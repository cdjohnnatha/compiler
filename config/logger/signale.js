const signale = require('signale');

const setup = {
  displayFilename: true,
  displayTimestamp: true,
  displayDate: false,
};

signale.config(setup);

module.exports = signale;
