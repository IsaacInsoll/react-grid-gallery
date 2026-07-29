module.exports = {
  preset: 'jest-puppeteer',
  testMatch: ['**/*.e2e.test.ts'],
  testPathIgnorePatterns: ['.publish'],
  setupFilesAfterEnv: ['./setup-jest.js'],
};
