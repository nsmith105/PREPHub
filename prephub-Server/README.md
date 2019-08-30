## RSS Parser Testing

The app.js file includes an RSS parser as well as routing forwards for testing different RSS scenarios. e.g. http://prephuburlhere.com/setrsspolice will switch the RSS feed to a local file containing an RSS post about police activity. Other forwards include "../setrssclear" to clear the police activity and "../setrssdefault" to set the RSS feed back the the default, live RSS feed URL.

## Server Deployment Instructions:

To run server locally:
1) Enter: "node app.js" in terminal
2) Website will be accessible through http://localhost:9000

To run on GCP VM:
1) Create VM instance with Ubuntu
2) Create firewall exception so that Node instance will be visible externally
    - https://cloud.google.com/vpn/docs/how-to/configuring-firewall-rules
3) Reserve external static IP so that IP will not change on VM reset
    - https://cloud.google.com/compute/docs/ip-addresses/reserve-static-external-ip-address#reserve_new_static
4) SSH into VM instance through GCP interface & clone repo 
5) To run node server, navigate to the server directory and enter "node app.js". Webpage will now be visible on the GCP instance external IP address. However, this node server will not persist when SSH window is closed.
6) To enable node server to persist after window is closed, you can run it in the background using "nohub" with the following command. 
    Note: nohup command should be executed IN the server directory.
    - sudo nohup node app.js &
    Note: ps command should be run in the same directory that the initial nohup command was executed in.
    - To close nohup background process: 
        1) get PID: ps -ef |grep nohup
        2) Kill nohup process: sudo kill {process_id}

# Website

This folder contains javascript files, a css file, and an html
file, which all have a specific purpose. The html file, called local.html
in the templates folder, consists the structure of the webpage. The webpage 
contains a banner, which changes depending on the rss feed received by the 
server, it contains buttons, which controls specific tabcontents. These buttons
with a specific label do the following:

- Twitter - Opens the twitter feed content
- Radio - Opens the radio buttons
- Lights - Open the light buttons
- Preparation - Opens info for disaster preparedness
- About - Open the about us content

In the public folder, there is a css folder and a js folder, which contains
the local.css file and the local.js file respectively, which determine the
structure and behavior of the webpage. The local.js file controls the behavior
of the buttons that change the radio and lights, the behavior of the content buttons
on the top of the page. Also, web sockets were implemented so the buttons can communicate
with the server, and the server can send messages to the website as well, notifying
the user of alerts.

All the modules needed are in the node_modules folder, the demo RSS feeds are
labeled in this directory.

The file, app.js, is the program for the web server, which is hosted on
google cloud.
