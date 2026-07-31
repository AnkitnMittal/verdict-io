import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

const execPromise = promisify(exec);

/**
 * Executes the provided code in a Docker sandbox environment.
 * @param {Object} langConfig - The language configuration object.
 * @param {string} code - The source code to be executed.
 * @param {string} input - The input to be provided to the code during execution.
 */
export const executeDockerSandbox = async (langConfig, code, input) => {
  const { image, filename, timeoutMs, memoryLimitMB, runCommand } = langConfig;
};
