import type { ChangeEventHandler, ReactNode } from "react";
import { Search } from "lucide-react";
import { cn } from "@/utils/cn";

interface SearchFilterBarProps {
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  placeholder: string;
  filters?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function SearchFilterBar({ value, onChange, placeholder, filters, actions, className }: SearchFilterBarProps) {
  return (
    <div className={cn("panel p-5", className)}>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_auto]">
        <label className="filter-search">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full border-none bg-transparent p-0 text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />
        </label>
        <div className="flex flex-col gap-3 xl:min-w-[320px] xl:items-stretch">
          {filters}
          {actions}
        </div>
      </div>
    </div>
  );
}
