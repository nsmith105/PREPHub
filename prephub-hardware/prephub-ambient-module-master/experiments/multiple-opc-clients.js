const OPC = require('../opc');

PIXEL_COUNT = 512;

let client1 = new OPC('127.0.0.1', 7890);
let client2 = new OPC('192.168.1.148', 7890);

function reset(client, intensity) {
    for (let i = 0; i < PIXEL_COUNT; i++) {
        client.setPixel(i, intensity, intensity, intensity);
    }
}

setInterval(() => {
    let color = Math.floor(Math.random() * Math.floor(255));
    console.log(color);
    reset(client1, color);
    reset(client2, color);

    client1.writePixels();
    client2.writePixels();

}, 1000);
