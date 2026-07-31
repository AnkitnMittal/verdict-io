export default {
  image: 'eclipse-temurin:21-jre',
  filename: 'Main.java',
  timeoutMs: 5000,
  memoryLimitMB: 512,
  runCommand: 'javac Main.java && java Main',
};
