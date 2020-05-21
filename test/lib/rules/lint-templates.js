/**
 * @file Checks commented ES6 templates against your regular linting rules
 * @author Brett Zamir
 */
'use strict';

// Requirements

const {RuleTester} = require('eslint');

const rule = require('../../../lib').rules['lint-templates'];

// Tests

const fullValid = [
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
    var template = /* js */ \`var b = \${a /* 'a'; */};\`;
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

const fullInvalid = [
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

let valid = fullValid;
let invalid = fullInvalid;
/* eslint-disable node/no-process-env */
if (process.env.npm_config_valid) {
  const [begin, end] = process.env.npm_config_valid.split(',');
  valid = fullValid.slice(
    Number.parseInt(begin),
    !Number.isNaN(Number.parseInt(end))
      ? end
      : Number.parseInt(begin) + 1
  );
  if (!process.env.npm_config_invalid) {
    invalid = [];
  }
}
if (process.env.npm_config_invalid) {
  const [begin, end] = process.env.npm_config_invalid.split(',');
  invalid = fullInvalid.slice(
    Number.parseInt(begin),
    !Number.isNaN(Number.parseInt(end))
      ? end
      : Number.parseInt(begin) + 1
  );
  if (!process.env.npm_config_valid) {
    valid = [];
  }
}
/* eslint-enable node/no-process-env */

const ruleTester = new RuleTester();
ruleTester.run('lint-templates', rule, {
  valid,
  invalid
});
