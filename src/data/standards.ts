export type UnitType = "percent_bw" | "reps" | "seconds" | "enum";
export type Sex = "male" | "female";

export interface Level {
  key: string;
  label: string;
  min: number | null;
  max: number | null;
  note?: string;
}

export interface TestStandardBase {
  id: string;
  label: string;
  unit: UnitType;
  sexSpecific: false;
  levels: Level[];
}

export interface TestStandardSexSpecific
  extends Omit<TestStandardBase, "sexSpecific" | "levels"> {
  sexSpecific: true;
  levelsBySex: Record<Sex, Level[]>;
}

export type TestStandard = TestStandardBase | TestStandardSexSpecific;

export interface Standards {
  tests: TestStandard[];
  globalLevels: Level[];
}

export const LEVEL_ORDER = [
  "no_data",
  "health",
  "base",
  "good_sport",
  "advanced",
  "ceiling"
];

const BASIC_LEVEL_LABELS: Record<string, string> = {
  no_data: "Brak danych",
  health: "Niski",
  base: "Wystarczający",
  good_sport: "Dobry",
  advanced: "Bardzo dobry",
  ceiling: "Sufit"
};

const NO_DATA_LEVEL: Level = {
  key: "no_data",
  label: BASIC_LEVEL_LABELS.no_data,
  min: null,
  max: null
};

