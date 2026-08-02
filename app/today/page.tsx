import { LiquidBackdrop } from "@/components/ui/LiquidBackdrop";
import { PageShell } from "@/components/ui/PageShell";
import { TodaySection } from "@/components/today/TodaySection";

export default function TodayPage() {
  return (
    <>
      <LiquidBackdrop variant="today" />
      <PageShell>
        <TodaySection />
      </PageShell>
    </>
  );
}
