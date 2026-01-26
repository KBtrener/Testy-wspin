import { useEffect } from "react";
import Card from "../../components/Card";
import NumberField from "../../components/NumberField";
import Toggle from "../../components/Toggle";
import WizardLayout from "../../components/WizardLayout";
import { useAppStore } from "../../store/useAppStore";
import { epley1rm, percentOfBw } from "../../utils/orm";
import { Label } from "@/components/ui/label";

const SquatStep = () => {
  const { state, setField } = useAppStore();
  const squat = state.squat;
  const bw = state.athlete.bodyweightKg ?? 0;
  const notTested = squat.notTested;

  const canCompute =
    squat.reps !== null && squat.reps >= 1 && squat.loadKg !== null;

  useEffect(() => {
    if (notTested) return;
    if (!canCompute && squat.computed1rmKg !== null) {
      setField(["squat", "computed1rmKg"], null);
      setField(["squat", "computed1rmPercentBw"], null);
    }
    if (canCompute) {
      const computed = epley1rm(squat.loadKg ?? 0, squat.reps ?? 0);
      const percent = percentOfBw(computed, bw);
      if (computed != squat.computed1rmKg) {
        setField(["squat", "computed1rmKg"], computed);
      }
      if (percent != squat.computed1rmPercentBw) {
        setField(["squat", "computed1rmPercentBw"], percent);
      }
    }
  }, [
    bw,
    canCompute,
    squat.computed1rmKg,
    squat.computed1rmPercentBw,
    squat.loadKg,
    squat.reps,
    notTested,
    setField
  ]);
  useEffect(() => {
    if (!notTested) return;
    if (squat.pistolCanPerform !== null) setField(["squat", "pistolCanPerform"], null);
    if (squat.pistolRepsEachLeg !== null) {
      setField(["squat", "pistolRepsEachLeg"], null);
    }
    if (squat.techniqueOk !== null) setField(["squat", "techniqueOk"], null);
    if (squat.reps !== null) setField(["squat", "reps"], null);
    if (squat.loadKg !== null) setField(["squat", "loadKg"], null);
    if (squat.computed1rmKg !== null) setField(["squat", "computed1rmKg"], null);
    if (squat.computed1rmPercentBw !== null) {
      setField(["squat", "computed1rmPercentBw"], null);
    }
  }, [
    notTested,
    squat.computed1rmKg,
    squat.computed1rmPercentBw,
    squat.loadKg,
    squat.pistolCanPerform,
    squat.pistolRepsEachLeg,
    squat.reps,
    squat.techniqueOk,
    setField
  ]);
  return (
    <WizardLayout
      title="SQUAT - Przysiad"
      stepIndex={5}
      totalSteps={8}
      backPath="/step/hinge"
      nextPath="/step/core"
    >
      <Card>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={squat.notTested}
            onChange={(event) =>
              setField(["squat", "notTested"], event.target.checked)
            }
          />
          <Label>Nie testuje</Label>
        </div>
        <div className="section-title">Część sprawnościowa</div>
        <Toggle
          label="Czy zrobisz przysiad na jednej nodze (pistol)?"
          value={squat.pistolCanPerform}
          onChange={(value) => setField(["squat", "pistolCanPerform"], value)}
          disabled={notTested}
        />
        {squat.pistolCanPerform && (
          <NumberField
            label="Powtórzenia na nogę"
            value={squat.pistolRepsEachLeg}
            onChange={(value) => setField(["squat", "pistolRepsEachLeg"], value)}
            integer
          disabled={notTested}
          />
        )}
        <div className="section-title">Część siłowa (przysiad ze sztangą)</div>
        <Toggle
          label="Czy wykonasz przysiad ze sztangą w poprawnej technice?"
          value={squat.techniqueOk}
          onChange={(value) => setField(["squat", "techniqueOk"], value)}
          unknownLabel="Nie wiem"
          disabled={notTested}
        />
        <NumberField
          label="Powtórzenia"
          value={squat.reps}
          onChange={(value) => setField(["squat", "reps"], value)}
          integer
          disabled={notTested}
        />
        <NumberField
          label="Obciążenie (kg)"
          value={squat.loadKg}
          onChange={(value) => setField(["squat", "loadKg"], value)}
          step={0.5}
          disabled={notTested}
        />
        <div className="field computed">
          <label>Wyliczony 1RM (ORMw)</label>
          <input
            type="number"
            readOnly
            placeholder="Wyliczy się automatycznie"
            value={squat.computed1rmKg ?? ""}
            disabled={notTested}
          />
          {!canCompute && (
            <div className="helper">Podaj powtórzenia i obciążenie.</div>
          )}
          {squat.computed1rmPercentBw !== null && (
            <div className="helper">
              To odpowiada {squat.computed1rmPercentBw}% BW.
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

export default SquatStep;










