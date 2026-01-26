import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import WizardLayout from "../../components/WizardLayout";
import { useAppStore } from "../../store/useAppStore";
import {
  classify,
  classifyPull,
  getPull2rmLevels,
  getLevelsForTest,
  type Level
} from "../../data/standards";
import { getInsight, type LevelKey } from "../../data/insights";

const NO_DATA = "Brak danych";

const LEVEL_LABELS: Record<string, string> = {
  below_health: "Poniżej niskiego",
  health: "Niski",
  base: "Wystarczający",
  good_sport: "Dobry",
  advanced: "Bardzo dobry",
  ceiling: "Sufit",
  no_data: NO_DATA
};

const LEVEL_DESCRIPTIONS: Record<string, string> = {
  health:
    "Siła w tym ćwiczeniu jest wyraźnie niewystarczająca i będzie Cię ograniczać we wspinaniu, niezależnie od aktualnego poziomu. Na tym etapie poprawa tej cechy jest zawsze dobrym kierunkiem, ponieważ buduje bazę, zmniejsza ryzyko przeciążeń i pozwala bezpiecznie rozwijać inne elementy treningu.",
  base:
    "Siła jest na poziomie minimalnie wystarczającym, aby nie blokować podstawowego rozwoju. Dla większości osób na tym poziomie siła nie jest głównym limiterem, ale jej dalsze, spokojne rozwijanie poprawia stabilność i tolerancję treningową.",
  good_sport:
    "Siła jest dobrze rozwinięta i przestaje być czynnikiem ograniczającym wspinanie. Na tym poziomie dalszy progres w tym ćwiczeniu daje coraz mniejszy zwrot, a większe korzyści zwykle przynoszą inne aspekty (technika, wytrzymałość, transfer).",
  advanced:
    "Siła znajduje się w górnym, sensownym zakresie użytkowym. Jest to poziom, na którym siła w pełni spełnia swoją rolę wspierającą i nie wymaga dalszego rozwoju. Zalecane jest utrzymanie, a nie dalsze podnoszenie wyników.",
  ceiling:
    "Siła przekracza praktyczny zakres użyteczności dla wspinania. Dalsze zwiększanie tej cechy nie przekłada się na lepsze wspinanie, a może zwiększać zmęczenie, koszt regeneracji lub ryzyko przeciążeń. Na tym etapie priorytetem jest utrzymanie, nie rozwój."
};

const getLevelDescription = (levelKey: string) =>
  LEVEL_DESCRIPTIONS[levelKey] ?? "Brak opisu poziomu.";

const LEVEL_ORDER = [
  "below_health",
  "health",
  "base",
  "good_sport",
  "advanced",
  "ceiling"
];

const levelRank = (key: string) => {
  const index = LEVEL_ORDER.indexOf(key);
  return index == -1 ? -1 : index;
};

const normalizeLevelKey = (areaId: string, levelKey: string | null) => {
  if (!levelKey) return "";
  if (areaId !== "core") return levelKey;
  if (levelKey === "good_sport") return "ceiling";
  return levelKey;
};

const levelColor = (key: string) => {
  switch (key) {
    case "below_health":
      return "#dc2626";
    case "health":
      return "#f59e0b";
    case "base":
      return "#4d7c0f";
    case "good_sport":
      return "#22c55e";
    case "advanced":
      return "#2563eb";
    case "ceiling":
      return "#7c3aed";
    default:
      return "#3a353b";
  }
};

const levelBackground = (key: string) => {
  switch (key) {
    case "below_health":
      return "#fee2e2";
    case "health":
      return "#ffedd5";
    case "base":
      return "#f7fee7";
    case "good_sport":
      return "#dcfce7";
    case "advanced":
      return "#dbeafe";
    case "ceiling":
      return "#ede9fe";
    default:
      return "#f3f4f6";
  }
};

const hasValue = (value: unknown) => {
  if (value == null) return false;
  if (typeof value == "string") return value.trim().length > 0;
  if (typeof value == "number") return !Number.isNaN(value);
  return true;
};

const showInput = (value: number | string | null | undefined) => {
  if (value == null) return NO_DATA;
  if (typeof value == "number") return Number.isNaN(value) ? NO_DATA : String(value);
  return value.trim() ? value : NO_DATA;
};

const formatTernary = (value: boolean | "unknown" | null) => {
  if (value === true) return "Tak";
  if (value === false) return "Nie";
  if (value === "unknown") return "Nie wiem";
  return NO_DATA;
};

const isInsightLevel = (value: string): value is LevelKey =>
  value === "health" ||
  value === "base" ||
  value === "good_sport" ||
  value === "advanced" ||
  value === "ceiling";

const getMarkerPercent = (
  levels: Level[],
  activeKey: string,
  value: number | null | undefined
) => {
  const activeIndex = levels.findIndex((level) => level.key === activeKey);
  if (activeIndex < 0) return 0;

  const level = levels[activeIndex];
  const segmentWidth = 100 / levels.length;
  const segmentStart = activeIndex * segmentWidth;

  if (value == null) {
    return segmentStart + segmentWidth * 0.5;
  }
  if (level.min === null) {
    return segmentStart + segmentWidth * 0.5;
  }

  const min = level.min ?? 0;
  let max = level.max ?? min;
  if (level.max === null) {
    const prev = levels[activeIndex - 1];
    const prevRange =
      prev && prev.min !== null && prev.max !== null ? prev.max - prev.min : null;
    max = min + (prevRange && prevRange > 0 ? prevRange : 1);
  }

  const range = max - min;
  if (range <= 0) return segmentStart + segmentWidth * 0.5;
  const clamped = Math.min(Math.max(value - min, 0), range);
  const fraction = clamped / range;
  const percent = segmentStart + segmentWidth * fraction;
  return Math.min(Math.max(percent, 0), 100);
};

const formatPercent = (value: number | null) =>
  hasValue(value) ? `${(value as number).toFixed(1)}% BW` : NO_DATA;

const DETAILS: Record<
  string,
  { title: string; measure: string; reason: string }
