const weather = require('yahoo-weather');

const log = require('./logger.js').log;

module.exports = {
    forecast: async (address, temperature) => {
        const data = await weather(address);
        if (!data) {
            log.error('Failed to retrieve weather data for address: ' + address);
            return;
        }

        // Build console output
        const conditions = '[' + data.item.title + ']';
        const forecast = data.item.forecast[1];  // Following day forecast
        let info = conditions + ' Current: ' + temperature;
        info += ', Low: ' + forecast.low;
        info += ', High: ' + forecast.high;

        // Toggle between low and high values
        temperature = (temperature === forecast.low) ? forecast.high : forecast.low;

        info += ', Showing: ' + temperature;

        // Log to a new line
        log.debug(info);

        // TODO Refactor to always be an integer rather than a string?
        return temperature;
    },
};
