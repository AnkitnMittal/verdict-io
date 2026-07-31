export default {
  image: 'gcc:13-alpine',
  filename: 'solution.cpp',
  timeoutMs: 2000,
  memoryLimitMB: 256,
  runCommand: 'g++ -O2 solution.cpp -o a.out && ./a.out',
};
