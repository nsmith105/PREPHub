## Deployment instructions:

To run server locally:
- node app.js
- website will be accessible through http://localhost:8080

To run on GCP VM:
1) Create VM instance with Ubuntu
2) Create firewall exception so that Node instance will be visible externally
    - https://cloud.google.com/vpn/docs/how-to/configuring-firewall-rules
3) Reserve external static IP so that IP will not change on VM reset
    - https://cloud.google.com/compute/docs/ip-addresses/reserve-static-external-ip-address#reserve_new_static
4) SSH into VM instance through GCP interface & clone repo 
5) To run node server, navigate to the server directory and enter "node app.js". Webpage will now be visible on the GCP instance external IP address. However, this node server will not persist when SSH window is closed.
6) To enable node server to persist after window is closed, you can run it in the background using "nohub" with the following command. 
    - sudo nohup node PREPHUB-TeamD/prephub-Server/app.js &
    - To close nohup background process: 
        1) get PID: ps -ef |grep nohup
        2) Kill nohup process: sudo kill <PID>
