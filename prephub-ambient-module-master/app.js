/**
 * Simple light module with two modes:
 *
 * 1. Weather mode during normal usage
 * 2. Emergency mode in the event of an emergency
 *
 * Weather mode alternates colors between the daily high and low for the
 * current geolocation.
 */

// Environment
require('dotenv').config();
require('checkenv').check();

// Abort if not running in an environment configured for Resin.io
if (!process.env.RESIN_DEVICE_UUID) {
    console.error('Resin environmental variables not found. Aborting.');
    process.exit(1);
}

// Libs
const colormap = require('colormap');
const fs = require('fs');
const rangeMap = require('range-map');
const timestring = require('timestring');

// Load colormap definition from colormap.json
// See https://github.com/bpostlethwaite/colormap for options
const colorsJSON = JSON.parse(fs.readFileSync(__dirname + '/colormap.json'));
const colors = colormap(colorsJSON);

// Device logs
const log = require('./modules/logger').log;

// Custom modules
const button = require('./modules/button');        // Override button
const fcservers = require("./modules/fcservers");  // Fadecandy servers
const lockfile = require('./modules/lockfile');    // Lockfile
const resin = require('./modules/resin');          // Resin
const weather = require('./modules/weather');      // Weather lookup

let temperature = null;

// Scan network
fcservers.scanner();

// Watch for lockfile
fs.watchFile(lockfile.path, async () => {
    // If the lockfile exists, emergency
    if (fs.existsSync(lockfile.path)) {
        fcservers.emergency();

        // Update Resin.io tag in the event that it is not in-sync with the
        // the lockfile
        resin.setModeOnOff(true);
    }
});

(async () => {
    // Device details, including location
    log.debug('Authenticating with Resin.io');
    await resin.authenticate();
    log.debug('Retrieving details about device');
    const device = await resin.device();
    log.debug(device);

    // Let the button monitor know our application id
    // TODO Is there a cleaner way to do this?
    log.debug('Configuring override button');
    button.application = device.application;

    let location = process.env.PREPHUB_LOCATION;
    if (!location) {
        location = device.location;
    }

    // Scan local network for fcservers
    log.debug('Scanning local network');
    await fcservers.scan();

    // Reset NeoPixels in case they are stuck on random values
    fcservers.allOff();

    const delay = '10 seconds';
    log.debug('Polling Resin.io tags every', delay);

    setInterval(async () => {
        // Skip if manual override is active
        if (button.override) {
            log.debug('Skipping Resin.io polling and weather lookup while in override mode');
        }

        // Turn off all LEDs before toggling modes
        fcservers.allOff();

        // Update mode from Resin.io tag
        const mode = await resin.getMode(device.application);
        lockfile.toggle(mode);

        // Color corresponding to the current temperature
        // TODO Clean up the interface to toggle between high and low
        temperature = await weather.forecast(location, temperature);
        if (temperature) {
            const mappedTemperature = rangeMap(temperature, -10, 40, 0, 100)
            fcservers.flash(colors[mappedTemperature]);
        }
    }, timestring(delay, 'ms'));

})().catch(error => { log.error(error); });
