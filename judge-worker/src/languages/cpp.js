export default {
  image: 'verdictio/sandbox-cpp',
  filename: 'solution.cpp',
  timeoutMs: 2000,
  memoryLimitMB: 256,
  compileCommand: 'g++ -O2 solution.cpp -std=c++20 -o a.out',
  runCommand: './a.out',
};
