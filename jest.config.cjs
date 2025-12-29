/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",

  // Treat TS as ESM so `import` works
  extensionsToTreatAsEsm: [".ts", ".tsx"],

  // ts-jest needs this mapping for ESM relative imports sometimes
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1"
  },

  testMatch: ["**/__tests__/**/*.(test|spec).ts?(x)", "**/*.(test|spec).ts?(x)"]
};
