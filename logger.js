const fs = require('fs'),
    winston = require("winston"),
    {createLogger, format, transports} = winston;
// dateformat = require("dateformat"),
// chalk = require("chalk");

module.exports = createLogger({
    transports: [
        new transports.Console({
            format: format.combine(
                format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
                format.json(),
                format.prettyPrint(),
                format.colorize({all: true}),
                format.simple(),
            )
        }),
        new transports.Stream({
            stream: fs.createWriteStream('./example.log')
        })
    ]
});