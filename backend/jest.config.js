    // backend/jest.config.js
    module.exports = {
        preset: 'ts-jest',
        testEnvironment: 'node',
        testMatch: [
            "<rootDir>/tests/unit/**/*.test.(ts|tsx)"
        ],
        moduleNameMapper: {
          // If you have path aliases in tsconfig.json, replicate them here
          // e.g., '^@/(.*)$': '<rootDir>/src/$1'
        },
      };