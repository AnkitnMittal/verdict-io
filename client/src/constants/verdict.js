/* Verdict constants */
export const VERDICTS = {
  PENDING: 'Pending',
  AC: 'AC',
  WA: 'WA',
  TLE: 'TLE',
  MLE: 'MLE',
  RE: 'RE',
  CE: 'CE',
};

/* Get the color class for a given verdict */
export function getVerdictColor(verdict) {
  if (verdict === 'AC') return 'text-emerald-500 font-bold';
  if (verdict === 'Pending...') return 'text-amber-500 animate-pulse';
  return 'text-red-500 font-bold';
}
