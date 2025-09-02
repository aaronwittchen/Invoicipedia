import { notFound } from 'next/navigation';
import { eq, and } from 'drizzle-orm';
import { db } from '@/db';
import { Invoices } from '@/db/schema';
import { auth } from '@clerk/nextjs/server';
import Invoice from './Invoice';

export default async function InvoicePage({
  params,
}: {
  params: { invoiceId: string };
}) {
  const { userId } = await auth();
  if (!userId) return;

  const { invoiceId: invoiceIdParam } = await Promise.resolve(params);
  const invoiceId = parseInt(invoiceIdParam);

  const [result] = await db
    .select()
    .from(Invoices)
    .where(and(eq(Invoices.id, invoiceId), eq(Invoices.userId, userId)))
    .limit(1);

  if (!result) {
    notFound();
  }

  return <Invoice invoice={result} />;
}
