import { Sex } from "./standards";

export type LevelKey = "health" | "base" | "good_sport" | "advanced" | "ceiling";

export type InsightTextMap = Partial<Record<LevelKey, string>>;

export interface InsightEntry {
  male?: InsightTextMap;
  female?: InsightTextMap;
  neutral?: InsightTextMap;
}

export interface Insights {
  [testId: string]: InsightEntry;
}

export const INSIGHTS: Insights = {
  pull_up_male: {
    male: {
      health: "Niski – Pull może ograniczać.",
      base: "Wystarczający – OK dla większości.",
      good_sport: "Dobry – Pull przestaje być limiterem.",
      advanced: "Bardzo dobry – Górny sensowny zakres.",
      ceiling: "Sufit – Dalszy wzrost bez transferu."
    }
  },
  pull_up_female: {
    female: {
      health: "Niski – Pull może ograniczać.",
      base: "Wystarczający – OK dla większości.",
      good_sport: "Dobry – Pull przestaje być limiterem.",
      advanced: "Bardzo dobry – Górny sensowny zakres.",
      ceiling: "Sufit – Dalszy wzrost bez transferu."
    }
  },
  bench_press: {
    male: {
      health: "Niski – Pull może ograniczać.",
      base: "Wystarczający – OK dla większości.",
      good_sport: "Dobry – Pull przestaje być limiterem.",
      advanced: "Bardzo dobry – Górny sensowny zakres.",
      ceiling: "Sufit – Dalszy wzrost bez transferu."
    },
    female: {
      health: "Niski – Pull może ograniczać.",
      base: "Wystarczający – OK dla większości.",
      good_sport: "Dobry – Pull przestaje być limiterem.",
      advanced: "Bardzo dobry – Górny sensowny zakres."
    }
  },
  pushups: {
    male: {
      health: "Niski – Pull może ograniczać.",
      base: "Wystarczający – OK dla większości.",
      good_sport: "Dobry – Pull przestaje być limiterem.",
      advanced: "Bardzo dobry – Górny sensowny zakres.",
      ceiling: "Sufit – Dalszy wzrost bez transferu."
    },
    female: {
      health: "Niski – Pull może ograniczać.",
      base: "Wystarczający – OK dla większości.",
      good_sport: "Dobry – Pull przestaje być limiterem.",
      advanced: "Bardzo dobry – Górny sensowny zakres.",
      ceiling: "Sufit – Dalszy wzrost bez transferu."
    }
  },
  deadlift: {
    male: {
      health: "Niski – Pull może ograniczać.",
      base: "Wystarczający – OK dla większości.",
      good_sport: "Dobry – Pull przestaje być limiterem.",
      advanced: "Bardzo dobry – Górny sensowny zakres.",
      ceiling: "Sufit – Dalszy wzrost bez transferu."
    },
    female: {
      health: "Niski – Pull może ograniczać.",
      base: "Wystarczający – OK dla większości.",
      good_sport: "Dobry – Pull przestaje być limiterem.",
      advanced: "Bardzo dobry – Górny sensowny zakres.",
      ceiling: "Sufit – Dalszy wzrost bez transferu."
    }
  },
  squat: {
    male: {
      health: "Niski – Pull może ograniczać.",
      base: "Wystarczający – OK dla większości.",
      good_sport: "Dobry – Pull przestaje być limiterem.",
      ceiling: "Sufit – Dalszy wzrost bez transferu."
    },
    female: {
      health: "Niski – Pull może ograniczać.",
      base: "Wystarczający – OK dla większości.",
      good_sport: "Dobry – Pull przestaje być limiterem.",
      ceiling: "Sufit – Dalszy wzrost bez transferu."
    }
  },
  pistol_squat: {
    neutral: {
      health: "Niski – pracuj nad równowagą i kontrolą.",
      base: "Wystarczający – wzmacniaj stabilizację jednostronną.",
      good_sport: "Dobry – dobra kontrola jednonóż."
    }
  },
  knees_to_elbows: {
    neutral: {
      health: "Niski – skup się na kontroli tułowia.",
      base: "Wystarczający – solidna siła brzucha.",
      good_sport: "Dobry – mocny core i dobra kontrola."
    }
  },
  l_sit: {
    neutral: {
      health: "Niski – popraw stabilizację i napięcie tułowia.",
      base: "Wystarczający – dobra kontrola izometryczna.",
      good_sport: "Dobry – mocny core."
    }
  },
  sorensen: {
    neutral: {
      health: "Niski – wzmacniaj prostowniki grzbietu.",
      base: "Wystarczający – dobra wytrzymałość tylnego łańcucha.",
      good_sport: "Dobry – bardzo dobra wytrzymałość."
    }
  },
  front_lever: {
    neutral: {
      health: "Niski – tuck.",
      base: "Wystarczający – advanced tuck.",
      good_sport: "Dobry – one leg.",
      advanced: "Bardzo dobry – straddle.",
      ceiling: "Sufit – full."
    }
  },
  fingers_max_hang: {
    male: {
      health: "Niski – pracuj nad regularnym bodźcem na palce.",
      base: "Wystarczający – dobra baza siły palców.",
      good_sport: "Dobry – palce na solidnym poziomie.",
      advanced: "Bardzo dobry – bardzo mocne palce.",
      ceiling: "Sufit – dalszy progres ma mniejszy wpływ na wynik."
    },
    female: {
      health: "Niski – pracuj nad regularnym bodźcem na palce.",
      base: "Wystarczający – dobra baza siły palców.",
      good_sport: "Dobry – palce na solidnym poziomie.",
      advanced: "Bardzo dobry – bardzo mocne palce.",
      ceiling: "Sufit – dalszy progres ma mniejszy wpływ na wynik."
    }
  }
};

export const getInsight = (
  testId: string,
  sex: Sex,
  levelKey: LevelKey
): string | null => {
  const entry = INSIGHTS[testId];
  if (!entry) return null;
  const map = entry[sex] ?? entry.neutral;
  if (!map) return null;
  return map[levelKey] ?? null;
};
