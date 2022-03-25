const fs = require('fs'), 
{ promisify } = require('util'),
appendFile = promisify(fs.appendFile),
moment = require('moment');

module.exports.log = async (message, fileName) => {
  await appendFile(`./logger/logs/${fileName}.${moment().format('YYYY.MM.DD')}.log`, `${message.toString()}\n`);
}