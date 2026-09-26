import { IconFacebook, IconPinterest, IconX } from "@/components/icons";
import { cn } from "@/lib/utils";

export function ShareIcons({
  url,
  title,
  className,
  variant = "ghost",
}: {
  url: string;
  title: string;
  className?: string;
  variant?: "ghost" | "filled";
}) {
  const encoded = encodeURIComponent(url);
  const text = encodeURIComponent(title);
  const items = [
    {
      label: "X",
      href: `https://twitter.com/share?url=${encoded}&text=${text}`,
      icon: IconX,
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
      icon: IconFacebook,
    },
    {
      label: "Pinterest",
      href: `https://pinterest.com/pin/create/button/?url=${encoded}&description=${text}`,
      icon: IconPinterest,
    },
  ];
  return (
    <ul className={cn("flex items-center gap-2", className)}>
      {items.map((it) => (
        <li key={it.label}>
          <a
            href={it.href}
            target="_blank"
            rel="nofollow noopener noreferrer"
            aria-label={it.label}
            className={cn(
              "inline-flex size-8 items-center justify-center rounded-full border border-line text-fg transition-colors hover:border-fg",
              variant === "filled" && "border-0 bg-ink text-inverse hover:opacity-85",
            )}
          >
            <it.icon className="size-3.5" />
          </a>
        </li>
      ))}
    </ul>
  );
}
