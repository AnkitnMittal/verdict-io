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
    '-i',
    '--read-only',
    '--tmpfs=/tmp:rw,noexec,nosuid,size=64m',
    '--network=none',
    `--memory=${langConfig.memoryLimitMB}m`,
    `--memory-swap=${langConfig.memoryLimitMB}m`,
    '--pids-limit=64',
    '--cap-drop=ALL',
    '--security-opt=no-new-privileges:true',
    `--user=${uid}:${gid}`,
    `-v`,
    `${tempDir}:/sandbox`,
    `-w`,
    `/sandbox`,
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
 * Executes the provided code for ALL test cases in a single Docker sandbox environment.
 * @param {Object} langConfig - The language configuration object.
 * @param {string} code - The source code to be executed.
 * @param {Array} testCases - Array of test case objects.
 */
export const executeDockerSandbox = async (langConfig, code, testCases = []) => {
  if (!langConfig || !code || testCases.length === 0) {
    throw new ApiError(400, 'Invalid language configuration, code, or test cases provided.');
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
        return [{ verdict: 'CE', stdout: '', stderr: cleanErrorOutput(rawCE, filename), runtime: 0, memory: 0 }];
      }
    }

    /* --- Execution Phase (Batched) --- */
    const numTestCases = testCases.length;

    for (let i = 0; i < numTestCases; i++) {
      await fs.writeFile(path.join(tempDir, `input_${i}.txt`), testCases[i].input, 'utf8');
    }

    const timeoutSecs = Math.max(1, Math.ceil(timeoutMs / 1000));

    const scriptContent = `#!/bin/sh
for i in $(seq 0 ${numTestCases - 1}); do
  timeout -s KILL ${timeoutSecs}s sh -c "${runCommand} < input_$i.txt > output_$i.txt 2> error_$i.txt"
  echo $? > exit_$i.txt
done
`;
    await fs.writeFile(path.join(tempDir, 'runner.sh'), scriptContent, 'utf8');
    await fs.chmod(path.join(tempDir, 'runner.sh'), 0o777);

    const runArgs = [...getRunArgs(langConfig, tempDir), 'sh', './runner.sh'];
    const totalContainerTimeoutMs = timeoutMs * numTestCases + 10000;

    const startTime = process.hrtime.bigint();
    const runResult = await spawnDockerProcess(runArgs, '', totalContainerTimeoutMs);
    const endTime = process.hrtime.bigint();
    const avgRuntimeMs = Number(endTime - startTime) / 1e6 / numTestCases;

    const results = [];

    /* --- Output Processing Phase --- */
    for (let i = 0; i < numTestCases; i++) {
      let stdout = '';
      let stderr = '';
      let exitCode = -1;

      try {
        stdout = await fs.readFile(path.join(tempDir, `output_${i}.txt`), 'utf8');
        stderr = await fs.readFile(path.join(tempDir, `error_${i}.txt`), 'utf8');
        const codeStr = await fs.readFile(path.join(tempDir, `exit_${i}.txt`), 'utf8');
        exitCode = parseInt(codeStr.trim(), 10);
      } catch (err) {
        if (runResult.isTimeout) exitCode = 137;
      }

      let verdict = 'AC';
      let stderrOut = cleanErrorOutput(stderr, filename);

      if (exitCode === 137 || exitCode === 124 || exitCode === 143) {
        verdict = 'TLE';
        stderrOut = `Time Limit Exceeded: Process terminated after ${timeoutMs}ms.`;
      } else if (exitCode === 139) {
        verdict = 'RE';
        stderrOut = `Runtime Error (SIGSEGV): Segmentation Fault. Core Dumped.`;
      } else if (exitCode === 136) {
        verdict = 'RE';
        stderrOut = `Runtime Error (SIGFPE): Floating Point Exception.`;
      } else if (exitCode !== 0) {
        verdict = 'RE';
        stderrOut = stderrOut || `Runtime Error: Process exited with nonzero status code ${exitCode}`;
      }

      results.push({
        verdict,
        stdout: stdout.trim(),
        stderr: stderrOut,
        runtime: Math.min(avgRuntimeMs, timeoutMs),
        memory: 0,
      });
    }

    return results;
  } catch (error) {
    throw new ApiError(500, `Error during Docker sandbox execution: ${error.message}`);
  } finally {
    if (tempDir) {
      await fs.rm(tempDir, { recursive: true, force: true }).catch(console.error);
    }
  }
};
