export const roundToHalf = (value: number) => Math.round(value * 2) / 2;

export const epley1rm = (weightTotal: number, reps: number) =>
  roundToHalf(weightTotal * (1 + reps / 30));

export const roundToOne = (value: number) => Math.round(value * 10) / 10;

export const percentOfBw = (total: number, bw: number) =>
  bw > 0 ? roundToOne((total / bw) * 100) : null;

export const estimateBenchFromPushups = (bw: number, reps: number) => {
  const pushupLoad = bw * 0.65;
  return epley1rm(pushupLoad, reps);
};