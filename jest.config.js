module.exports = {
  roots: ["<rootDir>/src"],
  collectCoverage: false,
  collectCoverageFrom: [
    "<rootDir>/src/**/*.ts",
    "!<rootDir>/src/main/**"
  ],
  coverageDirectory: "coverage",
  coverageProvider: "babel",
  testEnvironment: "node",
  preset: "@shelf/jest-mongodb",
  transform: {
    ".+\\.ts$": "ts-jest"
  }
};
