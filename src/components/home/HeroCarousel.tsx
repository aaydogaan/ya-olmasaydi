import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { IconChevron } from "@/components/icons";
import { Avatar } from "@/components/post/Avatar";
import { Cover } from "@/components/post/Cover";
import { formatRelativeTr, heroPosts } from "@/data/posts";
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
    <section className="relative w-full overflow-hidden bg-bg py-4 md:py-6">
      {/* Edge Navigation Buttons */}
      <button
        type="button"
        onClick={prev}
        className="absolute top-1/2 left-2 lg:left-3.5 z-30 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow-lg backdrop-blur-sm hover:bg-white hover:scale-105 active:scale-95 transition-all md:flex cursor-pointer border border-neutral-200/80"
        aria-label="Önceki"
      >
        <IconChevron className="size-5 rotate-180" />
      </button>
      <button
        type="button"
        onClick={next}
        className="absolute top-1/2 right-2 lg:right-3.5 z-30 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow-lg backdrop-blur-sm hover:bg-white hover:scale-105 active:scale-95 transition-all md:flex cursor-pointer border border-neutral-200/80"
        aria-label="Sonraki"
      >
        <IconChevron className="size-5" />
      </button>

      {/* Edge-to-edge container */}
      <div className="w-full grid grid-cols-1 gap-2.5 px-2 sm:grid-cols-2 sm:px-4 md:gap-3.5 lg:grid-cols-4 lg:px-5">
        {visible.map((slide, i) => {
          const cat = getCategory(slide.category);
          const author = AUTHORS[slide.author];
          return (
            <Link
              key={`${slide.slug}-${i}`}
              to="/$slug"
              params={{ slug: slide.slug }}
              className={cn(
                "relative block overflow-hidden rounded-[16px] border-[3px] border-white shadow-md group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
                i > 0 ? "hidden sm:block" : "block",
                i > 1 ? "sm:hidden lg:block" : "",
              )}
              style={{ aspectRatio: "1 / 1" }}
            >
              <Cover
                category={slide.category}
                slug={slide.slug}
                title={slide.title}
                image={slide.image}
                mark={false}
              />
              <div className="absolute inset-0 z-10 flex flex-col justify-end bg-gradient-to-t from-black/85 via-black/35 to-transparent p-4 text-inverse md:p-5">
                <span className="cat-pill mb-2.5 w-fit" data-cat={slide.category}>
                  {cat?.name}
                </span>
                <h3 className="font-display text-[1.35rem] leading-snug font-semibold text-white drop-shadow-sm md:text-[1.5rem]">
                  {slide.title}
                </h3>

                {/* Author Info matching WordPress aesthetic */}
                <div className="mt-3 flex items-center gap-2.5">
                  <Avatar slug={slide.author} size={36} link={false} />
                  <div className="text-[0.75rem] leading-tight text-white">
                    <p className="font-medium italic text-white/90">
                      tarafından {author?.name || "Recep Aydoğan"}
                    </p>
                    <p className="text-[0.7rem] text-white/75 mt-0.5">
                      {formatRelativeTr(slide.publishedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Mobile Controls */}
      <div className="mt-4 flex justify-center gap-6 lg:hidden">
        <button
          type="button"
          onClick={prev}
          className="flex size-10 items-center justify-center rounded-full bg-paper border border-line cursor-pointer"
          aria-label="Önceki"
        >
          <IconChevron className="size-4 rotate-180" />
        </button>
        <button
          type="button"
          onClick={next}
          className="flex size-10 items-center justify-center rounded-full bg-paper border border-line cursor-pointer"
          aria-label="Sonraki"
        >
          <IconChevron className="size-4" />
        </button>
      </div>
    </section>
  );
}
