# eslint-plugin-templates

Checks commented ES6 templates against your regular linting rules

***This project is not yet funtional.***

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

## Supported Rules

- `lint-templates` - Checks commented ES6 templates against your regular linting rules
