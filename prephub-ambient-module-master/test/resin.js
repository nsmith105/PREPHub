const expect = require('chai').expect;

const resin = require('../modules/resin');

// TODO Refactor to use chai-as-promised
describe('Resin.io Authenticate', () => {

    it('should authenticate with Resin.io when auth token is valid', async () => {
        // "test" token from the prephub@mit.edu Resin.io account
        // @see https://dashboard.resin.io/preferences/access-tokens
        // @see https://travis.mit.edu/urbanrisklab/prephub/settings
        const before = await resin.isAuthenticated();
        expect(before).to.be.false;
        await resin.authenticate();
        const after = await resin.isAuthenticated();
        expect(after).to.be.true;
    }).timeout('30s');

    /* TODO Is there a way to test this?
    it('should abort when no auth token', async () => {
        resin.logout();
        process.env.PREPHUB_RESIN_AUTH_TOKEN = null;
        const before = await resin.isAuthenticated();
        expect(before).to.be.false;
        await resin.authenticate();
        const after = await resin.isAuthenticated();
        expect(after).to.be.false;
    });
    */

    it('should fail to authenticate with Resin.io when auth token is wrong', async () => {
        resin.logout();
        process.env.PREPHUB_RESIN_AUTH_TOKEN = 'foo';
        const before = await resin.isAuthenticated();
        expect(before).to.be.false;
        await resin.authenticate();
        const after = await resin.isAuthenticated();
        expect(after).to.be.false;
    }).timeout('30s');
});
