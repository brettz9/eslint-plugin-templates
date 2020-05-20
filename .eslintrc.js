'use strict';

module.exports = {
  extends: [
    'ash-nazg/sauron',
    'plugin:node/recommended-script'
  ],
  env: {
    browser: false,
    es6: true
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  overrides: [{
    files: ['test/**'],
    extends: [
      'ash-nazg/sauron-node',
      'plugin:node/recommended-script'
    ],
    env: {
      mocha: true
    },
    rules: {
      // Browser only
      'compat/compat': 0,
      'import/no-commonjs': 0,
      'no-console': 0,
      'node/exports-style': 0
    }
  }, {
    files: ['*.md'],
    rules: {
    }
  }],
  rules: {
    'import/no-commonjs': 0,
    'import/unambiguous': 0,

    'no-console': 0
  }
};
