## Ambient

PREPHub "Ambient" Module

> Named in homage to Dr. Hiroshi Ishii's [Ambient Devices](https://en.wikipedia.org/wiki/Ambient_Devices) 

PREPHub LED control.  Display temperature low and high for the following day when in "NORMAL" mode;
deep red when in "EMERGENCY" mode.

Temperature data is sourced from [Yahoo! Weather](https://www.yahoo.com/news/weather).

[arp-scan](https://linux.die.net/man/1/arp-scan) is a standard Un*x command for 
system discovery and fingerprinting, capable of discovering all hosts on a local
network.

A version of arp-scan for Windows can be found can be found at [GitHub](https://github.com/QbsuranAlang/arp-scan-windows-).

## Configuration

If Resin.io has trouble geolocating a device, override the location via the `PREPHUB_LOCATION` device service variable.

See `env.json` for all other configuration environmental variables.

## Fadecandy NeoPixels

Lights are Adafruit [NeoPixels](https://learn.adafruit.com/adafruit-neopixel-uberguide/the-magic-of-neopixels)
controlled via [Fadecandy](https://www.adafruit.com/product/1689), a dithering USB driver.

In general, factory default Fadecandys should "just work".  See the [Fadecandy repository on GitHub for firmware](https://github.com/scanlime/fadecandy/tree/master/bin) 
if flashing is required.

### Connectivity

There are a number of options available for controlling the Fadecandy LED strips:

* [fcserver](https://github.com/scanlime/fadecandy):
  "Official" Fadecandy server listening on post 7890 of the local loopback interface
* [node-opc](https://github.com/parshap/js-opc):
  Socket-based alternative client to the simple client supplied by Fadecandy
* [node-pixel](https://github.com/ajfisher/node-pixel):
  Johnny-Five or stock Node Firmata for use with various Arduino boards.  &#9760; **Unstable**

After some initial research fcserver was determined to be the easiest to implement as well as being reliable and
portable.

### Power Considerations

One 2-meter strips can hold 60 NeoPixels. 60 NeoPixels × 60 milliamps = 3,600 
milliamps ... 3.6 Amps! LEDs are efficient, however many LEDs still use a lot 
of current.

Multiply the above by 24 strips = 86.4 Amps at 5 Volts. By comparison, the
power brick for a phone charger might provide maximum 1~2 Amps.

Consider oversizing the power supply; use one with a higher amperage rating
than required by the total deployed LEDs. Do not exceed five volts.

## Mode Toggle

Ensuring that the PREPHub toggles from one mode to another is challenging for a few reasons:

1. State needs to be retained even if the PREPHub cycles power
2. Direct secure communication with specific Resin.io devices is difficult to establish and maintain

### 1. State

To ensure that state is maintained even in the even that devices in the PREPHub are rebooted, either directly or 
due to power loss, when in "EMERGENCY" mode we maintain a zero byte lock file in the permanent `/data` directory:

    /data/PREPHUB_EMERGENCY

Software on the device monitors `/data` for this file and immediately changes color to "emergency red" when
the file is present.

Clicking on the emergency override button creates or removes this file accordingly.  The override button takes
precedence over network settings described below.

### 2. Network

Establishing a secure connection with the appropriate "ambient" controlling device inside the Resin.io network
is non-trivial and somewhat unreliable.

Instead we leverage Resin.io's [tag feature](https://docs.resin.io/reference/sdk/node-sdk/#resin.models.application.tags) 
to set a tag against the "application" corresponding with the PREPHub in Resin.io.  The "ambient" device polls 
Resin.io for `mode == "EMERGENCY"` every thirty seconds and toggles the lockfile accordingly.  In this way the device
need only connect securely to the local Resin.io network.

In the future it may be possible to establish a socket connection directly with the appropriate device and change
modes instantaneously.

### Troubleshooting

#### arp-scan takes a long time

arp-scans against a simple routes should be relatively fast. If scans seem to be taking unusually long, make sure that
`wlan0` or another adapter is not open.

For example, arp-scanning the "MIT GUEST" network results in he discovery of hundreds of hosts which can take several
minutes to complete.

#### Geolocatin Incorrect

Override the location via the `PREPHUB_LOCATION` device service variable.

#### Lights don't activate

There are a number of reasons that the Fadecandy LEDs may not activate.

Use the "prize" lighting as a good initial test is to see if the LEDs will cycle colors.
Login to the problematic device and run the following command:

`# root@3e6dfbd:/usr/src/app# node modules/cyclist/colorwheel.js rainbow`

#### Fade transitions don't work

Transitions are handled by Fadecandy itself.  When a Fadecany receives one signal and then, after a period of time,
another.. it will transition gracefully per settings given to `fcserver`.  If, however, the Fadecandy receives multiple
signals in sequence, it will immediately update to the most recently received color, ignoring transition settings.

Check to make sure that multiple IP addresses are not active on a device (for example both `eht0` and `wlan0`).
If multiple IP addresses are open, then the controlling "ambient" device may broadcast to all available addresses; the
Fadecandy would interpret these broadcasts to be in sequence from the same source causing transitions to be
ignored.


