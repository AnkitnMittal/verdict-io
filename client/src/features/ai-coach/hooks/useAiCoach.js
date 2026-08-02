import { useState, useRef, useCallback } from 'react';
import { aiApi } from '../api/aiApi';

export const useAiCoach = () => {
  const [activeTab, setActiveTab] = useState('hint');
  const [hintText, setHintText] = useState('');
  const [debugReport, setDebugReport] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hintLevel, setHintLevel] = useState(1);

  const abortControllerRef = useRef(null);

  const requestHint = useCallback(
    async ({ problemTitle, problemStatement, userCode, language }) => {
      setLoading(true);
      setError(null);
      setHintText('');

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      try {
        await aiApi.fetchHintStream(
          { problemTitle, problemStatement, userCode, language, hintLevel },
          (chunk) => {
            setHintText((prev) => prev + chunk);
          },
          abortControllerRef.current.signal,
        );
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError('Failed to fetch AI hint. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    },
    [hintLevel],
  );

  const requestDebugReport = useCallback(async ({ problemTitle, problemStatement, userCode, language, submissionDetails }) => {
    setLoading(true);
    setError(null);
    setDebugReport('');

    try {
      const data = await aiApi.fetchDebugReport({
        problemTitle,
        problemStatement,
        userCode,
        language,
        verdict: submissionDetails?.verdict || 'Unknown',
        stderr: submissionDetails?.aiReport || 'No diagnostic output provided by the judge.',
      });

      setDebugReport(data?.data?.report || 'No diagnostic output returned.');
    } catch (error) {
      setError(error?.response?.data?.message || 'Failed to analyze submission error.');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    activeTab,
    setActiveTab,
    hintText,
    debugReport,
    loading,
    error,
    hintLevel,
    setHintLevel,
    requestHint,
    requestDebugReport,
  };
};