export const STANDARDS: Standards = {
  globalLevels: [NO_DATA_LEVEL],
  tests: [
    {
      id: "pull_up_male",
      label: "Podciąganie nachwytem (weighted) — M",
      unit: "percent_bw",
      sexSpecific: false,
      levels: [
        { key: "health", label: "Niski", min: 0.00, max: 120.00 },
        { key: "base", label: "Wystarczający", min: 120.01, max: 140.00 },
        { key: "good_sport", label: "Dobry", min: 140.01, max: 160.00 },
        { key: "advanced", label: "Bardzo dobry", min: 160.01, max: 165.00 },
        { key: "ceiling", label: "Sufit", min: 165.01, max: null }
      ]
    },
    {
      id: "pull_up_female",
      label: "Podciąganie nachwytem (weighted) — K",
      unit: "percent_bw",
      sexSpecific: false,
      levels: [
        { key: "health", label: "Niski", min: 0.00, max: 102.00 },
        { key: "base", label: "Wystarczający", min: 102.01, max: 119.00 },
        { key: "good_sport", label: "Dobry", min: 119.01, max: 136.00 },
        { key: "advanced", label: "Bardzo dobry", min: 136.01, max: 140.25 },
        { key: "ceiling", label: "Sufit", min: 140.26, max: null }
      ]
    },
    {
      id: "bench_press",
      label: "Wyciskanie leżąc (1RM %BW)",
      unit: "percent_bw",
      sexSpecific: true,
      levelsBySex: {
        male: [
          { key: "health", label: "Niski", min: 0.00, max: 75.00 },
          { key: "base", label: "Wystarczający", min: 75.01, max: 100.00 },
          { key: "good_sport", label: "Dobry", min: 100.01, max: 110.00 },
          { key: "advanced", label: "Bardzo dobry", min: 110.01, max: 120.00 },
          { key: "ceiling", label: "Sufit", min: 120.01, max: null }
        ],
        female: [
          { key: "health", label: "Niski", min: 0.00, max: 50.00 },
          { key: "base", label: "Wystarczający", min: 50.01, max: 67.00 },
          { key: "good_sport", label: "Dobry", min: 67.01, max: 75.00 },
          { key: "advanced", label: "Bardzo dobry", min: 75.01, max: null }
        ]
      }
    },
    {
      id: "pushups",
      label: "Pompki (powtórzenia)",
      unit: "reps",
      sexSpecific: true,
      levelsBySex: {
        male: [
          { key: "health", label: "Niski", min: 0, max: 9 },
          { key: "base", label: "Wystarczający", min: 10, max: 19 },
          { key: "good_sport", label: "Dobry", min: 20, max: 34 },
          { key: "advanced", label: "Bardzo dobry", min: 35, max: 44 },
          { key: "ceiling", label: "Sufit", min: 45, max: null }
        ],
        female: [
          { key: "health", label: "Niski", min: 0, max: 4 },
          { key: "base", label: "Wystarczający", min: 5, max: 14 },
          { key: "good_sport", label: "Dobry", min: 15, max: 24 },
          { key: "advanced", label: "Bardzo dobry", min: 25, max: 34 },
          { key: "ceiling", label: "Sufit", min: 35, max: null }
        ]
      }
    },
    {
      id: "deadlift",
      label: "Martwy ciąg (1RM %BW)",
      unit: "percent_bw",
      sexSpecific: true,
      levelsBySex: {
        male: [
          { key: "health", label: "Niski", min: 0.00, max: 125.00 },
          { key: "base", label: "Wystarczający", min: 125.01, max: 150.00 },
          { key: "good_sport", label: "Dobry", min: 150.01, max: 175.00 },
          { key: "advanced", label: "Bardzo dobry", min: 175.01, max: 200.00 },
          { key: "ceiling", label: "Sufit", min: 200.01, max: null }
        ],
        female: [
          { key: "health", label: "Niski", min: 0.00, max: 115.00 },
          { key: "base", label: "Wystarczający", min: 115.01, max: 135.00 },
          { key: "good_sport", label: "Dobry", min: 135.01, max: 150.00 },
          { key: "advanced", label: "Bardzo dobry", min: 150.01, max: 170.00 },
          { key: "ceiling", label: "Sufit", min: 170.01, max: null }
        ]
      }
    },
    {
      id: "squat",
      label: "Przysiad (1RM %BW)",
      unit: "percent_bw",
      sexSpecific: true,
      levelsBySex: {
        male: [
          { key: "health", label: "Niski", min: 0.00, max: 75.00 },
          { key: "base", label: "Wystarczający", min: 75.01, max: 91.67 },
          { key: "good_sport", label: "Dobry", min: 91.68, max: 108.33 },
          { key: "advanced", label: "Bardzo dobry", min: 108.34, max: 125.00 },
          { key: "ceiling", label: "Sufit", min: 125.01, max: null }
        ],
        female: [
          { key: "health", label: "Niski", min: 0.00, max: 65.00 },
          { key: "base", label: "Wystarczający", min: 65.01, max: 80.01 },
          { key: "good_sport", label: "Dobry", min: 80.02, max: 95.02 },
          { key: "advanced", label: "Bardzo dobry", min: 95.03, max: 110.00 },
          { key: "ceiling", label: "Sufit", min: 110.01, max: null }
        ]
      }
    },
    {
      id: "pistol_squat",
      label: "Przysiad pistolet (powtórzenia na nogę)",
      unit: "reps",
      sexSpecific: false,
      levels: [
        { key: "health", label: "Niski", min: 0, max: 0 },
        { key: "base", label: "Wystarczający", min: 1, max: 2 },
        { key: "good_sport", label: "Dobry", min: 3, max: null }
      ]
    },
    {
      id: "knees_to_elbows",
      label: "Core — knees to elbows (powtórzenia)",
      unit: "reps",
      sexSpecific: false,
      levels: [
        { key: "health", label: "Niski", min: 0, max: 5 },
        { key: "base", label: "Wystarczający", min: 6, max: 11 },
        { key: "good_sport", label: "Dobry", min: 12, max: null }
      ]
    },
    {
      id: "l_sit",
      label: "Core — L-sit (sekundy)",
      unit: "seconds",
      sexSpecific: false,
      levels: [
        { key: "health", label: "Niski", min: 0, max: 19 },
        { key: "base", label: "Wystarczający", min: 20, max: 30 },
        { key: "good_sport", label: "Dobry", min: 31, max: null }
      ]
    },
    {
      id: "sorensen",
      label: "Core — Sorensen (sekundy)",
      unit: "seconds",
      sexSpecific: false,
      levels: [
        { key: "health", label: "Niski", min: 0, max: 89 },
        { key: "base", label: "Wystarczający", min: 90, max: 119 },
        { key: "good_sport", label: "Dobry", min: 120, max: null }
      ]
    },
    {
      id: "front_lever",
      label: "Core — front lever (poziom)",
      unit: "enum",
      sexSpecific: false,
      levels: [
        {
          key: "health",
          label: "Niski",
          min: null,
          max: null,
          note: "tuck"
        },
        {
          key: "base",
          label: "Wystarczający",
          min: null,
          max: null,
          note: "advanced_tuck"
        },
        {
          key: "good_sport",
          label: "Dobry",
          min: null,
          max: null,
          note: "one_leg"
        },
        {
          key: "advanced",
          label: "Bardzo dobry",
          min: null,
          max: null,
          note: "straddle"
        },
        {
          key: "ceiling",
          label: "Sufit",
          min: null,
          max: null,
          note: "full"
        }
      ]
    },
  ]
};

