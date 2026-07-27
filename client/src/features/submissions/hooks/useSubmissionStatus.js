import { useState, useRef, useEffect } from 'react';
import { submissionsApi } from '../api/submissionsApi';

const POLL_INTERVAL_MS = 1500;
const MAX_POLL_ATTEMPTS = 20;

/**
 * Custom hook to manage the submission status of code submissions.
 * It handles the submission process, polling for the verdict, and managing the state of the submission.
 *
 * @returns {Object} An object containing:
 *   - isSubmitting: A boolean indicating if a submission is in progress.
 *   - verdictData: The current verdict data of the submission.
 *   - submitCode: A function to initiate a code submission.
 */
export const useSubmissionStatus = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verdictData, setVerdictData] = useState(null);
  const pollTimerRef = useRef(null);

  /* Cleanup timer on unmount to prevent memory leaks */
  useEffect(() => {
    return () => clearInterval(pollTimerRef.current);
  }, []);

  const submitCode = async ({ problemId, language, code }) => {
    setIsSubmitting(true);
    setVerdictData({ verdict: 'Pending...' });

    try {
      const res = await submissionsApi.submitCode({ problemId, language, code });
      const { submissionId } = res.data;

      let attempts = 0;

      pollTimerRef.current = setInterval(async () => {
        attempts += 1;

        if (attempts > MAX_POLL_ATTEMPTS) {
          clearInterval(pollTimerRef.current);
          setVerdictData({ verdict: 'Timed Out' });
          setIsSubmitting(false);
          return;
        }

        try {
          const pollRes = await submissionsApi.getSubmission(submissionId);
          const currentVerdict = pollRes.data.verdict;

          if (currentVerdict !== 'Pending') {
            clearInterval(pollTimerRef.current);
            setVerdictData(pollRes.data);
            setIsSubmitting(false);
          }
        } catch {
          clearInterval(pollTimerRef.current);
          setVerdictData({ verdict: 'Error Fetching Status' });
          setIsSubmitting(false);
        }
      }, POLL_INTERVAL_MS);
    } catch {
      setVerdictData({ verdict: 'Error Processing Request' });
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, verdictData, submitCode };
};
