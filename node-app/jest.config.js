module.exports = {
  roots: ["<rootDir>", "<rootDir>/src", "<rootDir>/__tests__"],
  transform: {
    ".(ts|tsx)": "ts-jest",
  },
  testRegex: "(\\.(test|spec))\\.[tj]sx?$", // step === cucumber!
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  setupFiles: ["dotenv/config"],
  moduleDirectories: ["node_modules", "src"],
  testEnvironment: "node",
  reporters: ["default"],
  coveragePathIgnorePatterns: ["node_modules"],
  collectCoverageFrom: ["src/*.{t,j}s{,x}", "src/**/*.{t,j}s{,x}"],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
};
