export default {
  displayName: 'calendar-utils-models',
  preset: '../../../jest.preset.js',
  coverageDirectory: '../../../coverage/libs/calendar/utils-models',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
};
