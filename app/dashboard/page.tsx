import { LiquidBackdrop } from "@/components/ui/LiquidBackdrop";
import { PageShell } from "@/components/ui/PageShell";
import { DashboardSection } from "@/components/dashboard/DashboardSection";

export default function DashboardPage() {
  return (
    <>
      <LiquidBackdrop variant="dashboard" />
      <PageShell>
        <DashboardSection />
      </PageShell>
    </>
  );
}
