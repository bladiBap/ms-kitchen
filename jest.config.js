// import type {Config} from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';
// import { compilerOptions } from './tsconfig.json' with { type: 'json' };
import tsconfig from './tsconfig.json' with { type: 'json' };

const config= {
    preset: 'ts-jest',
    testEnvironment: 'node',
    collectCoverage: true,
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/**/*.d.ts',
        '!src/**/index.ts',
        '!src/**/*.test.ts',
        '!src/**/*.spec.ts',
		'!src/test/**/*',
		'!src/infrastructure/persistence/migrations/**'
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html', 'clover', 'json'],
    coverageThreshold: {
        global: {
            branches: 10,
            functions: 10,
            lines: 10,
            statements: 10
        }
    },
    testMatch: [
        '<rootDir>/src/test/unit/**/*.test.ts',
        '<rootDir>/src/test/unit/**/*.spec.ts',
    ],
    moduleFileExtensions: ['ts', 'js', 'json'],

    roots: ['<rootDir>/src/test/unit'],
    moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths, { prefix: '<rootDir>/src/' }),
    verbose: true,
    transform: {
        '^.+\\.ts$': 'ts-jest'
    }
};

export default config;
