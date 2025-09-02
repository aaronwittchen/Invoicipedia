import { CirclePlus } from 'lucide-react';
import { auth } from '@clerk/nextjs/server'

import { db } from "@/db";
import { Invoices } from "@/db/schema";
import { eq } from "drizzle-orm";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Container from "@/components/Container";

export default async function Home() {
  const { userId } = await auth();

  if (!userId) return;

    const results = await db.select()
    .from(Invoices)
    .where(eq(Invoices.userId, userId));
    return (
        <main className="justify-center items-center h-full mb-6">
            <Container>
            <div className="flex justify-between w-full px-4">
                <h1 className="text-3xl font-semibold p-4"><span>Invoices</span></h1>
                <p className="p-4">
                    <Button className="inline-flex gap-2" variant="ghost" asChild>
                        <Link href="/invoices/new">
                            <CirclePlus className="h-4 w-4" />
                            <span>Create Invoice</span>
                        </Link>
                    </Button>
                </p>
            </div>
            
            <Table className="w-full text-left">
                <TableCaption className="text-sm text-gray-500 p-4">
                    <span>A list of your recent invoices.</span>
                </TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px] px-4 py-2 p-4"><span>Date</span></TableHead>
                        <TableHead className="px-4 py-2 p-4"><span>Customer</span></TableHead>
                        <TableHead className="px-4 py-2 p-4"><span>Email</span></TableHead>
                        <TableHead className="text-center px-4 py-2 p-4"><span>Status</span></TableHead>
                        <TableHead className="text-right px-4 py-2 p-4"><span>Value</span></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {results.map(result => (
                        <TableRow key={result.id}>
                            <TableCell className="font-semibold p-0"><Link href={`/invoices/${result.id}`} className="block p-4">{new Date(result.createTs).toLocaleDateString('de-DE')}</Link></TableCell>
                            <TableCell className="font-semibold p-0"><Link href={`/invoices/${result.id}`} className="block p-4">Philip. J. Fry</Link></TableCell>
                            <TableCell className="p-0"><Link href={`/invoices/${result.id}`} className="block p-4">fry@planetexpress.com</Link></TableCell>
                            <TableCell className="text-center p-0">
                            <Link href={`/invoices/${result.id}`} className="block p-4">
                            <Badge
                            className={cn(
                                "rounded-full capitalize",
                                result.status === "open" && "bg-blue-500",
                                result.status === "paid" && "bg-green-600",
                                result.status === "void" && "bg-zinc-700",
                                result.status === "uncollectible" && "bg-red-600",
                            )}
                        >
                            {result.status}
                        </Badge>
                            </Link>
                            </TableCell>
                            <TableCell className="text-right font-semibold p-0">
                                <Link href={`/invoices/${result.id}`} className="block p-4">${(result.value / 100).toFixed(2)}</Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            </Container>
        </main>
    );
}
