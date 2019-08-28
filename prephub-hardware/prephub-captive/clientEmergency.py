#Emergency Bluetooth Connection

import bluetooth, time

def black_swan(serverMACAddress, port, emergency):
    #serverMACAddress = 'b8:27:eb:3d:ee:57'
    print("Black Swan Event")
    pi = bluetooth.BluetoothSocket(bluetooth.RFCOMM)
    pi.connect((serverMACAddress, port))

    time.sleep(2)

    print("Emergency protocol sent")
    pi.send(emergency)
    print("Connect closed")

