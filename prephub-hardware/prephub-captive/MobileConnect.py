import bluetooth
import critical
import clientEmergency
import threading
import time


screenPi = 'b8:27:eb:3d:ee:57'
goodPi = 'b8:27:eb:c8:66:03'

def sendEmergency():
    print("Threaded Emergency!")
    #screePi emergency signal
    #t1 = threading.Thread(target = clientEmergency.black_swan, name = 'screenPi', args = (screenPi, 3))
    #goodPi emergency signal
    t2 = threading.Thread(target = clientEmergency.black_swan, name = 'goodPi', args = (goodPi, 2))
    #t1.start()
    #time.sleep(3)
    t2.start()
    time.sleep(2)

serverSocket = bluetooth.BluetoothSocket( bluetooth.RFCOMM )
port = 1
backlog = 2
serverSocket.bind(('b8:27:eb:d0:85:0e',port))
print(port)
serverSocket.listen(backlog)

clientSocket, address = serverSocket.accept()
print("Accepted BT Connection from", address)
while 1:
    data = clientSocket.recv(1024)
    print("***Connected***")
    if data:
        print("Recieved: ", data)
        #sendEmergency()
        #clientEmergency.black_swan(screenPi, 3, data)
        time.sleep(1)
        clientEmergency.black_swan(goodPi, 2, data)

clientSocket.close()
serverSocket.close()
