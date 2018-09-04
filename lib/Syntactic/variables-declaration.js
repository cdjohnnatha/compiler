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

function type() {
  if (stack.top().token === INTEGER
    || stack.top().token === REAL
    || stack.top().token === BOOLEAN) {
    stack.next();
  }
}

function IndentifierList(tokens) {
  if (tokens) { stack = tokens; }
  if (stack.top().classification === VARIABLE) {
    stack.next();
    if (stack.top().token === COMA) {
      stack.next();
      if (tokens) {
        IndentifierList(tokens);
      } else {
        IndentifierList();
      }
    }
  }
}


function VariablesDeclarationList() {
  IndentifierList();
  if (stack.top().token === COLON) {
    stack.next();
    type();
    if (stack.top().token === SEMICOLON) {
      stack.next();
      if (stack.top().classification === VARIABLE) {
        VariablesDeclarationList();
      }
    } else {
      logger.error(stack.top());
      throw new Error('Missing semicolon');
    }
  }
}


function VariableDeclarations(tokens) {
  stack = tokens;
  if (stack.top().token === VAR) {
    stack.next();
    VariablesDeclarationList(stack);
  }
  return stack;
}

module.exports = {
  VariableDeclarations,
  IndentifierList,
};
