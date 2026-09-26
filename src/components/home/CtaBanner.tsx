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
          src="/images/Senin-hayat%C4%B1n-nas%C4%B1l-de%C4%9Fi%C5%9Firdi-Banner.jpg"
          alt="Senin Hayatın Nasıl Değişirdi?"
          className="w-full h-auto object-cover max-h-[340px]"
          loading="lazy"
        />
      </Link>
    </section>
  );
}
