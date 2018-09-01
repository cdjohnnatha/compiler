const logger = require('../../config/logger/signale');

let stack;

const {
  PROCEDURE,
  VARIABLE,
  OPEN_PARENTHESES,
  CLOSE_PARENTHESES,
  SEMICOLON,
} = require('../LanguageDictionary');

const { ArgumentsList } = require('./variables-declaration');

function Analyze(tokens) {
  stack = tokens;
  if (stack.top().token === PROCEDURE) {
    stack.next();
    if (stack.top().classification === VARIABLE) {
      stack.next();
      if (stack.top().token === OPEN_PARENTHESES) {
        stack.next();
        stack = ArgumentsList(stack);
        logger.debug(stack.top());
        if (stack.top().token === CLOSE_PARENTHESES) {
          stack.next();
          if (stack.top().token === SEMICOLON) {
            stack.next();
            return stack;
          }
          throw new Error(`Missing delimiter at line ${stack.top().line}`);
        }
        logger.error(stack.top());
        throw new Error(`Missing close parentheses at line ${stack.top().line}`);
      } else {
        logger.error(stack.top());
        throw new Error(`Missing delimiter at line ${stack.top().line}`);
      }
    } else {
      logger.error(stack.top());
      throw new Error(`Missing procedure ID at line ${stack.top().line}`);
    }
  }
  return stack;
}


module.exports = Analyze;
