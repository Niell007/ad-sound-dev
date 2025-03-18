import { Loader2 } from "lucide-react";

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );
}

export function LoadingPage() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="w-full animate-pulse">
      <div className="h-10 bg-muted rounded-md mb-4" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-16 bg-muted/50 rounded-md mb-2" />
      ))}
    </div>
  );
}
