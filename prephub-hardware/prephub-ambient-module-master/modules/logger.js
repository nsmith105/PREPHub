// Logger singleton
// "prephub" data logs to console and file
// "resin" data logs to stdout visible in the Resin.io dashboard

const fs = require('fs');
const bunyan = require('bunyan');
const format = require('bunyan-format');
const stream = format({outputMode: 'short'});

const obj = {};

const DEFAULT_PERSISTENT_LOG_PATH = '/data/log';
process.env.PREPHUB_LOG_PATH = process.env.PREPHUB_LOG_PATH || DEFAULT_PERSISTENT_LOG_PATH;

if (!obj.log) {
    obj.log = bunyan.createLogger({
        name: 'ambient',
        streams: [
            {name: 'resin', level: 'trace', stream: stream},
        ],
    });

    // TODO Can we simplify this conditional?
    if (!fs.existsSync(process.env.PREPHUB_LOG_PATH)) {
        // Resin logs to "short" if no save path
        obj.log.addStream({
            name: 'prephub',
            level: 'info',
            stream: stream
        });
    } else {
        // Otherwise save to file
        obj.log.addStream({
            name: 'prephub',
            level: 'info',
            path: process.env.PREPHUB_LOG_PATH + '/ambient.log'
        });
    }
}
module.exports = obj;
