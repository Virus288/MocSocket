import { defaults } from 'jest-config';
import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts'],
  testPathIgnorePatterns: ['lib'],
  preset: 'ts-jest',
  testMatch: ['**/*.test.ts'],
  testEnvironment: 'node',
  clearMocks: true,
  testTimeout: 10000,
  passWithNoTests: true,
};

export default config;
