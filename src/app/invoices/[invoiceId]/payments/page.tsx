import { eq } from 'drizzle-orm';
import { CreditCard } from 'lucide-react';
import Stripe from 'stripe';

import Container from '@/components/Container';
import { Badge } from '@/components/ui/badge';
import { Customers, Invoices } from '@/db/schema';
import { cn } from '@/lib/utils';
import { formatCurrency, getCurrencyDisplay, type Currency } from '@/lib/currency';

import { Button } from '@/components/ui/button';

import { createPayment, updateStatusAction } from '@/app/actions';
import { db } from '@/db';
import { notFound } from 'next/navigation';

const stripe = new Stripe(String(process.env.STRIPE_API_SECRET));

interface InvoicePageProps {
  params: Promise<{ invoiceId: string }>;
  searchParams: Promise<{
    status: string;
    session_id: string;
  }>;
}

export default async function InvoicePage({
  params,
  searchParams,
}: InvoicePageProps) {
  const resolvedParams = await params;
  const invoiceId = Number.parseInt(resolvedParams.invoiceId);

  const resolvedSearchParams = await searchParams;
  const sessionId = resolvedSearchParams.session_id;
  const isSuccess = sessionId && resolvedSearchParams.status === 'success';
  const isCanceled = resolvedSearchParams.status === 'canceled';
  let isError = false;

  console.log('isSuccess', isSuccess);
  console.log('isCanceled', isCanceled);

  if (Number.isNaN(invoiceId)) {
    throw new Error('Invalid Invoice ID');
  }

  if (isSuccess) {
    try {
      const { payment_status } = await stripe.checkout.sessions.retrieve(
        sessionId
      );

      if (payment_status !== 'paid') {
        isError = true;
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      isError = true;
    }
  }

  const [result] = await db
    .select({
      id: Invoices.id,
      status: Invoices.status,
      createTs: Invoices.createTs,
      description: Invoices.description,
      value: Invoices.value,
      currency: Invoices.currency,
      name: Customers.name,
    })
    .from(Invoices)
    .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
    .where(eq(Invoices.id, invoiceId))
    .limit(1);

  if (!result) {
    notFound();
  }

  const invoice = {
    ...result,
    customer: {
      name: result.name,
    },
  };

  return (
    <main className='w-full h-full'>
      <Container>
        {isError && (
          <p className='bg-red-100 text-sm text-red-800 text-center px-3 py-2 rounded-lg mb-6'>
            Something went wrong, please try again!
          </p>
        )}
        {isCanceled && (
          <p className='bg-yellow-100 text-sm text-yellow-800 text-center px-3 py-2 rounded-lg mb-6'>
            Payment was canceled, please try again.
          </p>
        )}
        {isSuccess && !isError && invoice.status === 'open' && (
          <div className='bg-green-100 text-sm text-green-800 text-center px-3 py-2 rounded-lg mb-6'>
            <p className='mb-2'>Payment successful! Please confirm to update your invoice status.</p>
            <form action={updateStatusAction}>
              <input type='hidden' name='id' value={invoice.id} />
              <input type='hidden' name='status' value='paid' />
              <Button type='submit' className='bg-green-600 hover:bg-green-700 text-white'>
                Confirm Payment
              </Button>
            </form>
          </div>
        )}
        {isSuccess && !isError && invoice.status === 'paid' && (
          <div className='bg-green-100 text-sm text-green-800 text-center px-3 py-2 rounded-lg mb-6'>
            Payment has been confirmed and your invoice is now marked as paid!
          </div>
        )}
        <div className='grid grid-cols-2'>
          <div>
            <div className='flex justify-between mb-8'>
              <h1 className='flex items-center gap-4 text-3xl font-semibold'>
                Invoice {invoice.id}
                <Badge
                  className={cn(
                    'rounded-full capitalize',
                    invoice.status === 'open' && 'bg-blue-500',
                    invoice.status === 'paid' && 'bg-green-600',
                    invoice.status === 'void' && 'bg-zinc-700',
                    invoice.status === 'uncollectible' && 'bg-red-600'
                  )}
                >
                  {invoice.status}
                </Badge>
              </h1>
            </div>

            <p className='text-3xl mb-3'>
              {formatCurrency(invoice.value, invoice.currency as Currency)}
            </p>

            <p className='text-lg mb-8'>{invoice.description}</p>
          </div>
          <div>
            <h2 className='text-xl font-bold mb-4'>Manage Invoice</h2>
            {invoice.status === 'open' && (
              <form action={createPayment}>
                <input type='hidden' name='id' value={invoice.id} />
                <Button className='flex gap-2 font-bold bg-green-700 text-white'>
                  <CreditCard className='w-5 h-auto text-white' />
                  <span>Pay Invoice</span>
                </Button>
              </form>
            )}
          </div>
        </div>

        <h2 className='font-bold text-lg mb-4'>Billing Details</h2>

        <ul className='grid gap-2'>
          <li className='flex gap-4'>
            <strong className='block w-28 flex-shrink-0 font-medium text-sm'>
              Invoice ID
            </strong>
            <span>{invoice.id}</span>
          </li>
          <li className='flex gap-4'>
            <strong className='block w-28 flex-shrink-0 font-medium text-sm'>
              Invoice Date
            </strong>
            <span>{new Date(invoice.createTs).toLocaleDateString()}</span>
          </li>
          <li className='flex gap-4'>
            <strong className='block w-28 flex-shrink-0 font-medium text-sm'>
              Billing Name
            </strong>
            <span>{invoice.customer.name}</span>
          </li>
          <li className='flex gap-4'>
            <strong className='block w-28 flex-shrink-0 font-medium text-sm'>
              Currency
            </strong>
            <span>{getCurrencyDisplay(invoice.currency as Currency)}</span>
          </li>
        </ul>
      </Container>
    </main>
  );
}
