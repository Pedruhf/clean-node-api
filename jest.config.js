module.exports = {
  roots: ["<rootDir>/src"],
  collectCoverage: false,
  collectCoverageFrom: ["<rootDir>/src/**/*.ts"],
  coverageDirectory: "coverage",
  coverageProvider: "babel",
  testEnvironment: "node",
  transform: {
    ".+\\.ts$": "ts-jest"
  }
};
