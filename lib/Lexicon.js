/**
 * @author Claudio Djohnnatha Duarte Lourenço <cdjohnnatha@gmail.com>
 */
const fs = require('fs');
const LanguageDictionary = require('../lib/LanguageDictionary');

const beginsWithNumberRegex = /(\s*)?^[0-9].+$/;
const beginsWithStringRegex = /(\s*)?^[a-z|A-Z]/;
const takeNumberRegex = /(\s*)?[+-]?\d+(\.\d+)?/;
const takeStringRegex = /(\s*)?\w+/;
const beginsWithSpecialCharacter = /(\s*)?^(\s*)?[.|,|;|:(=)?|==|>=|<=|<>|< >|+|-|*|/|(|)| or | and ]/;
const takeSpecialCharacter = /(\s*)?(\s*)?[.|,|;|:(=)?|==|>=|<=|<>|< >|+|-|*|/|(|)| or | and ]/;
const begindAndEndQuotes = /{(.*)?}/;
const beginsWithQuotes = /^{/;
const endsWithQuotes = /(.*)?}/;
const betweenBeginQuotes = /^{(.*)?/;
const betweenEndQuotes = /(.*)?}/;
const allSpecialCharacters = /[^a-zA-Z0-9]/;

/** Classificator regex */
const integerClassificator = /\d+/;
const delimitorClassificator = /[.|,|;|:|\(|\)]/;
const relationalOperatorClassificator = /[==|>=|<=|<>|< >|]/;
const realClassificator = /\d+\.\d+/;
const attributionClassificator = /:=/;
const aditionOperatorClassificator = /[+|-|or]/;
const timesOperatorClassificator = /[*|\/|and]/;
const stringClassificator = /^[a-z|A-Z]/;
/**
 * It will read the file and separate in tokens for classification.
 * @param {string} path - Path of file.
 */
async function Analyzer(path) {
  try {
    const pascalFile = fs.readFileSync(path, 'utf8').split('\n');
    let word = '';
    let quoteWords = '';
    let extra = '';
    const words = [];
    const quotes = [];
    let openQuotes = 0;
    let errorLine = 0;
    await pascalFile.forEach((line, count) => {
      let tmp = line;
      while (tmp.length > 0) {
        tmp = tmp.trim();
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
        } else {
          if (beginsWithStringRegex.test(tmp)) {
            [word] = takeStringRegex.exec(tmp);
          } else if (beginsWithNumberRegex.test(tmp)) {
            [word] = takeNumberRegex.exec(tmp);
          } else if (allSpecialCharacters.test(tmp)) {
            if (beginsWithSpecialCharacter.test(tmp)) {
              [word] = takeSpecialCharacter.exec(tmp);
            } else {
              throw new Error(`It is not recognized char "${tmp}" at line number: ${count + 1}`);
            }
          }
          words.push({ piece: word, line: count + 1 });
          tmp = tmp.slice(word.length);
        }
      }
    });
    if (openQuotes > 0) {
      throw new Error(`Not closed quote } at line: ${errorLine + 1}`);
    }
    words.forEach((element, count) => {
      let classification = '';
      if (LanguageDictionary.includes(element.piece)) {
        classification = 'reserved keywords';
      } else if (stringClassificator.test(element.piece)) {
        classification = 'variable';
      } else if (realClassificator.test(element.piece)) {
        classification = 'real';
      } else if (delimitorClassificator.test(element.piece)) {
        classification = 'delimiter';
      } else if (integerClassificator.test(element.piece)) {
        classification = 'integer';
      } else if (relationalOperatorClassificator.test(element.piece)) {
        classification = 'relational operator';
      } else if (attributionClassificator.test(element.piece)) {
        classification = 'attribution classificator';
      } else if (aditionOperatorClassificator.test(element.piece)) {
        classification = 'adition operator';
      } else if (timesOperatorClassificator.test(element.piece)) {
        classification = 'times operator';
      }
      words[count].classification = classification;
    });
    console.log(words);
    console.log(quotes);
  } catch (e) {
    console.log(e);
  }
}

module.exports = {
  Analyzer,
};


// [...line].forEach((char) => {
//   if (char !== ' ') {
//     if (char === ';' || char === ':' || char === ',') {
//       specialCharacter.push({ special: char, line: count });
//     } else if (typeof char === 'string') {
//       word = `${word}${char}`;
//     }
//   } else if (char === ' ' && word !== '') {
//     words.push({ word: word, line: count});
//     word = '';
//   }
// });
