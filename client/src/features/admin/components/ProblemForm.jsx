import { useState } from 'react';
import { Plus, Trash2, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { adminApi } from '../api/adminApi';

export const ProblemForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const [formData, setFormData] = useState({
    problemId: '',
    title: '',
    statement: '',
    difficulty: 'Easy',
    topics: '',
    timeLimit: 2,
    memoryLimit: 256,
    skeletonCode: [{ language: 'cpp', code: '' }],
    testCases: [{ input: '', expectedOutput: '', isHidden: true }],
  });

  /**
   * Handles changes to form inputs.
   * @param {Object} e - The change event.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Handles changes to array fields in the form data.
   * @param {number} index - The index of the item in the array.
   * @param {string} field - The field name to update.
   * @param {any} value - The new value for the field.
   * @param {string} arrayName - The name of the array in formData.
   */
  const handleArrayChange = (index, field, value, arrayName) => {
    const newArray = [...formData[arrayName]];
    newArray[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      [arrayName]: newArray,
    }));
  };

  /**
   * Adds a new item to an array field in the form data.
   * @param {string} arrayName - The name of the array in formData.
   * @param {Object} defaultItem - The default item to add to the array.
   */
  const addArrayItem = (arrayName, defaultItem) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: [...prev[arrayName], defaultItem],
    }));
  };

  /**
   * Removes an item from an array field in the form data.
   * @param {number} index - The index of the item to remove.
   * @param {string} arrayName - The name of the array in formData.
   */
  const removeArrayItem = (index, arrayName) => {
    if (formData[arrayName].length < 1) return;
    const newArray = formData[arrayName].filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      [arrayName]: newArray,
    }));
  };

  /* Handles form submission to create a new problem */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const payload = {
        ...formData,
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
        skeletonCode: [{ language: 'cpp', code: '' }],
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

  return (
    <form onSubmit={handleSubmit} className='space-y-8 text-slate-200'>
      {/* Status Messages */}
      {status.message && (
        <div
          className={`p-4 rounded-md flex items-center gap-3 ${status.type === 'error' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}
        >
          {status.type === 'error' ? <AlertCircle className='w-5 h-5' /> : <CheckCircle2 className='w-5 h-5' />}
          <span>{status.message}</span>
        </div>
      )}

      {/* Basic Information */}
      <div className='space-y-4 bg-slate-800/50 p-6 rounded-lg border border-slate-700'>
        <h3 className='text-lg font-medium text-slate-50 border-b border-slate-700 pb-2'>Basic Information</h3>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-slate-400 mb-1'>Problem ID (Slug)</label>
            <input
              required
              type='text'
              name='problemId'
              value={formData.problemId}
              onChange={handleChange}
              placeholder='two-sum'
              className='w-full bg-slate-900 border border-slate-700 rounded-md px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-slate-400 mb-1'>Title</label>
            <input
              required
              type='text'
              name='title'
              value={formData.title}
              onChange={handleChange}
              placeholder='Two Sum'
              className='w-full bg-slate-900 border border-slate-700 rounded-md px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-slate-400 mb-1'>Difficulty</label>
            <select
              name='difficulty'
              value={formData.difficulty}
              onChange={handleChange}
              className='w-full bg-slate-900 border border-slate-700 rounded-md px-4 py-2 focus:border-blue-500 outline-none transition-colors'
            >
              <option value='Easy'>Easy</option>
              <option value='Medium'>Medium</option>
              <option value='Hard'>Hard</option>
            </select>
          </div>
          <div>
            <label className='block text-sm font-medium text-slate-400 mb-1'>Topics (comma separated)</label>
            <input
              type='text'
              name='topics'
              value={formData.topics}
              onChange={handleChange}
              placeholder='Arrays, Hash Table'
              className='w-full bg-slate-900 border border-slate-700 rounded-md px-4 py-2 focus:border-blue-500 outline-none transition-colors'
            />
          </div>
        </div>

        <div>
          <label className='block text-sm font-medium text-slate-400 mb-1'>Problem Statement (Markdown)</label>
          <textarea
            required
            name='statement'
            value={formData.statement}
            onChange={handleChange}
            rows='6'
            className='w-full bg-slate-900 border border-slate-700 rounded-md px-4 py-2 focus:border-blue-500 outline-none transition-colors font-mono text-sm'
            placeholder='Write problem description here...'
          />
        </div>
      </div>

      {/* Constraints */}
      <div className='space-y-4 bg-slate-800/50 p-6 rounded-lg border border-slate-700'>
        <h3 className='text-lg font-medium text-slate-50 border-b border-slate-700 pb-2'>Execution Constraints</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-slate-400 mb-1'>Time Limit (Seconds)</label>
            <input
              required
              type='number'
              step='0.1'
              name='timeLimit'
              value={formData.timeLimit}
              onChange={handleChange}
              className='w-full bg-slate-900 border border-slate-700 rounded-md px-4 py-2 focus:border-blue-500 outline-none'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-slate-400 mb-1'>Memory Limit (MB)</label>
            <input
              required
              type='number'
              name='memoryLimit'
              value={formData.memoryLimit}
              onChange={handleChange}
              className='w-full bg-slate-900 border border-slate-700 rounded-md px-4 py-2 focus:border-blue-500 outline-none'
            />
          </div>
        </div>
      </div>

      {/* Test Cases */}
      <div className='space-y-4 bg-slate-800/50 p-6 rounded-lg border border-slate-700'>
        <div className='flex justify-between items-center border-b border-slate-700 pb-2'>
          <h3 className='text-lg font-medium text-slate-50'>Test Cases</h3>
          <button
            type='button'
            onClick={() => addArrayItem('testCases', { input: '', expectedOutput: '', isHidden: true })}
            className='text-sm flex items-center gap-1 text-blue-500 hover:text-blue-400'
          >
            <Plus className='w-4 h-4' /> Add Test Case
          </button>
        </div>

        {formData.testCases.map((tc, index) => (
          <div key={index} className='flex gap-4 items-start p-4 bg-slate-900 border border-slate-700 rounded-md relative'>
            <div className='flex-1 space-y-3'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-xs text-slate-400 mb-1'>Input</label>
                  <textarea
                    required
                    value={tc.input}
                    onChange={(e) => handleArrayChange(index, 'input', e.target.value, 'testCases')}
                    rows='2'
                    className='w-full bg-slate-800 border border-slate-600 rounded px-3 py-1 text-sm font-mono focus:border-blue-500 outline-none'
                  />
                </div>
                <div>
                  <label className='block text-xs text-slate-400 mb-1'>Expected Output</label>
                  <textarea
                    required
                    value={tc.expectedOutput}
                    onChange={(e) => handleArrayChange(index, 'expectedOutput', e.target.value, 'testCases')}
                    rows='2'
                    className='w-full bg-slate-800 border border-slate-600 rounded px-3 py-1 text-sm font-mono focus:border-blue-500 outline-none'
                  />
                </div>
              </div>
              <label className='flex items-center gap-2 text-sm text-slate-400 cursor-pointer w-max'>
                <input
                  type='checkbox'
                  checked={tc.isHidden}
                  onChange={(e) => handleArrayChange(index, 'isHidden', e.target.checked, 'testCases')}
                  className='rounded bg-slate-800 border-slate-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-900'
                />
                Hidden Test Case (Used for evaluation, hidden from user)
              </label>
            </div>
            {formData.testCases.length > 1 && (
              <button type='button' onClick={() => removeArrayItem(index, 'testCases')} className='text-red-500 hover:text-red-400 p-1'>
                <Trash2 className='w-5 h-5' />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Skeleton Code */}
      <div className='space-y-4 bg-slate-800/50 p-6 rounded-lg border border-slate-700'>
        <div className='flex justify-between items-center border-b border-slate-700 pb-2'>
          <h3 className='text-lg font-medium text-slate-50'>Skeleton Code</h3>
          <button
            type='button'
            onClick={() => addArrayItem('skeletonCode', { language: 'cpp', code: '' })}
            className='text-sm flex items-center gap-1 text-blue-500 hover:text-blue-400'
          >
            <Plus className='w-4 h-4' /> Add Language
          </button>
        </div>

        {formData.skeletonCode.map((sc, index) => (
          <div key={index} className='flex gap-4 items-start p-4 bg-slate-900 border border-slate-700 rounded-md'>
            <div className='flex-1 space-y-3'>
              <select
                value={sc.language}
                onChange={(e) => handleArrayChange(index, 'language', e.target.value, 'skeletonCode')}
                className='bg-slate-800 border border-slate-600 rounded px-3 py-1 text-sm focus:border-blue-500 outline-none text-slate-200'
              >
                <option value='cpp'>C++</option>
                <option value='python'>Python</option>
                <option value='java'>Java</option>
                <option value='javascript'>JavaScript</option>
              </select>
              <textarea
                required
                value={sc.code}
                onChange={(e) => handleArrayChange(index, 'code', e.target.value, 'skeletonCode')}
                rows='4'
                placeholder='function twoSum(nums, target) { ... }'
                className='w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-sm font-mono focus:border-blue-500 outline-none'
              />
            </div>
            {formData.skeletonCode.length > 1 && (
              <button type='button' onClick={() => removeArrayItem(index, 'skeletonCode')} className='text-red-500 hover:text-red-400 p-1'>
                <Trash2 className='w-5 h-5' />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className='flex justify-end pt-4'>
        <button
          type='submit'
          disabled={isLoading}
          className='bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-md font-medium flex items-center gap-2 transition-colors'
        >
          {isLoading ? <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin' /> : <Save className='w-5 h-5' />}
          {isLoading ? 'Saving...' : 'Save Problem'}
        </button>
      </div>
    </form>
  );
};
