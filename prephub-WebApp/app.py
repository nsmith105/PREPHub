from flask import Flask, render_template
from flask_bootstrap import Bootstrap

app = Flask(__name__)

@app.route("/login")
def login_press():
  return render_template("login.html")

@app.route("/")
def logout_press():
  return render_template("local.html")

@app.route("/")
def cancel_press():
  return render_template("local.html")

@app.route("/admin")
def submit_press():
  return render_template("admin.html")

@app.route("/")
def render_static():
  return render_template("local.html")

if __name__ == '__main__':
    Bootstrap(app)
    app.run()
