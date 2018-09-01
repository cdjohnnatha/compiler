const path = require('path');
const lexicon = require('../lib/Lexicon');

test('test Lexicon', () => {
  const filePath = path.join(__dirname, './', '/support/pascalFile.in');
  lexicon.Analyzer(filePath);
});
