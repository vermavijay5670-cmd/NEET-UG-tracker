import { MatteBackdrop } from "@/components/ui/MatteBackdrop";
import { PageShell } from "@/components/ui/PageShell";
import { StudyLogSection } from "@/components/study-log/StudyLogSection";

export default function StudyLogPage() {
  return (
    <>
      <MatteBackdrop />
      <PageShell>
        <StudyLogSection />
      </PageShell>
    </>
  );
}
