import { Link } from "@tanstack/react-router";

export function CtaBanner() {
  return (
    <section className="site-wrap my-10">
      <Link
        to="/senin-hayatin-nasil-degisirdi"
        className="group relative block overflow-hidden rounded-2xl shadow-(--shadow-post) border border-line/60 transition-transform hover:scale-[1.005]"
        title="Senin Hayatın Nasıl Değişirdi?"
      >
        <img
          src="/images/banner-senin.jpg"
          alt="Senin Hayatın Nasıl Değişirdi?"
          className="w-full h-auto object-cover max-h-[340px]"
          loading="lazy"
        />
      </Link>
    </section>
  );
}
