from flask import Flask, render_template
from flask_bootstrap import Bootstrap

app = Flask(__name__)

@app.route("/")
def render_static():
    return render_template("login.html")

if __name__ == '__main__':
    Bootstrap(app)
    app.run()
