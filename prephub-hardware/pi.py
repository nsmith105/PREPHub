import socketio
import opc, time
import json
import calendar
import vlc
import threading
import bluetooth

#TODO tell Justin or whoever is in charge of the server to implement the RSS feed cmd for default/reset

# Initiate socket client
socket = socketio.Client()

# Initiate bluetooth socket
bSocket = bluetooth.BluetoothSocket( bluetooth.RFCOMM )

#Below are PI specific settings
#********Uncomment Below for goodPI*******
port = 2
bSocket.bind(('b8:27:eb:c8:66:03',port))
#******************************************

#********Uncomment Below for screenPI*******
#port = 3
#bSocket.bind(('b8:27:eb:3d:ee:57',port))
#*******************************************
print("Port: ", port)
bSocket.listen(1)
btLock = False

#VLC Media Player Initialization
instance = vlc.Instance('--input-repeat=-1', '--fullscreen')
player = instance.media_player_new()

# Initiate socket client for fadecandy server (little chip netween Led strip and Pi
fade_client = opc.Client('localhost:7890')
numLEDs = 512
allClear = True

# -- Colors --
white = [ (255,255,255) ] * numLEDs
caution_yellow = [ (255,215,0) ] * numLEDs
lightBlue = [ (102,255,255) ] * numLEDs
purple = [ (148,0,211) ] * numLEDs
indigo = [ (75,0,130) ] * numLEDs
blue = [ (0,0,255) ] * numLEDs
green = [ (0,255,0) ] * numLEDs
yellow = [ (255,255,0) ] * numLEDs
orange = [ (255,127,0) ] * numLEDs
red = [ (255,0,0) ] * numLEDs
pink = [ (255, 143, 195) ] * numLEDs
brown = [ (143, 92, 20) ] * numLEDS
black = [ (0,0,0) ] * numLEDs
colors = {'"White"':white,'"Green"':green,'"Purple"':purple,'"Blue"':blue}

# this is for live version prephub = 'http://tinyurl.com/prephubpdx'
# this is for vm instance that we'll use to test
prephub = 'http://35.197.44.95:9000/'

#**********************Radio Presets**********************#
# radio 1 is Jammin 95.5 FM
radio1 = 'https://prod-18-236-222-179.wostreaming.net/alphacorporate-kbfffmaac-ibc4?session-id=4a52f158c5d9d710f541b67ded807a1a&source=website'
# radio 2 is 106.7 The Eagle
radio2 = 'https://stream5.opb.org/opbmusic_player.mp3'
# Radio 3 Random Trance Station
radio3='http://intenseradio.live-streams.nl:8000/live'
#  Radio 4 89.1 FM
radio4='https://stream5.opb.org/kmhd_web.mp3'
#**********************Radio Station Mapping for JSON packet**********************#
stations = {'"Radio 1"':radio1,'"Radio 2"':radio2,'"Radio 3"':radio3,'"Radio 4"':radio4}

def onStart():
    counter = 0
    print("Starting BT Thread")
    bt_Thread.start()
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
    # on startup leds turn blue and play radio1
    default_state()

# on `send command` from server parse 
# `data` sent from server
# parse json to retrieve value element of data
# which is the color to change the LED lights

@socket.on('send command', namespace='/pi')
#def handle_change_lights
def handle_cmd(data):
    cmd = json.dumps(data['value'])
    print('Received request from server: ' + data['value']) #maybe remove the 
   
    if cmd in colors:
        cmd_color(colors[cmd])
    elif cmd in stations:
        change_radio(stations[cmd])

    # sends msg back to server stating command was executed
    socket.emit('send command confirm', data, namespace='/pi')

# Hi danniel, it's me haison, check this out and make changes
@socket.on('rss feed', namespace='/pi')
def handle_rss_feed(data):
    print(data)
    if data == "police":
        cmd_caution()
    elif data == "inclement weather":
        cmd_color(lightBlue)
    elif data == "all clear":
        default_state() 

@socket.on('disconnect', namespace='/pi')   
def handle_disconnect():
    print('disconnected from server')

#the following functions are the color presets 
def cmd_color(color):
    fade_client.put_pixels(black)
    time.sleep(0.5)
    fade_client.put_pixels(color)

#change prephub to alert mode
def cmd_caution():
    # change lights to yellow
    fade_client.put_pixels(black)
    time.sleep(0.5)
    fade_client.put_pixels(caution_yellow)
    time.sleep(0.5)

    # get alert audio .mp3
    audio_file = vlc.MediaPlayer("/home/pi/Desktop/PREPHub/PREPHub-TeamD/prephub-hardware/AlertRecording.mp3")

    global allClear
    allClear = False
    # check if player is playing
    #if player.is_playing():
    player.pause()
    print('player paused') 
    audio_file.play() 
    # get the time audio file starts playing
    startTime = calendar.timegm(time.gmtime())
    while allClear == False:
        # get the current time
        currentTime = calendar.timegm(time.gmtime())     
        # if 12 seconds has passed restart audio clip
        if currentTime - startTime >= 13:
            startTime = calendar.timegm(time.gmtime())
            audio_file.stop()
            audio_file.play()
    audio_file.stop()
    del audio_file

def default_state():
    #player.stop()
    global allClear
    allClear = True
    media=instance.media_new(radio1)
    player.set_media(media)
    player.play()
    del media
    cmd_color(blue) 

def all_clear(state):
    global allClear
    player.pause()
    allClear = state
    print("allclear = ", allClear)
    cmd_color(black)


def change_radio(station):
    audio = instance.media_new(station)
    player.set_media(audio)
    player.play()
    del audio

def rainbow ():
    print('inside rainbow()') 
    print(light_rainbow)

    while light_rainbow: 
        loop()
        time.sleep(.1)

def loop():
    fade_client.put_pixels(black)
    time.sleep(2)
    fade_client.put_pixels(white)
    time.sleep(2)
    fade_client.put_pixels(purple)
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

def bt_Connection():
    global btLock
    print(" Bluetooth Thread started")
    time.sleep(5)

    while 1: 
        try:
            print("Waiting for BT connection")
            clientSocket, address = bSocket.accept()
        except:
            print("in exception") 
            clientSocket.close()
            break

        print("Accepted BT Connection from", address)
        bt_data = clientSocket.recv(32)
        print("BT Data Received from->", address)
        if bt_data:
            if btLock:
                #BT lock is true so Event is Currently Black_Swan
                #We want to reset the PREPHub and go back to Default state
                all_clear(True)
                default_state()
                btLock = False
            else:
                if allClear == False:
                    #PREPHub is not in a Black_Swan event but is in caution mode
                    #Set all Clear to true and remove from caustion mode to Default state
                    all_clear(True)
                    default_state()
                else:
                    all_clear(False)
                    cmd_color(red)
                    btLock = True
        



bt_Thread = threading.Thread(target=bt_Connection)
onStart()

# Socket event handlers

# Establish connection to server, loop until connection is established
# socket.connect('https://prephub-web.appspot.com/', namespaces=['/pi'])
