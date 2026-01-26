import { useEffect } from "react";
import Card from "../../components/Card";
import NumberField from "../../components/NumberField";
import Toggle from "../../components/Toggle";
import WizardLayout from "../../components/WizardLayout";
import { useAppStore } from "../../store/useAppStore";
import { epley1rm, percentOfBw } from "../../utils/orm";
import { Label } from "@/components/ui/label";

const PushStep = () => {
  const { state, setField } = useAppStore();
  const push = state.push;
  const bw = state.athlete.bodyweightKg ?? 0;
  const notTested = push.notTested;

  const canComputeBench =
    push.benchReps !== null &&
    push.benchReps >= 1 &&
    push.benchLoadKg !== null &&
    push.benchLoadKg > 0;

  useEffect(() => {
    if (notTested) return;
    if (!canComputeBench && push.benchComputed1rmKg !== null) {
      setField(["push", "benchComputed1rmKg"], null);
      setField(["push", "benchComputedPercentBw"], null);
    }
    if (canComputeBench) {
      const computed = epley1rm(push.benchLoadKg ?? 0, push.benchReps ?? 0);
      const percent = percentOfBw(computed, bw);
      if (computed != push.benchComputed1rmKg) {
        setField(["push", "benchComputed1rmKg"], computed);
      }
      if (percent != push.benchComputedPercentBw) {
        setField(["push", "benchComputedPercentBw"], percent);
      }
    }
  }, [
    bw,
    canComputeBench,
    push.benchComputed1rmKg,
    push.benchComputedPercentBw,
    push.benchLoadKg,
    push.benchReps,
    notTested,
    setField
  ]);

  useEffect(() => {
    if (!notTested) return;
    if (push.pushupsReps !== null) setField(["push", "pushupsReps"], null);
    if (push.benchTechniqueOk !== null) setField(["push", "benchTechniqueOk"], null);
    if (push.benchReps !== null) setField(["push", "benchReps"], null);
    if (push.benchLoadKg !== null) setField(["push", "benchLoadKg"], null);
    if (push.benchComputed1rmKg !== null) setField(["push", "benchComputed1rmKg"], null);
    if (push.benchComputedPercentBw !== null) {
      setField(["push", "benchComputedPercentBw"], null);
    }
  }, [
    notTested,
    push.benchComputed1rmKg,
    push.benchComputedPercentBw,
    push.benchLoadKg,
    push.benchReps,
    push.benchTechniqueOk,
    push.pushupsReps,
    setField
  ]);

  const warning =
    notTested
      ? undefined
      : push.benchTechniqueOk === null
        ? "Zaznacz, czy znasz poprawną technikę wyciskania."
        : undefined;

  return (
    <WizardLayout
      title="PUSH - Pompki i wyciskanie"
      stepIndex={3}
      totalSteps={8}
      backPath="/step/pull"
      nextPath="/step/hinge"
      warning={warning}
    >
      <Card>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={push.notTested}
            onChange={(event) =>
              setField(["push", "notTested"], event.target.checked)
            }
          />
          <Label>Nie testuje</Label>
        </div>
        <div className="section-title">Pompki</div>
        <NumberField
          label="Liczba pompek"
          value={push.pushupsReps}
          onChange={(value) => setField(["push", "pushupsReps"], value)}
          integer
          disabled={notTested}
        />
        <div className="section-title">Wyciskanie na ławce</div>
        <Toggle
          label="Czy znasz poprawną technikę wyciskania?"
          value={push.benchTechniqueOk}
          onChange={(value) => setField(["push", "benchTechniqueOk"], value)}
          unknownLabel="Nie wiem"
          disabled={notTested}
        />
        <NumberField
          label="Powtórzenia"
          value={push.benchReps}
          onChange={(value) => setField(["push", "benchReps"], value)}
          integer
          disabled={notTested}
        />
        <NumberField
          label="Obciążenie (kg)"
          value={push.benchLoadKg}
          onChange={(value) => setField(["push", "benchLoadKg"], value)}
          step={0.5}
          disabled={notTested}
        />
        <div className="field computed">
          <label>Wyliczony 1RM (ORMw)</label>
          <input
            type="number"
            readOnly
            placeholder="Wyliczy się automatycznie"
            value={push.benchComputed1rmKg ?? ""}
            disabled={notTested}
          />
          {!canComputeBench && (
            <div className="helper">Podaj powtórzenia i obciążenie.</div>
          )}
          {push.benchComputedPercentBw !== null && (
            <div className="helper">To odpowiada {push.benchComputedPercentBw}% BW.</div>
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

export default PushStep;