export const AGE_FACTORS = [
  { band: "20 lub mniej", factor: 1.0 },
  { band: "21-30", factor: 1.0 },
  { band: "30-39", factor: 1.0 },
  { band: "40-49", factor: 0.95 },
  { band: "50-59", factor: 0.89 },
  { band: "60-69", factor: 0.8 },
  { band: "70+", factor: 0.67 }
];

const AGE_FACTOR_BY_BAND = AGE_FACTORS.reduce<Record<string, number>>(
  (acc, entry) => {
    acc[entry.band] = entry.factor;
    return acc;
  },
  {}
);

const AGE_FACTOR_TEST_IDS = new Set([
  "pull_up_male",
  "pull_up_female",
  "bench_press",
  "pushups",
  "deadlift",
  "squat"
]);

const shouldApplyAgeFactor = (testId: string) => AGE_FACTOR_TEST_IDS.has(testId);

export const getAgeFactor = (ageBand?: string | null) =>
  AGE_FACTOR_BY_BAND[ageBand ?? ""] ?? 1;

const scaleValue = (value: number | null, factor: number) => {
  if (value === null) return null;
  return Number((value * factor).toFixed(2));
};

export const applyAgeFactorToLevels = (levels: Level[], factor: number): Level[] =>
  factor === 1
    ? levels
    : levels.map((level) => ({
        ...level,
        min: scaleValue(level.min, factor),
        max: scaleValue(level.max, factor)
      }));

export const getLevelsForTest = (
  testId: string,
  sex: Sex,
  ageBand?: string | null
): Level[] => {
  const test = STANDARDS.tests.find((item) => item.id === testId);
  if (!test) return [];
  const levels = test.sexSpecific ? test.levelsBySex[sex] : test.levels;
  if (!shouldApplyAgeFactor(testId)) return levels;
  const ageFactor = getAgeFactor(ageBand);
  return applyAgeFactorToLevels(levels, ageFactor);
};

const matchLevel = (value: number, levels: Level[]) => {
  for (const level of levels) {
    if (level.min === null && level.max === null) continue;
    const minOk = level.min === null || value >= level.min;
    const maxOk = level.max === null || value <= level.max;
    if (minOk && maxOk) return level;
  }
  return NO_DATA_LEVEL;
};

const mapEnumLevel = (value: string, levels: Level[]) => {
  const normalized = value.trim().toLowerCase();
  for (const level of levels) {
    if (!level.note) continue;
    const allowed = level.note.split(",").map((item) => item.trim());
    if (allowed.includes(normalized)) return level;
  }
  return NO_DATA_LEVEL;
};

export type PullTestMode = "scale" | "2rm";

export const getPull2rmLevels = (
  sex: Sex,
  ageBand?: string | null
): Level[] => {
  const levels =
    sex === "female"
      ? [
          { key: "health", label: BASIC_LEVEL_LABELS.health, min: 0.0, max: 100.0 },
          { key: "base", label: BASIC_LEVEL_LABELS.base, min: 100.01, max: 120.0 },
          { key: "good_sport", label: BASIC_LEVEL_LABELS.good_sport, min: 120.01, max: 130.0 },
          { key: "advanced", label: BASIC_LEVEL_LABELS.advanced, min: 130.01, max: 135.0 },
          { key: "ceiling", label: BASIC_LEVEL_LABELS.ceiling, min: 135.01, max: null }
        ]
      : [
          { key: "health", label: BASIC_LEVEL_LABELS.health, min: 0.0, max: 120.0 },
          { key: "base", label: BASIC_LEVEL_LABELS.base, min: 120.01, max: 140.0 },
          { key: "good_sport", label: BASIC_LEVEL_LABELS.good_sport, min: 140.01, max: 155.0 },
          { key: "advanced", label: BASIC_LEVEL_LABELS.advanced, min: 155.01, max: 165.0 },
          { key: "ceiling", label: BASIC_LEVEL_LABELS.ceiling, min: 165.01, max: null }
        ];

  const ageFactor = getAgeFactor(ageBand);
  return applyAgeFactorToLevels(levels, ageFactor);
};

