/**
 * @author Claudio Djohnnatha Duarte Lourenço <cdjohnnatha@gmail.com>
 */
const fs = require('fs');
const logger = require('../config/logger/signale');
const LanguageDictionary = require('../lib/LanguageDictionary');

const beginsWithNumberRegex = /(\s*)?^\d+/;
const beginsWithStringRegex = /(\s*)?^[a-z|A-Z]/;
const takeNumberRegex = /(\s*)?[+-]?\d+(\.\d+)?/;
const takeStringRegex = /(\s*)?\w+/;
const beginsWithSpecialCharacter = /(\s*)?^(\s*)?[.|,|;|:(=)?|==|>=|<=|<>|< >|+|-|*|/|(|)| or | and ]/;
const takeSpecialCharacter = /(\s*)?(\s*)?[.|,|;|:(=)?|:|==|>=|<=|<>|< >|+|-|*|\/|(|)| or | and ]/;
const begindAndEndQuotes = /{(.*)?}/;
const beginsWithQuotes = /^{/;
const endsWithQuotes = /(.*)?}/;
const betweenBeginQuotes = /^{(.*)?/;
const betweenEndQuotes = /(.*)?}/;
const allSpecialCharacters = /[^a-zA-Z0-9]/;
const barQuote = /^\/\/(.*)/;
const number3D = /^\d+(\.\d+)?x\d+(\.\d+)?y\d+(\.\d+)?z/;


/** Classificator regex */
const integerClassificator = /\d+/;
const delimitorClassificator = /[.|,|;|:|\(|\)]/;
const relationalOperatorClassificator = /[==|>=|<=|<>|< >|]/;
const realClassificator = /\d+\.\d+/;
const attributionClassificator = /:=/;
const aditionOperatorClassificator = /[+|-|or]/;
const timesOperatorClassificator = /[*|\/|and]/;
const stringClassificator = /^[a-z|A-Z]/;
const Stack = require('./stack');

const { Dictionary } = LanguageDictionary;
const {
  RESERVED_KEYWORD,
  NUMBER_3D,
  VARIABLE,
  REAL,
  DELIMITER,
  INTEGER,
  RELATIONAL_OPERATOR,
  ATTRIBUTION_CLASSIFICATOR,
  ADITION_OPERATOR,
  TIMES_OPERATOR,
  TRUE,
  FALSE,
  BOOLEAN,
} = LanguageDictionary;

/**
 * It will read the file and separate in tokens for classification.
 * @param {string} path - Path of file.
 */
async function Analyzer(path) {
  try {
    const pascalFile = fs.readFileSync(path, 'utf8').split('\n');
    let word = '';
    let extra = '';
    const words = [];
    const quotes = [];
    let openQuotes = 0;
    let errorLine = 0;
    await pascalFile.forEach((line, count) => {
      let tmp = line;
      while (tmp.length > 0) {
        tmp = tmp.trim();
        // console.log(tmp);
        if (barQuote.test(tmp)) {
          [extra] = barQuote.exec(tmp);
          quotes.push({ quote: extra, line: count + 1 });
          tmp = tmp.substring(0, tmp.indexOf('/'));
        }
        if (tmp.includes('{') && tmp.includes('}')) {
          [extra] = begindAndEndQuotes.exec(tmp);
          quotes.push({ quote: extra, line: count + 1 });
          tmp = tmp.substring(0, tmp.indexOf('{'));
        } else if (beginsWithQuotes.test(tmp) || endsWithQuotes.test(tmp)) {
          if (tmp.includes('{')) {
            [extra] = betweenBeginQuotes.exec(tmp);
            openQuotes += 1;
            errorLine = count;
          } else if (tmp.includes('}')) {
            [extra] = betweenEndQuotes.exec(tmp);
            openQuotes -= 1;
          }
          if (extra.length > 0) {
            quotes.push({ quote: extra, line: count + 1 });
            tmp = tmp.slice(extra.length);
          }
        } else if (number3D.test(tmp)) {
          [word] = number3D.exec(tmp);
          words.push({ piece: word, line: count + 1 });
          tmp = tmp.slice(word.length);
        } else {
          if (beginsWithStringRegex.test(tmp)) {
            [word] = takeStringRegex.exec(tmp);
            // console.log(word);
          } else if (beginsWithNumberRegex.test(tmp)) {
            [word] = takeNumberRegex.exec(tmp);
            // console.log(word);
          } else if (allSpecialCharacters.test(tmp)) {
            // console.log(word);
            if (beginsWithSpecialCharacter.test(tmp)) {
              [word] = takeSpecialCharacter.exec(tmp);
            } else {
              throw new Error(`It is not recognized char "${tmp}" at line number: ${count + 1}`);
            }
          }
          words.push({ token: word, line: count + 1 });
          tmp = tmp.slice(word.length);
        }
      }
    });
    if (openQuotes > 0) {
      throw new Error(`Not closed quote } at line: ${errorLine + 1}`);
    }
    words.forEach((element, count) => {
      const { token } = element;
      let classification = '';
      if (number3D.test(token)) {
        classification = NUMBER_3D;
      } else if (Dictionary.includes(token)) {
        classification = RESERVED_KEYWORD;
      } else if (stringClassificator.test(token)) {
        if (token === TRUE || token === FALSE) {
          classification = BOOLEAN;
        } else {
          classification = VARIABLE;
        }
      } else if (realClassificator.test(token)) {
        classification = REAL;
      } else if (delimitorClassificator.test(token)) {
        classification = DELIMITER;
      } else if (integerClassificator.test(token)) {
        classification = INTEGER;
      } else if (relationalOperatorClassificator.test(token)) {
        classification = RELATIONAL_OPERATOR;
      } else if (attributionClassificator.test(token)) {
        classification = ATTRIBUTION_CLASSIFICATOR;
      } else if (aditionOperatorClassificator.test(token)) {
        classification = ADITION_OPERATOR;
      } else if (timesOperatorClassificator.test(token)) {
        classification = TIMES_OPERATOR;
      }
      words[count].classification = classification;
    });
    // console.log(words);
    return new Stack({ tokens: words });
  } catch (e) {
    logger.error(e);
  }
}

module.exports = {
  Analyzer,
};
