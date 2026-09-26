import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  width = 120,
}: {
  className?: string;
  width?: number;
}) {
  return (
    <Link to="/" className={cn("inline-flex items-center", className)} aria-label="Ya Olmasaydı">
      <img
        src="/images/logo.png"
        alt="Ya Olmasaydı"
        width={width}
        height={Math.round(width * 0.375)}
        className="h-auto max-w-full"
        style={{ width }}
      />
    </Link>
  );
}
