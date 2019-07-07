#Client code for the PREPHub Hardware testing
#Benjamin Baleilevuka
#7/5/2019


import socket

def main():

	#This is the client socket for creating a connection
	s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
	#Get the hostname and the choose the connection port
	s.connect((socket.gethostname(), 1244))
	full_msg = ''
	while True:
		msg = s.recv(8)
		if len(msg) <= 0:
			break
		full_msg += msg.decode("utf-8")
	
	print(full_msg)


	"""
	This code is currently sending and recieving information as 
	bytes that are to be endcoded before being sent, here as utf-8
	then decoded on the recievers end
	"""

	

if __name__ == '__main__':
	main()
