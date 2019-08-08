import socketio
import opc, time
import json
import vlc



# Initiate socket client
socket = socketio.Client()

instance = vlc.Instance('--input-repeat=-1', '--fullscreen')
player = instance.media_player_new()
t_end = time.time() + 15

#socket.sleep(45)

# Initiate socket client for fadecandy server (little chip netween Led strip and Pi
fade_client = opc.Client('localhost:7890')
numLEDs = 512
prephub = 'https://prephub-web.appspot.com/'
#radio1 = 'http://radio.nolife-radio.com:9000/stream'
radio1 = 'https://prod-18-236-222-179.wostreaming.net/alphacorporate-kbfffmaac-ibc4?session-id=4a52f158c5d9d710f541b67ded807a1a&source=website'
radio2 = 'https://c13.prod.playlists.ihrhls.com/4315/playlist.m3u8?listeningSessionID=5d3f2b54f5671ed2_38217_uOMmp47J__00000001hQa&downloadSessionID=0&at=0&birthYear=null&campid=header&cid=index.html&clientType=web&fb_broadcast=0&host=webapp.US&init_id=8169&modTime=1564459075772&pname=15400&profileid=1149739135&territory=US&uid=1564458907341&age=null&gender=null&amsparams=playerid%3AiHeartRadioWebPlayer%3Bskey%3A1564459075&terminalid=159&awparams=g%3Anull%3Bn%3Anull%3Bccaud%3Aundefined%3BcompanionAds%3Atrue&playedFrom=60&dist=iheart&devicename=web-desktop&stationid=4315'
radio3='https://c13.prod.playlists.ihrhls.com/3540/playlist.m3u8?listeningSessionID=5d3f2b54f5671ed2_39053_6Ve8Uwu9__00000001j44&downloadSessionID=0&at=0&birthYear=null&campid=header&cid=index.html&clientType=web&fb_broadcast=0&host=webapp.US&init_id=8169&modTime=1564459960793&pname=15400&profileid=1149739135&territory=US&uid=1564458907341&age=null&gender=null&amsparams=playerid%3AiHeartRadioWebPlayer%3Bskey%3A1564459960&terminalid=159&awparams=g%3Anull%3Bn%3Anull%3Bccaud%3Aundefined%3BcompanionAds%3Atrue&playedFrom=59&dist=iheart&devicename=web-desktop&stationid=3540'
radio4='https://stream5.opb.org/kmhd_web.mp3'

def onStart():
    counter = 0
    while counter < 10:
        try:
            print('\nAttepting to connect')
            socket.connect(prephub, namespaces=['/pi'])
            if socket.sid != None:
                break
        except:
            error = socketio.exceptions
            print('Error -> ', error)
            time.sleep(5)
            counter += 1
    print('Exiting try block')





# connect to server
@socket.on('connect', namespace='/pi')
def handle_connect():
    print('Connection to server established')
# on startup leds will cycle through color presets.    
    white()
    time.sleep(1)
    green()
    time.sleep(1)
    blue()
    time.sleep(1)
    red()
    time.sleep(1)
    black()

# on `send command` from server parse 
# `data` sent from server
# parse json to retieve value element of data
# which is the color to change the LED lights  -- Note: may need to change color or other variable name (color could = color or radio)
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

    # if color = radio values, maybe add timer?
    if color == '"Radio 1"':
        print('Radio 1 data received by PI') 
        media=instance.media_new(radio1)
        player.set_media(media)
        player.play()
    if color == '"Radio 2"':
        media=instance.media_new(radio2)
        player.set_media(media)
        player.play()
    if color == '"Radio 3"':
        media=instance.media_new(radio3)
        player.set_media(media)
        player.play()
    if color == '"Radio 4"':
        media=instance.media_new(radio4)
        player.set_media(media)
        player.play()


  
    # sends msg back to server stating command was executed
    socket.emit('send command confirm', data, namespace='/pi')

@socket.on('disconnect', namespace='/pi')   
def handle_disconnect():
    print('disconnected from server')



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
    green = [ (0, 255, 0) ] * numLEDs

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

onStart()

# Socket event handlers

# Establish connection to server, loop until connection is established
#socket.connect('https://prephub-web.appspot.com/', namespaces=['/pi'])
