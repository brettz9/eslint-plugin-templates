/**
 * @file Populate ES6 templates so their contents can be linted
 * @author Brett Zamir
 */
'use strict';

// Requirements

const {join} = require('path');
const requireIndex = require('requireindex');

// Plugin Definition

// import all rules in lib/rules
module.exports = {
  rules: requireIndex(join(__dirname, '/rules')),
  configs: {
    recommended: {
      plugins: ['templates'],
      rules: {
        'templates/lint-templates': ['error']
      }
    }
  }
};
