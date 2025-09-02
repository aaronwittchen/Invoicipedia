"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CURRENCIES, type Currency } from "@/lib/currency";

interface CurrencySelectorProps {
  name: string;
  defaultValue?: Currency;
  className?: string;
}

export default function CurrencySelector({ 
  name, 
  defaultValue = "usd", 
  className 
}: CurrencySelectorProps) {
  return (
    <Select name={name} defaultValue={defaultValue}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Select currency" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(CURRENCIES).map(([code, currency]) => (
          <SelectItem key={code} value={code}>
            {currency.name} ({currency.symbol})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
