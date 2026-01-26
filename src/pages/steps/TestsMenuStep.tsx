import { Link } from "react-router-dom";
import Card from "../../components/Card";
import WizardLayout from "../../components/WizardLayout";
import { useAppStore } from "../../store/useAppStore";
import { getStepCompletion } from "../../utils/steps";

const TestsMenuStep = () => {
  const { state } = useAppStore();

  const tests = [
    { id: "pull", label: "PULL – Podciąganie" },
    { id: "push", label: "PUSH – Pchanie" },
    { id: "hinge", label: "HINGE – Martwy ciąg" },
    { id: "squat", label: "SQUAT – Przysiad" },
    { id: "core", label: "CORE – Core" },
    { id: "fingers", label: "FINGERS – Palce" }
  ] as const;

  return (
    <WizardLayout
      title="Testy (szybkie menu)"
      stepIndex={2}
      totalSteps={8}
      backPath="/step/athlete"
      nextPath="/step/pull"
    >
      <div className="list-grid">
        {tests.map((test) => {
          const complete = getStepCompletion(state, test.id);
          return (
            <Link key={test.id} to={`/step/${test.id}`}>
              <Card>
                <div className="section-title">{test.label}</div>
                <div className={`badge ${complete ? "done" : ""}`}>
                  {complete ? "Uzupełniono" : "Nieuzupełnione"}
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </WizardLayout>
  );
};

export default TestsMenuStep;