const chai = require('chai');

const expect = chai.expect;

const fs = require('fs');
const lockfile = require('../modules/lockfile');

describe('Lockfile', () => {
    it('has a default lockfile path', () => {
        expect(process.env.PREPHUB_LOCKFILE_PATH).to.equal('/data');
        expect(lockfile.path).to.equal('/data/PREPHUB_EMERGENCY');
    });

    it('toggles actual lockfile', () => {
        // Change to local directory
        lockfile.path = './PREPHUB_EMERGENCY';
        expect(lockfile.path).to.equal('./PREPHUB_EMERGENCY');

        // No lockfile yet
        expect(fs.existsSync(lockfile.path)).to.be.false;

        // Still no lockfile
        lockfile.toggle('NORMAL');
        expect(fs.existsSync(lockfile.path)).to.be.false;

        // Now create the lockfile
        lockfile.toggle('EMERGENCY');
        expect(fs.existsSync(lockfile.path)).to.be.true;

        // Remove the lockfile
        lockfile.toggle('NORMAL');
        expect(fs.existsSync(lockfile.path)).to.be.false;
     });

    it('toggles lockfile via boolean value', () => {
        // Change to local directory
        lockfile.path = './PREPHUB_EMERGENCY';
        expect(lockfile.path).to.equal('./PREPHUB_EMERGENCY');

        // No lockfile
        expect(fs.existsSync(lockfile.path)).to.be.false;

        // Lockfile created
        lockfile.onOff(true);
        expect(fs.existsSync(lockfile.path)).to.be.true;

        // Lockfile removed
        lockfile.onOff(0);
        expect(fs.existsSync(lockfile.path)).to.be.false;
    });

    it('logs error of unknown modes', () => {
        const stdout = require('test-console').stdout;
        const output = stdout.inspectSync(() => lockfile.toggle('FOO'));
        expect(output[0]).to.have.string('ERROR');
        expect(output[0]).to.have.string('Unknown mode "FOO"!');
    });
});
