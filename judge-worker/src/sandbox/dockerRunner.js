import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

import { ApiError } from '../utils/ApiError.js';

/* Helper function to clean error output */
const cleanErrorOutput = (rawError, filename) => {
  if (!rawError) return '';
  let cleanError = rawError.replace(/\/sandbox\//g, '');

  const MAX_ERROR_LENGTH = 3000;
  if (cleanError.length > MAX_ERROR_LENGTH) {
    cleanError = cleanError.substring(0, MAX_ERROR_LENGTH) + '\n... [Error output truncated by Judge]';
  }
  return cleanError.trim();
};

/* Helper function to get compile Docker arguments */
const getCompileArgs = (langConfig, tempDir) => {
  const uid = process.getuid ? process.getuid() : 1000;
  const gid = process.getgid ? process.getgid() : 1000;

  return [
    'run',
    '--rm',
    '-i',
    '--network=none',
    '--memory=1024m',
    '--memory-swap=1024m',
    '--cap-drop=ALL',
    `--user=${uid}:${gid}`,
    '-v',
    `${tempDir}:/sandbox`,
    '-w',
    `/sandbox`,
    langConfig.image,
  ];
};

/* Helper function to get run Docker arguments */
const getRunArgs = (langConfig, tempDir) => {
  const uid = process.getuid ? process.getuid() : 1000;
  const gid = process.getgid ? process.getgid() : 1000;

  return [
    'run',
    '--rm',
    '-i',                                             // Interactive mode
    '--read-only',                                    // Root filesystem is immutable
    '--tmpfs=/tmp:rw,noexec,nosuid,size=64m',         // Mount /tmp as tmpfs
    '--network=none',                                 // Disable network access
    `--memory=${langConfig.memoryLimitMB}m`,          // Hard RAM cap
    `--memory-swap=${langConfig.memoryLimitMB}m`,     // Disable swap
    '--pids-limit=64',                                // Prevent fork bombs  
    '--cap-drop=ALL',                                 // Drop root capabilities
    '--security-opt=no-new-privileges:true',          // Prevent privilege escalation
    `--user=${uid}:${gid}`,                           // Map host user permissions natively
    `-v`, `${tempDir}:/sandbox`,                      // Mount execution directory
    `-w`, `/sandbox`,                                 // Set working directory
    langConfig.image,
  ];
};

/* Helper function to spawn a Docker process */
const spawnDockerProcess = (dockerArgs, input = '', timeoutMs = 5000) => {
  return new Promise((resolve) => {
    let stdout = '';
    let stderr = '';
    let isTimeout = false;

    const child = spawn('docker', dockerArgs);

    const timer = setTimeout(() => {
      isTimeout = true;
      child.kill('SIGKILL');
    }, timeoutMs + 500);

    child.stdout.on('data', (chunk) => {
      if (stdout.length < 10 * 1024 * 1024) stdout += chunk.toString();
    });

    child.stderr.on('data', (chunk) => {
      if (stderr.length < 10 * 1024 * 1024) stderr += chunk.toString();
    });

    child.stdin.on('error', () => {});

    if (input) {
      child.stdin.write(input);
    }
    child.stdin.end();

    child.on('close', (code, signal) => {
      clearTimeout(timer);
      resolve({ code, signal, stdout: stdout.trim(), stderr: stderr.trim(), isTimeout });
    });

    child.on('error', (err) => {
      clearTimeout(timer);
      resolve({ code: null, signal: null, stdout: '', stderr: err.message, isTimeout: false });
    });
  });
};

/**
 * Executes the provided code in a Docker sandbox environment.
 * @param {Object} langConfig - The language configuration object.
 * @param {string} code - The source code to be executed.
 * @param {string} input - The input to be provided to the code during execution.
 */
export const executeDockerSandbox = async (langConfig, code, input = '') => {
  if (!langConfig || !code) {
    throw new ApiError(400, 'Invalid language configuration or code provided.');
  }

  const { image, filename, timeoutMs, memoryLimitMB, compileCommand, runCommand } = langConfig;
  let tempDir = null;

  try {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'verdictio-'));
    await fs.chmod(tempDir, 0o700);

    const filePath = path.join(tempDir, filename);
    await fs.writeFile(filePath, code, 'utf8');

    /* --- Compilation Phase --- */
    if (compileCommand) {
      const compileArgs = [...getCompileArgs(langConfig, tempDir), 'sh', '-c', compileCommand];
      const compileResult = await spawnDockerProcess(compileArgs, '', 20000);

      if (compileResult.code !== 0 || compileResult.isTimeout) {
        const rawCE = compileResult.stderr || compileResult.stdout || 'Compilation failed or Timed Out';
        return {
          verdict: 'CE',
          stdout: '',
          stderr: cleanErrorOutput(rawCE, filename),
          runtime: 0,
          memory: 0,
        };
      }
    }

    /* --- Execution Phase --- */
    const runArgs = [...getRunArgs(langConfig, tempDir), 'sh', '-c', runCommand];

    const startTime = process.hrtime.bigint();
    const runResult = await spawnDockerProcess(runArgs, input, timeoutMs);
    const endTime = process.hrtime.bigint();
    const runtimeMs = Number(endTime - startTime) / 1e6;

    let verdict = 'AC';
    let stderrOut = cleanErrorOutput(runResult.stderr, filename);

    // --- Hardened POSIX Signal & Exit Code Mapping ---
    if (runResult.isTimeout || runResult.signal === 'SIGKILL') {
      verdict = 'TLE';
      stderrOut = `Time Limit Exceeded: Process terminated after ${timeoutMs}ms.`;
    } else if (runResult.code === 137) {
      verdict = 'MLE';
      stderrOut = `Memory Limit Exceeded: Process killed (Exceeded ${memoryLimitMB}MB allocation).`;
    } else if (runResult.code === 139) {
      verdict = 'RE';
      stderrOut = `Runtime Error (SIGSEGV): Segmentation Fault. Core Dumped.\n\nHint: You are likely accessing an array out of bounds, dereferencing a null pointer, or causing a stack overflow via infinite recursion.`;
    } else if (runResult.code === 136) {
      verdict = 'RE';
      stderrOut = `Runtime Error (SIGFPE): Floating Point Exception.\n\nHint: Check your code for division by zero or modulo by zero operations.`;
    } else if (runResult.code === 134) {
      verdict = 'RE';
      stderrOut = `Runtime Error (SIGABRT): Process Aborted.\n\nHint: This is often caused by a failed assertion or an unhandled exception thrown in C++.`;
    } else if (runResult.code !== 0) {
      verdict = 'RE';
      stderrOut = stderrOut || `Runtime Error: Process exited with nonzero status code ${runResult.code}`;
    }

    return {
      verdict,
      stdout: runResult.stdout,
      stderr: stderrOut,
      runtime: Math.min(runtimeMs, timeoutMs),
      memory: 0,
    };
  } catch (error) {
    throw new ApiError(500, `Error during Docker sandbox execution: ${error.message}`);
  } finally {
    if (tempDir) {
      await fs.rm(tempDir, { recursive: true, force: true }).catch(console.error);
    }
  }
};
