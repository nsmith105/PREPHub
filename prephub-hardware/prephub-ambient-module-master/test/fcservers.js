const chai = require('chai');
const expect = chai.expect;

const stdout = require('test-console').stdout;

const fcservers = require('../modules/fcservers');

describe('fcservers', () => {
    it('contains map of fcservers', () => {
        expect(fcservers.fcservers).to.be.a('Map');
    });
    it('is configured to default host and port', () => {
        for (let opc of fcservers.fcservers.values()) {
            expect(opc.host).to.equal('localhost');
            expect(opc.port).to.equal(7890);
        }
    });
    it('ignores empty colors', () => {
        const output = stdout.inspectSync(() => fcservers.flash(null));
        expect(output[0]).to.have.string('Undefined color');
    });
    it('turns off all leds', () => {
        fcservers.allOff();
        for (let opc of fcservers.fcservers.values()) {
            // First LED appears to be a control LED of sorts.. ignore
            for (let i = 4; i < opc.pixelBuffer.length - 3; i += 3) {
                expect(opc.pixelBuffer[i]).to.equal(0);
                expect(opc.pixelBuffer[i+1]).to.equal(0);
                expect(opc.pixelBuffer[i+2]).to.equal(0);
            }
        }
    });
    it('turns all leds red', () => {
        fcservers.emergency();
        for (let opc of fcservers.fcservers.values()) {
            // First LED appears to be a control LED of sorts.. ignore
            for (let i = 4; i < opc.pixelBuffer.length; i += 3) {
                expect(opc.pixelBuffer[i]).to.equal(255);
                expect(opc.pixelBuffer[i+1]).to.equal(0);
                expect(opc.pixelBuffer[i+2]).to.equal(0);
            }
        }
    });
});

