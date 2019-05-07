const chai = require('chai');

const expect = chai.expect;

describe('Button', () => {
    // Difficult to test other than on a device as root
    before(function() {
        this.skip();
    });

    it('setActiveLow', () => {
        const button = require('../modules/button');
        expect(button.activeLow()).to.be.true;
    });

    it('toggles off', () => {
        const button = require('../modules/button');
        button.watch(null, 0);
        expect(button.override).to.be.false;
    });

    it('toggles on', () => {
        const button = require('../modules/button');
        button.watch(null, 1);
        expect(button.override).to.be.true;
    });

    it('debounces', () => {
        const button = require('../modules/button');
        button.watch(null, 0);
        button.watch(null, 1);
        expect(button.override).to.be.false;
        this.timeout(1000);
        button.watch(null, 1);
        expect(button.override).to.be.true;
    });
});
