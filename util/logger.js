const winston = require('winston');
//winston.emitErrs = true;

var loggerLevel = process.env.LOGGER_LEVEL || "info" || "debug";

var logger = winston.createLogger( {
    transports: [
    new winston.transports.File({
        filename:'errors.log',
        level:'error'
    }),
    new winston.transports.Console({
        level:loggerLevel
    })
]
});

module.exports = logger;