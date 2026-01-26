export type Gender = "male" | "female" | "other" | "";

export type FrontLeverLevel =
  | "none"
  | "tuck"
  | "advanced_tuck"
  | "one_leg"
  | "straddle"
  | "full";

export type StepId =
  | "athlete"
  | "tests"
  | "pull"
  | "push"
  | "hinge"
  | "squat"
  | "core"
  | "fingers"
  | "summary";

export type PullTestMode = "scale" | "2rm";
export type TernaryAnswer = boolean | "unknown" | null;

export interface AthleteData {
  fullName: string;
  reportDate: string;
  gender: Gender;
  age: string | null;
  bodyweightKg: number | null;
  trainingYears: number | null;
  climbingYears: number | null;
  levelOS: string;
  levelRP: string;
  maxGrade: string;
  notes: string;
}

export interface PullTest {
  testMode: PullTestMode;
  notTested: boolean;
  reps: number | null;
  addedWeightKg: number | null;
  totalLoadKg: number | null;
  percentBw: number | null;
}

export interface PushTest {
  notTested: boolean;
  hasBench: boolean | null;
  summaryMethod: "bench" | "pushups";
  benchTechniqueOk: TernaryAnswer;
  benchReps: number | null;
  benchLoadKg: number | null;
  benchComputed1rmKg: number | null;
  benchComputedPercentBw: number | null;
  pushupsReps: number | null;
  pushupsComputed1rmKg: number | null;
  pushupsComputedPercentBw: number | null;
}

export interface HingeTest {
  notTested: boolean;
  canPerformMin: TernaryAnswer;
  reps: number | null;
  loadKg: number | null;
  computed1rmKg: number | null;
  computed1rmPercentBw: number | null;
}

export interface SquatTest {
  notTested: boolean;
  pistolCanPerform: boolean | null;
  pistolRepsEachLeg: number | null;
  techniqueOk: TernaryAnswer;
  reps: number | null;
  loadKg: number | null;
  computed1rmKg: number | null;
  computed1rmPercentBw: number | null;
}

export interface CoreTest {
  notTested: boolean;
  kneesToElbowsReps: number | null;
  lSitSeconds: number | null;
  sorensenSeconds: number | null;
  frontLeverLevel: FrontLeverLevel;
  transferControl: TernaryAnswer;
}

export type GripType = "half_crimp" | "open_hand" | "";

export interface FingersTest {
  notTested: boolean;
  gripType: GripType;
  externalLoadKg: number | null;
  isAssisted: boolean;
  holdTimeSeconds: number | null;
  techniqueOk: TernaryAnswer;
  totalLoadKg: number | null;
  percentBw: number | null;
}

export interface AppState {
  athlete: AthleteData;
  pull: PullTest;
  push: PushTest;
  hinge: HingeTest;
  squat: SquatTest;
  core: CoreTest;
  fingers: FingersTest;
  dashboardTargetLevel: "health" | "base" | "good_sport" | "advanced" | "ceiling";
  dashboardClimbGrade: string;
}
