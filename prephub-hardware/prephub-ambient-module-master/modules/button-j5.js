// Toggle switch using Johnny-Five and StandardFirmataPlus

const five = require('johnny-five');
const board = new five.Board({repl: false});

const log = require('./logger.js').log;

const fcservers = require('./fcservers');
const lockfile = require('./lockfile');

module.exports = {override: false};

// Monitor Firmata. (Make sure StandardFirmataPlus is installed on the sensor!)
board.on('ready', () => {
    const led = new five.Led(13);
    const button = new five.Switch(10);

    button.on('open', () => {
        module.exports.override = false;
        led.off();
        lockfile.toggle('NORMAL');
        fcservers.allOff();
        log.info('Override not active');
    });

    button.on('close', () => {
        module.exports.override = true;
        led.on();
        lockfile.toggle('EMERGENCY');
        fcservers.emergency();
        log.info('EMERGENCY mode override activated');
    });
});

