/**
 * @file Checks commented ES6 templates against your regular linting rules
 * @author Brett Zamir
 * @license MIT
 */
'use strict';

const {CLIEngine} = require('eslint');

const jsTriggers = new Set(['js', 'javascript']);

/**
 * Checks if the given token is a comment token or not.
 *
 * @param {Token} token - The token to check.
 * @returns {boolean} `true` if the token is a comment token.
 */
const isMultilineCommentToken = (token) => {
  return token.type === 'Block';
};

/**
 * Checks for the presence of a JSDoc comment for the given node and returns it.
 * Adapted from `eslint-plugin-jsdoc`->`eslint`.
 * @param {SourceCode} sourceCode
 * @param {ASTNode} astNode The AST node to get the comment for.
 * @returns {Token|null} The Block comment token containing the JSDoc comment
 *    for the given node or null if not found.
 * @private
 */
const findPrecedingMultilineComment = (sourceCode, astNode) => {
  const tokenBefore = sourceCode.getTokenBefore(astNode, {
    includeComments: true
  });
  if (!tokenBefore || !isMultilineCommentToken(tokenBefore)) {
    return null;
  }

  return tokenBefore;
};

// Rule Definition

module.exports = {
  meta: {
    docs: {
      description: 'Populate ES6 templates so their contents can be linted'
      // category: '',
      // recommended: false
    },
    type: 'problem',
    fixable: null, // or 'code' when ready
    schema: [
      {
        additionalProperties: false,
        properties: {
          taggedTemplates: {
            type: 'array',
            items: {
              type: 'string'
            }
          }
        },
        type: 'object'
      }
    ]
  },

  create (context) {
    const {
      matchingFileName, taggedTemplates
    } = context.options[0] || {};
    const sourceCode = context.getSourceCode();

    const isNodeAJSTemplate = (node) => {
      if (taggedTemplates) {
        const {parent} = node;
        if (// parent.type === 'TemplateLiteral' &&
          parent.type === 'TaggedTemplateExpression' &&
          taggedTemplates.includes(parent.tag.name)
        ) {
          return true;
        }
      }
      const docNode = findPrecedingMultilineComment(sourceCode, node);
      if (!docNode || !jsTriggers.has(docNode.value.trim())) {
        return false;
      }

      return true;
    };

    return {
      TemplateLiteral (node) {
        const isJSTemplate = isNodeAJSTemplate(node);
        if (!isJSTemplate) {
          return;
        }

        // Todo: Use caching of config as in `eslint-plugin-jsdoc`'s
        //  `check-examples`, for better performance
        const filePath = matchingFileName || context.getFilename();
        // const code = sourceCode.getText(node);
        let code = '';
        node.quasis.forEach(({value: {cooked}}, i) => {
          // `raw` would have escaping, so we use `cooked`
          code += cooked;
          if (node.expressions[i]) {
            // Not in AST
            // code += node.expressions[i].trailingComments[0].value;
            code += sourceCode.getCommentsAfter(
              node.expressions[i]
            )[0].value.slice(1, -1); // Strip single space on either end
          }
        });
        console.log('code', code);
        // console.log('quasis', node.quasis);
        // console.log('expressions', node.expressions);

        // Todo[eslint@>=7.1]: When `async` function may be supported in ESLint,
        //    see about replacing `CLIEngine`
        /*
        // `async` not yet supported in rules, so commenting out for now
        //   and using deprecated `CLIEngine` instead
        const {ESLint} = require('eslint');

        const eslint = new ESLint();
        // Only linting one file (this one)
        const [{messages}] = await eslint.lintText(code, {filePath});
        */
        const cli = new CLIEngine();
        const {results: [{messages}]} = cli.executeOnText(code, filePath);

        messages.forEach(({
          message: msg,
          line, column, endLine, endColumn,
          severity, ruleId
        }) => {
          const {start: nodeStart} = node.loc;

          const startLn = nodeStart.line + line;
          const endLn = nodeStart.line + (endLine || line);
          const startCol = nodeStart.column + column;
          const endCol = nodeStart.column + (endColumn || column);

          const message = `Template ${severity === 2 ? 'error' : 'warning'}${
            ruleId ? ` (${ruleId})` : ''
          }: ${msg}`;

          context.report({
            loc: {
              start: {
                column: startCol,
                line: startLn
              },
              end: {
                column: endCol,
                line: endLn
              }
            },
            node,
            message
          });
        });
      }
    };
  }
};
