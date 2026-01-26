import { useEffect } from "react";
import Card from "../../components/Card";
import NumberField from "../../components/NumberField";
import Toggle from "../../components/Toggle";
import WizardLayout from "../../components/WizardLayout";
import { useAppStore } from "../../store/useAppStore";
import { Label } from "@/components/ui/label";

const CoreStep = () => {
  const { state, setField } = useAppStore();
  const core = state.core;
  const notTested = core.notTested;

  useEffect(() => {
    if (!notTested) return;
    if (core.kneesToElbowsReps !== null) {
      setField(["core", "kneesToElbowsReps"], null);
    }
    if (core.lSitSeconds !== null) setField(["core", "lSitSeconds"], null);
    if (core.sorensenSeconds !== null) setField(["core", "sorensenSeconds"], null);
    if (core.frontLeverLevel !== "none") {
      setField(["core", "frontLeverLevel"], "none");
    }
    if (core.transferControl !== null) {
      setField(["core", "transferControl"], null);
    }
  }, [
    core.frontLeverLevel,
    core.kneesToElbowsReps,
    core.lSitSeconds,
    core.sorensenSeconds,
    core.transferControl,
    notTested,
    setField
  ]);

  return (
    <WizardLayout
      title="CORE - Core / transfer"
      stepIndex={6}
      totalSteps={8}
      backPath="/step/squat"
      nextPath="/step/fingers"
    >
      <Card>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={core.notTested}
            onChange={(event) =>
              setField(["core", "notTested"], event.target.checked)
            }
          />
          <Label>Nie testuje</Label>
        </div>
        <NumberField
          label="Knees-to-elbows / toes-to-bar (reps)"
          value={core.kneesToElbowsReps}
          onChange={(value) => setField(["core", "kneesToElbowsReps"], value)}
          integer
          disabled={notTested}
        />
        <NumberField
          label="L-sit (sekundy)"
          value={core.lSitSeconds}
          onChange={(value) => setField(["core", "lSitSeconds"], value)}
          integer
          disabled={notTested}
        />
        <NumberField
          label="Sorensen (sekundy)"
          value={core.sorensenSeconds}
          onChange={(value) => setField(["core", "sorensenSeconds"], value)}
          integer
          disabled={notTested}
        />
        <div className="space-y-2">
          <Label>Front lever poziom</Label>
          <select
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={core.frontLeverLevel}
            onChange={(event) =>
              setField(["core", "frontLeverLevel"], event.target.value)
            }
            disabled={notTested}
          >
            <option value="none">Brak</option>
            <option value="tuck">Tuck</option>
            <option value="advanced_tuck">Advanced tuck</option>
            <option value="one_leg">One leg</option>
            <option value="straddle">Straddle</option>
            <option value="full">Full</option>
          </select>
        </div>
        <Toggle
          label="Czy czujesz dobrą kontrolę transferu w ruchach wspinaczkowych?"
          value={core.transferControl}
          onChange={(value) => setField(["core", "transferControl"], value)}
          unknownLabel="Nie wiem"
          disabled={notTested}
        />
      </Card>
    </WizardLayout>
  );
};

export default CoreStep;
