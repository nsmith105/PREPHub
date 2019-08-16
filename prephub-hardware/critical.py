#
#/usr/bin/env python

# Open Pixel Control client: All lights to solid white

import opc, time


def warning():

    client = opc.Client('localhost:7890')
    numLEDs = 512
    red = [ (255,0,0) ] * numLEDs

    black = [ (0,0,0) ] * numLEDs
    
    client.put_pixels(black)
    time.sleep(0.5)
    client.put_pixels(red)
    time.sleep(0.5)

def off():
    black = [ (0,0,0) ] * numLEDs
    red = [ (255,0,0) ] * numLEDs
    time.sleep(0.5)
    client.put_pixels(black)
    time.sleep(0.5)
    client.put_pixels(black)
    time.sleep(0.5)