> = {
  pull: {
    title: "Podciąganie (Pull-up - siła ciągowa)",
    measure:
      "Test ocenia maksymalną siłę ciągową górnej części ciała w relacji do masy ciała. To mocny wskaźnik siły względnej w ruchach statycznych i kontrolowanych.",
    reason:
      "Siła podciągania pozwala utrzymać ciało blisko ściany, kontrolować ruch w przewieszeniach i stabilnie dociągać w cruxach. Jest bramą do poziomu, ale nie gwarantuje wyniku; powyżej sufitu to głównie higiena siły."
  },
  push: {
    title: "Wyciskanie leżąc (Bench Press - siła antagonistów)",
    measure:
      "Test mierzy siłę mięśni pchających (klatka piersiowa, barki, tricepsy), czyli antagonistów wobec dominujących we wspinaczce mięśni ciągnących.",
    reason:
      "Choć ruchy pchające rzadko są limiterem sportowym, odpowiedni poziom siły antagonistycznej jest kluczowy dla zdrowia barków i łokci. Dobrze rozwinięta siła push poprawia stabilność stawu ramiennego, zmniejsza ryzyko przeciążeń i kontuzji oraz pozwala utrzymać długoterminową zdolność do intensywnego treningu wspinaczkowego."
  },
  hinge: {
    title: "Martwy ciąg (Deadlift / Hex Bar - tylna taśma)",
    measure:
      "Test ocenia siłę tylnej taśmy mięśniowej: pośladków, prostowników grzbietu, mięśni dwugłowych uda oraz zdolność do przenoszenia siły przez tułów.",
    reason:
      "Silna tylna taśma zapewnia stabilność kręgosłupa i umożliwia efektywne generowanie siły z nóg, szczególnie w wysokich stopniach, dociągnięciach i ruchach dynamicznych. Odpowiedni poziom siły w martwym ciągu działa ochronnie na plecy i pozwala utrzymać napięcie całego ciała w trudnych sekwencjach."
  },
  squat: {
    title: "Przysiad (pełny zakres ruchu)",
    measure:
      "Test ocenia siłę i kontrolę kończyn dolnych w pełnym zakresie ruchu, z naciskiem na mobilność bioder, stabilność kolan i koordynację.",
    reason:
      "Wspinaczka to w dużej mierze praca nóg. Zdolność do generowania siły w głębokich pozycjach przekłada się bezpośrednio na wysokie stopnie, drop-knee, haczenia oraz oszczędzanie siły rąk. W tym teście większe znaczenie ma jakość ruchu i kontrola niż sama liczba kilogramów."
  },
  core: {
    title:
      "Core - testy funkcjonalne (knees-to-elbows, L-sit, front lever, Sorensen)",
    measure:
      "Zestaw testów ocenia zdolność do stabilizacji tułowia w ruchu i w izometrii, czyli realną funkcjonalną siłę core, a nie tylko wytrzymałość statyczną.",
    reason:
      "Silny core umożliwia efektywne przenoszenie siły między rękami a nogami, utrzymanie napięcia w przewieszeniach oraz kontrolę pozycji ciała w dynamicznych ruchach. Niedobory w tej sferze często skutkują rozlewaniem się ciała, utratą precyzji i nadmiernym obciążeniem rąk."
  },
  fingers: {
    title: "Siła palców (Finger Strength - zwis na krawędce)",
    measure:
      "Test ocenia maksymalną siłę palców w relacji do masy ciała, najczęściej poprzez zwis oburącz (lub jednorącz na wyższych poziomach) na standaryzowanej krawędce. To najbardziej specyficzny parametr wspinaczkowy i silny predyktor poziomu.",
    reason:
      "Siła palców bezpośrednio decyduje o utrzymaniu na małych chwytach, jakości w cruxach i marginesie bezpieczeństwa. Otwiera poziom, ale go nie daje; powyżej ~170-180% BW zwrot z kolejnych procentów maleje."
  }
};

type ReportCard = {
  id: string;
  title: string;
  description: string;
  nextLevelNote?: string | null;
  detail: { title: string; measure: string; reason: string };
  scale: { levels: Level[]; activeKey: string } | null;
  scaleValue?: number | null;
  result: {
    levelKey: string;
    levelLabel: string;
    primaryValue: string;
    primaryUnit: string;
    secondaryLabel?: string;
    secondaryValue?: string;
    secondaryUnit?: string;
  };
  inputs: Array<{ label: string; value: string }>;
  insight?: string | null;
  fingerAssessment?: FingerAssessment | null;
};


type FingerBand = {
  grade: string;
  okMin: number;
  okMax: number;
  highMax: number;
};

type FingerAssessment = {
  grade: string;
  category: "Nisko" | "Adekwatnie" | "Wysoko" | "Bardzo wysoko";
  message: string;
};

const FINGER_BANDS: Record<"male" | "female", FingerBand[]> = {
  male: [
    { grade: "6c", okMin: 105, okMax: 115, highMax: 125 },
    { grade: "7a", okMin: 115, okMax: 125, highMax: 135 },
    { grade: "7b", okMin: 120, okMax: 130, highMax: 145 },
    { grade: "7c", okMin: 135, okMax: 150, highMax: 165 },
    { grade: "8a", okMin: 145, okMax: 160, highMax: 175 },
    { grade: "8b", okMin: 155, okMax: 170, highMax: 185 },
    { grade: "8c", okMin: 165, okMax: 180, highMax: 195 },
    { grade: "9a", okMin: 175, okMax: 190, highMax: 205 }
  ],
  female: [
    { grade: "6c", okMin: 90, okMax: 100, highMax: 110 },
    { grade: "7a", okMin: 95, okMax: 105, highMax: 115 },
    { grade: "7b", okMin: 100, okMax: 110, highMax: 125 },
    { grade: "7c", okMin: 115, okMax: 130, highMax: 145 },
    { grade: "8a", okMin: 125, okMax: 140, highMax: 155 },
    { grade: "8b", okMin: 135, okMax: 150, highMax: 165 },
    { grade: "8c", okMin: 145, okMax: 160, highMax: 175 },
    { grade: "9a", okMin: 155, okMax: 170, highMax: 185 }
  ]
};

const getFingerAssessment = (
  percent: number | null,
  sex: "male" | "female"
): FingerAssessment | null => {
  if (percent == null || Number.isNaN(percent)) return null;
  const bands = FINGER_BANDS[sex];
  const eligible = bands.filter((band) => percent >= band.okMin);
  const target = eligible.length ? eligible[eligible.length - 1] : bands[0];

  let category: FingerAssessment["category"];
  if (percent < target.okMin) {
    category = "Nisko";
  } else if (percent <= target.okMax) {
    category = "Adekwatnie";
  } else if (percent <= target.highMax) {
    category = "Wysoko";
  } else {
    category = "Bardzo wysoko";
  }

  const messageByCategory: Record<FingerAssessment["category"], string> = {
    Nisko: `Twoja siła palców odpowiada poziomowi ${target.grade} (status: Nisko). Jeśli wspinasz się na ${target.grade} lub niżej - palce nie ograniczają. Jeśli wspinasz się wyżej niż ${target.grade} - palce ograniczają.`,
    Adekwatnie: `Twoja siła palców odpowiada poziomowi ${target.grade} (status: Adekwatnie). Jeśli wspinasz się na ${target.grade} lub niżej - palce nie ograniczają. Jeśli wspinasz się wyżej niż ${target.grade} - palce ograniczają.`,
    Wysoko: `Twoja siła palców odpowiada poziomowi ${target.grade} (status: Wysoko). Jeśli wspinasz się niżej niż ${target.grade}, masz zapas w palcach - ogranicza Cię siła ogólna, technika lub psycha.`,
    "Bardzo wysoko": `Twoja siła palców odpowiada poziomowi ${target.grade} (status: Bardzo wysoko). Jeśli wspinasz się niżej niż ${target.grade}, masz duży zapas w palcach - ogranicza Cię siła ogólna, technika lub psycha.`
  };

  return { grade: target.grade, category, message: messageByCategory[category] };
};

const getFingerMarkerPercent = (
  percent: number | null,
  sex: "male" | "female"
): number | null => {
  const assessment = getFingerAssessment(percent, sex);
  if (!assessment) return null;
  const bands = FINGER_BANDS[sex];
  const gradeIndex = bands.findIndex((band) => band.grade === assessment.grade);
  if (gradeIndex < 0) return null;
  const segmentWidth = 100 / bands.length;
  const band = bands[gradeIndex];
  const adequateWidth = band.okMax - band.okMin;
  const highWidth = band.highMax - band.okMax;
  const lowMin = band.okMin - adequateWidth;
  const highMax = band.highMax + (highWidth > 0 ? highWidth : adequateWidth);
  const clamped = Math.min(Math.max(percent ?? band.okMin, lowMin), highMax);
  const range = highMax - lowMin;
  const fraction = range > 0 ? (clamped - lowMin) / range : 0.5;
  const marker = (gradeIndex + fraction) * segmentWidth;
  return Math.min(Math.max(marker, 0), 100);
};

const fingerCategoryColor = (category: FingerAssessment["category"]) => {
  switch (category) {
    case "Nisko":
      return "#dc2626";
    case "Adekwatnie":
      return "#16a34a";
    case "Wysoko":
      return "#2563eb";
    case "Bardzo wysoko":
      return "#7c3aed";
    default:
      return "#3a353b";
  }
};

