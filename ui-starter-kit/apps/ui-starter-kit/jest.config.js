module.exports = {
  name: 'ui-starter-kit',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/ui-starter-kit',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
