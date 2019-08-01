// Lockfile remembers the last state regardless of network connection

const fs = require('fs');
const touch = require('touch');

const log = require('./logger.js').log;

const DEFAULT_PERSISTENT_DATA_PATH = '/data';
process.env.PREPHUB_LOCKFILE_PATH =
    process.env.PREPHUB_LOCKFILE_PATH || DEFAULT_PERSISTENT_DATA_PATH;

module.exports = {
    path: process.env.PREPHUB_LOCKFILE_PATH + '/PREPHUB_EMERGENCY',

    // Boolean on/off
    onOff: (value) => {
        if (value) {
            module.exports.toggle('EMERGENCY');
        } else {
            module.exports.toggle('NORMAL');
        }
    },

    // Toggle method with room to grow into multiple states
    // TODO Consider implementing a state per method as per fcservers.js
    toggle: (mode) => {
        switch (mode) {
            case 'EMERGENCY':
                touch.sync(module.exports.path);
                log.debug('Touched ' + module.exports.path);
                break;
            case 'NORMAL':
                if (fs.existsSync(module.exports.path)) {
                    fs.unlinkSync(module.exports.path);
                    log.debug('Unlinked ' + module.exports.path);
                }
                break;
            default:
                log.error(`Unknown mode "${mode}"!`);
                break;
        }
    },
};
