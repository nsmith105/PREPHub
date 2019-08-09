from flask import Flask, render_template, redirect
app = Flask(__name__)

@app.route('/<params>')
def server_screen(params):
    return render_template(params+".html")

@app.route('/')
def route_req():
    return redirect("/english")

if __name__ == '__main__':
    app.run()