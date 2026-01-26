
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  BlobProvider,
  Font,
  Svg,
  Circle,
  Polygon,
  Image
} from "@react-pdf/renderer";
import { useMemo } from "react";
import { useAppStore } from "../store/useAppStore";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  classify,
  classifyPull,
  getPull2rmLevels,
  getLevelsForTest,
  type Level
} from "../data/standards";
import { getInsight, type LevelKey } from "../data/insights";
import arial from "../assets/fonts/arial.ttf";
import arialBold from "../assets/fonts/arialbd.ttf";
import logoKbt from "../assets/logokbt.png";

Font.register({
  family: "Arial",
  fonts: [
    { src: arial, fontWeight: 400 },
    { src: arialBold, fontWeight: 700 }
  ]
});

const THEME = {
  ink: "#3a353b",
  teal: "#128099",
  lime: "#c1d445",
  background: "#f5f5f2",
  card: "#ffffff",
  border: "rgba(58,53,59,0.16)",
  muted: "rgba(58,53,59,0.78)",
  mutedStrong: "rgba(58,53,59,0.9)"
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 18,
    paddingBottom: 70,
    paddingHorizontal: 24,
    fontSize: 13,
    fontFamily: "Arial",
    color: THEME.ink,
    backgroundColor: THEME.background
  },
  header: {
    marginBottom: 10,
    padding: 18,
    borderWidth: 1,
    borderColor: THEME.border,
    borderRadius: 12,
    backgroundColor: THEME.card
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  logo: {
    width: 70,
    height: 52,
    objectFit: "contain"
  },
  title: {
    fontSize: 17,
    fontWeight: 700,
    color: THEME.ink
  },
  sub: {
    color: THEME.muted,
    marginTop: 4
  },
  footer: {
    position: "absolute",
    bottom: 18,
    left: 24,
    right: 24,
    fontSize: 11,
    color: THEME.muted,
    borderWidth: 1,
    borderColor: THEME.border,
    borderRadius: 10,
    padding: 8,
    backgroundColor: THEME.card,
    textAlign: "center"
  },
  hero: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12
  },
  card: {
    borderWidth: 1,
    borderColor: THEME.border,
    borderRadius: 12,
    padding: 22,
    backgroundColor: THEME.card,
    flex: 1
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 8
  },
  athleteGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 6,
    columnGap: 10
  },
  athleteItem: {
    width: "48%"
  },
  athleteLabel: {
    fontSize: 12,
    color: THEME.muted
  },
  athleteValue: {
    fontSize: 14,
    fontWeight: 600
  },
  athleteNotes: {
    width: "100%"
  },
  targetLabel: {
    fontSize: 14,
    color: THEME.muted
  },
  targetValue: {
    fontSize: 15,
    fontWeight: 700,
    marginTop: 2
  },
  donutWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 8
  },
  donutValue: {
    fontSize: 23,
    fontWeight: 700,
    textAlign: "center"
  },
  donutLabel: {
    fontSize: 11,
    color: THEME.muted,
    textAlign: "center"
  },
  donutMeta: {
    flexDirection: "column",
    gap: 4
  },
  statLabel: {
    fontSize: 11,
    color: THEME.muted
  },
  statValue: {
    fontSize: 13,
    fontWeight: 700
  },
  tiles: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 12
  },
  tile: {
    width: "31%",
    borderWidth: 1,
    borderColor: THEME.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12
  },
  tileTitle: {
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: THEME.teal
  },
  tileValue: {
    fontSize: 20,
    fontWeight: 700,
    marginTop: 6
  },
  tileMeta: {
    fontSize: 13,
    color: THEME.muted,
    marginTop: 2
  },
  pill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 2,
    paddingHorizontal: 6,
    fontSize: 10,
    fontWeight: 700
  },
  tileHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  summary: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12
  },
  summaryCard: {
    borderWidth: 1,
    borderColor: THEME.border,
    borderRadius: 12,
    padding: 20,
    backgroundColor: THEME.card,
    flex: 1
  },
  summaryTitle: {
    fontSize: 17,
    fontWeight: 700,
    marginBottom: 6
  },
  summaryText: {
    fontSize: 14,
    color: THEME.ink,
    lineHeight: 1.55
  },
  guidelinesCard: {
    borderWidth: 1,
    borderColor: THEME.border,
    borderRadius: 12,
    padding: 20,
    backgroundColor: THEME.card,
    marginBottom: 12
  },
  guidelinesSection: {
    marginTop: 10
  },
  guidelinesTitle: {
    fontSize: 12,
    fontWeight: 700,
    textTransform: "uppercase",
    color: THEME.mutedStrong,
    letterSpacing: 0.6
  },
  guidelinesText: {
    fontSize: 12,
    color: THEME.muted,
    marginTop: 4,
    lineHeight: 1.5
  },
  guidelinesTable: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: THEME.border,
    borderRadius: 8,
    overflow: "hidden"
  },
  guidelinesRow: {
    flexDirection: "row",
    alignItems: "stretch"
  },
  guidelinesCell: {
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRightWidth: 1,
    borderRightColor: THEME.border,
    fontSize: 10
  },
  guidelinesHeaderCell: {
    fontSize: 9,
    fontWeight: 700,
    color: THEME.mutedStrong,
    backgroundColor: "#f1f3f2"
  },
  glossaryRow: {
    marginBottom: 6
  },
  glossaryTerm: {
    fontSize: 10,
    fontWeight: 700,
    textTransform: "uppercase",
    color: THEME.mutedStrong
  },
  glossaryText: {
    fontSize: 11,
    color: THEME.muted
  },
  sectionIntro: {
    borderWidth: 1,
    borderColor: THEME.border,
    borderRadius: 12,
    padding: 20,
    backgroundColor: THEME.card,
    marginBottom: 12
  },
  sectionIntroTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: THEME.ink
  },
  sectionIntroLead: {
    fontSize: 13,
    color: THEME.muted,
    marginTop: 6
  },
  sectionIntroBody: {
    fontSize: 12,
    color: THEME.ink,
    marginTop: 8,
    lineHeight: 1.5
  },
  reportCard: {
    borderWidth: 1,
    borderColor: THEME.border,
    borderRadius: 12,
    padding: 20,
    backgroundColor: THEME.card,
    marginBottom: 12
  },
  reportTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: THEME.ink
  },
  reportDesc: {
    fontSize: 14,
    color: THEME.muted,
    marginTop: 4
  },
  sectionPageTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: THEME.ink,
    marginBottom: 12
  },
  detailLabel: {
    fontSize: 13,
    color: THEME.teal,
    fontWeight: 700,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginTop: 20
  },
  detailText: {
    fontSize: 14,
    lineHeight: 1.6,
    color: THEME.ink
  },
  resultBox: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginTop: 0,
    flex: 1
  },
  resultTitle: {
    fontSize: 12,
    color: THEME.muted,
    textTransform: "uppercase"
  },
  resultLevel: {
    fontSize: 18,
    fontWeight: 700,
    marginTop: 4
  },
  resultValuePrimary: {
    fontSize: 20,
    fontWeight: 700,
    color: THEME.ink
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 8,
    marginTop: 4
  },
  rowLabel: {
    fontSize: 12,
    color: THEME.muted
  },
  rowValue: {
    fontSize: 12,
    fontWeight: 700,
    color: THEME.ink
  },
  note: {
    fontSize: 10,
    color: THEME.muted,
    marginTop: 4
  },
  section: {
    borderWidth: 1,
    borderColor: THEME.border,
    borderRadius: 10,
    padding: 16,
    marginTop: 0,
    backgroundColor: THEME.background,
    flex: 1
  },
  resultRowPair: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    textTransform: "uppercase",
    color: THEME.teal,
    letterSpacing: 0.6,
    marginBottom: 12,
    marginTop: 20
  },
  scale: {
    marginTop: 8
  },
  scaleTrack: {
    position: "relative",
    flexDirection: "row",
    height: 12,
    borderRadius: 999,
    backgroundColor: "rgba(58,53,59,0.2)"
  },
  scaleSegment: {
    flex: 1
  },
  scaleMarker: {
    position: "absolute",
    top: -10,
    width: 14,
    height: 10,
    zIndex: 2
  },
  scaleMarkerDot: {
    position: "absolute",
    top: 4,
    width: 5,
    height: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: THEME.background,
    zIndex: 2
  },
  scaleLabels: {
    marginTop: 4,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  scaleLabel: {
    fontSize: 8,
    color: THEME.muted
  },
  fingerScale: {
    marginTop: 12
  },
  fingerScaleTrack: {
    position: "relative",
    flexDirection: "row",
    height: 12,
    borderRadius: 999,
    backgroundColor: "rgba(58,53,59,0.2)"
  },
  fingerScaleSegment: {
    flex: 1
  },
  fingerScaleLabels: {
    marginTop: 4,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  fingerScaleLabel: {
    fontSize: 8,
    color: THEME.muted
  },
  fingerMarker: {
    position: "absolute",
    top: -10,
    width: 14,
    height: 10,
    zIndex: 2
  },
  fingerMarkerDot: {
    position: "absolute",
    top: 4,
    width: 5,
    height: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: THEME.background,
    zIndex: 2
  }
});

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

