#!/usr/bin/env python

#Open Pixel Control client: All lights to solid white

import opc, time

numLEDs = 512
client = opc.Client('localhost:7890')

black = [ (0,0,0) ] * numLEDs
red = [ (255,0,0) ] * numLEDs

# Fade to white
# when AWS is up we need to change while True to while(STATE) or else lights will not change without keyboard interrupt 
while True:
	client.put_pixels(red)
	time.sleep(1)
	client.put_pixels(black)
	time.sleep(1)
