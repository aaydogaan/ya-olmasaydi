import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { IconChevron } from "@/components/icons";
import { Avatar } from "@/components/post/Avatar";
import { Cover } from "@/components/post/Cover";
import { formatRelativeTr, heroPosts, POSTS, type Post } from "@/data/posts";
import { AUTHORS, getCategory } from "@/data/site";
import { cn } from "@/lib/utils";

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function HeroCarousel() {
  const [basePosts, setBasePosts] = useState<Post[]>(() => heroPosts());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Shuffle posts on client-side mount for random mixed variety
  useEffect(() => {
    const candidatePosts = POSTS.filter((p) => p.image);
    const randomized = shuffleArray(candidatePosts).slice(0, 16);
    if (randomized.length > 0) {
      setBasePosts(randomized);
    }
  }, []);

  const totalOriginal = basePosts.length;
  // Clone the first 4 items to the end for seamless looping
  const extendedPosts = [...basePosts, ...basePosts.slice(0, 4)];

  // Auto slide every 4.5 seconds (one article at a time)
  useEffect(() => {
    if (isPaused || totalOriginal === 0) return;
    const interval = window.setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
      setIsTransitioning(true);
    }, 4500);

    return () => window.clearInterval(interval);
  }, [isPaused, totalOriginal]);

  // Handle seamless loop reset when transition ends
  const handleTransitionEnd = () => {
    if (currentIndex >= totalOriginal) {
      setIsTransitioning(false);
      setCurrentIndex(0);
    }
  };

  // Re-enable transitions after instant reset
  useEffect(() => {
    if (!isTransitioning) {
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true);
        });
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [isTransitioning]);

  const prev = () => {
    if (currentIndex === 0) {
      // Jump to end clones without transition then slide
      setIsTransitioning(false);
      setCurrentIndex(totalOriginal);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true);
          setCurrentIndex(totalOriginal - 1);
        });
      });
    } else {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const next = () => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 40) {
      next();
    } else if (diff < -40) {
      prev();
    }
    touchStartX.current = null;
    setIsPaused(false);
  };

  return (
    <section
      className="relative w-full overflow-hidden bg-bg py-4 md:py-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Edge Navigation Buttons (Desktop) */}
      <button
        type="button"
        onClick={prev}
        className="absolute top-1/2 left-2 lg:left-4 z-30 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow-lg backdrop-blur-sm hover:bg-white hover:scale-105 active:scale-95 transition-all md:flex cursor-pointer border border-neutral-200/80"
        aria-label="Önceki Yazı"
      >
        <IconChevron className="size-5 rotate-180" />
      </button>
      <button
        type="button"
        onClick={next}
        className="absolute top-1/2 right-2 lg:right-4 z-30 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow-lg backdrop-blur-sm hover:bg-white hover:scale-105 active:scale-95 transition-all md:flex cursor-pointer border border-neutral-200/80"
        aria-label="Sonraki Yazı"
      >
        <IconChevron className="size-5" />
      </button>

      {/* Carousel Track Container */}
      <div
        className="w-full overflow-hidden px-2 sm:px-4 lg:px-5"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex gap-2.5 md:gap-3.5"
          style={{
            transform: `translateX(calc(-${currentIndex} * (100% + var(--carousel-gap, 14px)) / var(--carousel-cols)))`,
            transition: isTransitioning
              ? "transform 650ms cubic-bezier(0.25, 1, 0.5, 1)"
              : "none",
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {extendedPosts.map((slide, i) => {
            const cat = getCategory(slide.category);
            const author = AUTHORS[slide.author];
            return (
              <div
                key={`${slide.slug}-${i}`}
                className="carousel-slide-item shrink-0"
              >
                <Link
                  to="/$slug"
                  params={{ slug: slide.slug }}
                  className="relative block size-full overflow-hidden rounded-[14px] border-[2.5px] border-white shadow-md group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  style={{ aspectRatio: "1 / 0.94" }}
                >
                  <Cover
                    category={slide.category}
                    slug={slide.slug}
                    title={slide.title}
                    image={slide.image}
                    mark={false}
                    zoomOnHover={false}
                  />
                  <div className="absolute inset-0 z-10 flex flex-col justify-end bg-gradient-to-t from-black/85 via-black/30 to-transparent p-3.5 text-inverse md:p-4">
                    <span
                      className="cat-pill text-[9px] px-2 py-0.5 mb-1.5 w-fit"
                      data-cat={slide.category}
                    >
                      {cat?.name}
                    </span>
                    <h3 className="font-display text-[1.05rem] leading-snug font-semibold text-white drop-shadow-sm md:text-[1.22rem] line-clamp-2">
                      {slide.title}
                    </h3>

                    {/* Author Info */}
                    <div className="mt-2.5 flex items-center gap-2">
                      <Avatar slug={slide.author} size={30} link={false} />
                      <div className="text-[0.72rem] leading-tight text-white">
                        <p className="font-medium italic text-white/90">
                          tarafından {author?.name || "Recep Aydoğan"}
                        </p>
                        <p className="text-[0.68rem] text-white/75 mt-0.5">
                          {formatRelativeTr(slide.publishedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Controls */}
      <div className="mt-4 flex justify-center gap-6 md:hidden">
        <button
          type="button"
          onClick={prev}
          className="flex size-10 items-center justify-center rounded-full bg-paper border border-line cursor-pointer shadow-sm active:scale-95 transition-transform"
          aria-label="Önceki Yazı"
        >
          <IconChevron className="size-4 rotate-180" />
        </button>
        <button
          type="button"
          onClick={next}
          className="flex size-10 items-center justify-center rounded-full bg-paper border border-line cursor-pointer shadow-sm active:scale-95 transition-transform"
          aria-label="Sonraki Yazı"
        >
          <IconChevron className="size-4" />
        </button>
      </div>
    </section>
  );
}
