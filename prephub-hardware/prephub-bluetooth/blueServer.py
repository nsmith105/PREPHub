#Blutooth Server for Pi
import bluetooth 

hostMACAddress = '84:ef:18:ae:5f:46'
port = 3
backlog = 1
size = 1024
s = bluetooth.BluetoothSocket(bluetooth.RFCOMM)
s.bind((hostMACAddress, port))
s.listen(backlog)
try:
    print("Attepting to Connect Bluetooth")
    client, clientInfo = s.accept()
    while 1:
        data = client.recv(size)
        print('Connection Accepted on ', clientInfo)
        if data:
            print('message: ',data)
            client.send(data)
except:
    print("Closing Socket")
    client.close()
    s.close()


