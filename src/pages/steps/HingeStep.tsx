import { useEffect } from "react";
import Card from "../../components/Card";
import NumberField from "../../components/NumberField";
import Toggle from "../../components/Toggle";
import WizardLayout from "../../components/WizardLayout";
import { useAppStore } from "../../store/useAppStore";
import { epley1rm, percentOfBw } from "../../utils/orm";
import { Label } from "@/components/ui/label";

const HingeStep = () => {
  const { state, setField } = useAppStore();
  const hinge = state.hinge;
  const bw = state.athlete.bodyweightKg ?? 0;
  const notTested = hinge.notTested;

  const canCompute =
    hinge.reps !== null && hinge.reps >= 1 && hinge.loadKg !== null;

  useEffect(() => {
    if (notTested) return;
    if (!canCompute && hinge.computed1rmKg !== null) {
      setField(["hinge", "computed1rmKg"], null);
      setField(["hinge", "computed1rmPercentBw"], null);
    }
    if (canCompute) {
      const computed = epley1rm(hinge.loadKg ?? 0, hinge.reps ?? 0);
      const percent = percentOfBw(computed, bw);
      if (computed != hinge.computed1rmKg) {
        setField(["hinge", "computed1rmKg"], computed);
      }
      if (percent != hinge.computed1rmPercentBw) {
        setField(["hinge", "computed1rmPercentBw"], percent);
      }
    }
  }, [
    bw,
    canCompute,
    hinge.computed1rmKg,
    hinge.computed1rmPercentBw,
    hinge.loadKg,
    hinge.reps,
    notTested,
    setField
  ]);
  useEffect(() => {
    if (!notTested) return;
    if (hinge.canPerformMin !== null) setField(["hinge", "canPerformMin"], null);
    if (hinge.reps !== null) setField(["hinge", "reps"], null);
    if (hinge.loadKg !== null) setField(["hinge", "loadKg"], null);
    if (hinge.computed1rmKg !== null) setField(["hinge", "computed1rmKg"], null);
    if (hinge.computed1rmPercentBw !== null) {
      setField(["hinge", "computed1rmPercentBw"], null);
    }
  }, [
    hinge.canPerformMin,
    hinge.computed1rmKg,
    hinge.computed1rmPercentBw,
    hinge.loadKg,
    hinge.reps,
    notTested,
    setField
  ]);
  const warning =
    notTested
      ? undefined
      : hinge.canPerformMin === null
        ? "Warto zaznaczyć, czy możesz wykonać martwy ciąg bezpiecznie."
        : undefined;

  return (
    <WizardLayout
      title="HINGE - Martwy ciąg"
      stepIndex={4}
      totalSteps={8}
      backPath="/step/push"
      nextPath="/step/squat"
      warning={warning}
    >
      <Card>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={hinge.notTested}
            onChange={(event) =>
              setField(["hinge", "notTested"], event.target.checked)
            }
          />
          <Label>Nie testuje</Label>
        </div>
        <Toggle
          label="Czy wykonasz martwy ciąg w bezpiecznej technice?"
          value={hinge.canPerformMin}
          onChange={(value) => setField(["hinge", "canPerformMin"], value)}
          unknownLabel="Nie wiem"
          disabled={notTested}
        />
        <NumberField
          label="Powtórzenia"
          value={hinge.reps}
          onChange={(value) => setField(["hinge", "reps"], value)}
          integer
          disabled={notTested}
        />
        <NumberField
          label="Obciążenie (kg)"
          value={hinge.loadKg}
          onChange={(value) => setField(["hinge", "loadKg"], value)}
          step={0.5}
          disabled={notTested}
        />
        <div className="field computed">
          <label>Wyliczony 1RM (ORMw)</label>
          <input
            type="number"
            readOnly
            placeholder="Wyliczy się automatycznie"
            value={hinge.computed1rmKg ?? ""}
            disabled={notTested}
          />
          {!canCompute && (
            <div className="helper">Podaj powtórzenia i obciążenie.</div>
          )}
          {hinge.computed1rmPercentBw !== null && (
            <div className="helper">
              To odpowiada {hinge.computed1rmPercentBw}% BW.
            </div>
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

export default HingeStep;







