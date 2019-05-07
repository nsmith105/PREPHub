const expect = require('chai').expect;

const stdout = require('test-console').stdout;
const log = require('../modules/logger').log;

describe('Log utility', () => {
    it('should not fail if no default directory', () => {
        // Default is '/data/log' but may not exist
        expect(process.env.PREPHUB_LOG_PATH).to.equal('/data/log');
        let output = stdout.inspectSync(() => log.info('foo'));
        expect(output[0]).to.have.string('INFO');
        expect(output[0]).to.have.string('foo');

        // Try a dir that definitely does not exist
        process.env.PREPHUB_LOG_PATH = 'nonesuchpath'
        expect(process.env.PREPHUB_LOG_PATH).to.equal('nonesuchpath');
        output = stdout.inspectSync(() => log.info('foo'));
        expect(output[0]).to.have.string('INFO');
        expect(output[0]).to.have.string('foo');
    });

    it('should output errors', () => {
        const output = stdout.inspectSync(() => log.error('foo'));
        expect(output[0]).to.have.string('ERROR');
        expect(output[0]).to.have.string('foo');
    });

    it('should output warnings', () => {
        const output = stdout.inspectSync(() => log.warn('foo'));
        expect(output[0]).to.have.string('WARN');
        expect(output[0]).to.have.string('foo');
    });

    it('should output debug', () => {
        const output = stdout.inspectSync(() => log.debug('foo'));
        expect(output[0]).to.have.string('DEBUG');
        expect(output[0]).to.have.string('foo');
    });

    it('should output trace', () => {
        const output = stdout.inspectSync(() => log.trace('foo'));
        expect(output[0]).to.have.string('TRACE');
        expect(output[0]).to.have.string('foo');
    });
});
