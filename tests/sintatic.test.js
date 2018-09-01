const path = require('path');
const sintatic = require('../lib/Syntactic/sintatic');

test('test Lexicon', async () => {
  const filePath = path.join(__dirname, './', '/support/pascalFile.in');
  sintatic.Analyzer(filePath);
});
