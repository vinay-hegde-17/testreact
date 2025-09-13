module.exports = {
  clearMocks: true,
  collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}"],
  coverageReporters: ["text", "lcov"],
  testMatch: ["<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}"],
  reporters: [
    "default",
    ["jest-junit", { outputDirectory: "test-results", outputName: "junit.xml" }],
    ["jest-html-reporters", {
      publicPath: "./html-report",
      filename: "report.html",
      expand: true
    }]
  ]
};
