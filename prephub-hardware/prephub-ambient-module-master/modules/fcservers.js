// Scan network for Fadecandy servers

const arpScan = require('arpscan/promise');
const portCheck = require('is-port-reachable');
const timestring = require('timestring');

const log = require('./logger.js').log;

const OPC = require('../../opc');

const fcservers = new Map();

// Default Fadecandy port
const DEFAULT_FADECANDY_PORT = 7890;
const port = parseInt(process.env.PREPHUB_FADECANDY_PORT || DEFAULT_FADECANDY_PORT);

// Default hosts if defined
if (process.env.PREPHUB_FADECANDY_HOSTS) {
    let hosts = JSON.parse(process.env.PREPHUB_FADECANDY_HOSTS);
    log.debug('Configuring default hosts: ' + hosts);
    for (let host of hosts) {
        let opc = new OPC(host, port);
        fcservers.set(host, opc);
    }
}

// arp-scan will not include the current machine so add localhost as default
fcservers.set('localhost', new OPC('localhost', port));

module.exports = {
    fcservers,

    allOff: () => {
        // Initial reset
        module.exports.force([0, 0, 0]);
    },

    // Boolean on/off
    onOff: (value) => {
        if (value) {
            module.exports.emergency();
        } else {
            module.exports.allOff();
        }
    },

    emergency: () => {
        module.exports.force([255, 0, 0]);
    },

    flash: (color) => {
        if (!color) {
            log.warn('Undefined color');
            return;
        }

        log.debug(`Flashing LEDs ${color}`);
        // First update all fcservers
        for (let opc of fcservers.values()) {
            //log.trace(opc);
            for (let i = 0; i < 512; i++) {
                opc.setPixel(i, color[0], color[1], color[2]);
            }
        }
        // Then write all at once to reduce latency
        for (let opc of fcservers.values()) {
            opc.writePixels();
        }
    },

    // Fadecandy can be finicky.. Flash a couple of times to make sure we force a color.
    // Transitions will be cut off.
    force: (color) => {
        module.exports.flash(color);
        setTimeout(() => { module.exports.flash(color); }, 1);
    },

    scan: async () => {
        let hosts = [];
        try {
            hosts = await arpScan({interface: 'eth0'});
            // let hosts = [{mac: 'abc', ip: '123'}, {mac: 'efg', ip: '456'}]

            // Purge fcservers that are no longer in the arp table
            for (let [key, fcserver] of fcservers) {
                if ('localhost' === fcserver.host) {
                    continue;
                }
                if (hosts.find((host) => host.ip === fcserver.host)) {
                    continue;
                }
                log.warn('Purging unseen fcserver: ' + fcserver.host);
                fcservers.delete(key);
            }
        } catch (error) {
            log.error('ARP host lookup failed. Is arp-scan installed?');
            log.debug(error);
        }

        try {
            // Add/update reachable hosts
            for (let i = 0; i < hosts.length; i++) {
                const host = hosts[i];
                // Can we actually ping the port?
                const reachable = await portCheck(port, {host: host.ip});
                // If not, remove from the list
                if (!reachable) {
                    log.warn('Cannot reach host: ' + host.ip);
                    //delete hosts[i]; // Remove unreachable hosts
                    //hosts = hosts.filter(Boolean); // Filter out holes in array
                } else {
                    //log.debug('Host reachable!');
                    log.debug(host);
                    // If we can reach the host, add or update record in list
                    if (fcservers.has(host.mac)) {
                        log.warn('Multiple ip addresses associated with mac address');
                        // Update ip address in case it changes
                        //fcservers.get(host.mac).host = host.ip;
                    } else {
                        log.debug('Inserting record');
                        // Unknown mac address.. add a new server
                        fcservers.set(host.mac, new OPC(host.ip, port));
                    }
                }
            }
        } catch (error) {
            log.error('Port test failed');
            log.debug(error);
        }

        // Log known servers
        log.trace('Fadecandy servers:');
        fcservers.forEach((opc, key) => log.trace(`${key} ${opc.host}`));
    },

    // Periodically re-scan network
    scanner: () => {
        delay = '60 seconds';
        log.debug('Re-scanning network every', delay);
        setInterval(() => {
            log.debug('Scanning network');
            module.exports.scan();
        }, timestring(delay, 'ms'));
    }
};
