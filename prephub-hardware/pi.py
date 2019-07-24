import socketio
import opc, time
import json



# Initiate socket client
socket = socketio.Client()

# Initiate socket client for fadecandy server (little chip netween Led strip and Pi
fade_client = opc.Client('localhost:7890')
numLEDs = 512

# Socket event handlers

# connect to serve
@socket.on('connect', namespace='/pi')
def handle_connect():
    print('Connection to server established')

# on `send command` from server parse 
# `data` sent from server
# parse json to retieve value element of data
# which is the color to change the LED lights
@socket.on('send command', namespace='/pi')
def handle_change_lights(data):
    color = json.dumps(data['value'])
    print('Received request from server: ' + data['value'])
    
    if color == '"White"':
        white()
    if color == '"Green"':
        green()
    if color == '"Red"':
        red()
    if color == '"Blue"':
        blue()
    if color == '"Black"':
        black() 
  
    # sends msg back to server stating command was executed
    socket.emit('send command confirm', data, namespace='/pi')

@socket.on('disconnect', namespace='/pi')   
def handle_disconnect():
    print('disconnected from server')

# Establish connection to server
socket.connect('https://prephub-web.appspot.com/', namespaces=['/pi'])

#the following functions are the color presets 
def white():
    print("In white function\n")

    black = [ (0,0,0) ] * numLEDs
    print(type(black))
    white = [ (255, 255, 255) ] * numLEDs

   # c_black = [c_black.encode('utf-8') for c_black in black]
   # c_white = [c_white.encode('utf-8') for c_white in white]
    
    fade_client.put_pixels(black)
    fade_client.put_pixels(black)
    time.sleep(0.5)
    fade_client.put_pixels(white)

def green ():
    black = [ (0,0,0) ] * numLEDs
    green = [ (21, 100, 52) ] * numLEDs

    fade_client.put_pixels(black)
    fade_client.put_pixels(black)
    time.sleep(0.5)
    fade_client.put_pixels(green)

def blue ():
    black = [ (0,0,0) ] * numLEDs
    blue = [ (41, 94, 194) ] * numLEDs

    fade_client.put_pixels(black)
    fade_client.put_pixels(black)
    time.sleep(0.5)
    fade_client.put_pixels(blue)

def red ():
    black = [ (0,0,0) ] * numLEDs
    red = [ (255, 0, 0) ] * numLEDs

    fade_client.put_pixels(black)
    fade_client.put_pixels(black)
    time.sleep(0.5)
    fade_client.put_pixels(red)

def black():
    black = [ (0,0,0) ] * numLEDs

    fade_client.put_pixels(black)
    fade_client.put_pixels(black)


def party ():
    black = [ (0,0,0) ] * numLEDs
    red = [ (255, 0, 0) ] * numLEDs
    green = [ (0, 255, 0) ] * numLEDs
    blue = [ (0, 0, 255) ] * numLEDs
   
    fade_client.put_pixels(black)
    fade_client.put_pixels(black)
    time.sleep(0.5)
    fade_client.put_pixels(red)


