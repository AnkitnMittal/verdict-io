export default {
  image: 'eclipse-temurin:21-jdk',
  filename: 'Main.java',
  timeoutMs: 5000,
  memoryLimitMB: 512,
  compileCommand: 'javac Main.java',
  runCommand: 'java Main',
};
