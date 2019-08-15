#
#/usr/bin/env python

# Open Pixel Control client: All lights to solid white

import opc, time

numLEDs = 512
client = opc.Client('localhost:7890')

def warning():
    print("Critical-Red Emergency")
    black = [ (0,0,0) ] * numLEDs
    red = [ (255,0,0) ] * numLEDs

    client.put_pixels(red)
    time.sleep(1)

def off():
    black = [ (0,0,0) ] * numLEDs
    client.put_pixels(black)
