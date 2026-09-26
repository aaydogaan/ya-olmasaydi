export function AwardCard() {
  return (
    <div className="overflow-hidden rounded-2xl shadow-(--shadow-post) border border-line/60 bg-paper transition-transform hover:scale-[1.01]">
      <img
        src="/images/birincilik.jpg"
        alt="TRT Geleceğin İletişimcileri Birincilik Ödülü - Ya Olmasaydı"
        className="w-full h-auto object-cover rounded-2xl"
        loading="lazy"
      />
    </div>
  );
}
