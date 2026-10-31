module.exports = {
  clearMocks: true,
  moduleFileExtensions: ['js', 'ts'],
  testMatch: ['**/*.test.ts'],
  resolver: '<rootDir>/jest.resolver.js',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', {tsconfig: {allowJs: true}}]
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(@actions|@octokit|universal-user-agent|before-after-hook|undici|fast-content-type-parse|json-with-bigint|tunnel|content-type)/)'
  ],
  setupFiles: ['dotenv/config'],
  verbose: true,
  cacheDirectory: '.test'
}
