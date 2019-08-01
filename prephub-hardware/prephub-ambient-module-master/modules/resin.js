// Resin.io SDK
const resin = require('resin-sdk')({apiUrl: 'https://api.resin.io/'});

const log = require('./logger.js').log;

module.exports = {
    authenticate: async () => {
        // Abort if no auth token
        if (!process.env.PREPHUB_RESIN_AUTH_TOKEN) {
            return false;
        }

        // Authenticate with Resin.io using permanent token
        let authCount = 0;
        log.debug('SSL certificate validation may fail if clock not synchronized. Will retry Resin.io authentication until success.');
        let authenticated = false;
        while (!authenticated && authCount++ < 5) {
            // Initial pause gives clock time to sync
            log.debug(`Pausing for five seconds before Resin.io authentication attempt #${authCount}`);
            await new Promise(resolve => setTimeout(resolve, 5000));
            try {
                await resin.auth.loginWithToken(process.env.PREPHUB_RESIN_AUTH_TOKEN);
                authenticated = await module.exports.isAuthenticated();
            } catch (error) {
                log.warn(error);
            }
        }
    },

    isAuthenticated: async () => {
        return await resin.auth.isLoggedIn();
    },

    device: async () => {
        let device = await resin.models.device.get(process.env.RESIN_DEVICE_UUID);
        device.application = await resin.models.device.getApplicationName(device.id);
        return device;
    },

    // Get mode for the given PREPHub "application" in Resin.io
    getMode: async (application) => {
        let tags = [];
        try {
            tags = await resin.models.application.tags.getAllByApplication(application);
        } catch (error) {
            log.error(error);
            return;
        }
        for (let tag of tags) {
            if ('mode' == tag.tag_key && 'EMERGENCY' == tag.value) {
                return 'EMERGENCY';
            }
        }
        return 'NORMAL';
    },

    // Set mode for the given PREPHub "application" in Resin.io
    setMode: async (application, mode) => {
        resin.models.application.tags.set(application, 'mode', mode);
    },

    // Set to 'EMERGENCY' or 'NORMAL' depending on boolean value
    setModeOnOff: async (application, value) => {
        let mode = (value ? 'EMERGENCY' : 'NORMAL');
        module.exports.setMode(application, mode);
    },

    logout: async () => {
        return await resin.auth.logout()
    }
};

