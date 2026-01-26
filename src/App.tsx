import { Navigate, Route, Routes } from "react-router-dom";
import AthleteStep from "./pages/steps/AthleteStep";
import TestsMenuStep from "./pages/steps/TestsMenuStep";
import PullStep from "./pages/steps/PullStep";
import PushStep from "./pages/steps/PushStep";
import HingeStep from "./pages/steps/HingeStep";
import SquatStep from "./pages/steps/SquatStep";
import CoreStep from "./pages/steps/CoreStep";
import FingersStep from "./pages/steps/FingersStep";
import SummaryStep from "./pages/steps/SummaryStep";
import ReportPage from "./pages/ReportPage";
import StandardsPage from "./pages/StandardsPage";
import { useAppStore } from "./store/useAppStore";
import { getFirstIncompleteStep } from "./utils/steps";
import { StepId } from "./models/types";

const stepOrder: StepId[] = [
  "athlete",
  "pull",
  "push",
  "hinge",
  "squat",
  "core",
  "fingers",
  "summary"
];

const App = () => {
  const { state } = useAppStore();
  const firstIncomplete = getFirstIncompleteStep(state, stepOrder);

  return (
    <Routes>
      <Route path="/" element={<Navigate to={`/step/${firstIncomplete}`} replace />} />
      <Route path="/step/athlete" element={<AthleteStep />} />
      <Route path="/step/tests" element={<TestsMenuStep />} />
      <Route path="/step/pull" element={<PullStep />} />
      <Route path="/step/push" element={<PushStep />} />
      <Route path="/step/hinge" element={<HingeStep />} />
      <Route path="/step/squat" element={<SquatStep />} />
      <Route path="/step/core" element={<CoreStep />} />
      <Route path="/step/fingers" element={<FingersStep />} />
      <Route path="/step/summary" element={<SummaryStep />} />
      <Route path="/report" element={<ReportPage />} />
      <Route path="/standards" element={<StandardsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
