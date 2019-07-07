#Server code for testing the pi hardware as clients
#Benjamin Baleilevuka
#7/5/2019
#PREHub Team-D Capstone

import socket



def main():

	#Define the socket to be IPV4 and TCP
	s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
	#Socket is the endpoint that recieves data
	s.bind((socket.gethostname(), 1244))
	#If server sockets are at capacity create a queue and the limit is 5
	s.listen(5)

	while True:
		clientsocket, address = s.accept()
		#print("Connection from {address} has been established!")
		clientsocket.send(bytes("Welcome to server", "utf-8"))
		clientsocket.close()













if __name__ == '__main__':
	main()
