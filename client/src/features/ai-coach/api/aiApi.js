import axiosInstance from '../../../api/axiosInstance';
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

/* API functions for AI-related operations */
export const aiApi = {
  fetchDebugReport: async (payload) => {
    const response = await axiosInstance.post('/ai/debug', payload);
    return response.data;
  },

  /**
   * Establishes an SSE stream connection for progressive hints token-by-token.
   * @param {Object} payload - The request payload to send to the API.
   * @param {Function} onChunk - Callback function to handle each chunk of data received.
   * @param {AbortSignal} signal - An AbortSignal to allow cancellation of the request.
   */
  fetchHintStream: async (payload, onChunk, signal) => {
    const response = await fetch(`${API_URL}/ai/hint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(payload),
      signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();

      for (const line of lines) {
        if (!line.startsWith('data:')) continue;

        const dataStr = line.slice(6).trim();
        if (dataStr === '[DONE]') return;

        try {
          const parsed = JSON.parse(dataStr);
          if (parsed.error) throw new Error(parsed.error);

          if (parsed.text) {
            onChunk(parsed.text);
          }
        } catch (error) {
          if (error instanceof SyntaxError) continue;
          throw error;
        }
      }
    }
  },
};
