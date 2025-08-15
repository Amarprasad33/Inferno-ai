// components/ui/multi-select.tsx
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function MultiSelect({
  selected,
  options,
  onChange,
  placeholderText
}: {
  selected: string[];
  options: { value: string; label: string }[];
  onChange: (value: string[]) => void;
  placeholderText: string
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between text-black hover:bg-zinc-100 hover:text-zinc-700 bg-white border"
        >
          {selected?.length > 0
            ? selected.map((value) => options.find((option) => option.value === value)?.label).join(", ")
            : `Select ${placeholderText}...`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 max-h-[400px] overflow-y-auto">
        <Command>
          <CommandInput placeholder="Search skills..." />
          <CommandEmpty>No skills found.</CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={() => {
                  const newSelected = Array.isArray(selected) && selected?.includes(option.value)
                    ? selected?.filter((value) => value !== option.value)
                    : [...selected, option.value];
                  onChange(newSelected);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selected?.includes(option.value) ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}