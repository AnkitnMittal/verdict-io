import { useState } from 'react';
import { Plus, Trash2, Save, AlertCircle, CheckCircle2, FileText, Upload, Code2 } from 'lucide-react';
import { adminApi } from '../api/adminApi';

import { AVAILABLE_LANGUAGES } from '../../../constants/languages';

export const ProblemForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [activeLangTab, setActiveLangTab] = useState(AVAILABLE_LANGUAGES[0].id || 'cpp');

  const [showBulkTestCases, setShowBulkTestCases] = useState(false);
  const [bulkInput, setBulkInput] = useState('');
  const [bulkError, setBulkError] = useState('');

  const [formData, setFormData] = useState({
    problemId: '',
    title: '',
    statement: '',
    difficulty: 'Easy',
    topics: '',
    timeLimit: 2,
    memoryLimit: 256,
    skeletonCode: AVAILABLE_LANGUAGES.map((lang) => ({ language: lang.id, code: '' })),
    testCases: [{ input: '', expectedOutput: '', isHidden: true }],
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleTestCaseChange = (index, field, value) => {
    const newTestCases = [...formData.testCases];
    newTestCases[index][field] = value;
    setFormData((prev) => ({ ...prev, testCases: newTestCases }));
  };

  const addTestCase = () => {
    setFormData((prev) => ({
      ...prev,
      testCases: [...prev.testCases, { input: '', expectedOutput: '', isHidden: true }],
    }));
  };

  const removeTestCase = (index) => {
    if (formData.testCases.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      testCases: prev.testCases.filter((_, i) => i !== index),
    }));
  };

  const handleBulkTestCaseImport = () => {
    try {
      setBulkError('');
      const parsed = JSON.parse(bulkInput);
      if (!Array.isArray(parsed)) {
        throw new Error('JSON must be an array of objects.');
      }

      const formatted = parsed.map((tc) => ({
        input: typeof tc.input === 'object' ? JSON.stringify(tc.input) : String(tc.input ?? ''),
        expectedOutput: typeof tc.expectedOutput === 'object' ? JSON.stringify(tc.expectedOutput) : String(tc.expectedOutput ?? ''),
        isHidden: tc.isHidden ?? true,
      }));

      setFormData((prev) => ({
        ...prev,
        testCases: [...prev.testCases, ...formatted],
      }));
      setBulkInput('');
      setShowBulkTestCases(false);
    } catch (err) {
      setBulkError(err.message || 'Invalid JSON format. Expected: [{"input": "...", "expectedOutput": "...", "isHidden": true}]');
    }
  };

  const handleSkeletonCodeChange = (lang, code) => {
    const updated = formData.skeletonCode.map((item) => (item.language === lang ? { ...item, code } : item));
    setFormData((prev) => ({ ...prev, skeletonCode: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const activeSkeletonCode = formData.skeletonCode.filter((item) => item.code.trim() !== '');

      const payload = {
        ...formData,
        skeletonCode: activeSkeletonCode,
        topics: formData.topics
          .split(',')
          .map((topic) => topic.trim())
          .filter(Boolean),
      };

      await adminApi.createProblem(payload);
      setStatus({ type: 'success', message: 'Problem created successfully!' });

      setFormData({
        problemId: '',
        title: '',
        statement: '',
        difficulty: 'Easy',
        topics: '',
        timeLimit: 2,
        memoryLimit: 256,
        skeletonCode: AVAILABLE_LANGUAGES.map((lang) => ({ language: lang.id, code: '' })),
        testCases: [{ input: '', expectedOutput: '', isHidden: true }],
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to create problem',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const activeSkeleton = formData.skeletonCode.find((s) => s.language === activeLangTab) || { code: '' };

  return (
    <form onSubmit={handleSubmit} className='max-w-5xl mx-auto space-y-8 text-slate-200 pb-20'>
      {/* Status Alert */}
      {status.message && (
        <div
          className={`p-4 rounded-lg flex items-center gap-3 border ${
            status.type === 'error' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          }`}
        >
          {status.type === 'error' ? <AlertCircle className='w-5 h-5 shrink-0' /> : <CheckCircle2 className='w-5 h-5 shrink-0' />}
          <span className='text-sm font-medium'>{status.message}</span>
        </div>
      )}

      {/* Section 1: Metadata */}
      <div className='bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 shadow-sm'>
        <h3 className='text-md font-semibold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3'>
          <FileText className='w-4 h-4 text-blue-400' /> General Information
        </h3>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
          <div>
            <label className='block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2'>Problem Title</label>
            <input
              required
              type='text'
              name='title'
              value={formData.title}
              onChange={handleChange}
              placeholder='e.g., Two Sum'
              className='w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all'
            />
          </div>
          <div>
            <label className='block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2'>Slug / ID</label>
            <input
              required
              type='text'
              name='problemId'
              value={formData.problemId}
              onChange={handleChange}
              placeholder='e.g., two-sum'
              className='w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all font-mono'
            />
          </div>
          <div>
            <label className='block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2'>Difficulty</label>
            <select
              name='difficulty'
              value={formData.difficulty}
              onChange={handleChange}
              className='w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:border-blue-500 outline-none transition-all'
            >
              <option value='Easy'>Easy</option>
              <option value='Medium'>Medium</option>
              <option value='Hard'>Hard</option>
            </select>
          </div>
          <div>
            <label className='block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2'>Topics (Comma Separated)</label>
            <input
              type='text'
              name='topics'
              value={formData.topics}
              onChange={handleChange}
              placeholder='Arrays, Hash Table, Two Pointers'
              className='w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:border-blue-500 outline-none transition-all'
            />
          </div>
        </div>

        {/* Expanded Problem Statement Area */}
        <div>
          <label className='block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2'>Problem Statement (Markdown Supported)</label>
          <textarea
            required
            name='statement'
            value={formData.statement}
            onChange={handleChange}
            rows={12}
            className='w-full min-h-62.5 bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-sm leading-relaxed focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-y'
            placeholder='Write detailed problem description, inputs, outputs, and constraints here...'
          />
        </div>

        {/* Time and Memory Limits */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-slate-800/60'>
          <div>
            <label className='block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2'>Time Limit (Seconds)</label>
            <input
              required
              type='number'
              step='0.1'
              name='timeLimit'
              value={formData.timeLimit}
              onChange={handleChange}
              className='w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm focus:border-blue-500 outline-none'
            />
          </div>
          <div>
            <label className='block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2'>Memory Limit (MB)</label>
            <input
              required
              type='number'
              name='memoryLimit'
              value={formData.memoryLimit}
              onChange={handleChange}
              className='w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm focus:border-blue-500 outline-none'
            />
          </div>
        </div>
      </div>

      {/* Section 2: Tabbed Skeleton Code Editor */}
      <div className='bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow-sm'>
        <div className='flex items-center justify-between border-b border-slate-800 pb-3'>
          <h3 className='text-md font-semibold text-slate-100 flex items-center gap-2'>
            <Code2 className='w-4 h-4 text-blue-400' /> Starter Code Templates
          </h3>
          <span className='text-xs text-slate-500'>Switch tabs to supply default starter code for each language</span>
        </div>

        {/* Tab Navigation */}
        <div className='flex gap-2 border-b border-slate-800 pb-2'>
          {AVAILABLE_LANGUAGES.map((lang) => {
            const hasCode = formData.skeletonCode.find((s) => s.language === lang.id)?.code.trim().length > 0;
            return (
              <button
                key={lang.id}
                type='button'
                onClick={() => setActiveLangTab(lang.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  activeLangTab === lang.id ? 'bg-blue-600 text-white shadow' : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {lang.label}
                {hasCode && <span className='w-1.5 h-1.5 rounded-full bg-emerald-400' />}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className='space-y-2'>
          <textarea
            value={activeSkeleton.code}
            onChange={(e) => handleSkeletonCodeChange(activeLangTab, e.target.value)}
            rows={8}
            placeholder={`// Add starter code template for ${AVAILABLE_LANGUAGES.find((l) => l.id === activeLangTab)?.label}...`}
            className='w-full bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-sm leading-relaxed focus:border-blue-500 outline-none transition-all'
          />
        </div>
      </div>

      {/* Section 3: Test Cases */}
      <div className='bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow-sm'>
        <div className='flex items-center justify-between border-b border-slate-800 pb-3'>
          <h3 className='text-md font-semibold text-slate-100'>Test Cases ({formData.testCases.length})</h3>
          <div className='flex items-center gap-2'>
            <button
              type='button'
              onClick={() => setShowBulkTestCases(!showBulkTestCases)}
              className='text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors flex items-center gap-1.5 border border-slate-700'
            >
              <Upload className='w-3.5 h-3.5' /> Bulk Import
            </button>
            <button
              type='button'
              onClick={addTestCase}
              className='text-xs font-medium px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition-colors flex items-center gap-1.5 border border-blue-500/30'
            >
              <Plus className='w-3.5 h-3.5' /> Add Row
            </button>
          </div>
        </div>

        {/* Bulk Import Drawer */}
        {showBulkTestCases && (
          <div className='bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 mb-4'>
            <div className='flex justify-between items-center'>
              <label className='text-xs font-semibold text-slate-400 uppercase tracking-wider'>Paste JSON Test Cases</label>
              <span className='text-xs text-slate-500'>Format: [{"{input: '...', expectedOutput: '...', isHidden: true}"}]</span>
            </div>
            <textarea
              value={bulkInput}
              onChange={(e) => setBulkInput(e.target.value)}
              rows={4}
              placeholder='[{"input": "2 3", "expectedOutput": "5", "isHidden": false}]'
              className='w-full bg-slate-900 border border-slate-800 rounded-lg p-3 font-mono text-xs focus:border-blue-500 outline-none'
            />
            {bulkError && <p className='text-xs text-red-400'>{bulkError}</p>}
            <div className='flex justify-end gap-2'>
              <button type='button' onClick={() => setShowBulkTestCases(false)} className='px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200'>
                Cancel
              </button>
              <button
                type='button'
                onClick={handleBulkTestCaseImport}
                className='px-3 py-1.5 text-xs bg-blue-600 text-white rounded-md font-medium hover:bg-blue-500 transition-colors'
              >
                Import Test Cases
              </button>
            </div>
          </div>
        )}

        {/* Test Case List */}
        <div className='space-y-4'>
          {formData.testCases.map((tc, index) => (
            <div key={index} className='p-4 bg-slate-950 border border-slate-800/80 rounded-xl space-y-3 relative group'>
              <div className='flex justify-between items-center border-b border-slate-800/50 pb-2'>
                <span className='text-xs font-semibold text-slate-400'>Test Case #{index + 1}</span>
                {formData.testCases.length > 1 && (
                  <button type='button' onClick={() => removeTestCase(index)} className='text-slate-500 hover:text-red-400 transition-colors p-1'>
                    <Trash2 className='w-4 h-4' />
                  </button>
                )}
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-xs text-slate-400 mb-1 font-mono'>Input</label>
                  <textarea
                    required
                    value={tc.input}
                    onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                    rows={2}
                    className='w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono focus:border-blue-500 outline-none'
                  />
                </div>
                <div>
                  <label className='block text-xs text-slate-400 mb-1 font-mono'>Expected Output</label>
                  <textarea
                    required
                    value={tc.expectedOutput}
                    onChange={(e) => handleTestCaseChange(index, 'expectedOutput', e.target.value)}
                    rows={2}
                    className='w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono focus:border-blue-500 outline-none'
                  />
                </div>
              </div>

              <div className='pt-1'>
                <label className='inline-flex items-center gap-2 text-xs text-slate-400 cursor-pointer select-none'>
                  <input
                    type='checkbox'
                    checked={tc.isHidden}
                    onChange={(e) => handleTestCaseChange(index, 'isHidden', e.target.checked)}
                    className='rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0 focus:ring-offset-0'
                  />
                  Hidden test case (Used for final score, hidden from problem view)
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky Action Footer */}
      <div className='fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 py-3 px-6 z-10'>
        <div className='max-w-5xl mx-auto flex justify-end items-center gap-4'>
          <button
            type='submit'
            disabled={isLoading}
            className='bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all'
          >
            {isLoading ? <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' /> : <Save className='w-4 h-4' />}
            {isLoading ? 'Saving...' : 'Save Problem'}
          </button>
        </div>
      </div>
    </form>
  );
};
