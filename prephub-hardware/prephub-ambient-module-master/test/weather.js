const expect = require('chai').expect;

const weather = require('../modules/weather');

describe('Yahoo! Weather lookup', () => {
    it('should eventually return temperature data for a simple address', async () => {
        const temperature = await weather.forecast('Cambridge, MA');
        expect(parseInt(temperature)).to.be.a('number');
    });
});
