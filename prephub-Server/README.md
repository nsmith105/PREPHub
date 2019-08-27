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

All the modules needed ar ein the node_modules folder, the demo RSS feeds are
in the "RSS xml demo files" folder.

The file, app.js, is the program for the web server, which is hosted on
google cloud.
