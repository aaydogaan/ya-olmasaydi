import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { IconChevron } from "@/components/icons";
import { Avatar } from "@/components/post/Avatar";
import { Cover } from "@/components/post/Cover";
import { heroPosts } from "@/data/posts";
import { AUTHORS, getCategory } from "@/data/site";
import { cn } from "@/lib/utils";

export function HeroCarousel() {
  const slides = heroPosts();
  const [index, setIndex] = useState(1);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5200);
    return () => window.clearInterval(id);
  }, [slides.length]);

  function prev() {
    setIndex((i) => (i - 1 + slides.length) % slides.length);
  }
  function next() {
    setIndex((i) => (i + 1) % slides.length);
  }

  const visible = [0, 1, 2, 3].map((offset) => slides[(index + offset) % slides.length]);

  return (
    <section className="relative overflow-hidden bg-bg py-5 md:py-6">
      <button
        type="button"
        onClick={prev}
        className="absolute top-1/2 left-3 z-20 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-inverse text-fg shadow-md md:flex"
        aria-label="Önceki"
      >
        <IconChevron className="size-5 rotate-180" />
      </button>
      <button
        type="button"
        onClick={next}
        className="absolute top-1/2 right-3 z-20 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-inverse text-fg shadow-md md:flex"
        aria-label="Sonraki"
      >
        <IconChevron className="size-5" />
      </button>

      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-3 px-4 sm:grid-cols-2 md:gap-4 lg:grid-cols-4 lg:px-14">
        {visible.map((slide, i) => {
          const cat = getCategory(slide.category);
          const author = AUTHORS[slide.author];
          return (
            <Link
              key={`${slide.slug}-${i}`}
              to="/$slug"
              params={{ slug: slide.slug }}
              className={cn(
                "relative block overflow-hidden rounded-[10px] shadow-(--shadow-post)",
                i > 0 ? "hidden sm:block" : "block",
                i > 1 ? "sm:hidden lg:block" : "",
              )}
              style={{ aspectRatio: "1 / 1.02" }}
            >
              <Cover category={slide.category} slug={slide.slug} title={slide.title} image={slide.image} mark={false} />
              <div className="absolute inset-0 z-10 flex flex-col justify-end bg-linear-to-t from-ink/80 via-ink/25 to-transparent p-4 text-inverse md:p-5">
                <span className="cat-pill mb-3 w-fit" data-cat={slide.category}>
                  {cat?.name}
                </span>
                <h3 className="font-display text-[1.35rem] leading-snug font-semibold md:text-[1.5rem]">
                  {slide.title}
                </h3>
                <div className="mt-3 flex items-center gap-2 text-sm text-inverse/90">
                  <Avatar slug={slide.author} size={32} link={false} />
                  <span>{author.name}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-4 flex justify-center gap-6 lg:hidden">
        <button type="button" onClick={prev} className="flex size-10 items-center justify-center rounded-full bg-paper" aria-label="Önceki">
          <IconChevron className="size-4 rotate-180" />
        </button>
        <button type="button" onClick={next} className="flex size-10 items-center justify-center rounded-full bg-paper" aria-label="Sonraki">
          <IconChevron className="size-4" />
        </button>
      </div>
    </section>
  );
}
