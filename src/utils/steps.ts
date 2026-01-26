import { AppState, StepId } from "../models/types";

const hasValue = (value: unknown) => {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  return true;
};

const anyFilled = (values: unknown[]) => values.some(hasValue);

export const isAthleteComplete = (state: AppState) =>
  hasValue(state.athlete.fullName) && hasValue(state.athlete.reportDate);

export const isPullComplete = (state: AppState) =>
  anyFilled([
    state.pull.reps,
    state.pull.addedWeightKg,
    state.pull.totalLoadKg,
    state.pull.percentBw
  ]);

export const isPushComplete = (state: AppState) =>
  anyFilled([
    state.push.benchTechniqueOk,
    state.push.benchReps,
    state.push.benchLoadKg,
    state.push.benchComputed1rmKg,
    state.push.pushupsReps,
  ]);

export const isHingeComplete = (state: AppState) =>
  anyFilled([
    state.hinge.canPerformMin,
    state.hinge.reps,
    state.hinge.loadKg,
    state.hinge.computed1rmKg
  ]);

export const isSquatComplete = (state: AppState) =>
  anyFilled([
    state.squat.pistolCanPerform,
    state.squat.pistolRepsEachLeg,
    state.squat.techniqueOk,
    state.squat.reps,
    state.squat.loadKg,
    state.squat.computed1rmKg
  ]);

export const isCoreComplete = (state: AppState) =>
  anyFilled([
    state.core.kneesToElbowsReps,
    state.core.lSitSeconds,
    state.core.sorensenSeconds,
    state.core.frontLeverLevel,
    state.core.transferControl
  ]);

export const isFingersComplete = (state: AppState) =>
  anyFilled([
    state.fingers.gripType,
    state.fingers.externalLoadKg,
    state.fingers.holdTimeSeconds
  ]);

export const isSummaryComplete = () => true;

export const getStepCompletion = (state: AppState, step: StepId) => {
  switch (step) {
    case "athlete":
      return isAthleteComplete(state);
    case "pull":
      return isPullComplete(state);
    case "push":
      return isPushComplete(state);
    case "hinge":
      return isHingeComplete(state);
    case "squat":
      return isSquatComplete(state);
    case "core":
      return isCoreComplete(state);
    case "fingers":
      return isFingersComplete(state);
    case "summary":
      return isSummaryComplete();
    default:
      return false;
  }
};

export const getFirstIncompleteStep = (
  state: AppState,
  steps: StepId[]
) => {
  for (const step of steps) {
    if (!getStepCompletion(state, step)) {
      return step;
    }
  }
  return steps[steps.length - 1];
};
