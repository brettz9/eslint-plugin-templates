# eslint-plugin-templates

Checks commented ES6 templates against your regular linting rules.

***This project is not yet funtional.***

## Motivation

The main use case is for checking linting for SSR (Server-Side Rendering),
i.e., templates that build JavaScript dynamically--without needing to
add a programmatic linting routine to your UI tests.

By requiring the populating of sample strings, it may also make the code
more readable.

## Supported Rules

Currently has a single rule `lint-templates`.

### `lint-templates`

Checks commented ES6 templates against your regular linting rules.

```js
const dynamicValue = 'realRuntimeValue';
const template = /* js */ `
    const value = ${dynamicValue /* 'sampleValue' */}
`;
res.send(template);
```

The code to be checked for linting errors will then be:

```js
const value = 'sampleValue'
```

So if your linting rules insist on the ESLint `semi` rule (i.e., checking
for semi-colons), your template would get flagged by ESLint as being
in violation, pointing to the *template* line number.

<!--
Todo: Document options here once supported
-->

#### Options

##### `matchingFileName`

##### `taggedTemplates`

Array of [tagged template](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_templates)
names that will trigger the linting.

By default, the rule recognizes templates preceded by a `/* js */` or
`/* javascript */` comment as being ready for linting (assuming it adds
substitution comments (`/* 'sampleValue' */` in the example above) as
required so potentially valid JavaScript can result and be linted).

However, if you are using tagged templates which imply JavaScript, the
`/* js */` comments would become redundant.

So, you can add the following under `taggedTemplates`:

```json
["js", "javascript"]
```

...allowing the following (without any preceding `/* js */` comments)
to cause the template to be linted.

```js
const dynamicValue = 'realRuntimeValue';
const template = javascript`
    const value = ${dynamicValue /* 'sampleValue' */}
`;
res.send(template);
```

We don't currently predefine any `taggedTemplates` names as we do for
comments.

## Installation

```
$ npm install eslint eslint-plugin-templates --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then
you must also install `eslint-plugin-templates` globally.

## Usage

Add `templates` to the plugins section of your `.eslintrc.*` configuration
file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "templates"
    ]
}
```

Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "templates/lint-templates": ["error"]
    }
}
```

Or, if you want the above as is, you may just use:

```json
{
    "extends": {
        "plugin:templates/recommended"
    }
}
```

## See also

For other linting of JavaScript-within-JavaScript:

1. [`jsdoc/check-examples`](https://github.com/gajus/eslint-plugin-jsdoc#eslint-plugin-jsdoc-rules-check-examples) - Checking jsdoc `@example` JavaScript
1. [This `eslint-plugin-jsdoc` issue](https://github.com/gajus/eslint-plugin-jsdoc/issues/473)
    for the idea of linting jsdoc default values like `"someValue"` in
    `@param [name1="someValue"]` (not currently implemented)

## To-dos

1. Tests/coverage passing (including tests against specific rules)
1. Add config for ESLint as in `eslint-plugin-jsdoc` `check-examples`

## Possible to-dos

1. Templates marked as HTML but containing `<script>`
1. Add a separate rule to insist that JS tagged templates or JS-comment
    templates have proper internal comments for use by `lint-templates`
1. Fixer (with `fixable: 'code'`)
1. Cache for performance as in `eslint-plugin-jsdoc` `check-examples`