export const classifyPull = (params: {
  mode: PullTestMode;
  sex: Sex;
  percentBw: number | null;
  reps: number | null;
  addedWeightKg: number | null;
  ageBand?: string | null;
}): { levelKey: string; label: string } => {
  const { mode, sex, percentBw, reps, addedWeightKg, ageBand } = params;

  if (percentBw === null || reps === null) {
    return { levelKey: NO_DATA_LEVEL.key, label: NO_DATA_LEVEL.label };
  }

  if (mode === "2rm") {
    if (reps !== 2) {
      return { levelKey: NO_DATA_LEVEL.key, label: NO_DATA_LEVEL.label };
    }
    const levels = getPull2rmLevels(sex, ageBand);
    const level = matchLevel(percentBw, levels);
    return { levelKey: level.key, label: level.label };
  }

  const addedWeight = addedWeightKg ?? 0;
  const ageFactor = shouldApplyAgeFactor("pull_up_male") ? getAgeFactor(ageBand) : 1;
  const scaled = (value: number) => value * ageFactor;

  if (reps === 2 && percentBw >= scaled(165)) {
    return { levelKey: "ceiling", label: BASIC_LEVEL_LABELS.ceiling };
  }

  if (reps >= 2 && reps <= 3 && percentBw >= scaled(160) && percentBw <= scaled(180)) {
    return { levelKey: "advanced", label: BASIC_LEVEL_LABELS.advanced };
  }

  if (reps === 3 && percentBw >= scaled(140) && percentBw <= scaled(160)) {
    return { levelKey: "good_sport", label: BASIC_LEVEL_LABELS.good_sport };
  }

  if (reps >= 3 && reps <= 5 && percentBw >= scaled(110) && percentBw <= scaled(125)) {
    return { levelKey: "base", label: BASIC_LEVEL_LABELS.base };
  }

  if (addedWeight === 0 && reps >= 5 && reps <= 8) {
    return { levelKey: "health", label: BASIC_LEVEL_LABELS.health };
  }

  if (addedWeight === 0 && reps >= 1) {
    return { levelKey: "health", label: BASIC_LEVEL_LABELS.health };
  }

  return { levelKey: NO_DATA_LEVEL.key, label: NO_DATA_LEVEL.label };
};

export function classify(
  testId: string,
  sex: Sex,
  value: number | string,
  ageBand?: string | null
): { levelKey: string; label: string } {
  if (value === null || value === undefined || value === "") {
    return { levelKey: NO_DATA_LEVEL.key, label: NO_DATA_LEVEL.label };
  }

  const test = STANDARDS.tests.find((item) => item.id === testId);
  if (!test) {
    return { levelKey: NO_DATA_LEVEL.key, label: NO_DATA_LEVEL.label };
  }

  const levels = test.sexSpecific ? test.levelsBySex[sex] : test.levels;
  const ageFactor = shouldApplyAgeFactor(testId) ? getAgeFactor(ageBand) : 1;
  const adjustedLevels = applyAgeFactorToLevels(levels, ageFactor);

  if (test.unit === "enum") {
    const level = mapEnumLevel(String(value), levels);
    return { levelKey: level.key, label: level.label };
  }

  const numeric = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(numeric)) {
    return { levelKey: NO_DATA_LEVEL.key, label: NO_DATA_LEVEL.label };
  }

  const level = matchLevel(numeric, adjustedLevels);
  return { levelKey: level.key, label: level.label };
}

// Usage:
// import { STANDARDS, classify } from "./data/standards";
// const result = classify("pull_up_male", "male", 155.25);
