import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

/**
 * Executes the provided code in a Docker sandbox environment.
 * @param {string} language - The programming language of the code (e.g., 'javascript', 'python').
 * @param {string} code - The source code to be executed.
 * @param {string} input - The input to be provided to the code during execution.
 */
export const executeDockerSandbox = async (language, code, input) => {
  const dockerCmd = `docker run --rm -i \
    --network=none \
    --memory="256m" \
    --cpus="0.5" \
    --read-only \
    --pids-limit=50 \
    --user=runner \
    --cap-drop=ALL \
    node:20-alpine node /app/solution.js`;

  /* Implementation details for writing temp files & executing the Docker command */
};
