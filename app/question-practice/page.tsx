import { MatteBackdrop } from "@/components/ui/MatteBackdrop";
import { PageShell } from "@/components/ui/PageShell";
import { QuestionPracticeSection } from "@/components/question-practice/QuestionPracticeSection";

export default function QuestionPracticePage() {
  return (
    <>
      <MatteBackdrop />
      <PageShell>
        <QuestionPracticeSection />
      </PageShell>
    </>
  );
}
