const {
  VAR,
  VARIABLE,
  COLON,
  DELIMITER,
  BOOLEAN,
  REAL,
  INTEGER,
  SEMICOLON,
  COMA,
  RESERVED_KEYWORD,
  CLOSE_PARENTHESES,
} = require('../LanguageDictionary');

const logger = require('../../config/logger/signale');

let stack;

function ArgumentsList(tokens) {
  stack = tokens;
  while (true) {
    if (stack.top().classification === VARIABLE) {
      stack.next();
      if (stack.top().classification === DELIMITER) {
        if (stack.top().token === COMA) {
          stack.next();
        } else if (stack.top().token === COLON) {
          stack.next();
          if (
            stack.top().token === INTEGER
            || stack.top().token === REAL
            || stack.top().token === BOOLEAN
          ) {
            stack.next();
            if (stack.top().token === SEMICOLON) {
              stack.next();
            } else if (stack.top().token === CLOSE_PARENTHESES) {
              return stack;
            } else {
              logger.error(stack.top());
              throw new Error(`Missing semicolon at line ${stack.top().line}`);
            }
          } else {
            logger.error(stack.top());
            throw new Error(`Missing type of variable at line ${stack.top().line}`);
          }
        } else {
          break;
        }
      } else {
        break;
      }
    } else {
      return stack;
    }
  }
}


function VariableDeclarations(tokens) {
  stack = tokens;
  if (stack.top().token === VAR && stack.top().classification === RESERVED_KEYWORD) {
    stack.next();
    return ArgumentsList(stack);
  }
}

module.exports = {
  VariableDeclarations,
  ArgumentsList,
};
