import { auth } from '@clerk/nextjs/server';
import { and, eq, isNull } from 'drizzle-orm';
import { notFound } from 'next/navigation';

import { db } from '@/db';
import { Customers, Invoices } from '@/db/schema';
import Invoice from './Invoice';

interface PageProps {
  params: Promise<{ invoiceId: string }>;
}

export default async function InvoicePage({ params }: PageProps) {
  const { userId, orgId } = await auth();

  if (!userId) {
    return notFound();
  }

  const resolvedParams = await params;
  const invoiceId = Number.parseInt(resolvedParams.invoiceId);

  if (Number.isNaN(invoiceId)) {
    return notFound();
  }

  // Displaying all invoices for public demo

  let [result]: Array<{
    invoices: typeof Invoices.$inferSelect;
    customers: typeof Customers.$inferSelect;
  }> = await db
    .select()
    .from(Invoices)
    .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
    .limit(1);

  if (orgId) {
    [result] = await db
      .select()
      .from(Invoices)
      .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
      .where(
        and(eq(Invoices.id, invoiceId), eq(Invoices.organizationId, orgId))
      )
      .limit(1);
  } else {
    [result] = await db
      .select()
      .from(Invoices)
      .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
      .where(
        and(
          eq(Invoices.id, invoiceId),
          eq(Invoices.userId, userId),
          isNull(Invoices.organizationId)
        )
      )
      .limit(1);
  }

  if (!result) {
    notFound();
  }

  const invoice = {
    ...result.invoices,
    customer: result.customers,
  };

  return <Invoice invoice={invoice} />;
}
