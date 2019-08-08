// Very simple toggle switch using GPIO pins

const log = require('./logger.js').log;

const fcservers = require('./fcservers');
const lockfile = require('./lockfile');
const resin = require('./resin');

const Gpio = require('onoff').Gpio;

const button = new Gpio(2, 'in', 'both', {debounceTimeout: 10});
button.setActiveLow(true);

button.watch((error, value) => {
    log.info('Override switch set to ' + value);
    module.exports.override = value;

    // Create or remove lockfile
    lockfile.onOff(value);

    // Although the lockfile change will update lights after a few seconds,
    // update lights immediately to improve responsiveness
    fcservers.onOff(value);

    // Update application "mode" tag in Resin.io so that dashboard reflects
    // the new mode. Note that module.exports.application id is set via app.js
    resin.setModeOnOff(module.exports.application, value);
});
