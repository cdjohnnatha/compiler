/**
 * @author Claudio Djohnnatha Duarte Lourenço <cdjohnnatha@gmail.com>
*/
import logger from '../../config/logger/signale';
import lexicon from '../lexicon';
import subprogramsDeclaration from './subprograms-declarations';

import {
  PROGRAM,
  RESERVED_KEYWORD,
  VARIABLE,
  DELIMITER,
  SEMICOLON,
} from '../LanguageDictionary';

const { DOT } = require('../LanguageDictionary');

let stack;

function programId() {
  if (stack.top().token === PROGRAM) {
    stack.next();
    if (stack.top().classification === VARIABLE) {
      stack.next();
      if (stack.top().token === SEMICOLON) {
        stack.next();
        return;
      }
      logger.error(stack.top());
      throw Error(`Missing ; at line ${stack.top().line}`);
    }
    logger.error(stack.top());
    throw Error('Not found program id');
  } else {
    logger.error(stack.top());
    throw Error('Not found reserved word program');
  }
}

async function Analyzer(path) {
  try {
    stack = await lexicon.Analyzer(path);
    programId();
    stack = subprogramsDeclaration(stack);
    logger.debug(stack.top());
  } catch (error) {
    logger.error(error);
  }
}

module.exports = {
  Analyzer,
};
