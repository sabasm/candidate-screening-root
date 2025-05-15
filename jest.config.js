module.exports = {
 projects: [
   {
     displayName: 'app',
     testMatch: ['<rootDir>/app/src/**/__tests__/**/*.test.{ts,tsx,js,jsx}'],
     testEnvironment: 'jsdom',
     transform: {
       '^.+\\.(ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }]
     },
     moduleNameMapper: {
       '^@/(.*)$': '<rootDir>/app/src/$1'
     },
     setupFiles: ['<rootDir>/jest.setup.js']
   }
 ]
};