type FingerAspect = "Nisko" | "Adekwatnie" | "Wysoko" | "Bardzo wysoko";

const getFingerAspectMarker = (
  percent: number | null,
  band: FingerBand
): { percent: number; aspect: FingerAspect } | null => {
  if (percent == null || Number.isNaN(percent)) return null;
  const adequateWidth = band.okMax - band.okMin;
  const highWidth = band.highMax - band.okMax;
  const lowMin = band.okMin - adequateWidth;
  const veryMax = band.highMax + (highWidth > 0 ? highWidth : adequateWidth);

  let aspect: FingerAspect = "Adekwatnie";
  let fraction = 0.5;

  if (percent < band.okMin) {
    aspect = "Nisko";
    const range = band.okMin - lowMin;
    fraction = range > 0 ? (percent - lowMin) / range : 0.5;
  } else if (percent <= band.okMax) {
    aspect = "Adekwatnie";
    const range = band.okMax - band.okMin;
    fraction = range > 0 ? (percent - band.okMin) / range : 0.5;
  } else if (percent <= band.highMax) {
    aspect = "Wysoko";
    const range = band.highMax - band.okMax;
    fraction = range > 0 ? (percent - band.okMax) / range : 0.5;
  } else {
    aspect = "Bardzo wysoko";
    const range = veryMax - band.highMax;
    fraction = range > 0 ? (percent - band.highMax) / range : 0.5;
  }

  const segmentWidth = 100 / 4;
  const index = ["Nisko", "Adekwatnie", "Wysoko", "Bardzo wysoko"].indexOf(aspect);
  const marker = (index + Math.min(Math.max(fraction, 0), 1)) * segmentWidth;
  return { percent: Math.min(Math.max(marker, 0), 100), aspect };
};

const SECTION_DESCRIPTIONS = {
  strength: {
    title: "Twój profil siłowy",
    lead:
      "Testy siły nie są bezpośrednio powiązane z konkretnym poziomem wspinania. Ich celem jest zbudowanie Twojego profilu siłowego - oceny, czy Twoja siła jest kompletna, zrównoważona i wystarczająca, aby nie ograniczała wspinania.",
    body:
      "Wspinaczka nie wymaga maksymalnej siły we wszystkich bojach, ale wymaga, aby żaden z podstawowych elementów siły nie był wąskim gardłem. Lattice wykorzystuje skalę podciągania do analizy relacji między siłą a poziomem wspinania, jednak nawet tam podciąganie przestaje być dźwignią progresu po osiągnięciu pewnego poziomu. Dlatego w tych testach nie szukamy rekordu, nie przypisujemy bezpośrednio stopnia wspinaczkowego, tylko sprawdzamy, czy Twoja siła jest na tyle kompletna, by wspinanie mogło się rozwijać dalej. Silny profil siłowy = brak ograniczeń systemowych, a niekoniecznie wysoki wynik w jednym ćwiczeniu."
  },
  fingers: {
    title: "Bezpośredni wyznacznik możliwości wspinaczkowych",
    lead:
      "W przeciwieństwie do testów siły ogólnej, testy palców są bezpośrednio powiązane z poziomem wspinania. Siła palców jest najsilniej skorelowaną cechą z tym, na jakim poziomie realnie się wspinasz.",
    body:
      "We wspinaniu to właśnie palce najczęściej wyznaczają górną granicę możliwości. Można poprawić technikę, wytrzymałość czy taktykę, ale nie da się stabilnie wspinać powyżej poziomu siły palców. Dlatego testy palców są interpretowane wprost względem poziomu wspinania, a ich wynik traktujemy jako sufit możliwości, a nie jedną z wielu cech. Poziom palców = poziom, na którym wspinanie jest możliwe bez kombinowania. To właśnie dlatego testy palców mają w aplikacji osobną, uprzywilejowaną rolę."
  },
  core: {
    title: "Wstępna ocena - nie pełny obraz",
    lead:
      "Testy core w tej sekcji są wstępną oceną, a nie pełną diagnozą sprawności centralnej. Pokazują one podstawowy poziom kontroli tułowia, ale nie wyczerpują tematu stabilności i funkcji core.",
    body:
      "Najlepszym ogólnym wyznacznikiem sprawności ciała - w tym pracy core - są testy FMS (Functional Movement Screen). Dają one znacznie pełniejszy obraz jakości ruchu niż pojedyncze testy siłowe. Jeśli chodzi stricte o siłę core, jednym z najlepszych testów jest dragon flag (smocza flaga) jako test czystej kontroli i napięcia globalnego. Jednocześnie waga przodem (front lever) jest testem mieszanym - łączy w sobie siłę core oraz siłę ściągania (pull). Dlatego można mieć bardzo mocny core, zrobić smoczą flagę, a mimo to nie wykonać wagi przodem, jeśli siła ściągania jest niewystarczająca. Brak wagi przodem nie zawsze oznacza słaby core - często oznacza brak równowagi między core a górną częścią ciała."
  }
};


