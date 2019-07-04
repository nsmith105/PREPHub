from flask import Flask, request, redirect, render_template
from flask_bootstrap import Bootstrap

app = Flask(__name__)

@app.route("/web")
def web_press():
  return render_template("web.html")

@app.route("/login-web")
def login_web_press():
  return render_template("login-web.html")

@app.route("/web")
def cancel_web_press():
  return render_template("web.html")

@app.route("/admin-web")
def submit_web_press():
  return render_template("admin-web.html")

@app.route("/web")
def logout_web_press():
  return render_template("web.html")

@app.route("/local")
def local_press():
  return render_template("local.html")

@app.route("/login")
def login_press():
  return render_template("login.html")

@app.route("/local")
def logout_press():
  return render_template("local.html")

@app.route("/local")
def cancel_press():
  return render_template("local.html")

@app.route("/admin")
def submit_press():
  return render_template("admin.html")

@app.route("/")
def render_static():
  return render_template("access.html")

if __name__ == '__main__':
    Bootstrap(app)
    app.run()