const formatPercent = (value: number | null) =>
  hasValue(value) ? `${(value as number).toFixed(1)}% BW` : NO_DATA;

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
const DETAILS: Record<string, { title: string; measure: string; reason: string }> = {
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
    title: "Core - testy funkcjonalne (knees-to-elbows, L-sit, front lever, Sorensen)",
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

type Area = {
  id: string;
  title: string;
  value: string;
  levelLabel: string;
  levelKey: string | null;
  note: string;
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

const sanitizeFileName = (value: string) =>
  value.replace(/[\\/:*?"<>|]+/g, "-").replace(/\s+/g, " ").trim();

const getLevels = (testId: string, sex: "male" | "female", ageBand?: string | null) =>
  getLevelsForTest(testId, sex, ageBand);

const Donut = ({ value, color }: { value: number; color: string }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const dash = (value / 100) * circumference;
  return (
    <View
      style={{
        width: 96,
        height: 96,
        position: "relative",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Svg width={96} height={96} viewBox="0 0 96 96" style={{ position: "absolute" }}>
        <Circle
          cx={48}
          cy={48}
          r={radius}
          stroke={THEME.border}
          strokeWidth={10}
          fill="none"
        />
        <Circle
          cx={48}
          cy={48}
          r={radius}
          stroke={color}
          strokeWidth={10}
          fill="none"
          strokeDasharray={`${dash} ${circumference}`}
          transform="rotate(-90 48 48)"
        />
      </Svg>
      <Text style={styles.donutValue}>{value}%</Text>
      <Text style={styles.donutLabel}>poziomu</Text>
    </View>
  );
};

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

const ScaleBar = ({
  scale,
  value
}: {
  scale: { levels: Level[]; activeKey: string };
  value: number | null | undefined;
}) => {
  const markerPercent = getMarkerPercent(scale.levels, scale.activeKey, value);
  const markerColor = levelColor(scale.activeKey);

  return (
    <View style={styles.scale}>
      <View style={styles.scaleTrack}>
        {scale.levels.map((level, index) => (
          <View
            key={level.key}
            style={{
              ...styles.scaleSegment,
              backgroundColor:
                level.key === scale.activeKey
                  ? levelBackground(level.key)
                  : "rgba(58,53,59,0.22)",
              marginRight: index === scale.levels.length - 1 ? 0 : 2
            }}
          />
        ))}
        <Svg
          style={{
            ...styles.scaleMarker,
            left: `${markerPercent}%`,
            marginLeft: -7
          }}
          viewBox="0 0 14 10"
        >
          <Polygon points="7,10 14,0 0,0" fill={markerColor} />
        </Svg>
        <View
          style={{
            ...styles.scaleMarkerDot,
            left: `${markerPercent}%`,
            backgroundColor: markerColor,
            marginLeft: -2.5
          }}
        />
      </View>
      <View style={styles.scaleLabels}>
        {scale.levels.map((level) => (
          <Text key={level.key} style={styles.scaleLabel}>
            {level.label}
          </Text>
        ))}
      </View>
    </View>
  );
};
const ReportDocument = ({
  fullName,
  reportDate,
  areas,
  reportCards,
  measurementPercent,
  measuredCount,
  totalAreas,
  documentTitle,
  athlete,
  highestProfile,
  fingerMarkerPercent,
  selectedClimbGrade,
  fingerAspectMarker
}: {
  fullName: string;
  reportDate: string;
  areas: Area[];
  reportCards: ReportCard[];
  measurementPercent: number;
  measuredCount: number;
  totalAreas: number;
  documentTitle: string;
  athlete: {
    gender: string;
    age: string | null;
    bodyweightKg: number | null;
    trainingYears: number | null;
    climbingYears: number | null;
    notes: string;
  };
  highestProfile: { levelKey: string | null; completion: number; count: number };
  fingerMarkerPercent: number | null;
  selectedClimbGrade: string;
  fingerAspectMarker: { percent: number; aspect: FingerAspect } | null;
}) => {
  const strengthCards = reportCards.filter((card) =>
    ["pull", "push", "hinge", "squat"].includes(card.id)
  );
  const fingerCards = reportCards.filter((card) => card.id === "fingers");
  const coreCards = reportCards.filter((card) => card.id === "core");
  const currentLevelKey = highestProfile.levelKey;
  const highestProfileLabel = currentLevelKey ? LEVEL_LABELS[currentLevelKey] : NO_DATA;
  const highestProfilePercent = Math.round(highestProfile.completion * 100);
  const sex = athlete.gender === "female" ? "female" : "male";
  const fingerAssessment = fingerCards[0]?.fingerAssessment ?? null;
  const fingerMarkerColor = fingerAssessment
    ? fingerCategoryColor(fingerAssessment.category)
    : THEME.ink;
  const fingerBands = FINGER_BANDS[sex];

  return (
    <Document title={documentTitle} author="KBTrener">
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Image src={logoKbt} style={styles.logo} />
            <View>
              <Text style={styles.title}>Raport testów siłowych</Text>
              <Text style={styles.sub}>
                {fullName || "Zawodnik"} - {reportDate || ""}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.hero}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{fullName || "Zawodnik"}</Text>
            <View style={styles.athleteGrid}>
              <View style={styles.athleteItem}>
                <Text style={styles.athleteLabel}>Data raportu</Text>
                <Text style={styles.athleteValue}>{reportDate || "-"}</Text>
              </View>
              <View style={styles.athleteItem}>
                <Text style={styles.athleteLabel}>Płeć</Text>
                <Text style={styles.athleteValue}>{athlete.gender || "-"}</Text>
              </View>
              <View style={styles.athleteItem}>
                <Text style={styles.athleteLabel}>Wiek</Text>
                <Text style={styles.athleteValue}>{athlete.age ?? "-"}</Text>
              </View>
              <View style={styles.athleteItem}>
                <Text style={styles.athleteLabel}>BW</Text>
                <Text style={styles.athleteValue}>{athlete.bodyweightKg ?? "-"} kg</Text>
              </View>
              <View style={styles.athleteItem}>
                <Text style={styles.athleteLabel}>Staż treningowy</Text>
                <Text style={styles.athleteValue}>{athlete.trainingYears ?? "-"} lat</Text>
              </View>
              <View style={styles.athleteItem}>
                <Text style={styles.athleteLabel}>Staż wspinaczkowy</Text>
                <Text style={styles.athleteValue}>{athlete.climbingYears ?? "-"} lat</Text>
              </View>
              <View style={[styles.athleteItem, styles.athleteNotes]}>
                <Text style={styles.athleteLabel}>Dolegliwosci / uwagi</Text>
                <Text style={styles.athleteValue}>{athlete.notes || "-"}</Text>
              </View>
            </View>
          </View>
          <View style={styles.card}>
            <Text style={styles.targetLabel}>Poziom obecny</Text>
            <Text style={styles.targetValue}>{highestProfileLabel}</Text>
            <View style={styles.donutWrap}>
              <Donut
                value={highestProfilePercent}
                color={levelColor(currentLevelKey ?? "no_data")}
              />
              <View style={styles.donutMeta}>
                <Text style={styles.statLabel}>Kompletność profilu siłowego</Text>
                <Text style={styles.statValue}>
                  {measurementPercent}% ({measuredCount}/{totalAreas})
                </Text>
                <Text style={styles.statLabel}>Kompletnosc poziomu</Text>
                <Text style={styles.statValue}>
                  {highestProfile.count}/{totalAreas}
                </Text>
                <Text style={styles.statLabel}>Najwyzszy kompletny profil</Text>
                <Text style={styles.statValue}>
                  {highestProfileLabel} ({highestProfilePercent}%)
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.tiles}>
          {areas.map((area) => (
            <View
              key={area.id}
              style={{
                ...styles.tile,
                borderColor: levelColor(area.levelKey || "no_data"),
                backgroundColor: levelBackground(area.levelKey || "no_data")
              }}
              wrap={false}
            >
              <View style={styles.tileHeader}>
                <Text style={styles.tileTitle}>{area.title}</Text>
                <Text
                  style={{
                    ...styles.pill,
                    borderColor: levelColor(area.levelKey || "no_data"),
                    color: levelColor(area.levelKey || "no_data"),
                    backgroundColor: "#ffffff"
                  }}
                >
                  {area.levelLabel}
                </Text>
              </View>
              <Text style={styles.tileValue}>{area.value}</Text>
              <Text style={styles.tileMeta}>{area.note}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.footer} fixed>
          Raport przygotowany przez Karol Bilecki KBTrener - info@kbtrener.pl
        </Text>
      </Page>

      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Image src={logoKbt} style={styles.logo} />
            <View>
              <Text style={styles.title}>Raport testów siłowych</Text>
              <Text style={styles.sub}>
                {fullName || "Zawodnik"} - {reportDate || ""}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionPageTitle}>Sekcja: siła</Text>
        <View style={styles.sectionIntro}>
          <Text style={styles.sectionIntroTitle}>{SECTION_DESCRIPTIONS.strength.title}</Text>
          <Text style={styles.sectionIntroLead}>{SECTION_DESCRIPTIONS.strength.lead}</Text>
          <Text style={styles.sectionIntroBody}>{SECTION_DESCRIPTIONS.strength.body}</Text>
        </View>

        {strengthCards.map((card) => (
          <View key={card.id} style={styles.reportCard} wrap={false}>
            <Text style={styles.reportTitle}>{card.detail.title}</Text>
            <Text style={styles.reportDesc}>{card.description}</Text>
            {card.nextLevelNote && (
              <>
                <Text style={styles.detailLabel}>Jak mieć poziom wyżej</Text>
                <Text style={styles.detailText}>{card.nextLevelNote}</Text>
              </>
            )}
            {card.fingerAssessment && (
              <>
                <Text style={styles.detailLabel}>Stan palców</Text>
                <Text style={styles.detailText}>{card.fingerAssessment.message}</Text>
              </>
            )}

            <Text style={styles.detailLabel}>Co mierzy</Text>
            <Text style={styles.detailText}>{card.detail.measure}</Text>

            <Text style={styles.detailLabel}>Dlaczego to ważne we wspinaczce</Text>
            <Text style={styles.detailText}>{card.detail.reason}</Text>

            {card.scale && <ScaleBar scale={card.scale} value={card.scaleValue ?? null} />}

            <View style={styles.resultRowPair} wrap={false}>
              <View
                style={{
                  ...styles.resultBox,
                  borderColor: levelColor(card.result.levelKey),
                  backgroundColor: levelBackground(card.result.levelKey)
                }}
              >
                <Text style={styles.resultTitle}>Wynik główny</Text>
                <Text style={styles.resultLevel}>
                  {card.id === "fingers"
                    ? `Poziom palców (wspinaczkowy): ${card.fingerAssessment?.grade ?? NO_DATA}`
                    : card.result.levelLabel}
                </Text>
                <View style={styles.resultRow}>
                  <Text style={styles.rowLabel}>Wynik</Text>
                  <Text style={styles.resultValuePrimary}>
                    {card.result.primaryValue} {card.result.primaryUnit}
                  </Text>
                </View>
                {card.result.secondaryLabel && card.result.secondaryValue && (
                  <View style={styles.resultRow}>
                    <Text style={styles.rowLabel}>{card.result.secondaryLabel}</Text>
                    <Text style={styles.rowValue}>
                      {card.result.secondaryValue} {card.result.secondaryUnit}
                    </Text>
                  </View>
                )}
                <Text style={styles.note}>
                  Poziom i %BW są kluczowe; szczegóły zależne od testu.
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Dane wejściowe</Text>
                {card.inputs.map((item) => (
                  <View key={item.label} style={styles.row}>
                    <Text style={styles.rowLabel}>{item.label}</Text>
                    <Text style={styles.rowValue}>{item.value}</Text>
                  </View>
                ))}
              </View>
            </View>

          </View>
        ))}

        <Text style={styles.footer} fixed>
          Raport przygotowany przez Karol Bilecki KBTrener - info@kbtrener.pl
        </Text>
      </Page>

      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Image src={logoKbt} style={styles.logo} />
            <View>
              <Text style={styles.title}>Raport testów siłowych</Text>
              <Text style={styles.sub}>
                {fullName || "Zawodnik"} - {reportDate || ""}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionPageTitle}>Sekcja: palce</Text>
        <View style={styles.sectionIntro}>
          <Text style={styles.sectionIntroTitle}>{SECTION_DESCRIPTIONS.fingers.title}</Text>
          <Text style={styles.sectionIntroLead}>{SECTION_DESCRIPTIONS.fingers.lead}</Text>
          <Text style={styles.sectionIntroBody}>{SECTION_DESCRIPTIONS.fingers.body}</Text>
        </View>

        {fingerCards.map((card) => (
          <View key={card.id} style={styles.reportCard}>
            <Text style={styles.reportTitle}>{card.detail.title}</Text>
            <Text style={styles.reportDesc}>{card.description}</Text>
            {card.nextLevelNote && (
              <>
                <Text style={styles.detailLabel}>Jak mieć poziom wyżej</Text>
                <Text style={styles.detailText}>{card.nextLevelNote}</Text>
              </>
            )}
            {card.fingerAssessment && (
              <>
                <Text style={styles.detailLabel}>Stan palców</Text>
                <Text style={styles.detailText}>{card.fingerAssessment.message}</Text>
              </>
            )}
            <Text style={styles.detailLabel}>Skala wspinaczkowa (palce)</Text>
            <FingerScale
              bands={fingerBands}
              markerPercent={fingerMarkerPercent}
              markerColor={fingerMarkerColor}
            />
            <Text style={styles.detailLabel}>Poziom względem wybranego poziomu</Text>
            <Text style={styles.detailText}>
              Wybrany poziom wspinania: {selectedClimbGrade || NO_DATA}
            </Text>
            <FingerAspectScale marker={fingerAspectMarker} />

            <Text style={styles.detailLabel}>Co mierzy</Text>
            <Text style={styles.detailText}>{card.detail.measure}</Text>

            <Text style={styles.detailLabel}>Dlaczego to ważne we wspinaczce</Text>
            <Text style={styles.detailText}>{card.detail.reason}</Text>

            {card.scale && <ScaleBar scale={card.scale} value={card.scaleValue ?? null} />}

            <View style={styles.resultRowPair}>
              <View
                style={{
                  ...styles.resultBox,
                  borderColor: levelColor(card.result.levelKey),
                  backgroundColor: levelBackground(card.result.levelKey)
                }}
              >
                <Text style={styles.resultTitle}>Wynik główny</Text>
                <Text style={styles.resultLevel}>
                  {card.id === "fingers"
                    ? `Poziom palców (wspinaczkowy): ${card.fingerAssessment?.grade ?? NO_DATA}`
                    : card.result.levelLabel}
                </Text>
                <View style={styles.resultRow}>
                  <Text style={styles.rowLabel}>Wynik</Text>
                  <Text style={styles.resultValuePrimary}>
                    {card.result.primaryValue} {card.result.primaryUnit}
                  </Text>
                </View>
                {card.result.secondaryLabel && card.result.secondaryValue && (
                  <View style={styles.resultRow}>
                    <Text style={styles.rowLabel}>{card.result.secondaryLabel}</Text>
                    <Text style={styles.rowValue}>
                      {card.result.secondaryValue} {card.result.secondaryUnit}
                    </Text>
                  </View>
                )}
                <Text style={styles.note}>
                  Poziom i %BW są kluczowe; szczegóły zależne od testu.
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Dane wejściowe</Text>
                {card.inputs.map((item) => (
                  <View key={item.label} style={styles.row}>
                    <Text style={styles.rowLabel}>{item.label}</Text>
                    <Text style={styles.rowValue}>{item.value}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        ))}

        <Text style={styles.footer} fixed>
          Raport przygotowany przez Karol Bilecki KBTrener - info@kbtrener.pl
        </Text>
      </Page>

      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Image src={logoKbt} style={styles.logo} />
            <View>
              <Text style={styles.title}>Raport testów siłowych</Text>
              <Text style={styles.sub}>
                {fullName || "Zawodnik"} - {reportDate || ""}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionPageTitle}>Sekcja: core</Text>
        <View style={styles.sectionIntro}>
          <Text style={styles.sectionIntroTitle}>{SECTION_DESCRIPTIONS.core.title}</Text>
          <Text style={styles.sectionIntroLead}>{SECTION_DESCRIPTIONS.core.lead}</Text>
          <Text style={styles.sectionIntroBody}>{SECTION_DESCRIPTIONS.core.body}</Text>
        </View>

        {coreCards.map((card) => (
          <View key={card.id} style={styles.reportCard} wrap={false}>
            <Text style={styles.reportTitle}>{card.detail.title}</Text>
            <Text style={styles.reportDesc}>{card.description}</Text>
            {card.nextLevelNote && (
              <>
                <Text style={styles.detailLabel}>Jak mieć poziom wyżej</Text>
                <Text style={styles.detailText}>{card.nextLevelNote}</Text>
              </>
            )}
            {card.fingerAssessment && (
              <>
                <Text style={styles.detailLabel}>Stan palców</Text>
                <Text style={styles.detailText}>{card.fingerAssessment.message}</Text>
              </>
            )}

            <Text style={styles.detailLabel}>Co mierzy</Text>
            <Text style={styles.detailText}>{card.detail.measure}</Text>

            <Text style={styles.detailLabel}>Dlaczego to ważne we wspinaczce</Text>
            <Text style={styles.detailText}>{card.detail.reason}</Text>

            {card.scale && <ScaleBar scale={card.scale} value={card.scaleValue ?? null} />}

            <View style={styles.resultRowPair} wrap={false}>
              <View
                style={{
                  ...styles.resultBox,
                  borderColor: levelColor(card.result.levelKey),
                  backgroundColor: levelBackground(card.result.levelKey)
                }}
              >
                <Text style={styles.resultTitle}>Wynik główny</Text>
                <Text style={styles.resultLevel}>
                  {card.id === "fingers"
                    ? `Poziom palców (wspinaczkowy): ${card.fingerAssessment?.grade ?? NO_DATA}`
                    : card.result.levelLabel}
                </Text>
                <View style={styles.resultRow}>
                  <Text style={styles.rowLabel}>Wynik</Text>
                  <Text style={styles.resultValuePrimary}>
                    {card.result.primaryValue} {card.result.primaryUnit}
                  </Text>
                </View>
                {card.result.secondaryLabel && card.result.secondaryValue && (
                  <View style={styles.resultRow}>
                    <Text style={styles.rowLabel}>{card.result.secondaryLabel}</Text>
                    <Text style={styles.rowValue}>
                      {card.result.secondaryValue} {card.result.secondaryUnit}
                    </Text>
                  </View>
                )}
                <Text style={styles.note}>
                  Poziom i %BW są kluczowe; szczegóły zależne od testu.
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Dane wejściowe</Text>
                {card.inputs.map((item) => (
                  <View key={item.label} style={styles.row}>
                    <Text style={styles.rowLabel}>{item.label}</Text>
                    <Text style={styles.rowValue}>{item.value}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        ))}

        <Text style={styles.footer} fixed>
          Raport przygotowany przez Karol Bilecki KBTrener - info@kbtrener.pl
        </Text>
      </Page>
    </Document>
  );
};

const FingerScale = ({
  bands,
  markerPercent,
  markerColor
}: {
  bands: FingerBand[];
  markerPercent: number | null;
  markerColor: string;
}) => (
  <View style={styles.fingerScale}>
    <View style={styles.fingerScaleTrack}>
      {bands.map((band, index) => (
        <View
          key={band.grade}
          style={{
            ...styles.fingerScaleSegment,
            backgroundColor: "rgba(58,53,59,0.2)",
            marginRight: index === bands.length - 1 ? 0 : 2
          }}
        />
      ))}
      {markerPercent !== null && (
        <>
          <Svg
            style={{
              ...styles.fingerMarker,
              left: `${markerPercent}%`,
              marginLeft: -7
            }}
            viewBox="0 0 14 10"
          >
            <Polygon points="7,10 14,0 0,0" fill={markerColor} />
          </Svg>
          <View
            style={{
              ...styles.fingerMarkerDot,
              left: `${markerPercent}%`,
              backgroundColor: markerColor,
              marginLeft: -2.5
            }}
          />
        </>
      )}
    </View>
    <View style={styles.fingerScaleLabels}>
      {bands.map((band) => (
        <Text key={band.grade} style={styles.fingerScaleLabel}>
          {band.grade}
        </Text>
      ))}
    </View>
  </View>
);

const FINGER_ASPECT_LABELS = ["Nisko", "Adekwatnie", "Wysoko", "Bardzo wysoko"];

const FingerAspectScale = ({
  marker
}: {
  marker: { percent: number; aspect: FingerAspect } | null;
}) => {
  const markerColor = marker ? fingerCategoryColor(marker.aspect) : THEME.ink;

  return (
    <View style={styles.fingerScale}>
      <View style={styles.fingerScaleTrack}>
        {FINGER_ASPECT_LABELS.map((label, index) => (
          <View
            key={label}
            style={{
              ...styles.fingerScaleSegment,
              backgroundColor: "rgba(58,53,59,0.2)",
              marginRight: index === FINGER_ASPECT_LABELS.length - 1 ? 0 : 2
            }}
          />
        ))}
        {marker && (
          <>
            <Svg
              style={{
                ...styles.fingerMarker,
                left: `${marker.percent}%`,
                marginLeft: -7
              }}
              viewBox="0 0 14 10"
            >
              <Polygon points="7,10 14,0 0,0" fill={markerColor} />
            </Svg>
            <View
              style={{
                ...styles.fingerMarkerDot,
                left: `${marker.percent}%`,
                backgroundColor: markerColor,
                marginLeft: -2.5
              }}
            />
          </>
        )}
      </View>
      <View style={styles.fingerScaleLabels}>
        {FINGER_ASPECT_LABELS.map((label) => (
          <Text key={label} style={styles.fingerScaleLabel}>
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
};
const ReportPage = () => {
  const { state } = useAppStore();
  const isMobile =
    typeof navigator !== "undefined" &&
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const sex = state.athlete.gender == "female" ? "female" : "male";
  const ageBand = state.athlete.age;
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
  const fingerMarkerPercent = useMemo(
    () =>
      state.fingers.notTested
        ? null
        : getFingerMarkerPercent(state.fingers.percentBw, sex),
    [state.fingers.notTested, state.fingers.percentBw, sex]
  );
  const selectedClimbGrade =
    state.dashboardClimbGrade?.trim() ||
    fingerAssessment?.grade ||
    FINGER_BANDS[sex][0]?.grade ||
    "6c";
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
    if (state.pull.testMode === "2rm") {
      return getPercentBwNextLevelNote({
        levels: getPull2rmLevels(sex, ageBand),
        currentKey: levelKey,
        currentValue: pullPercent,
        bodyweight: state.athlete.bodyweightKg
      });
    }
    return getPercentBwNextLevelNote({
      levels: getLevels(pullInsightId, sex, ageBand),
      currentKey: levelKey,
      currentValue: pullPercent,
      bodyweight: state.athlete.bodyweightKg
    });
  };

  const areas = useMemo<Area[]>(() => {
    const pullLevel =
      state.pull.notTested ? null :
      pullPercent !== null
        ? state.pull.testMode === "2rm"
          ? state.pull.reps !== null
            ? classifyPull({
                mode: state.pull.testMode,
                sex,
                percentBw: pullPercent,
                reps: state.pull.reps,
                addedWeightKg: state.pull.addedWeightKg,
                ageBand
              })
            : null
          : classify(pullInsightId, sex, pullPercent, ageBand)
        : null;
    const pushLevel = state.push.notTested
      ? null
      : pushSummaryValue !== null
        ? classify(pushSummaryTestId, sex, pushSummaryValue, ageBand)
        : null;
    const hingeLevel = state.hinge.notTested
      ? null
      : state.hinge.computed1rmPercentBw
        ? classify("deadlift", sex, state.hinge.computed1rmPercentBw, ageBand)
        : null;
    const squatLevel = state.squat.notTested
      ? null
      : state.squat.computed1rmPercentBw
        ? classify("squat", sex, state.squat.computed1rmPercentBw, ageBand)
        : null;
    const fingersLevel = fingerAssessment
      ? { levelKey: "good_sport", label: fingerAssessment.grade }
      : null;

    const coreResult = state.core.notTested
      ? null
      : hasValue(state.core.frontLeverLevel)
        ? classify("front_lever", sex, state.core.frontLeverLevel, ageBand)
        : null;

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
        value:
          state.push.notTested ? NO_DATA :
          pushSummaryMethod === "pushups"
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
        value: coreResult ? coreResult.label : NO_DATA,
        levelLabel: coreResult ? coreResult.label : NO_DATA,
        levelKey: coreResult ? coreResult.levelKey : null,
        note: state.core.notTested ? "Brak pomiaru" : "Front lever"
      },
      {
        id: "fingers",
        title: "FINGERS",
        value: state.fingers.notTested ? NO_DATA : fingerAssessment?.grade ? `Poziom: ${fingerAssessment.grade}` : NO_DATA,
        levelLabel: fingerAssessment?.grade ?? NO_DATA,
        levelKey: fingersLevel?.levelKey ?? null,
        note: "Max hang"
      }
    ];
  }, [
    benchPercent,
    pullPercent,
    pullInsightId,
    pullModeLabel,
    pushSummaryMethod,
    pushupsReps,
    state.pull.notTested,
    state.push.notTested,
    state.hinge.notTested,
    state.squat.notTested,
    state.core.notTested,
    state.fingers.notTested,
    sex,
    state.athlete.age,
    state.athlete.bodyweightKg,
    state.core.frontLeverLevel,
    state.core.kneesToElbowsReps,
    state.core.lSitSeconds,
    state.core.sorensenSeconds,
    state.fingers.percentBw,
    state.hinge.computed1rmPercentBw,
    state.pull.addedWeightKg,
    state.pull.reps,
    state.pull.testMode,
    state.squat.computed1rmPercentBw
  ]);

  const reportCards = useMemo<ReportCard[]>(() => {
    const data: ReportCard[] = [];

    const pullLevel =
      state.pull.notTested ? null :
      pullPercent !== null
        ? state.pull.testMode === "2rm"
          ? state.pull.reps !== null
            ? classifyPull({
                mode: state.pull.testMode,
                sex,
                percentBw: pullPercent,
                reps: state.pull.reps,
                addedWeightKg: state.pull.addedWeightKg,
                ageBand
              })
            : null
          : classify(pullInsightId, sex, pullPercent, ageBand)
        : null;
    const pullScale =
      state.pull.notTested
        ? []
        : state.pull.testMode === "2rm"
          ? getPull2rmLevels(sex, ageBand)
          : getLevels(pullInsightId, sex, ageBand);
    data.push({
      id: "pull",
      title: `PULL - Podciąganie nachwytem (${pullModeLabel})`,
      description: "Siła wzgledna górnej części ciała.",
      nextLevelNote: getPullNextLevelNote(pullLevel?.levelKey ?? null),
      detail: DETAILS.pull,
      scale: pullScale.length ? { levels: pullScale, activeKey: pullLevel?.levelKey ?? "no_data" } : null,
      scaleValue: state.pull.notTested ? null : pullPercent,
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
        { label: "Tryb testu", value: pullModeLabel },
        { label: "Powtórzenia", value: showInput(state.pull.reps) },
        { label: "Dodatkowy ciężar", value: showInput(state.pull.addedWeightKg) + " kg" }
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
    const benchScale = state.push.notTested ? [] : getLevels("bench_press", sex, ageBand);
    const pushupsScale = state.push.notTested ? [] : getLevels("pushups", sex, ageBand);
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
        primaryValue:
          state.push.notTested ? NO_DATA :
          pushSummaryMethod === "pushups"
            ? showInput(pushupsReps)
            : benchPercent
              ? benchPercent.toFixed(2)
              : NO_DATA,
        primaryUnit: pushSummaryMethod === "pushups" ? "powt." : "% BW",
        secondaryLabel:
          pushSummaryMethod === "pushups" ? undefined : "ORMw ławka",
        secondaryValue:
          state.push.notTested ? NO_DATA :
          pushSummaryMethod === "pushups"
            ? undefined
            : state.push.benchComputed1rmKg?.toString() ?? NO_DATA,
        secondaryUnit: pushSummaryMethod === "pushups" ? undefined : "kg"
      },
      inputs: [
        { label: "Technika wyciskania", value: formatTernary(state.push.benchTechniqueOk) },
        { label: "Pompki", value: showInput(state.push.pushupsReps) },
        { label: "Powtórzenia na ławce", value: showInput(state.push.benchReps) },
        { label: "Obciążenie na ławce", value: showInput(state.push.benchLoadKg) + " kg" }
      ],
      insight:
        pushLevel && isInsightLevel(pushLevel.levelKey)
          ? getInsight(pushSummaryTestId, sex, pushLevel.levelKey)
          : null
    });

    const deadliftLevel = state.hinge.notTested
      ? null
      : state.hinge.computed1rmPercentBw
        ? classify("deadlift", sex, state.hinge.computed1rmPercentBw, ageBand)
        : null;
    const deadliftScale = state.hinge.notTested ? [] : getLevels("deadlift", sex, ageBand);
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
      scale: deadliftScale.length ? { levels: deadliftScale, activeKey: deadliftLevel?.levelKey ?? "no_data" } : null,
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
        { label: "Technika martwego ciągu", value: formatTernary(state.hinge.canPerformMin) },
        { label: "Powtórzenia", value: showInput(state.hinge.reps) },
        { label: "Obciążenie", value: showInput(state.hinge.loadKg) + " kg" }
      ],
      insight:
        deadliftLevel && isInsightLevel(deadliftLevel.levelKey)
          ? getInsight("deadlift", sex, deadliftLevel.levelKey)
          : null
    });

    const squatLevel = state.squat.notTested
      ? null
      : state.squat.computed1rmPercentBw
        ? classify("squat", sex, state.squat.computed1rmPercentBw, ageBand)
        : null;
    const squatScale = state.squat.notTested ? [] : getLevels("squat", sex, ageBand);
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
      scale: squatScale.length ? { levels: squatScale, activeKey: squatLevel?.levelKey ?? "no_data" } : null,
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
        { label: "Technika przysiadu", value: formatTernary(state.squat.techniqueOk) },
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
    const coreScale = state.core.notTested ? [] : getLevels("front_lever", sex, ageBand);

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
        { label: "Knees-to-elbows", value: state.core.notTested ? NO_DATA : showInput(state.core.kneesToElbowsReps) },
        { label: "L-sit", value: state.core.notTested ? NO_DATA : showInput(state.core.lSitSeconds) + " s" },
        { label: "Sorensen", value: state.core.notTested ? NO_DATA : showInput(state.core.sorensenSeconds) + " s" },
        { label: "Front lever", value: state.core.notTested ? NO_DATA : showInput(state.core.frontLeverLevel) },
        { label: "Kontrola transferu", value: formatTernary(state.core.transferControl) }
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
        { label: "Dodatkowy ciężar", value: showInput(state.fingers.externalLoadKg) + " kg" },
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
    state.pull.notTested,
    state.push.notTested,
    state.hinge.notTested,
    state.squat.notTested,
    state.core.notTested,
    state.fingers.notTested,
    sex,
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
    state.athlete.age,
    state.hinge.canPerformMin,
    state.squat.computed1rmKg,
    state.squat.computed1rmPercentBw,
    state.squat.loadKg,
    state.squat.reps,
    state.squat.techniqueOk,
    state.core.transferControl,
    fingerAssessment
  ]);

  const strengthAreaIds = new Set(["pull", "push", "hinge", "squat"]);
  const strengthAreas = areas.filter((area) => strengthAreaIds.has(area.id));
  const measuredStrengthAreas = strengthAreas.filter((area) => area.levelKey);
  const measurementPercent = Math.round(
    (measuredStrengthAreas.length / strengthAreas.length) * 100
  );
  const highestProfile = useMemo(() => {
    if (!strengthAreas.length) {
      return { levelKey: null as string | null, completion: 0, count: 0 };
    }
    let bestKey = LEVEL_ORDER[0];
    let bestCompletion = 0;
    let bestCount = 0;
    LEVEL_ORDER.forEach((levelKey) => {
      const count = strengthAreas.filter(
        (area) =>
          levelRank(normalizeLevelKey(area.id, area.levelKey ?? "below_health")) >=
          levelRank(levelKey)
      ).length;
      const completion = count / strengthAreas.length;
      if (
        completion > bestCompletion ||
        (completion === bestCompletion &&
          levelRank(levelKey) > levelRank(bestKey))
      ) {
        bestCompletion = completion;
        bestKey = levelKey;
        bestCount = count;
      }
    });
    return { levelKey: bestKey, completion: bestCompletion, count: bestCount };
  }, [strengthAreas]);
  const documentTitle = useMemo(() => {
    const name = state.athlete.fullName?.trim() || "Zawodnik";
    const date = state.athlete.reportDate?.trim() || "";
    return date ? `${name} ${date}` : name;
  }, [state.athlete.fullName, state.athlete.reportDate]);
  const fileName = useMemo(
    () => `${sanitizeFileName(documentTitle)}.pdf`,
    [documentTitle]
  );
  const document = (
    <ReportDocument
      fullName={state.athlete.fullName}
      reportDate={state.athlete.reportDate}
      areas={areas}
      reportCards={reportCards}
      measurementPercent={measurementPercent}
      measuredCount={measuredStrengthAreas.length}
      totalAreas={strengthAreas.length}
      highestProfile={highestProfile}
      fingerMarkerPercent={fingerMarkerPercent}
      selectedClimbGrade={selectedClimbGrade}
      fingerAspectMarker={fingerAspectMarker}
      documentTitle={documentTitle}
      athlete={state.athlete}
    />
  );

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <BlobProvider document={document}>
        {({ url, loading, error }) => (
          <>
            <div className="border-b border-border bg-card/80 px-4 py-3">
              <a
                className={cn(
                  buttonVariants({ variant: "secondary" }),
                  (!url || loading || error) &&
                    "pointer-events-none opacity-60"
                )}
                href={url ?? undefined}
                {...(isMobile
                  ? { target: "_blank", rel: "noreferrer" }
                  : { download: fileName })}
              >
                {loading
                  ? "Generowanie PDF..."
                  : error
                    ? "Błąd generowania PDF"
                    : isMobile
                      ? "Otwórz PDF"
                      : "Pobierz PDF"}
              </a>
            </div>
            <div className="flex-1 min-h-0">
              {loading && (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  Generowanie podgladu PDF...
                </div>
              )}
              {error && (
                <div className="flex h-full items-center justify-center text-sm text-destructive">
                  Nie udalo sie wygenerowac PDF. Sprawdz konsole.
                </div>
              )}
              {!loading && !error && url && !isMobile && (
                <iframe
                  title="Podglad raportu PDF"
                  src={url}
                  className="h-full w-full border-0"
                />
              )}
              {!loading && !error && url && isMobile && (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground px-6 text-center">
                  Podglad PDF na telefonie otwiera sie w nowej karcie. Uzyj
                  przycisku powyzej.
                </div>
              )}
            </div>
          </>
        )}
      </BlobProvider>
    </div>
  );
};

export default ReportPage;
















