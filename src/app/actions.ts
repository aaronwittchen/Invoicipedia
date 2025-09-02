'use server';

import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { and, eq, isNull } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { Customers, Invoices, type Status } from '@/db/schema';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { Resend } from 'resend';
import { InvoiceCreatedEmail } from '@/emails/invoice-created';
import { isValidCurrency, type Currency } from '@/lib/currency';

const stripe = new Stripe(String(process.env.STRIPE_API_SECRET));
// const resend = new Resend(process.env.RESEND_API_KEY);

export async function createAction(formData: FormData) {
  const { userId, orgId } = await auth();

  if (!userId) {
    return;
  }

  const value = Math.floor(
    Number.parseFloat(String(formData.get('value'))) * 100
  );
  const currencyRaw = formData.get('currency') as string;
  const currency: Currency = isValidCurrency(currencyRaw) ? currencyRaw : 'usd';
  const description = formData.get('description') as string;
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;

  const [customer] = await db
    .insert(Customers)
    .values({
      name,
      email,
      userId,
      organizationId: orgId || null,
    })
    .returning({
      id: Customers.id,
    });

  const results = await db
    .insert(Invoices)
    .values({
      value,
      currency,
      description,
      userId,
      customerId: customer.id,
      status: 'open',
      organizationId: orgId || null,
    })
    .returning({
      id: Invoices.id,
    });

  /* const { data, error } = await resend.emails.send({
    from: 'Onion <info@test.onion.dev>',
    to: [email],
    subject: 'You Have a New Invoice',
    react: InvoiceCreatedEmail({ 
      invoiceId: results[0].id,
      amount: value,
      currency: currency,
      description: description,
      customerName: name,
    }),
  });

  if (error) {
    console.error('Failed to send email:', error);
    // Continue with redirect even if email fails
  }
    */

  redirect(`/invoices/${results[0].id}`);
}

export async function updateStatusAction(formData: FormData) {
  const { userId, orgId } = await auth();

  if (!userId) {
    return;
  }

  const id = formData.get('id') as string;
  const status = formData.get('status') as Status;

  if (orgId) {
    await db
      .update(Invoices)
      .set({ status })
      .where(
        and(
          eq(Invoices.id, Number.parseInt(id)),
          eq(Invoices.organizationId, orgId)
        )
      );
  } else {
    await db
      .update(Invoices)
      .set({ status })
      .where(
        and(
          eq(Invoices.id, Number.parseInt(id)),
          eq(Invoices.userId, userId),
          isNull(Invoices.organizationId)
        )
      );
  }

  // Revalidate all relevant pages to ensure status updates are reflected
  revalidatePath(`/invoices/${id}`, 'page');
  revalidatePath(`/invoices/${id}/payments`, 'page');
  revalidatePath('/dashboard', 'page');
}

export async function deleteInvoiceAction(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    return;
  }

  const id = formData.get('id') as string;

  const results = await db
    .delete(Invoices)
    .where(
      and(eq(Invoices.id, Number.parseInt(id)), eq(Invoices.userId, userId))
    );

  redirect('/dashboard');
}

export async function createPayment(formData: FormData) {
  const { userId } = await auth();
  if (!userId) return;

  const headersList = await headers();
  const origin = headersList.get('origin');
  const id = Number.parseInt(formData.get('id') as string);

  const [result] = await db
    .select({
      status: Invoices.status,
      value: Invoices.value,
      currency: Invoices.currency,
    })
    .from(Invoices)
    .where(eq(Invoices.id, id))
    .limit(1);

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: result.currency,
          product: process.env.STRIPE_PRODUCT_ID!,
          unit_amount: result.value,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${origin}/invoices/${id}/payments?status=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/invoices/${id}/payments?status=canceled&session_id={CHECKOUT_SESSION_ID}`,
  });

  if (!session.url) {
    throw new Error('Invalid Session');
  }

  redirect(session.url);
}
