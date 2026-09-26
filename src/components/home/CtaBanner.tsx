import { Link } from "@tanstack/react-router";

export function CtaBanner() {
  return (
    <section className="site-wrap my-10">
      <Link
        to="/senin-hayatin-nasil-degisirdi"
        className="relative flex overflow-hidden rounded-md bg-brand text-inverse shadow-(--shadow-post)"
      >
        <div className="relative z-10 flex flex-1 flex-col justify-center px-6 py-8 md:px-10 md:py-10">
          <p className="font-display text-3xl leading-[1.1] font-bold tracking-tight md:text-5xl">
            SENİN HAYATIN
            <br />
            NASIL DEĞİŞİRDİ?
          </p>
          <p className="mt-4 max-w-sm text-sm md:text-base">
            Senin hikayeni duymak için sabırsızlanıyoruz.
            <span className="ml-2 inline-block translate-y-0.5">↗</span>
          </p>
        </div>
        <div className="relative hidden w-[42%] md:block">
          <div className="absolute inset-0 bg-linear-to-l from-cat-kultur to-transparent" />
          <svg viewBox="0 0 280 220" className="absolute right-0 bottom-0 h-full w-auto text-inverse/90" aria-hidden="true">
            <path
              fill="currentColor"
              d="M168 214c-18-6-28-24-30-46-2-24 6-44 10-70 3-18-4-28-16-34-10-6-14-18-8-28 8-14 28-16 40-6 14 12 18 34 14 54-3 16 2 28 12 38 14 14 22 34 18 54-3 16-18 32-40 38Z"
            />
            <circle cx="186" cy="58" r="28" fill="currentColor" />
            <path fill="#d4c4a8" d="M158 52c8-18 38-22 52-8 6 6 8 16 4 24-10-10-28-12-40-4-4-4-10-8-16-12Z" />
          </svg>
        </div>
      </Link>
    </section>
  );
}
