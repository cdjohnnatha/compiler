const {
  BEGIN,
  END,
  VARIABLE,
  SIGNALS,
  RELATIONAL_OPERATORS,
  ADICTIVE_OPERATORS,
  MULTIPLICATIVE_OPERATORS,
  SEMICOLON,
  OPEN_PARENTHESES,
  CLOSE_PARENTHESES,
  INTEGER,
  REAL,
  TRUE,
  FALSE,
  COMA,
  ELSE_CONDITIONAL,
  PROCEDURE,
  IF_CONDITIONAL,
  THEN,
  WHILE_LOOP,
  DO_LOOP,
  COLON,
  EQUALS,
  NOT,
} = require('../LanguageDictionary');
const logger = require('../../config/logger/signale');

let stack;

function factor() {
  if (stack.top().classification === VARIABLE) {
    stack.next();
    if (stack.top().token === OPEN_PARENTHESES) {
      stack.next();
      expressionList();
      if (stack.top().token === CLOSE_PARENTHESES) {
        stack.next();
      } else {
        logger.error(stack.top());
        throw new Error('');
      }
    }
  } else if (stack.top().classification === INTEGER) {
    stack.next();
  } else if (stack.top().classification === REAL) {
    stack.next();
  } else if (stack.top().token === TRUE) {
    stack.next();
  } else if (stack.top().token === FALSE) {
    stack.next();
  } else if (stack.top().token === OPEN_PARENTHESES) {
    stack.next();
    expression();
    if (stack.top().token === CLOSE_PARENTHESES) {
      stack.next();
    }
  } else if (stack.top().token === NOT) {
    stack.next();
    factor();
  }
}

function term() {
  factor();
  if (MULTIPLICATIVE_OPERATORS.includes(stack.top().token)) {
    stack.next();
    term();
  }
}

function simpleExpression() {
  term();
  if (SIGNALS.includes(stack.top().token)) {
    stack.next();
    term();
  }
  if (ADICTIVE_OPERATORS.includes(stack.top())) {
    stack.next();
    simpleExpression();
  }
}

function expression() {
  simpleExpression();

  if (RELATIONAL_OPERATORS.includes(stack.top().token)) {
    stack.next();
    simpleExpression();
  }
}

function expressionList() {
  expression();
  if (stack.top().token === COMA) {
    stack.next();
    expressionList();
  }
}

function procedureActivation() {
  if (stack.top().classification === VARIABLE) {
    stack.next();
    if (stack.top().token === OPEN_PARENTHESES) {
      stack.next();
      expressionList();
      if (stack.top().token === CLOSE_PARENTHESES) {
        stack.next();
      } else {
        logger.error(stack.top());
        throw new Error('missing close parentheses');
      }
    }
  }
}

function elsePart() {
  if (stack.top().token === ELSE_CONDITIONAL) {
    stack.next();
    command();
  }
}

function command() {
  if (stack.top().classification === VARIABLE) {
    stack.next();
    if (stack.top().token === COLON) {
      stack.next();
      if (stack.top().token === EQUALS) {
        stack.next();
        expression();
      }
    } else {
      logger.debug(stack.top());
      throw new Error('Wrong attribution');
    }
  } else if (stack.top().token === PROCEDURE) {
    stack.next();
    procedureActivation();
  } else if (stack.top().token === BEGIN) {
    compoundCommand(stack);
  } else if (stack.top().token === IF_CONDITIONAL) {
    expression();
    if (stack.top().token === THEN) {
      stack.next();
      command();
      elsePart();
    } else {
      logger.error(stack.top());
      throw new Error('Missing Then particle');
    }
  } else if (stack.top().token === WHILE_LOOP) {
    stack.next();
    expression();
    if (stack.top().token === DO_LOOP) {
      stack.next();
      command();
    } else {
      logger.error(stack.top());
      throw new Error('Missing DO particle');
    }
  }
}

function commandList() {
  command();
  if (stack.top().token === SEMICOLON) {
    stack.next();
    commandList();
  }
}

function optinalCommands() {
  if (stack.top().token !== END) {
    commandList();
  }
}

function compoundCommand(tokens) {
  stack = tokens;
  if (stack.top().token === BEGIN) {
    stack.next();
    optinalCommands();
    if (stack.top().token === END) {
      stack.next();
      return stack;
    }
    throw new Error(`Expected end at line ${stack.top().line}`);
  }
  return stack;
}

module.exports = compoundCommand;
