import { useEffect } from "react";
import Card from "../../components/Card";
import NumberField from "../../components/NumberField";
import RadioGroup from "../../components/RadioGroup";
import Toggle from "../../components/Toggle";
import WizardLayout from "../../components/WizardLayout";
import { useAppStore } from "../../store/useAppStore";
import { roundToOne } from "../../utils/orm";
import { Label } from "@/components/ui/label";

const FingersStep = () => {
  const { state, setField } = useAppStore();
  const fingers = state.fingers;
  const bw = state.athlete.bodyweightKg ?? 0;
  const notTested = fingers.notTested;

  useEffect(() => {
    if (notTested) return;
    if (fingers.externalLoadKg === null) return;
    if (fingers.isAssisted && fingers.externalLoadKg > 0) {
      setField(["fingers", "externalLoadKg"], -Math.abs(fingers.externalLoadKg));
    }
    if (!fingers.isAssisted && fingers.externalLoadKg < 0) {
      setField(["fingers", "externalLoadKg"], Math.abs(fingers.externalLoadKg));
    }
  }, [fingers.externalLoadKg, fingers.isAssisted, notTested, setField]);

  useEffect(() => {
    if (notTested) {
      if (fingers.gripType !== "") setField(["fingers", "gripType"], "");
      if (fingers.externalLoadKg !== null) {
        setField(["fingers", "externalLoadKg"], null);
      }
      if (fingers.isAssisted) setField(["fingers", "isAssisted"], false);
      if (fingers.totalLoadKg !== null) setField(["fingers", "totalLoadKg"], null);
      if (fingers.percentBw !== null) setField(["fingers", "percentBw"], null);
      return;
    }
    if (bw > 0 && fingers.externalLoadKg !== null) {
      const total = bw + fingers.externalLoadKg;
      const percent = roundToOne((total / bw) * 100);
      if (total !== fingers.totalLoadKg) {
        setField(["fingers", "totalLoadKg"], total);
      }
      if (percent !== fingers.percentBw) {
        setField(["fingers", "percentBw"], percent);
      }
    } else if (fingers.totalLoadKg !== null || fingers.percentBw !== null) {
      setField(["fingers", "totalLoadKg"], null);
      setField(["fingers", "percentBw"], null);
    }
  }, [
    bw,
    fingers.externalLoadKg,
    fingers.gripType,
    fingers.isAssisted,
    fingers.totalLoadKg,
    fingers.percentBw,
    notTested,
    setField
  ]);

  useEffect(() => {
    if (notTested) return;
    if (fingers.holdTimeSeconds !== 7) {
      setField(["fingers", "holdTimeSeconds"], 7);
    }
  }, [fingers.holdTimeSeconds, notTested, setField]);

  const displayedExternal =
    fingers.externalLoadKg !== null ? Math.abs(fingers.externalLoadKg) : null;

  return (
    <WizardLayout
      title="FINGERS - Max Hang"
      stepIndex={7}
      totalSteps={8}
      backPath="/step/core"
      nextPath="/step/summary"
    >
      <Card>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={fingers.notTested}
            onChange={(event) =>
              setField(["fingers", "notTested"], event.target.checked)
            }
          />
          <Label>Nie testuje</Label>
        </div>
        <RadioGroup
          label="Typ chwytu"
          value={fingers.gripType}
          options={[
            { label: "Half crimp", value: "half_crimp" },
            { label: "Open hand", value: "open_hand" }
          ]}
          onChange={(value) => setField(["fingers", "gripType"], value)}
          disabled={notTested}
        />
        <Toggle
          label="Odciążenie (negatywny ciężar)?"
          value={fingers.isAssisted}
          onChange={(value) => setField(["fingers", "isAssisted"], value)}
          yesLabel="Tak"
          noLabel="Nie"
          disabled={notTested}
        />
        <NumberField
          label="Dodatkowy ciężar / odciążenie (kg)"
          value={displayedExternal}
          onChange={(value) => {
            if (value === null) {
              setField(["fingers", "externalLoadKg"], null);
              return;
            }
            const signed = fingers.isAssisted ? -Math.abs(value) : value;
            setField(["fingers", "externalLoadKg"], signed);
          }}
          step={0.5}
          disabled={notTested}
        />
        {fingers.percentBw !== null && (
          <div className="badge done large">
            Obciążenie całkowite: {fingers.totalLoadKg} kg ({fingers.percentBw}% BW)
          </div>
        )}
        <div className="helper">
          Test Max Hang (7 s, 20 mm, oburacz). Najbardziej miarodajny test
          siły palców we wspinaczce. Dla osób średniozaawansowanych i
          zaawansowanych.
        </div>
        <div className="helper">
          Warunki wejścia: brak aktywnego bólu palców lub łokci, pełna
          rozgrzewka, minimum około 12 miesięcy regularnego wspinania.
        </div>
        <div className="helper">
          Procedura: kilka zwisów przygotowawczych (krótszy czas, lżejsze
          obciążenie), potem dobierz obciążenie tak, aby 7 s było możliwe,
          a 8 s już nie. Zwis bez bujania, z aktywnymi barkami, bez pełnego
          crimpa.
        </div>
        <div className="helper">
          Ciekawostka: około 124% BW to okolice poziomu 7b, a 160-165% BW
          to poziom 8b+.
        </div>
        <div className="section-title">Parametry testu (stale)</div>
        <div className="helper">Czas zwisu: 7 s</div>
        <div className="helper">Krawędka: 20 mm</div>
        <div className="helper">Ręce: obie</div>
      </Card>
    </WizardLayout>
  );
};

export default FingersStep;





