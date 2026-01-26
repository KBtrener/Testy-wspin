import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AGE_FACTORS, STANDARDS, type Level, type TestStandard } from "../data/standards";

const UNIT_LABELS: Record<string, string> = {
  percent_bw: "% BW",
  reps: "powtórzenia",
  seconds: "sekundy",
  enum: "poziom"
};

const formatRange = (level: Level) => {
  if (level.min === null && level.max === null) {
    return level.note ? `(${level.note})` : "-";
  }
  if (level.min === null) return `<= ${level.max}`;
  if (level.max === null) return `>= ${level.min}`;
  return `${level.min}-${level.max}`;
};

const renderLevels = (levels: Level[]) => (
  <table className="table">
    <thead>
      <tr className="text-left text-xs text-muted-foreground">
        <th className="pb-2">Poziom</th>
        <th className="pb-2">Zakres</th>
        <th className="pb-2">Klucz</th>
      </tr>
    </thead>
    <tbody>
      {levels.map((level) => (
        <tr key={`${level.key}-${level.label}`}>
          <td className="py-1.5 text-sm font-semibold text-foreground">
            {level.label}
          </td>
          <td className="py-1.5 text-sm text-muted-foreground">
            {formatRange(level)}
          </td>
          <td className="py-1.5 text-xs text-muted-foreground">{level.key}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const FINGER_CLIMBING_LEVELS = {
  id: "fingers",
  title: "Siła palców (Max Hang 20 mm, 7 s, 2 ręce)",
  unit: "% BW",
  male: [
    { grade: "6c", low: "<105%", ok: "105-115%", high: "115-125%", very: ">125%" },
    { grade: "7a", low: "<115%", ok: "115-125%", high: "125-135%", very: ">135%" },
    { grade: "7b", low: "<120%", ok: "120-130%", high: "130-145%", very: ">145%" },
    { grade: "7c", low: "<135%", ok: "135-150%", high: "150-165%", very: ">165%" },
    { grade: "8a", low: "<145%", ok: "145-160%", high: "160-175%", very: ">175%" },
    { grade: "8b", low: "<155%", ok: "155-170%", high: "170-185%", very: ">185%" },
    { grade: "8c", low: "<165%", ok: "165-180%", high: "180-195%", very: ">195%" },
    { grade: "9a", low: "<175%", ok: "175-190%", high: "190-205%", very: ">205%" }
  ],
  female: [
    { grade: "6c", low: "<90%", ok: "90-100%", high: "100-110%", very: ">110%" },
    { grade: "7a", low: "<95%", ok: "95-105%", high: "105-115%", very: ">115%" },
    { grade: "7b", low: "<100%", ok: "100-110%", high: "110-125%", very: ">125%" },
    { grade: "7c", low: "<115%", ok: "115-130%", high: "130-145%", very: ">145%" },
    { grade: "8a", low: "<125%", ok: "125-140%", high: "140-155%", very: ">155%" },
    { grade: "8b", low: "<135%", ok: "135-150%", high: "150-165%", very: ">165%" },
    { grade: "8c", low: "<145%", ok: "145-160%", high: "160-175%", very: ">175%" },
    { grade: "9a", low: "<155%", ok: "155-170%", high: "170-185%", very: ">185%" }
  ]
};

const LEVEL_DESCRIPTIONS = [
  {
    key: "health",
    level: "Niski",
    text:
      "Siła w tym ćwiczeniu jest wyraźnie niewystarczająca i będzie Cię ograniczać we wspinaniu, niezależnie od aktualnego poziomu.\n\nNa tym etapie poprawa tej cechy jest zawsze dobrym kierunkiem, ponieważ buduje bazę, zmniejsza ryzyko przeciążeń i pozwala bezpiecznie rozwijać inne elementy treningu."
  },
  {
    key: "base",
    level: "Wystarczający",
    text:
      "Siła jest na poziomie minimalnie wystarczającym, aby nie blokować podstawowego rozwoju.\n\nDla większości osób na tym poziomie siła nie jest głównym limiterem, ale jej dalsze, spokojne rozwijanie poprawia stabilność i tolerancję treningową."
  },
  {
    key: "good_sport",
    level: "Dobry",
    text:
      "Siła jest dobrze rozwinięta i przestaje być czynnikiem ograniczającym wspinanie.\n\nNa tym poziomie dalszy progres w tym ćwiczeniu daje coraz mniejszy zwrot, a większe korzyści zwykle przynoszą inne aspekty (technika, wytrzymałość, transfer)."
  },
  {
    key: "advanced",
    level: "Bardzo dobry",
    text:
      "Siła znajduje się w górnym, sensownym zakresie użytkowym.\n\nJest to poziom, na którym siła w pełni spełnia swoją rolę wspierającą i nie wymaga dalszego rozwoju. Zalecane jest utrzymanie, a nie dalsze podnoszenie wyników."
  },
  {
    key: "ceiling",
    level: "Sufit",
    text:
      "Siła przekracza praktyczny zakres użyteczności dla wspinania.\n\nDalsze zwiększanie tej cechy nie przekłada się na lepsze wspinanie, a może zwiększać zmęczenie, koszt regeneracji lub ryzyko przeciążeń. Na tym etapie priorytetem jest utrzymanie, nie rozwój."
  }
];

const renderFingerClimbingTable = (
  rows: Array<{ grade: string; low: string; ok: string; high: string; very: string }>
) => (
  <table className="table">
    <thead>
      <tr className="text-left text-xs text-muted-foreground">
        <th className="pb-2">Poziom (FR)</th>
        <th className="pb-2">Nisko (deficyt)</th>
        <th className="pb-2">Adekwatnie</th>
        <th className="pb-2">Wysoko</th>
        <th className="pb-2">Bardzo wysoko</th>
      </tr>
    </thead>
    <tbody>
      {rows.map((row) => (
        <tr key={row.grade}>
          <td className="py-1.5 text-sm font-semibold text-foreground">{row.grade}</td>
          <td className="py-1.5 text-sm text-muted-foreground">{row.low}</td>
          <td className="py-1.5 text-sm text-muted-foreground">{row.ok}</td>
          <td className="py-1.5 text-sm text-muted-foreground">{row.high}</td>
          <td className="py-1.5 text-sm text-muted-foreground">{row.very}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const renderAgeFactorTable = () => (
  <table className="table">
    <thead>
      <tr className="text-left text-xs text-muted-foreground">
        <th className="pb-2">Grupa wieku</th>
        <th className="pb-2">Age factor</th>
      </tr>
    </thead>
    <tbody>
      {AGE_FACTORS.map((entry) => (
        <tr key={entry.band}>
          <td className="py-1.5 text-sm font-semibold text-foreground">
            {entry.band}
          </td>
          <td className="py-1.5 text-sm text-muted-foreground">
            {entry.factor.toFixed(2)}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

const StandardsPage = () => {
  const navigate = useNavigate();
  const tests = useMemo(() => STANDARDS.tests, []);

  return (
    <div className="mx-auto w-full max-w-5xl rounded-2xl border border-border bg-card/95 p-6 shadow-xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Standardy</h1>
          <div className="mt-1 text-sm text-muted-foreground">
            Podgląd aktualnych progów klasyfikacji testów.
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => navigate(-1)}>
            Wróć
          </Button>
          <Button size="sm" onClick={() => navigate("/step/summary")}>
            Dashboard
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        <div className="rounded-xl border border-border bg-background p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <div className="text-sm font-semibold text-foreground">
                {FINGER_CLIMBING_LEVELS.title}
              </div>
              <div className="text-xs text-muted-foreground">
                Zakres - poziom wspinania (M/K)
              </div>
            </div>
          </div>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Mężczyźni
              </div>
              {renderFingerClimbingTable(FINGER_CLIMBING_LEVELS.male)}
            </div>
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Kobiety
              </div>
              {renderFingerClimbingTable(FINGER_CLIMBING_LEVELS.female)}
            </div>
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            Adekwatnie = palce nie blokują poziomu. Wysoko = palce powyżej potrzeby.
            Bardzo wysoko = niski zwrot z dalszego treningu palców.
          </div>
        </div>
        <div className="rounded-xl border border-border bg-background p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <div className="text-sm font-semibold text-foreground">Age factor</div>
              <div className="text-xs text-muted-foreground">
                Mnożnik dla testów siłowych (nie dotyczy testów palców).
              </div>
            </div>
          </div>
          <div className="mt-3">{renderAgeFactorTable()}</div>
        </div>
        <div className="rounded-xl border border-border bg-background p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <div className="text-sm font-semibold text-foreground">
                Opisy poziomów
              </div>
              <div className="text-xs text-muted-foreground">
                Klucz poziomu, nazwa robocza i interpretacja
              </div>
            </div>
          </div>
          <div className="mt-3">
            <table className="table">
              <thead>
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="pb-2">Poziom</th>
                  <th className="pb-2">Klucz</th>
                  <th className="pb-2">Opis</th>
                </tr>
              </thead>
              <tbody>
                {LEVEL_DESCRIPTIONS.map((row) => (
                  <tr key={row.key}>
                    <td className="py-1.5 text-sm font-semibold text-foreground">
                      {row.level}
                    </td>
                    <td className="py-1.5 text-sm text-muted-foreground">{row.key}</td>
                    <td className="py-1.5 text-sm text-muted-foreground whitespace-pre-line">
                      {row.text}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {tests.map((test: TestStandard) => (
          <div
            key={test.id}
            className="rounded-xl border border-border bg-background p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="text-sm font-semibold text-foreground">
                  {test.label}
                </div>
                <div className="text-xs text-muted-foreground">
                  {UNIT_LABELS[test.unit] ?? test.unit} · {test.id}
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                {test.sexSpecific ? "Różnice wg płci" : "Wspólne progi"}
              </div>
            </div>

            <div className="mt-3">
              {"levels" in test ? (
                renderLevels(test.levels)
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Mężczyźni
                    </div>
                    {renderLevels(test.levelsBySex.male)}
                  </div>
                  <div>
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Kobiety
                    </div>
                    {renderLevels(test.levelsBySex.female)}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StandardsPage;


