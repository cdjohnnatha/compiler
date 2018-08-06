const path = require('path');
const Lexicon = require('../lib/Lexicon');

test('test Lexicon', () => {
  const filePath = path.join(__dirname, './', '/support/pascalFile.in');
  Lexicon.Analyzer(filePath);
});
