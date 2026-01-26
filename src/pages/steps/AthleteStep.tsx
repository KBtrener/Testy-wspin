import WizardLayout from "../../components/WizardLayout";
import NumberField from "../../components/NumberField";
import Card from "../../components/Card";
import { useAppStore } from "../../store/useAppStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const AthleteStep = () => {
  const { state, setField } = useAppStore();
  const athlete = state.athlete;

  const warning =
    athlete.bodyweightKg === null || athlete.age === null
      ? "Wiek i masa ciala sa wymagane, aby przejsc dalej."
      : athlete.fullName.trim() === "" || athlete.reportDate.trim() === ""
        ? "Warto uzupelnic imie/nazwisko i date raportu, by uniknac brakow."
        : undefined;

  const canProceed = athlete.bodyweightKg !== null && athlete.age !== null;

  return (
    <WizardLayout
      title="Dane zawodnika"
      stepIndex={1}
      totalSteps={8}
      backPath="/step/athlete"
      nextPath={canProceed ? "/step/pull" : undefined}
      warning={warning}
    >
      <Card>
        <div className="space-y-2">
          <Label>Imię i nazwisko</Label>
          <Input
            value={athlete.fullName}
            onChange={(event) =>
              setField(["athlete", "fullName"], event.target.value)
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Data raportu</Label>
          <Input
            type="date"
            value={athlete.reportDate}
            onChange={(event) =>
              setField(["athlete", "reportDate"], event.target.value)
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Płeć</Label>
          <select
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={athlete.gender}
            onChange={(event) =>
              setField(["athlete", "gender"], event.target.value)
            }
          >
            <option value="">Wybierz</option>
            <option value="male">Mężczyzna</option>
            <option value="female">Kobieta</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label>Wiek (grupa)</Label>
          <select
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={athlete.age ?? ""}
            onChange={(event) =>
              setField(["athlete", "age"], event.target.value || null)
            }
          >
            <option value="" disabled>
              Wybierz
            </option>
            <option value="20 lub mniej">20 lub mniej</option>
            <option value="21-30">21-30</option>
            <option value="30-39">30-39</option>
            <option value="40-49">40-49</option>
            <option value="50-59">50-59</option>
            <option value="60-69">60-69</option>
            <option value="70+">70+</option>
          </select>
        </div>
        <NumberField
          label="Masa ciała (BW) kg"
          value={athlete.bodyweightKg}
          onChange={(value) => setField(["athlete", "bodyweightKg"], value)}
          step={0.5}
        />
        <NumberField
          label="Staż treningowy (lata)"
          value={athlete.trainingYears}
          onChange={(value) => setField(["athlete", "trainingYears"], value)}
          step={0.5}
        />
        <NumberField
          label="Staż wspinaczkowy (lata)"
          value={athlete.climbingYears}
          onChange={(value) => setField(["athlete", "climbingYears"], value)}
          step={0.5}
        />
        <div className="space-y-2">
          <Label>Dolegliwości / uwagi</Label>
          <Textarea
            value={athlete.notes}
            onChange={(event) =>
              setField(["athlete", "notes"], event.target.value)
            }
          />
        </div>
      </Card>
    </WizardLayout>
  );
};

export default AthleteStep;
