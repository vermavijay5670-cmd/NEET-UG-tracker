export function MatteBackdrop() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{
        background:
          "radial-gradient(circle at 15% 0%, rgba(123,77,255,0.08) 0%, transparent 45%)," +
          "radial-gradient(circle at 85% 100%, rgba(65,255,114,0.05) 0%, transparent 45%)," +
          "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 100%)," +
          "linear-gradient(180deg, var(--color-bg-1) 0%, var(--color-bg-0) 100%)",
      }}
    />
  );
}
