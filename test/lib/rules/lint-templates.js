/**
 * @file Checks commented ES6 templates against your regular linting rules
 * @author Brett Zamir
 */
'use strict';

// Requirements

const {RuleTester} = require('eslint');

const rule = require('../../../lib').rules['lint-templates'];

// Tests

const valid = [
  {
    code: `
    var a = 'a';
    var template = /* js */ \`var b = \${a /* 'a'; */}\`;
    `,
    parserOptions: {
      ecmaVersion: 6
    }
  },
  {
    code: `
    var a = 'a';
    var js = function (strings, ...args) {
      return strings.join('') + args.join('');
    };
    var template = js\`var b = \${a /* 'a'; */}\`;
    `,
    options: [
      {
        taggedTemplates: ['js']
      }
    ],
    parserOptions: {
      ecmaVersion: 6
    }
  },
  {
    code: `
    var a = 'a';
    var js = function () {};
    var template = js\`var b = \${a /* 'a'; */}\`;
    `,
    options: [
      {
        taggedTemplates: ['javascript']
      }
    ],
    parserOptions: {
      ecmaVersion: 6
    }
  }
];

const invalid = [
  {
    code: `
    var a = 'a';
    var template = /* js */ \`var b = \${a /* 'a; */}\`;
    `,
    errors: [{
      message: 'Template error: Parsing error: Unexpected token',
      type: 'TemplateElement'
    }],
    parserOptions: {
      ecmaVersion: 6
    }
  },
  {
    code: `
    var a = 'a';
    var js = function () {};
    var template = js\`var b = \${a /* 'a'; */}\`;
    `,
    errors: [{
      message: 'Template error: Parsing error: Unexpected token',
      type: 'TemplateElement'
    }],
    options: [
      {
        taggedTemplates: ['js']
      }
    ],
    parserOptions: {
      ecmaVersion: 6
    }
  }
];

// Todo: Need tests for violating specific rules of different severity

const ruleTester = new RuleTester();
ruleTester.run('lint-templates', rule, {
  valid,
  invalid
});
