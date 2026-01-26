import { useEffect } from "react";
import Card from "../../components/Card";
import NumberField from "../../components/NumberField";
import WizardLayout from "../../components/WizardLayout";
import { useAppStore } from "../../store/useAppStore";
import { percentOfBw } from "../../utils/orm";
import RadioGroup from "../../components/RadioGroup";
import { Label } from "@/components/ui/label";

const PullStep = () => {
  const { state, setField } = useAppStore();
  const pull = state.pull;
  const bw = state.athlete.bodyweightKg ?? 0;
  const is2rm = pull.testMode === "2rm";
  const notTested = pull.notTested;

  useEffect(() => {
    if (notTested) return;
    if (is2rm && pull.reps !== 2) {
      setField(["pull", "reps"], 2);
    }
  }, [is2rm, notTested, pull.reps, setField]);

  const canCompute = !notTested && bw > 0 && pull.reps !== null && pull.reps >= 1;

  useEffect(() => {
    if (notTested) {
      if (pull.reps !== null) setField(["pull", "reps"], null);
      if (pull.addedWeightKg !== null) setField(["pull", "addedWeightKg"], null);
      if (pull.totalLoadKg !== null) setField(["pull", "totalLoadKg"], null);
      if (pull.percentBw !== null) setField(["pull", "percentBw"], null);
      return;
    }
    if (!canCompute) {
      if (pull.totalLoadKg !== null) {
        setField(["pull", "totalLoadKg"], null);
      }
      if (pull.percentBw !== null) {
        setField(["pull", "percentBw"], null);
      }
      return;
    }

    const total = bw + (pull.addedWeightKg ?? 0);
    const percent = percentOfBw(total, bw);
    if (total !== pull.totalLoadKg) {
      setField(["pull", "totalLoadKg"], total);
    }
    if (percent !== pull.percentBw) {
      setField(["pull", "percentBw"], percent);
    }
  }, [
    bw,
    canCompute,
    pull.addedWeightKg,
    pull.percentBw,
    pull.reps,
    pull.totalLoadKg,
    notTested,
    setField
  ]);

  return (
    <WizardLayout
      title="PULL - Podciąganie nachwytem"
      stepIndex={2}
      totalSteps={8}
      backPath="/step/athlete"
      nextPath="/step/push"
    >
      <Card>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={pull.notTested}
            onChange={(event) =>
              setField(["pull", "notTested"], event.target.checked)
            }
          />
          <Label>Nie testuje</Label>
        </div>
        <RadioGroup
          label="Tryb testu"
          value={pull.testMode}
          options={[
            { value: "scale", label: "Skala stopniowana" },
            { value: "2rm", label: "Lattice 2RM" }
          ]}
          onChange={(value) => setField(["pull", "testMode"], value)}
          disabled={notTested}
        />
        <NumberField
          label="Liczba powtórzeń"
          value={pull.reps}
          onChange={(value) => setField(["pull", "reps"], value)}
          integer
          disabled={is2rm || notTested}
          helper={is2rm ? "W trybie 2RM liczba powtórzeń jest ustawiona na 2." : undefined}
        />
        <NumberField
          label="Dodatkowy ciężar (kg)"
          value={pull.addedWeightKg}
          onChange={(value) => setField(["pull", "addedWeightKg"], value)}
          step={0.5}
          min={0}
          disabled={notTested}
        />
        <div className="field computed">
          <label>Wynik w % BW</label>
          <input
            type="number"
            readOnly
            placeholder="Wyliczy się automatycznie"
            value={pull.percentBw ?? ""}
            disabled={notTested}
          />
          {!canCompute && <div className="helper">Podaj BW i powtórzenia.</div>}
          {pull.totalLoadKg !== null && (
            <div className="helper">Całkowite obciążenie: {pull.totalLoadKg} kg.</div>
          )}
        </div>
        <div className="helper">
          Zasady ogólne: rozgrzewka ogólna i specyficzna jest obowiązkowa.
          Priorytetem jest jakość ruchu i brak bólu. Przerwij test natychmiast,
          gdy pojawi się ból lub utrata kontroli technicznej. Nie testuj maksów,
          jeśli technika nie jest stabilna - wtedy wykonaj test pod okiem
          trenera. Celem jest rzetelna ocena siły, nie załamanie formy.
        </div>
        <div className="helper">
          1RM: dla bezpiecznego oszacowania nie wykonuj więcej niż 3-5
          maksymalnych powtórzeń. Jeśli potrafisz zrobić ponad 5 powtórzeń, to nie
          jest test siły maksymalnej. Preferuj szacowanie 1RM na podstawie serii
          3-5 powtórzeń.
        </div>
        <div className="helper">
          Rampowanie: zwiększaj obciążenie stopniowo, seriami. W każdej serii
          wykonuj 3-5 powtórzeń, technicznie czysto. Zatrzymaj test jedną serię
          przed utratą techniki - to jest wynik. Odpoczywaj 2-4 min, aby jakość
          kolejnej serii była pełna.
        </div>
        <div className="helper">
          Złota zasada: test pokazuje to, co potrafisz zrobić dobrze, nie to,
          co potrafisz przepchnąć siłą woli.
        </div>
      </Card>
    </WizardLayout>
  );
};

export default PullStep;


