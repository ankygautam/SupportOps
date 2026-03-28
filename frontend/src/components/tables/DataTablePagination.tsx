import { Button } from "@/components/forms/Button";

interface DataTablePaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  currentCount: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function DataTablePagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  currentCount,
  onPrevious,
  onNext,
}: DataTablePaginationProps) {
  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = totalItems === 0 ? 0 : start + currentCount - 1;

  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-soft sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-500">
        Showing {start}-{end} of {totalItems}
      </p>
      <div className="flex items-center gap-3">
        <Button type="button" variant="secondary" size="sm" disabled={page === 1} onClick={onPrevious}>
          Previous
        </Button>
        <span className="text-sm font-semibold text-slate-700">
          Page {page} of {totalPages}
        </span>
        <Button type="button" variant="secondary" size="sm" disabled={page >= totalPages} onClick={onNext}>
          Next
        </Button>
      </div>
    </div>
  );
}
