import { MatteBackdrop } from "@/components/ui/MatteBackdrop";
import { PageShell } from "@/components/ui/PageShell";
import { PlannerSection } from "@/components/planner/PlannerSection";

export default function PlannerPage() {
  return (
    <>
      <MatteBackdrop />
      <PageShell>
        <PlannerSection />
      </PageShell>
    </>
  );
}
