from flask import Flask, request
import requests
app = Flask(__name__)

@app.route('/testing', methods = ['POST','GET'])
def index():
    content = request.json
    print (content['on'])
    return './helloworld'

if __name__ == '__main__':
   app.run(host='127.0.0.1', port=8080,debug=True)