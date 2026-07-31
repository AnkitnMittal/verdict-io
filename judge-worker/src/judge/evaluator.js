import { VERDICTS } from './verdict.js';

/* Evaluate the output of a submission against the expected output */
export const evaluateOutput = (expectedOutput, actualOutput) => {
  if (actualOutput == null) return VERDICTS.WA;

  /* Normalize line endings, trim whitespace, strip trailing blank lines, and trailing whitespace */
  const normalize = (str) =>
    str
      .replace(/\r\n/g, '\n')
      .split('\n')
      .map((line) => line.trim().replace(/\s+/g, ' '))
      .join('\n')
      .replace(/\n+$/, '')
      .trim();

  const actualNormalized = normalize(actualOutput);
  const expectedNormalized = normalize(expectedOutput);

  return actualNormalized === expectedNormalized ? VERDICTS.AC : VERDICTS.WA;
};
