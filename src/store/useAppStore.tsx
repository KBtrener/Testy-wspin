import React, { createContext, useContext, useEffect, useReducer } from "react";
import { AppState } from "../models/types";

const STORAGE_KEY = "athlete-wizard-state";

const getToday = () => new Date().toISOString().split("T")[0];

const getDefaultState = (): AppState => ({
  athlete: {
    fullName: "",
    reportDate: getToday(),
    gender: "",
    age: null,
    bodyweightKg: null,
    trainingYears: null,
    climbingYears: null,
    levelOS: "",
    levelRP: "",
    maxGrade: "",
    notes: ""
  },
  pull: {
    testMode: "scale",
    notTested: false,
    reps: null,
    addedWeightKg: null,
    totalLoadKg: null,
    percentBw: null
  },
  push: {
    notTested: false,
    hasBench: null,
    summaryMethod: "bench",
    benchTechniqueOk: null,
    benchReps: null,
    benchLoadKg: null,
    benchComputed1rmKg: null,
    benchComputedPercentBw: null,
    pushupsReps: null,
    pushupsComputed1rmKg: null,
    pushupsComputedPercentBw: null
  },
  hinge: {
    notTested: false,
    canPerformMin: null,
    reps: null,
    loadKg: null,
    computed1rmKg: null,
    computed1rmPercentBw: null
  },
  squat: {
    notTested: false,
    pistolCanPerform: null,
    pistolRepsEachLeg: null,
    techniqueOk: null,
    reps: null,
    loadKg: null,
    computed1rmKg: null,
    computed1rmPercentBw: null
  },
  core: {
    notTested: false,
    kneesToElbowsReps: null,
    lSitSeconds: null,
    sorensenSeconds: null,
    frontLeverLevel: "none",
    transferControl: null
  },
  fingers: {
    notTested: false,
    gripType: "",
    externalLoadKg: null,
    isAssisted: false,
    holdTimeSeconds: null,
    techniqueOk: null,
    totalLoadKg: null,
    percentBw: null
  },
  dashboardTargetLevel: "good_sport",
  dashboardClimbGrade: ""
});

type Action =
  | { type: "setField"; path: string[]; value: unknown }
  | { type: "reset"; state: AppState };

const setByPath = (obj: AppState, path: string[], value: unknown): AppState => {
  if (path.length === 0) return obj;
  const [head, ...tail] = path;
  const record = obj as unknown as Record<string, unknown>;
  return {
    ...obj,
    [head]: tail.length
      ? setByPath(record[head] as AppState, tail, value)
      : value
  } as AppState;
};

const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case "setField":
      return setByPath(state, action.path, action.value);
    case "reset":
      return action.state;
    default:
      return state;
  }
};

const mergeState = (base: AppState, incoming: Partial<AppState>) => ({
  ...base,
  ...incoming,
  athlete: { ...base.athlete, ...incoming.athlete },
  pull: { ...base.pull, ...incoming.pull },
  push: { ...base.push, ...incoming.push },
  hinge: { ...base.hinge, ...incoming.hinge },
  squat: { ...base.squat, ...incoming.squat },
  core: { ...base.core, ...incoming.core },
  fingers: { ...base.fingers, ...incoming.fingers },
  dashboardTargetLevel: incoming.dashboardTargetLevel ?? base.dashboardTargetLevel,
  dashboardClimbGrade: incoming.dashboardClimbGrade ?? base.dashboardClimbGrade
});

const initState = (): AppState => {
  const defaults = getDefaultState();
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as Partial<AppState>;
      const merged = mergeState(defaults, parsed);
      if (!merged.athlete.reportDate) {
        merged.athlete.reportDate = getToday();
      }
      return merged;
    }
  } catch {
    return defaults;
  }
  return defaults;
};

interface AppStoreValue {
  state: AppState;
  setField: (path: string[], value: unknown) => void;
  reset: () => void;
}

const AppStoreContext = createContext<AppStoreValue | undefined>(undefined);

export const AppStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, undefined, initState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value: AppStoreValue = {
    state,
    setField: (path, value) => dispatch({ type: "setField", path, value }),
    reset: () => dispatch({ type: "reset", state: getDefaultState() })
  };

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
};

export const useAppStore = () => {
  const ctx = useContext(AppStoreContext);
  if (!ctx) {
    throw new Error("useAppStore must be used within AppStoreProvider");
  }
  return ctx;
};
