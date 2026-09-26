import { Link } from "@tanstack/react-router";
import { AUTHORS, type AuthorSlug } from "@/data/site";
import { cn } from "@/lib/utils";

export function Avatar({
  slug,
  size = 40,
  link = true,
}: {
  slug: AuthorSlug;
  size?: number;
  link?: boolean;
}) {
  const author = AUTHORS[slug];
  const inner = (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-fg font-display font-semibold text-inverse",
        size > 48 ? "text-sm" : "text-[0.65rem]",
      )}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {author.initials}
    </span>
  );
  if (!link) return inner;
  return (
    <Link
      to="/author/$slug"
      params={{ slug }}
      className="shrink-0"
      aria-label={author.name}
    >
      {inner}
    </Link>
  );
}
