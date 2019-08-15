import socketio
import opc, time
import json
import vlc
import threading



# Initiate socket client
socket = socketio.Client()

instance = vlc.Instance('--input-repeat=-1', '--fullscreen')
player = instance.media_player_new()
t_end = time.time() + 15
#audio_file = vlc.MediaPlayer("/home/pi/Desktop/PREPHub/PREPHub-TeamD/prephub-hardware/AlertRecording.mp3")


#socket.sleep(45)

# Initiate socket client for fadecandy server (little chip netween Led strip and Pi
fade_client = opc.Client('localhost:7890')
numLEDs = 512
light_rainbow = False
print('value of light rainbow after var declar.')
print(light_rainbow)
#light_white = False

#colors
#other_blue = [ (41, 94, 194) ] * numLEDs
white = [ (255,255,255) ] * numLEDs
caution_yellow = [ (255,215,0) ] * numLEDs
lightBlue = [ (102,255,255) ] * numLEDs
violet = [ (148,0,211) ] * numLEDs 
indigo = [ (75,0,130) ] * numLEDs
blue = [ (0,0,255) ] * numLEDs
green = [ (0,255,0) ] * numLEDs
yellow = [ (255,255,0) ] * numLEDs
orange = [ (255,127,0) ] * numLEDs
red = [ (255,0,0) ] * numLEDs
black = [ (0,0,0) ] * numLEDs

# this is for live version prephub = 'http://prephub-web.appspot.com/'
# this is for vm instance that we'll use to test
prephub = 'http://35.197.44.95:9000/'
# radio 1 is 95.5 FM
radio1 = 'https://prod-18-236-222-179.wostreaming.net/alphacorporate-kbfffmaac-ibc4?session-id=4a52f158c5d9d710f541b67ded807a1a&source=website'
radio2 = 'https://c13.prod.playlists.ihrhls.com/4315/playlist.m3u8?listeningSessionID=5d3f2b54f5671ed2_38217_uOMmp47J__00000001hQa&downloadSessionID=0&at=0&birthYear=null&campid=header&cid=index.html&clientType=web&fb_broadcast=0&host=webapp.US&init_id=8169&modTime=1564459075772&pname=15400&profileid=1149739135&territory=US&uid=1564458907341&age=null&gender=null&amsparams=playerid%3AiHeartRadioWebPlayer%3Bskey%3A1564459075&terminalid=159&awparams=g%3Anull%3Bn%3Anull%3Bccaud%3Aundefined%3BcompanionAds%3Atrue&playedFrom=60&dist=iheart&devicename=web-desktop&stationid=4315'
radio3='https://c13.prod.playlists.ihrhls.com/3540/playlist.m3u8?listeningSessionID=5d3f2b54f5671ed2_39053_6Ve8Uwu9__00000001j44&downloadSessionID=0&at=0&birthYear=null&campid=header&cid=index.html&clientType=web&fb_broadcast=0&host=webapp.US&init_id=8169&modTime=1564459960793&pname=15400&profileid=1149739135&territory=US&uid=1564458907341&age=null&gender=null&amsparams=playerid%3AiHeartRadioWebPlayer%3Bskey%3A1564459960&terminalid=159&awparams=g%3Anull%3Bn%3Anull%3Bccaud%3Aundefined%3BcompanionAds%3Atrue&playedFrom=59&dist=iheart&devicename=web-desktop&stationid=3540'
#  89.1 FM
radio4='https://stream5.opb.org/kmhd_web.mp3'

def onStart():
    counter = 0
    #cmd_caution()
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
    media=instance.media_new(radio1)
    player.set_media(media)
    player.play()
    #global light_rainbow
    #light_rainbow = True
    #print(light_rainbow)
    cmd_blue()

# on `send command` from server parse 
# `data` sent from server
# parse json to retieve value element of data
# which is the color to change the LED lights  -- Note: may need to change color or other variable name (color could = color or radio)
@socket.on('send command', namespace='/pi')
def handle_change_lights(data):
    cmd = json.dumps(data['value'])
    print('Received request from server: ' + data['value']) #maybe remove the 
   
    # TODO make all if --> elif excpet the first 
    global light_rainbow
    #global light_white
    if cmd == '"Reset"':
        print('inside if reset') 
        print(light_rainbow) 
        light_rainbow = True 
        rainbow()
    elif cmd == '"White"':
        light_rainbow = False
        #light_white = True
        cmd_white()
    # executes caution() to test that caution() works, needs to be changed back to another preset 
    elif cmd == '"Green"':
        light_rainbow = False
        cmd_green()
    # executes snow() to test that snow() works, needs to be changed back to another preset 
    elif cmd == '"Red"':
        light_rainbow = False
        cmd_red()
    elif cmd == '"Blue"':
        light_rainbow = False
        cmd_blue()
    elif cmd == '"Black"':
        light_rainbow = False
        cmd_black() 
    # need to stop radios: make functions for each radio
    elif cmd == '"Radio 1"':
        #print('Radio 1 data received by PI') 
        media=instance.media_new(radio1)
        player.set_media(media)
        player.play()
    elif cmd == '"Radio 2"':
        media=instance.media_new(radio2)
        player.set_media(media)
        player.play()
    elif cmd == '"Radio 3"':
        media=instance.media_new(radio3)
        player.set_media(media)
        player.play()
    elif cmd == '"Radio 4"':
        media=instance.media_new(radio4)
        player.set_media(media)
        player.play()


  
    # sends msg back to server stating command was executed
    socket.emit('send command confirm', data, namespace='/pi')


