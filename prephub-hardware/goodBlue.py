import bluetooth
import critical

serverSocket = bluetooth.BluetoothSocket( bluetooth.RFCOMM )
port = 2
backlog = 1
serverSocket.bind(('b8:27:eb:c8:66:03',port))
print("Port: ", port)
serverSocket.listen(backlog)

try:
    clientSocket, address = serverSocket.accept()
    print("Accepted BT Connection from", address)
    data = clientSocket.recv(32)
    print("***Connected***")
    if data:
        if data == b'o':
            critical.off()
        else:
            critical.warning()

except:
    clientSocket.close()
    serverSocket.close()
