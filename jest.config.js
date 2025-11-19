module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: ['src/**/*.js'],
  testMatch: ['**/tests/**/*.test.js'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(uuid|@supabase)/)'
  ],
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  moduleNameMapper: {
    '^uuid$': 'uuid'
  },
  forceExit: true,
  detectOpenHandles: false
};