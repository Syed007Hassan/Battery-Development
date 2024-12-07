const morgan = require('morgan');
const logger = require('../config/logger');

// Create a custom Morgan format
const morganFormat = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms';

// Create stream object with 'write' function for Morgan
const stream = {
  write: (message) => logger.info(message.trim())
};

// Export middleware
module.exports = morgan(morganFormat, { stream }); 