const SummaryStep = () => {
  const { state, setField } = useAppStore();
  const pull = state.pull;
  const targetLevel = state.dashboardTargetLevel;
  const ageBand = state.athlete.age;

  const sex = state.athlete.gender == "female" ? "female" : "male";
  const pullInsightId = sex == "female" ? "pull_up_female" : "pull_up_male";

  const pullPercent = state.pull.percentBw;
  const pullModeLabel = state.pull.testMode === "2rm" ? "Lattice 2RM" : "Skala stopniowana";

  const benchPercent = state.push.benchComputedPercentBw;
  const pushSummaryMethod = state.push.summaryMethod ?? "bench";
  const pushupsReps = state.push.pushupsReps;
  const pushSummaryTestId = pushSummaryMethod === "pushups" ? "pushups" : "bench_press";
  const pushSummaryValue =
    pushSummaryMethod === "pushups" ? pushupsReps : benchPercent ?? null;
  const fingerAssessment = useMemo(
    () =>
      state.fingers.notTested ? null : getFingerAssessment(state.fingers.percentBw, sex),
    [state.fingers.notTested, state.fingers.percentBw, sex]
  );
  const [dashboardView, setDashboardView] = useState<"strength" | "fingers" | "core">(
    "strength"
  );
  const storedClimbGrade = state.dashboardClimbGrade?.trim();
  const [selectedClimbGrade, setSelectedClimbGrade] = useState<string>(
    storedClimbGrade || fingerAssessment?.grade || FINGER_BANDS[sex][0]?.grade || "6c"
  );
  const [gradeTouched, setGradeTouched] = useState(false);

  useEffect(() => {
    if (gradeTouched) return;
    if (storedClimbGrade) {
      if (selectedClimbGrade !== storedClimbGrade) {
        setSelectedClimbGrade(storedClimbGrade);
      }
      return;
    }
    if (!fingerAssessment?.grade) return;
    if (selectedClimbGrade === fingerAssessment.grade) return;
    setSelectedClimbGrade(fingerAssessment.grade);
    setField(["dashboardClimbGrade"], fingerAssessment.grade);
  }, [
    fingerAssessment?.grade,
    gradeTouched,
    selectedClimbGrade,
    storedClimbGrade,
    setField
  ]);

  const classifyWithBelow = (
    testId: string,
    value: number | string | null
  ) => {
    if (testId === "front_lever" && (value === null || value === "none")) {
      return null;
    }
    if (!hasValue(value)) return null;
    const result = classify(testId, sex, value as number | string, ageBand);
    if (result.levelKey == "no_data") {
      if (testId === "front_lever") return null;
      return { levelKey: "below_health", label: LEVEL_LABELS.below_health };
    }
    return result;
  };

  const classifyPullWithBelow = () => {
    if (state.pull.notTested) return null;
    if (!hasValue(pullPercent)) return null;
    if (pull.testMode === "2rm") {
      if (pull.reps === null) return null;
        const result = classifyPull({
          mode: pull.testMode,
          sex,
          percentBw: pullPercent,
          reps: pull.reps,
          addedWeightKg: pull.addedWeightKg,
          ageBand
        });
      if (result.levelKey == "no_data") {
        return { levelKey: "below_health", label: LEVEL_LABELS.below_health };
      }
      return result;
    }

    const result = classify(pullInsightId, sex, pullPercent ?? "", ageBand);
    if (result.levelKey == "no_data") {
      return { levelKey: "below_health", label: LEVEL_LABELS.below_health };
    }
    return result;
  };

  const areas = useMemo(() => {
    const pullLevel = state.pull.notTested ? null : classifyPullWithBelow();
    const pushLevel = state.push.notTested
      ? null
      : classifyWithBelow(pushSummaryTestId, pushSummaryValue ?? null);
    const hingeLevel = state.hinge.notTested
      ? null
      : classifyWithBelow("deadlift", state.hinge.computed1rmPercentBw);
    const squatLevel = state.squat.notTested
      ? null
      : classifyWithBelow("squat", state.squat.computed1rmPercentBw);
    const fingersLevel = fingerAssessment
      ? { levelKey: "good_sport", label: fingerAssessment.grade }
      : null;

    const coreResult = state.core.notTested
      ? null
      : classifyWithBelow("front_lever", state.core.frontLeverLevel);
    const coreLevelKey = coreResult ? coreResult.levelKey : null;
    const coreLevelLabel = coreResult ? coreResult.label : NO_DATA;
    const coreNote = state.core.notTested
      ? "Brak pomiaru"
      : hasValue(state.core.frontLeverLevel)
        ? "Front lever"
        : "Brak pomiaru";

    return [
      {
        id: "pull",
        title: "PULL",
        value: state.pull.notTested ? NO_DATA : formatPercent(pullPercent),
        levelLabel: pullLevel?.label ?? NO_DATA,
        levelKey: pullLevel?.levelKey ?? null,
        note: pullModeLabel
      },
      {
        id: "push",
        title: "PUSH",
        value: state.push.notTested
          ? NO_DATA
          : pushSummaryMethod === "pushups"
            ? hasValue(pushupsReps)
              ? `${pushupsReps} powt.`
              : NO_DATA
            : formatPercent(benchPercent ?? null),
        levelLabel: pushLevel?.label ?? NO_DATA,
        levelKey: pushLevel?.levelKey ?? null,
        note: pushSummaryMethod === "pushups" ? "Pompki" : "Ławka"
      },
      {
        id: "hinge",
        title: "HINGE",
        value: state.hinge.notTested ? NO_DATA : formatPercent(state.hinge.computed1rmPercentBw),
        levelLabel: hingeLevel?.label ?? NO_DATA,
        levelKey: hingeLevel?.levelKey ?? null,
        note: "Martwy ciąg"
      },
      {
        id: "squat",
        title: "SQUAT",
        value: state.squat.notTested ? NO_DATA : formatPercent(state.squat.computed1rmPercentBw),
        levelLabel: squatLevel?.label ?? NO_DATA,
        levelKey: squatLevel?.levelKey ?? null,
        note: "Przysiad"
      },
      {
        id: "core",
        title: "CORE",
        value: coreLevelLabel,
        levelLabel: coreLevelLabel,
        levelKey: coreLevelKey,
        note: coreNote
      },
      {
      id: "fingers",
      title: "FINGERS",
      value: state.fingers.notTested ? NO_DATA : formatPercent(state.fingers.percentBw),
      levelLabel: fingersLevel?.label ? `Poziom palców: ${fingersLevel.label}` : NO_DATA,
      levelKey: fingersLevel?.levelKey ?? null,
      note: "Max hang"
      }
    ];
  }, [
    benchPercent,
    pullPercent,
    pullModeLabel,
    pushSummaryMethod,
    pushupsReps,
    state.pull.notTested,
    state.push.notTested,
    state.hinge.notTested,
    state.squat.notTested,
    state.core.notTested,
    state.fingers.notTested,
    state.core.frontLeverLevel,
    state.core.kneesToElbowsReps,
    state.core.lSitSeconds,
    state.core.sorensenSeconds,
    state.fingers.percentBw,
    state.hinge.computed1rmPercentBw,
    state.pull.addedWeightKg,
    state.pull.reps,
    state.pull.testMode,
    state.squat.computed1rmPercentBw,
    sex,
    state.athlete.age
  ]);

  const strengthAreaIds = new Set(["pull", "push", "hinge", "squat"]);
  const strengthAreas = areas.filter((area) => strengthAreaIds.has(area.id));
  const measuredStrengthAreas = strengthAreas.filter((area) => area.levelKey);
  const strengthMeetsTargetCount = measuredStrengthAreas.filter(
    (area) =>
      levelRank(normalizeLevelKey(area.id, area.levelKey ?? "")) >= levelRank(targetLevel)
  ).length;

  const levelCompletion = strengthAreas.length
    ? strengthMeetsTargetCount / strengthAreas.length
    : 0;
  const donutStyle: CSSProperties = {
    "--value": Math.round(levelCompletion * 100),
    "--color": levelColor(targetLevel)
  } as CSSProperties;

  const nextLevelIndex = LEVEL_ORDER.indexOf(targetLevel) + 1;
  const nextLevelKey = LEVEL_ORDER[nextLevelIndex] ?? null;
  const nextLevelLabel = nextLevelKey ? LEVEL_LABELS[nextLevelKey] : null;
  const areasBelowNextLevel = nextLevelKey
    ? strengthAreas.filter(
        (area) =>
          levelRank(
            normalizeLevelKey(area.id, area.levelKey ?? "below_health")
          ) < levelRank(nextLevelKey)
      )
    : [];
  const areasBelowNextLevelNames = areasBelowNextLevel.map((area) => area.title);
  const ceilingAreas = measuredStrengthAreas
    .filter((area) => area.levelKey === "ceiling")
    .map((area) => area.title);
  const levelProgressMessage = nextLevelLabel
    ? areasBelowNextLevelNames.length
      ? `Brakuje Ci poprawy ${areasBelowNextLevel.length} testów, żeby osiągnąć poziom ${nextLevelLabel}.` +
        ` Do poprawy: ${areasBelowNextLevelNames.join(", ")}.`
      : `Masz juz poziom ${nextLevelLabel} we wszystkich obszarach. Swietna robota!`
    : ceilingAreas.length
      ? `Ostateczne zwycięstwo: masz poziom Sufit w obszarach ${ceilingAreas.join(
          ", "
        )}.`
      : "Ostateczne zwycięstwo: osiągnąłeś najwyższy poziom docelowy.";
  const fingerMarkerPercent = useMemo(
    () =>
      state.fingers.notTested
        ? null
        : getFingerMarkerPercent(state.fingers.percentBw, sex),
    [state.fingers.notTested, state.fingers.percentBw, sex]
  );
  const selectedBand = useMemo(
    () => FINGER_BANDS[sex].find((band) => band.grade === selectedClimbGrade),
    [selectedClimbGrade, sex]
  );
  const fingerAspectMarker = useMemo(
    () =>
      state.fingers.notTested || !selectedBand
        ? null
        : getFingerAspectMarker(state.fingers.percentBw, selectedBand),
    [selectedBand, state.fingers.notTested, state.fingers.percentBw]
  );

  const getLevels = (testId: string): Level[] => getLevelsForTest(testId, sex, ageBand);

  const getPercentBwNextLevelNote = (params: {
    levels: Level[];
    currentKey: string | null | undefined;
    currentValue: number | null | undefined;
    bodyweight: number | null | undefined;
  }) => {
    const { levels, currentKey, currentValue, bodyweight } = params;
    if (!levels.length || !currentKey || currentKey === "no_data") return null;
    if (currentValue == null || bodyweight == null) return null;
    const currentIndex = levels.findIndex((level) => level.key === currentKey);
    if (currentIndex < 0) return null;
    const nextLevel = levels[currentIndex + 1];
    if (!nextLevel || nextLevel.min === null) return null;
    const deltaPercent = nextLevel.min - currentValue;
    if (deltaPercent <= 0) return null;
    const deltaKg = (deltaPercent / 100) * bodyweight;
    return `Aby wejść na następny poziom możesz zrobić +${deltaKg.toFixed(
      1
    )} kg.`;
  };

  const getPullNextLevelNote = (levelKey: string | null | undefined) => {
    if (state.pull.notTested) return null;
    if (!levelKey || levelKey === "no_data") return null;
    if (pullPercent == null || state.athlete.bodyweightKg == null) return null;
    if (pull.testMode === "2rm") {
      return getPercentBwNextLevelNote({
        levels: getPull2rmLevels(sex, ageBand),
        currentKey: levelKey,
        currentValue: pullPercent,
        bodyweight: state.athlete.bodyweightKg
      });
    }
    return getPercentBwNextLevelNote({
      levels: getLevels(pullInsightId),
      currentKey: levelKey,
      currentValue: pullPercent,
      bodyweight: state.athlete.bodyweightKg
    });
  };

  const reportCards = useMemo(() => {
    const data: ReportCard[] = [];

    const pullLevel = state.pull.notTested
      ? null
      : pullPercent !== null
        ? pull.testMode === "2rm"
          ? pull.reps !== null
            ? classifyPull({
                mode: pull.testMode,
                sex,
                percentBw: pullPercent,
                reps: pull.reps,
                addedWeightKg: pull.addedWeightKg,
                ageBand
              })
            : null
          : classify(pullInsightId, sex, pullPercent, ageBand)
        : null;
    const pullScale = state.pull.notTested
      ? []
      : pull.testMode === "2rm"
        ? getPull2rmLevels(sex, ageBand)
        : getLevels(pullInsightId);
    data.push({
      id: "pull",
      title: `PULL - Podciąganie nachwytem (${pullModeLabel})`,
      description: "Siła wzgledna górnej części ciała.",
      nextLevelNote: getPullNextLevelNote(pullLevel?.levelKey ?? null),
      detail: DETAILS.pull,
      scale: pullScale.length
        ? { levels: pullScale, activeKey: pullLevel?.levelKey ?? "no_data" }
        : null,
      scaleValue: state.pull.notTested ? null : pullPercent ?? null,
      result: {
        levelKey: pullLevel?.levelKey ?? "no_data",
        levelLabel: pullLevel?.label ?? NO_DATA,
        primaryValue: state.pull.notTested ? NO_DATA : pullPercent ? pullPercent.toFixed(2) : NO_DATA,
        primaryUnit: "% BW",
        secondaryLabel: "Całkowite obciążenie",
        secondaryValue: state.pull.notTested ? NO_DATA : state.pull.totalLoadKg?.toString() ?? NO_DATA,
        secondaryUnit: "kg"
      },
      inputs: [
        {
          label: "Tryb testu",
          value: pullModeLabel
        },
        {
          label: "Powtórzenia",
          value: showInput(state.pull.reps)
        },
        {
          label: "Dodatkowy ciężar",
          value: showInput(state.pull.addedWeightKg) + " kg"
        }
      ],
      insight:
        pullLevel && isInsightLevel(pullLevel.levelKey)
          ? getInsight(pullInsightId, sex, pullLevel.levelKey)
          : null
    });

    const benchLevel = state.push.notTested
      ? null
      : benchPercent
        ? classify("bench_press", sex, benchPercent, ageBand)
        : null;
    const pushupsLevel =
      state.push.notTested ? null : pushupsReps !== null ? classify("pushups", sex, pushupsReps, ageBand) : null;
    const benchScale = state.push.notTested ? [] : getLevels("bench_press");
    const pushupsScale = state.push.notTested ? [] : getLevels("pushups");
    const pushLevel = pushSummaryMethod === "pushups" ? pushupsLevel : benchLevel;
    const pushScale = pushSummaryMethod === "pushups" ? pushupsScale : benchScale;
    data.push({
      id: "push",
      title: "PUSH - Pompki i wyciskanie",
      description: "Siła pchania i wytrzymałość górnej części ciała.",
      nextLevelNote:
        pushSummaryMethod === "bench"
          ? getPercentBwNextLevelNote({
              levels: pushScale,
              currentKey: pushLevel?.levelKey ?? null,
              currentValue: benchPercent ?? null,
              bodyweight: state.athlete.bodyweightKg
            })
          : null,
      detail: DETAILS.push,
      scale: pushScale.length
        ? { levels: pushScale, activeKey: pushLevel?.levelKey ?? "no_data" }
        : null,
      scaleValue: state.push.notTested ? null : pushSummaryMethod === "pushups" ? pushupsReps ?? null : benchPercent ?? null,
      result: {
        levelKey: pushLevel?.levelKey ?? "no_data",
        levelLabel: pushLevel?.label ?? NO_DATA,
        primaryValue: state.push.notTested
          ? NO_DATA
          : pushSummaryMethod === "pushups"
            ? showInput(pushupsReps)
            : benchPercent
              ? benchPercent.toFixed(2)
              : NO_DATA,
        primaryUnit: pushSummaryMethod === "pushups" ? "powt." : "% BW",
        secondaryLabel:
          pushSummaryMethod === "pushups" ? undefined : "ORMw ławka",
        secondaryValue: state.push.notTested
          ? NO_DATA
          : pushSummaryMethod === "pushups"
            ? undefined
            : state.push.benchComputed1rmKg?.toString() ?? NO_DATA,
        secondaryUnit: pushSummaryMethod === "pushups" ? undefined : "kg"
      },
      inputs: [
        {
          label: "Technika wyciskania",
          value: formatTernary(state.push.benchTechniqueOk)
        },
        { label: "Pompki", value: showInput(state.push.pushupsReps) },
        { label: "Powtórzenia na ławce", value: showInput(state.push.benchReps) },
        {
          label: "Obciążenie na ławce",
          value: showInput(state.push.benchLoadKg) + " kg"
        }
      ],
      insight:
        pushLevel && isInsightLevel(pushLevel.levelKey)
          ? getInsight(pushSummaryTestId, sex, pushLevel.levelKey)
          : null
    });

    const deadliftLevel = state.hinge.notTested ? null : state.hinge.computed1rmPercentBw
      ? classify("deadlift", sex, state.hinge.computed1rmPercentBw, ageBand)
      : null;
    const deadliftScale = state.hinge.notTested ? [] : getLevels("deadlift");
    data.push({
      id: "hinge",
      title: "HINGE - Martwy ciąg",
      description: "Siła tylnego lancucha i stabilizacja tułowia.",
      nextLevelNote: getPercentBwNextLevelNote({
        levels: deadliftScale,
        currentKey: deadliftLevel?.levelKey ?? null,
        currentValue: state.hinge.computed1rmPercentBw ?? null,
        bodyweight: state.athlete.bodyweightKg
      }),
      detail: DETAILS.hinge,
      scale: deadliftScale.length
        ? { levels: deadliftScale, activeKey: deadliftLevel?.levelKey ?? "no_data" }
        : null,
      scaleValue: state.hinge.notTested ? null : state.hinge.computed1rmPercentBw ?? null,
      result: {
        levelKey: deadliftLevel?.levelKey ?? "no_data",
        levelLabel: deadliftLevel?.label ?? NO_DATA,
        primaryValue: state.hinge.notTested ? NO_DATA : state.hinge.computed1rmPercentBw
          ? state.hinge.computed1rmPercentBw.toFixed(2)
          : NO_DATA,
        primaryUnit: "% BW",
        secondaryLabel: "ORMw",
        secondaryValue: state.hinge.notTested ? NO_DATA : state.hinge.computed1rmKg?.toString() ?? NO_DATA,
        secondaryUnit: "kg"
      },
      inputs: [
        {
          label: "Technika martwego ciągu",
          value: formatTernary(state.hinge.canPerformMin)
        },
        { label: "Powtórzenia", value: showInput(state.hinge.reps) },
        { label: "Obciążenie", value: showInput(state.hinge.loadKg) + " kg" }
      ],
      insight:
        deadliftLevel && isInsightLevel(deadliftLevel.levelKey)
          ? getInsight("deadlift", sex, deadliftLevel.levelKey)
          : null
    });

    const squatLevel = state.squat.notTested ? null : state.squat.computed1rmPercentBw
      ? classify("squat", sex, state.squat.computed1rmPercentBw, ageBand)
      : null;
    const squatScale = state.squat.notTested ? [] : getLevels("squat");
    data.push({
      id: "squat",
      title: "SQUAT - Przysiad",
      description: "Siła nóg i stabilizacja w przysiadzie ze sztanga.",
      nextLevelNote: getPercentBwNextLevelNote({
        levels: squatScale,
        currentKey: squatLevel?.levelKey ?? null,
        currentValue: state.squat.computed1rmPercentBw ?? null,
        bodyweight: state.athlete.bodyweightKg
      }),
      detail: DETAILS.squat,
      scale: squatScale.length
        ? { levels: squatScale, activeKey: squatLevel?.levelKey ?? "no_data" }
        : null,
      scaleValue: state.squat.notTested ? null : state.squat.computed1rmPercentBw ?? null,
      result: {
        levelKey: squatLevel?.levelKey ?? "no_data",
        levelLabel: squatLevel?.label ?? NO_DATA,
        primaryValue: state.squat.notTested ? NO_DATA : state.squat.computed1rmPercentBw
          ? state.squat.computed1rmPercentBw.toFixed(2)
          : NO_DATA,
        primaryUnit: "% BW",
        secondaryLabel: "ORMw",
        secondaryValue: state.squat.notTested ? NO_DATA : state.squat.computed1rmKg?.toString() ?? NO_DATA,
        secondaryUnit: "kg"
      },
      inputs: [
        {
          label: "Technika przysiadu",
          value: formatTernary(state.squat.techniqueOk)
        },
        { label: "Powtórzenia", value: showInput(state.squat.reps) },
        { label: "Obciążenie", value: showInput(state.squat.loadKg) + " kg" }
      ],
      insight:
        squatLevel && isInsightLevel(squatLevel.levelKey)
          ? getInsight("squat", sex, squatLevel.levelKey)
          : null
    });

    const coreResult = state.core.notTested
      ? null
      : hasValue(state.core.frontLeverLevel)
        ? classify("front_lever", sex, state.core.frontLeverLevel, ageBand)
        : null;
    const coreLevelLabel = coreResult ? coreResult.label : NO_DATA;
    const coreScale = state.core.notTested ? [] : getLevels("front_lever");

    data.push({
      id: "core",
      title: "CORE - Testy funkcjonalne",
      description: "Stabilizacja tułowia i kontrola w ruchu.",
      detail: DETAILS.core,
      scale: coreScale.length
        ? { levels: coreScale, activeKey: coreResult?.levelKey ?? "no_data" }
        : null,
      scaleValue: null,
      result: {
        levelKey: coreResult?.levelKey ?? "no_data",
        levelLabel: coreLevelLabel,
        primaryValue: coreLevelLabel,
        primaryUnit: "",
        secondaryLabel: undefined,
        secondaryValue: undefined,
        secondaryUnit: undefined
      },
      inputs: [
        {
          label: "Knees-to-elbows",
          value: showInput(state.core.kneesToElbowsReps)
        },
        { label: "L-sit", value: state.core.notTested ? NO_DATA : showInput(state.core.lSitSeconds) + " s" },
        { label: "Sorensen", value: state.core.notTested ? NO_DATA : showInput(state.core.sorensenSeconds) + " s" },
        { label: "Front lever", value: state.core.notTested ? NO_DATA : showInput(state.core.frontLeverLevel) },
        {
          label: "Kontrola transferu", value: state.core.notTested ? NO_DATA : formatTernary(state.core.transferControl)
        }
      ],
      insight:
        coreResult && isInsightLevel(coreResult.levelKey)
          ? getInsight("front_lever", sex, coreResult.levelKey)
          : "Brak interpretacji dla tego wyniku."
    });

    const fingersLevel = fingerAssessment
      ? { levelKey: "good_sport", label: fingerAssessment.grade }
      : null;
    data.push({
      id: "fingers",
      title: "FINGERS - Max Hang",
      description: "Siła palców w zwisie na krawedce 20 mm.",
      nextLevelNote: null,
      detail: DETAILS.fingers,
      scale: null,
      scaleValue: null,
      result: {
        levelKey: fingersLevel?.levelKey ?? "no_data",
        levelLabel: fingersLevel?.label ? `Poziom palców: ${fingersLevel.label}` : NO_DATA,
        primaryValue: state.fingers.notTested ? NO_DATA : state.fingers.percentBw ? state.fingers.percentBw.toFixed(2) : NO_DATA,
        primaryUnit: "% BW",
        secondaryLabel: "Obciążenie całkowite",
        secondaryValue: state.fingers.notTested ? NO_DATA : state.fingers.totalLoadKg?.toString() ?? NO_DATA,
        secondaryUnit: "kg"
      },
      fingerAssessment,
      inputs: [
        { label: "Typ chwytu", value: showInput(state.fingers.gripType) },
        {
          label: "Dodatkowy ciężar",
          value: showInput(state.fingers.externalLoadKg) + " kg"
        },
        { label: "Czas zwisu", value: showInput(state.fingers.holdTimeSeconds) + " s" }
      ],
      insight: null
    });

    return data;
  }, [
    benchPercent,
    pullPercent,
    pullInsightId,
    pullModeLabel,
    pushSummaryMethod,
    pushupsReps,
    sex,
    state.athlete.bodyweightKg,
    state.core.frontLeverLevel,
    state.core.kneesToElbowsReps,
    state.core.lSitSeconds,
    state.core.sorensenSeconds,
    state.fingers.externalLoadKg,
    state.fingers.gripType,
    state.fingers.holdTimeSeconds,
    state.fingers.percentBw,
    state.fingers.totalLoadKg,
    state.hinge.computed1rmKg,
    state.hinge.computed1rmPercentBw,
    state.hinge.loadKg,
    state.hinge.reps,
    state.pull.addedWeightKg,
    state.pull.reps,
    state.pull.testMode,
    state.pull.totalLoadKg,
    state.push.benchComputed1rmKg,
    state.push.benchLoadKg,
    state.push.benchReps,
    state.push.benchTechniqueOk,
    state.push.pushupsReps,
    state.pull.notTested,
    state.push.notTested,
    state.hinge.notTested,
    state.squat.notTested,
    state.core.notTested,
    state.fingers.notTested,
    state.hinge.canPerformMin,
    state.athlete.age,
    state.squat.computed1rmKg,
    state.squat.computed1rmPercentBw,
    state.squat.loadKg,
    state.squat.reps,
    state.squat.techniqueOk,
    state.core.transferControl,
    fingerAssessment
  ]);

  const filteredReportCards = useMemo(() => {
    if (dashboardView === "fingers") {
      return reportCards.filter((card) => card.id === "fingers");
    }
    if (dashboardView === "core") {
      return reportCards.filter((card) => card.id === "core");
    }
    return reportCards.filter((card) =>
      ["pull", "push", "hinge", "squat"].includes(card.id)
    );
  }, [dashboardView, reportCards]);

  return (
    <WizardLayout
      title="Dashboard"
      stepIndex={8}
      totalSteps={8}
      backPath="/step/fingers"
    >
      <div className="dashboard">
        <div className="dashboard-hero">
          <div className="dashboard-card">
            <div className="dashboard-title">{state.athlete.fullName || "Zawodnik"}</div>
            <div className="athlete-grid">
              <div className="athlete-item">
                <span>Data raportu</span>
                <strong>{state.athlete.reportDate || "-"}</strong>
              </div>
              <div className="athlete-item">
                <span>Płeć</span>
                <strong>{state.athlete.gender || "-"}</strong>
              </div>
              <div className="athlete-item">
                <span>Wiek</span>
                <strong>{state.athlete.age ?? "-"}</strong>
              </div>
              <div className="athlete-item">
                <span>BW</span>
                <strong>{state.athlete.bodyweightKg ?? "-"} kg</strong>
              </div>
              <div className="athlete-item">
                <span>Staż treningowy</span>
                <strong>{state.athlete.trainingYears ?? "-"} lat</strong>
              </div>
              <div className="athlete-item">
                <span>Staż wspinaczkowy</span>
                <strong>{state.athlete.climbingYears ?? "-"} lat</strong>
              </div>
              <div className="athlete-item">
                <span>Push w podsumowaniu</span>
                <select
                  className="dashboard-select"
                  value={pushSummaryMethod}
                  onChange={(event) =>
                    setField(
                      ["push", "summaryMethod"],
                      event.target.value as "bench" | "pushups"
                    )
                  }
                >
                  <option value="bench">Wyciskanie na ławce</option>
                  <option value="pushups">Pompki</option>
                </select>
              </div>
              <div className="athlete-item athlete-notes">
                <span>Dolegliwosci / uwagi</span>
                <strong>{state.athlete.notes || "-"}</strong>
              </div>
            </div>
            <div className="dashboard-actions">
              <Link to="/report" className="button">
                Otworz raport PDF
              </Link>
              <Link to="/step/athlete" className="button secondary">
                Wróć na początek formularza
              </Link>
            </div>
          </div>
          <div className="dashboard-card">
            <div className="dashboard-row">
              <div>
                <div className="dashboard-label">Poziom docelowy</div>
                <select
                  className="dashboard-select"
                  value={targetLevel}
                  onChange={(event) =>
                    setField(
                      ["dashboardTargetLevel"],
                      event.target.value as
                        | "health"
                        | "base"
                        | "good_sport"
                        | "advanced"
                        | "ceiling"
                    )
                  }
                >
                  <option value="health">Niski</option>
                  <option value="base">Wystarczający</option>
                  <option value="good_sport">Dobry</option>
                  <option value="advanced">Bardzo dobry</option>
                  <option value="ceiling">Sufit</option>
                </select>
              </div>
              <div className="dashboard-stat">
                <div className="dashboard-stat-value">
                  Wykonanych zostalo {measuredStrengthAreas.length} testów profilu
                  siłowego z {strengthAreas.length}.
                </div>
              </div>
            </div>
            <div className="dashboard-donut">
              <div className="donut" style={donutStyle}>
                <div className="donut-center">
                  <div className="donut-value">
                    {Math.round(levelCompletion * 100)}%
                  </div>
                  <div className="donut-label">poziomu</div>
                </div>
              </div>
              <div className="dashboard-donut-meta">
                <div className="dashboard-stat-label">{levelProgressMessage}</div>
                <div className="dashboard-stat-value">
                  {strengthMeetsTargetCount}/{strengthAreas.length}
                </div>
                <div className="dashboard-sub">
                  Kompletność profilu siłowego: liczba testów na poziomie lub wyżej
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-label">Siła palców na skali wspinaczkowej</div>
          {fingerAssessment ? (
            <>
              <div className="summary-text">
                Palce masz na poziomie {fingerAssessment.grade} (
                {fingerAssessment.category}).
              </div>
              <div className="summary-text">{fingerAssessment.message}</div>
            </>
          ) : (
            <div className="summary-text">
              Brak wyniku palców - uzupełnij test Max Hang, aby zobaczyć pozycję
              na skali.
            </div>
          )}
          <div className="report-scale">
            <div className="report-scale-track">
              {FINGER_BANDS[sex].map((band) => (
                <div
                  key={band.grade}
                  className="report-scale-segment"
                  style={{ background: "rgba(58,53,59,0.2)" }}
                />
              ))}
              {fingerMarkerPercent !== null && (
                <>
                  <div
                    className="report-scale-marker"
                    style={
                      {
                        left: `${fingerMarkerPercent}%`,
                        "--marker-color": fingerCategoryColor(
                          fingerAssessment?.category ?? "Adekwatnie"
                        )
                      } as CSSProperties
                    }
                  />
                  <div
                    className="report-scale-dot"
                    style={
                      {
                        left: `${fingerMarkerPercent}%`,
                        "--marker-color": fingerCategoryColor(
                          fingerAssessment?.category ?? "Adekwatnie"
                        )
                      } as CSSProperties
                    }
                  />
                </>
              )}
            </div>
            <div className="report-scale-labels">
              {FINGER_BANDS[sex].map((band) => (
                <span key={band.grade}>{band.grade}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          {areas.map((area) => {
            const tone = area.levelKey ?? "no_data";
            const tileStyle: CSSProperties = {
              borderColor: levelColor(tone),
              background: levelBackground(tone)
            };
            return (
              <div key={area.id} className="dashboard-tile" style={tileStyle}>
                <div className="tile-header">
                  <div className="tile-title">{area.title}</div>
                  <div
                    className="tile-pill"
                    style={{
                      color: levelColor(tone),
                      background: "#ffffff",
                      borderColor: levelColor(tone)
                    }}
                  >
                    {area.levelLabel}
                  </div>
                </div>
                <div className="tile-value">{area.value}</div>
                {area.id === "fingers" && fingerAssessment ? (
                  <>
                    <div className="tile-meta">
                      Palce masz na poziomie {fingerAssessment.grade} (
                      {fingerAssessment.category})
                    </div>
                    <div className="tile-meta">{area.note}</div>
                  </>
                ) : (
                  <div className="tile-meta">{area.note}</div>
                )}
              </div>
            );
          })}
        </div>

        <div className="dashboard-report">
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-sm font-semibold text-foreground">Widok:</div>
            <button
              type="button"
              className={`button ${dashboardView === "strength" ? "secondary" : ""}`}
              onClick={() => setDashboardView("strength")}
            >
              Testy siły
            </button>
            <button
              type="button"
              className={`button ${dashboardView === "fingers" ? "secondary" : ""}`}
              onClick={() => setDashboardView("fingers")}
            >
              Testy palców
            </button>
            <button
              type="button"
              className={`button ${dashboardView === "core" ? "secondary" : ""}`}
              onClick={() => setDashboardView("core")}
            >
              Testy core
            </button>
          </div>
          <div className="report-card">
            <div className="report-header">
              <div>
                <div className="report-title">
                  {SECTION_DESCRIPTIONS[dashboardView].title}
                </div>
                <div className="report-desc">
                  {SECTION_DESCRIPTIONS[dashboardView].lead}
                </div>
              </div>
            </div>
            <div className="report-body">
              <div className="detail-block">
                <div className="detail-text">
                  {SECTION_DESCRIPTIONS[dashboardView].body}
                </div>
              </div>
            </div>
          </div>
          {filteredReportCards.map((card) => {
            const resultStyle: CSSProperties = {
              borderColor: levelColor(card.result.levelKey),
              background: levelBackground(card.result.levelKey)
            };
            return (
              <div key={card.id} className="report-card">
                <div className="report-header">
                  <div>
                    <div className="report-title">{card.detail.title}</div>
                    <div className="report-desc">{card.description}</div>
                  </div>
                </div>
                <div className="report-body">
                  {card.nextLevelNote && (
                    <div className="detail-block">
                      <div className="detail-label">Jak mieć poziom wyżej</div>
                      <div className="detail-text">{card.nextLevelNote}</div>
                    </div>
                  )}
                  {card.fingerAssessment && (
                    <div className="detail-block">
                      <div className="detail-label">Stan palców</div>
                      <div className="detail-text">{card.fingerAssessment.message}</div>
                    </div>
                  )}
                  {card.id === "fingers" && (
                    <div className="detail-block">
                      <div className="detail-label">Skala wspinaczkowa (palce)</div>
                      <div className="report-scale">
                        <div className="report-scale-track">
                          {FINGER_BANDS[sex].map((band) => (
                            <div
                              key={band.grade}
                              className="report-scale-segment"
                              style={{ background: "rgba(58,53,59,0.2)" }}
                            />
                          ))}
                          {fingerMarkerPercent !== null && (
                            <>
                              <div
                                className="report-scale-marker"
                                style={
                                  {
                                    left: `${fingerMarkerPercent}%`,
                                    "--marker-color": fingerCategoryColor(
                                      fingerAssessment?.category ?? "Adekwatnie"
                                    )
                                  } as CSSProperties
                                }
                              />
                              <div
                                className="report-scale-dot"
                                style={
                                  {
                                    left: `${fingerMarkerPercent}%`,
                                    "--marker-color": fingerCategoryColor(
                                      fingerAssessment?.category ?? "Adekwatnie"
                                    )
                                  } as CSSProperties
                                }
                              />
                            </>
                          )}
                        </div>
                        <div className="report-scale-labels">
                          {FINGER_BANDS[sex].map((band) => (
                            <span key={band.grade}>{band.grade}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="detail-block">
                    <div className="detail-label">Co mierzy</div>
                    <div className="detail-text">{card.detail.measure}</div>
                </div>
                <div className="detail-block">
                  <div className="detail-label">Dlaczego to ważne we wspinaczce</div>
                  <div className="detail-text">{card.detail.reason}</div>
                </div>
                {card.id === "fingers" ? (
                  <div className="detail-block">
                    <div className="detail-label">Wybierz swój obecny poziom wspinania</div>
                    <select
                      className="dashboard-select"
                      value={selectedClimbGrade}
                      onChange={(event) => {
                        setSelectedClimbGrade(event.target.value);
                        setGradeTouched(true);
                        setField(["dashboardClimbGrade"], event.target.value);
                      }}
                    >
                      {FINGER_BANDS[sex].map((band) => (
                        <option key={band.grade} value={band.grade}>
                          {band.grade}
                        </option>
                      ))}
                    </select>
                    <div className="report-scale">
                      <div className="report-scale-track">
                        {["Nisko", "Adekwatnie", "Wysoko", "Bardzo wysoko"].map(
                          (label) => (
                            <div
                              key={label}
                              className="report-scale-segment"
                              style={{ background: "rgba(58,53,59,0.2)" }}
                            />
                          )
                        )}
                        {fingerAspectMarker && (
                          <>
                            <div
                              className="report-scale-marker"
                              style={
                                {
                                  left: `${fingerAspectMarker.percent}%`,
                                  "--marker-color": fingerCategoryColor(
                                    fingerAspectMarker.aspect as FingerAssessment["category"]
                                  )
                                } as CSSProperties
                              }
                            />
                            <div
                              className="report-scale-dot"
                              style={
                                {
                                  left: `${fingerAspectMarker.percent}%`,
                                  "--marker-color": fingerCategoryColor(
                                    fingerAspectMarker.aspect as FingerAssessment["category"]
                                  )
                                } as CSSProperties
                              }
                            />
                          </>
                        )}
                      </div>
                      <div className="report-scale-labels">
                        {["Nisko", "Adekwatnie", "Wysoko", "Bardzo wysoko"].map((label) => (
                          <span key={label}>{label}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  card.scale && (() => {
                    const markerPercent = getMarkerPercent(
                      card.scale.levels,
                      card.scale.activeKey,
                      card.scaleValue ?? null
                    );
                    const markerStyle: CSSProperties = {
                      left: `${markerPercent}%`,
                      "--marker-color": levelColor(card.scale.activeKey)
                    } as CSSProperties;
                    return (
                      <div className="report-scale">
                        <div className="report-scale-track">
                          {card.scale.levels.map((level) => {
                            const isActive = level.key === card.scale?.activeKey;
                            return (
                              <div
                                key={level.key}
                                className={`report-scale-segment${isActive ? " active" : ""}`}
                                style={{
                                  background: isActive
                                    ? levelBackground(level.key)
                                    : "rgba(58,53,59,0.2)"
                                }}
                              />
                            );
                          })}
                          <div className="report-scale-marker" style={markerStyle} />
                          <div className="report-scale-dot" style={markerStyle} />
                        </div>
                        <div className="report-scale-labels">
                          {card.scale.levels.map((level) => (
                            <span key={level.key}>{level.label}</span>
                          ))}
                        </div>
                      </div>
                    );
                  })()
                )}
                  <div className="report-row-pair">
                    <div className="report-result" style={resultStyle}>
                      <div className="report-result-title">Wynik główny</div>
                      <div className="report-result-level">
                        {card.id === "fingers"
                          ? `Poziom palców (wspinaczkowy): ${card.fingerAssessment?.grade ?? NO_DATA}`
                          : card.result.levelLabel}
                      </div>
                      <div className="report-row">
                        <span>Wynik</span>
                        <strong>
                          {card.result.primaryValue} {card.result.primaryUnit}
                        </strong>
                      </div>
                      {card.result.secondaryLabel && card.result.secondaryValue && (
                        <div className="report-row">
                          <span>{card.result.secondaryLabel}</span>
                          <strong>
                            {card.result.secondaryValue} {card.result.secondaryUnit}
                          </strong>
                        </div>
                      )}
                      <div className="report-note">
                        Poziom i %BW są kluczowe; szczegóły zależne od testu.
                      </div>
                    </div>
                    <div className="report-section">
                      <div className="report-section-title">Dane wejściowe</div>
                      {card.inputs.map((item) => (
                        <div key={item.label} className="report-row">
                          <span>{item.label}</span>
                          <strong>{item.value}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="report-section mt-4">
                    <div className="report-section-title">Poziom i interpretacja</div>
                    <div className="report-row">
                      <span>Poziom ćwiczenia</span>
                      <strong>{card.result.levelLabel}</strong>
                    </div>
                    <div className="report-note">
                      {getLevelDescription(card.result.levelKey)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </WizardLayout>
  );
};

export default SummaryStep;