# Hi danniel, its me haison, check this out and make changes
@socket.on('rss feed', namespace='/pi')
def handle_rss_feed(data):
    print(data)
    if data == "police activity":
        cmd_caution()
    elif data == "inclement weather":
        cmd_snow()
    elif data == "all clear":
        player.play()

@socket.on('disconnect', namespace='/pi')   
def handle_disconnect():
    print('disconnected from server')



#the following functions are the color presets 
def cmd_white():
    #print("In white function\n")
    #print(type(black))

    #fade_client.put_pixels(black)
    #while light_white:
    fade_client.put_pixels(black)
    time.sleep(0.5)
    fade_client.put_pixels(white)

def cmd_green ():
    fade_client.put_pixels(black)
    fade_client.put_pixels(black)
    time.sleep(0.5)
    fade_client.put_pixels(green)

def cmd_blue ():
    fade_client.put_pixels(black)
    fade_client.put_pixels(black)
    time.sleep(0.5)
    fade_client.put_pixels(blue)

def cmd_red ():
    fade_client.put_pixels(black)
    fade_client.put_pixels(black)
    time.sleep(0.5)
    fade_client.put_pixels(red)

# off setting
def cmd_black():
    fade_client.put_pixels(black)
    fade_client.put_pixels(black)

def cmd_snow():
    fade_client.put_pixels(black)
    fade_client.put_pixels(black)
    time.sleep(0.5)
    fade_client.put_pixels(lightBlue)

def alert_audio():
    audio_file = vlc.MediaPlayer("/home/pi/Desktop/PREPHub/PREPHub-TeamD/prephub-hardware/AlertRecording.mp3")
    audio_file.play()

def cmd_loop():
    fade_client.put_pixels(black)
    time.sleep(2)
    fade_client.put_pixels(caution_yellow)
    time.sleep(2)
    audio_file = vlc.MediaPlayer("/home/pi/Desktop/PREPHub/PREPHub-TeamD/prephub-hardware/AlertRecording.mp3")
    # check if player is playing
    if player.is_playing():
        player.pause()
    print('player paused') 
    audiothread = threading.Thread(target = audio_file.play, name = 'AlertRecording')
    while 1:
        print('inside while loop of cmd_caution')
        print('thread start') 
        audiothread.start() 
        audiothread.join()
        print('starting sleep') 
        time.sleep(12)
    #audio_file.play()
    #fade_client.put_pixels(black)
    #time.sleep(2)
    #fade_client.put_pixels(caution_yellow)
    #time.sleep(2)

def cmd_caution():
    fade_client.put_pixels(black)
    time.sleep(2)
    fade_client.put_pixels(caution_yellow)
    time.sleep(2)
    audio_file = vlc.MediaPlayer("/home/pi/Desktop/PREPHub/PREPHub-TeamD/prephub-hardware/AlertRecording.mp3")
    # check if player is playing
    if player.is_playing():
        player.pause()
    print('player paused') 
    while 1:
        print('inside caution')
        audio_file.play()
        time.sleep(12)
        audio_file.stop()

#base setting
def rainbow ():
    print('inside rainbow()') 
    print(light_rainbow)
    
    while light_rainbow: 
        loop()
        time.sleep(.1)

def loop():
    #time.sleep(1)
    fade_client.put_pixels(black)
    time.sleep(2)
    fade_client.put_pixels(white)
    time.sleep(2)
    fade_client.put_pixels(violet)
    time.sleep(2)
    fade_client.put_pixels(indigo)
    time.sleep(2)
    fade_client.put_pixels(blue)
    time.sleep(2)
    fade_client.put_pixels(green)
    time.sleep(2)
    fade_client.put_pixels(yellow)
    time.sleep(2)
    fade_client.put_pixels(orange)
    time.sleep(2)
    fade_client.put_pixels(red)
    time.sleep(2)
    fade_client.put_pixels(white)
    time.sleep(2)
    fade_client.put_pixels(black)
    time.sleep(1)

#def  switch_white():
    

onStart()

# Socket event handlers

# Establish connection to server, loop until connection is established
# socket.connect('https://prephub-web.appspot.com/', namespaces=['/pi'])
