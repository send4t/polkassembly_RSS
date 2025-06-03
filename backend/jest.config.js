    // backend/jest.config.js
    module.exports = {
        preset: 'ts-jest',
        testEnvironment: 'node',
        roots: ['<rootDir>/src'], // Adjust if your tests are elsewhere
        moduleNameMapper: {
          // If you have path aliases in tsconfig.json, replicate them here
          // e.g., '^@/(.*)$': '<rootDir>/src/$1'
        },
      };