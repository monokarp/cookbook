/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
    rootDir: "..",
    testMatch: ["<rootDir>/e2e/**/*.spec.ts"],
    testTimeout: 120000,
    maxWorkers: 1,
    globalSetup: "detox/runners/jest/globalSetup",
    globalTeardown: "detox/runners/jest/globalTeardown",
    reporters: ["detox/runners/jest/reporter"],
    testEnvironment: "detox/runners/jest/testEnvironment",
    verbose: true,
    setupFilesAfterEnv: ["<rootDir>/e2e/test-setup.ts"],
    transform: {
        "^.+\\.tsx?$": [
            "ts-jest",
            {
                tsconfig: "<rootDir>/e2e/tsconfig.json",
            },
        ],
    },
    moduleNameMapper: {
        "@cookbook/domain/(.*)": "<rootDir>/src/domain/$1",
        "@cookbook/ui/(.*)": "<rootDir>/src/ui/$1",
    },
};
