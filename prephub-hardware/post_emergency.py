import opc, time
import vlc

instance = vlc.Instance('--input-repeat=-1', '--fullscreen')
player = instance.media_player_new()

# Initiate socket client for fadecandy server
client = opc.Client('localhost:7890')
numLEDs = 60

player = vlc.MediaPlayer("/home/pi/Desktop/PREPHub/PREPHub-TeamD/prephub-hardware/SampleAudio_0.4mb.mp3")

red = [ (255,0,0) ] * numLEDs
black = [ (0,0,0) ] * numLEDs

#player.play()
while True:
    client.put_pixels(red)
    #time.sleep(2)
    #client.put_pixels(black)
    #time.sleep(2)
