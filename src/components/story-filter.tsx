"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { countries, type Country } from '@/lib/types';

export function StoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentRegion = searchParams.get('region');

  const handleFilter = (region: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (region && region !== 'All') {
      params.set('region', region);
    } else {
      params.delete('region');
    }
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  return (
    <Select onValueChange={handleFilter} defaultValue={currentRegion || 'All'}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filter by country" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="All">All Countries</SelectItem>
        {countries.map((country) => (
          <SelectItem key={country} value={country}>
            {country}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
