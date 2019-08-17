### This is the Hardware Readme File
# There are three Raspberry Pi's. One 


## PREPHUB Raspberry Pi Setup for Pi that only connect to led strips
1. Follow the directions to setup the Raspberry Pi [here](https://www.raspberrypi.org/help/quick-start-guide/2/)  
2. Update and Upgrade the Raspberry Pi  
   - 'sudo apt-get install update && sudo apt install upgrade -y'  
3. Clone the [PREPHub Repository]() onto the Raspberry PI  
   - Our team created a PREPHub folder on the desktop then `cd PREPHub` and clone repository  
4. Ensure Python3-pip is installed  
   - `sudo apt-get install python3-pip`  
5. Install Python-socketio  
   - `pip install python-socketio`  
6. Install VLC to be used to play radio stations in `pi.py`  
   - `sudo pip3 install python-vlc`  
7. Install gnome-terminal  
   - `sudo apt install gnome-terminal`  
8. This step show how to autostart `pi.py` file. This file connects to the fadecandy server, gcp server, and changes lights and radio stations  
   - `cp /etc/xdg/lxsession/LXDE-pi/ .config/`  
   - `cd /home/pi/.config/lxsession/LXDE-pi’  
   - `vim autostart`
   - At the bottom of `autostart` add
     - `@gnome-terminal -- python3 /home/pi/Desktop/PREPHub/PREPHub-TeamD/prephub-hardware/pi.py`  
9. Connect to fadecandy server on startup. Must edit `crontab`
   -  

## PREPHUB Raspberry Pi setupt for screen Pi
   - 
 
