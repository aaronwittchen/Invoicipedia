import { CirclePlus } from 'lucide-react';
import { auth } from '@clerk/nextjs/server';

import { db } from '@/db';
import { Customers, Invoices } from '@/db/schema';
import { and, eq, isNull } from 'drizzle-orm';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Container from '@/components/Container';
import { getCurrencyName, formatCurrency, type Currency } from '@/lib/currency';

interface DashboardPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
  }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const { userId, orgId } = await auth();

  if (!userId) return;

  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const limit = Number(resolvedSearchParams.limit) || 20;
  const offset = (page - 1) * limit;

  let results: Array<{
    invoices: typeof Invoices.$inferSelect;
    customers: typeof Customers.$inferSelect;
  }> = [];

  if (orgId) {
    results = await db
      .select()
      .from(Invoices)
      .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
      .where(eq(Invoices.organizationId, orgId))
      .limit(limit)
      .offset(offset);
  } else {
    results = await db
      .select()
      .from(Invoices)
      .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
      .where(and(eq(Invoices.userId, userId), isNull(Invoices.organizationId)))
      .limit(limit)
      .offset(offset);
  }

  // Get total count for pagination
  let totalCount = 0;
  if (orgId) {
    const countResult = await db
      .select({ count: Invoices.id })
      .from(Invoices)
      .where(eq(Invoices.organizationId, orgId));
    totalCount = countResult.length;
  } else {
    const countResult = await db
      .select({ count: Invoices.id })
      .from(Invoices)
      .where(and(eq(Invoices.userId, userId), isNull(Invoices.organizationId)));
    totalCount = countResult.length;
  }

  const invoices = results?.map(({ invoices, customers }) => {
    return {
      ...invoices,
      customer: customers,
    };
  });

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <main className='justify-center items-center h-full mb-6'>
      <Container>
        <div className='flex justify-between w-full px-4'>
          <h1 className='text-3xl font-semibold p-4'>
            <span>Invoices</span>
          </h1>
          <p className='p-4'>
            <Button className='inline-flex gap-2' variant='ghost' asChild>
              <Link href='/invoices/new'>
                <CirclePlus className='h-4 w-4' />
                <span>Create Invoice</span>
              </Link>
            </Button>
          </p>
        </div>

        <Table className='w-full text-left'>
          <TableCaption className='text-sm text-gray-500 p-4'>
            <span>A list of your recent invoices.</span>
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[100px] px-4 py-2 p-4'>
                <span>Date</span>
              </TableHead>
              <TableHead className='px-4 py-2 p-4'>
                <span>Customer</span>
              </TableHead>
              <TableHead className='px-4 py-2 p-4'>
                <span>Email</span>
              </TableHead>
              <TableHead className='text-center px-4 py-2 p-4'>
                <span>Status</span>
              </TableHead>
              <TableHead className='text-center px-4 py-2 p-4'>
                <span>Currency</span>
              </TableHead>
              <TableHead className='text-right px-4 py-2 p-4'>
                <span>Value</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((result) => {
              return (
                <TableRow key={result.id}>
                  <TableCell className='font-medium text-left p-0'>
                    <Link
                      href={`/invoices/${result.id}`}
                      className='block p-4 font-semibold'
                    >
                      {new Date(result.createTs).toLocaleDateString()}
                    </Link>
                  </TableCell>
                  <TableCell className='text-left p-0'>
                    <Link
                      href={`/invoices/${result.id}`}
                      className='block p-4 font-semibold'
                    >
                      {result.customer.name}
                    </Link>
                  </TableCell>
                  <TableCell className='text-left p-0'>
                    <Link className='block p-4' href={`/invoices/${result.id}`}>
                      {result.customer.email}
                    </Link>
                  </TableCell>
                  <TableCell className='text-center p-0'>
                    <Link className='block p-4' href={`/invoices/${result.id}`}>
                      <Badge
                        className={cn(
                          'rounded-full capitalize',
                          result.status === 'open' && 'bg-blue-500',
                          result.status === 'paid' && 'bg-green-600',
                          result.status === 'void' && 'bg-zinc-700',
                          result.status === 'uncollectible' && 'bg-red-600'
                        )}
                      >
                        {result.status}
                      </Badge>
                    </Link>
                  </TableCell>
                  <TableCell className='text-center p-0'>
                    <Link className='block p-4' href={`/invoices/${result.id}`}>
                      {getCurrencyName(result.currency as Currency)}
                    </Link>
                  </TableCell>
                  <TableCell className='text-right p-0'>
                    <Link
                      href={`/invoices/${result.id}`}
                      className='block p-4 font-semibold'
                    >
                      {formatCurrency(result.value, result.currency as Currency)}
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <Button
              variant="outline"
              disabled={page <= 1}
              asChild
            >
              <Link href={`/dashboard?page=${page - 1}&limit=${limit}`}>
                Previous
              </Link>
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                
                return (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? "default" : "outline"}
                    asChild
                    size="sm"
                  >
                    <Link href={`/dashboard?page=${pageNum}&limit=${limit}`}>
                      {pageNum}
                    </Link>
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              disabled={page >= totalPages}
              asChild
            >
              <Link href={`/dashboard?page=${page + 1}&limit=${limit}`}>
                Next
              </Link>
            </Button>
          </div>
        )}

        {/* Page Info */}
        <div className="text-center text-sm text-gray-500 mt-4">
          Showing {offset + 1}-{Math.min(offset + limit, totalCount)} of {totalCount} invoices
        </div>
      </Container>
    </main>
  );
}
