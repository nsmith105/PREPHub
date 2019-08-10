#
#/usr/bin/env python

# Open Pixel Control client: All lights to solid white

import opc, time

numLEDs = 512
client = opc.Client('localhost:7890')

def warning():

    black = [ (0,0,0) ] * numLEDs
    red = [ (255,0,0) ] * numLEDs

    while True:
        client.put_pixels(red)
        time.sleep(0.1)
        client.put_pixels(black)
        time.sleep(0.1)

def off():
    black = [ (0,0,0) ] * numLEDs
    client.put_pixels(black)
