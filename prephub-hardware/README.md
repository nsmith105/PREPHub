### This is the Hardware Readme File
# There are three Raspberry Pi's. 


## PREPHub Raspberry Pi Setup for Pi that only connect to led strips
1. Follow the directions to setup the Raspberry Pi [here](https://www.raspberrypi.org/help/quick-start-guide/2/)  
2. Update and Upgrade the Raspberry Pi  
   - `sudo apt-get install update && sudo apt install upgrade -y`  
3. Clone the [PREPHub Repository]() onto the Raspberry PI  
   - From the home directory go to `Desktop` and make a new folder PREPHub(`mkdir PREPHub`)
   - Go into the new folder `cd PREPHub`(You current path should be `~/Desktop/PREPHub/`
   - Clone this repository into this folder(`git clone "Link to this repo"`)
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
   - Enter `sudo crontab -e`  
   - At bottom of file type in `@reboot sudo /home/pi/Desktop/PREPHub/PREPHub-TeamD/prephub-hardware/fadecandy-package-02/bin/fcserver-rpi`
 

## PREPHub Raspberry Pi setup for screen Pi
1. Follow the directions to setup the Raspberry Pi [here](https://www.raspberrypi.org/help/quick-start-guide/2/)  
2. Update and Upgrade the Raspberry Pi  
   - `sudo apt-get install update && sudo apt install upgrade -y`  
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
   - `cd /home/pi/.config/lxsession/LXDE-pi`  
   - `vim autostart`
   - At the bottom of `autostart` add
     - `@gnome-terminal -- python3 /home/pi/Desktop/PREPHub/PREPHub-TeamD/prephub-hardware/pi.py`
9. Connect to fadecandy server on startup. Must edit `crontab`
   - Enter `sudo crontab -e`  
   - At bottom of file type in `@reboot sudo /home/pi/Desktop/PREPHub/PREPHub-TeamD/prephub-hardware/fadecandy-package-02/bin/fcserver-rpi`
10. Run Image Carousel on startup edit `crontab`
    - Enter `sudo crontab -e`
    - At bottom of file type in `@reboot node /home/pi/Desktop/PREPHub/PREPHub-TeamD/prephub-hardware/prephub-Screen/app.js` to host a local node.js server so the script `load_image.js` send ajax request to itself to load images automatically.
   - Go to `~/.config/lxsession/LXDE-pi`
   - Enter `vim autostart`
   - At the bottom of the file enter `@chromium-browser --start-fullscreen http://localhost:8082 /home/pi/Desktop/splash.html`  
   
## Bluetooth Setup
###Do This before Captive Pi setup
After the above installations are complete setup the Bluetooth Protocol by following these directions to install the neccesary hardware. Open a terminal and follow the directions below
1. Download the latest version of the Bluetooth Library
   - `sudo apt-get install bluetooth libbluetooth-dev`
2. Download the latest version of pybluez
   - `sudo pip install pybluez`
3. Restart your system
   - `sudo reboot`
4. Run the bluetooth config manager
   - `sudo hciconfig`
5. Make the PI available to sync by typing
   - `scan on`
   - `discoverable on`
   - `pairable on`
6. Find the device you want pair with and type
   - `pair *mac addres here*`
7. (Only for Captive Portal Pi)Copy that Mac Address and put it into the Captive Portal Pi `MobileConnect.py` to recieve a connection from you selected Device.
8.(Only for Main and Screen Pi) Copy the Mac Address from the Captive portal Pi and put it into your pi.py folder to recieve a connection from
   
## PREPHub Raspberry Pi setup for Wireless Access Point and Captive Portal Pi
1. Follow the directions to setup the Raspberry Pi [here](https://www.raspberrypi.org/help/quick-start-guide/2/)  
2. Update and Upgrade the Raspberry Pi  
   - `sudo apt-get install update && sudo apt install upgrade -y`  
3. Clone the [PREPHub Repository]() onto the Raspberry PI  
   - Our team created a PREPHub folder on the desktop then `cd PREPHub` and clone repository
   Note: Step 3 is not required for the Captive Portal Pi but it is good to have the code on this Pi just in case.
4. Follow the directions to turn this Pi into a Wireless Access Point [here](https://pimylifeup.com/raspberry-pi-wireless-access-point/)
5. Follow the directions for setting up a Raspberry Pi Captive Portal Page [here](https://pimylifeup.com/raspberry-pi-captive-portal/)
6. To change the Splash Page (the page you are redirected to after connecting to the Pi Wifi)
   - Go to `/etc/nodogsplash/htdocs`
   - Edit `splash.html`
   - Insert `images` folder with necessary images if need be
7. To change Wifi Name
   - Enter `sudo nano /etc/hostapd/hostapd.conf`
   - Change `ssid=Pi3-AP` to a name you want
8. For no password comment out 
   - `auth_algs=1`
   - `wpa=2`
   - `wpa_key_mgmt=WPA-PSK`
   - `wpa_pairwise=TKIP`
   - `rsn_pairwise=CCMP`
9. For changes to take effect enter:
   - `sudo systemctl stop hostapd`
   - `sudo systemctl stop dnsmasq`
   - `sudo systemctl restart dhcpcd`
   - `sudo sh -c "echo 1 > /proc/sys/net/ipv4/ip_forward"`
   - `sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE`
   - `sudo sh -c "iptables-save > /etc/iptables.ipv4.nat"`
   - `sudo systemctl unmask hostapd`
   - `sudo systemctl enable hostapd`
   - `sudo systemctl start hostapd`
   - `sudo service dnsmasq start`
10. To start BT server on startup
   - `cp /etc/xdg/lxsession/LXDE-pi/ .config/`  
   - `cd /home/pi/.config/lxsession/LXDE-pi`  
   - `vim autostart`
   - At the bottom of `autostart` add
     - `@gnome-terminal -- python3 /home/pi/Desktop/PREPHub/PREPHub-TeamD/prephub-hardware/MobileConnect.py`
   
