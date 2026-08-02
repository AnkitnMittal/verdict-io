import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook to manage code and language state for a coding problem.
 * It also handles saving and retrieving code drafts from localStorage.
 */
export const useCodeRunner = (problemId, initialLanguage = 'cpp', skeletonCode = '') => {
  const [language, setLanguage] = useState(initialLanguage);
  const storageKey = `verdictio_draft_${problemId}_${language}`;

  const [code, setCode] = useState(() => {
    return localStorage.getItem(storageKey) || skeletonCode;
  });

  const hasAppliedInitialCode = useRef(Boolean(skeletonCode));

  useEffect(() => {
    if (hasAppliedInitialCode.current || !skeletonCode) return;
    hasAppliedInitialCode.current = true;

    const draft = localStorage.getItem(storageKey);
    if (!draft) {
      setCode(skeletonCode);
    }
  }, [skeletonCode, storageKey]);

  /* Save code to localStorage when code or language changes */
  useEffect(() => {
    if (code) {
      localStorage.setItem(storageKey, code);
    }
  }, [code, storageKey]);

  /* Handle language change and update code accordingly */
  const handleLanguageChange = (newLanguage, newSkeleton = '') => {
    setLanguage(newLanguage);
    const newStorageKey = `verdictio_draft_${problemId}_${newLanguage}`;
    const savedDraft = localStorage.getItem(newStorageKey);
    setCode(savedDraft || newSkeleton);
  };

  return { language, code, setCode, handleLanguageChange };
};
