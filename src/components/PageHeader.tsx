export function PageHeader({ title, kicker }: { title: string; kicker?: string }) {
  return (
    <header className="border-b border-line bg-paper py-12 text-center">
      {kicker ? <p className="mb-2 text-xs tracking-[0.18em] text-muted uppercase">{kicker}</p> : null}
      <h1 className="font-display text-3xl font-semibold md:text-4xl">{title}</h1>
    </header>
  );
}
