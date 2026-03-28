import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/forms/Button";
import { EmptyState } from "@/components/ui/EmptyState";

interface PageErrorStateProps {
  title: string;
  description: string;
  onRetry?: () => void;
}

export function PageErrorState({ title, description, onRetry }: PageErrorStateProps) {
  return (
    <EmptyState
      title={title}
      description={description}
      icon={<AlertTriangle className="h-6 w-6 text-rose-500" />}
      action={
        onRetry ? (
          <Button type="button" variant="secondary" onClick={onRetry}>
            <RefreshCcw className="h-4 w-4" />
            Retry
          </Button>
        ) : undefined
      }
    />
  );
}
