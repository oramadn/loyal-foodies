"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { Restaurant } from "@/types";

type Props = {
  restaurants: Restaurant[];
  onSelect: (restaurant: Restaurant | null) => void;
};

export function RestaurantPicker({ restaurants, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = restaurants.find((r) => r.id === selectedId) ?? null;

  function handleSelect(id: string) {
    const restaurant = restaurants.find((r) => r.id === id) ?? null;
    const newId = selectedId === id ? null : id;
    setSelectedId(newId);
    onSelect(newId ? restaurant : null);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        aria-expanded={open}
        className={cn(
          buttonVariants({ variant: "outline" }),
          "w-full justify-between font-normal"
        )}
      >
        {selected ? selected.name : "Pick a saved restaurant…"}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0">
        <Command>
          <CommandInput placeholder="Search restaurants…" />
          <CommandList>
            <CommandEmpty>No saved restaurants found.</CommandEmpty>
            <CommandGroup>
              {restaurants.map((r) => (
                <CommandItem key={r.id} value={r.name} onSelect={() => handleSelect(r.id)}>
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedId === r.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div>
                    <p>{r.name}</p>
                    {r.note && (
                      <p className="text-xs text-muted-foreground">{r.note}</p>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
