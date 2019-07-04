from flask import Flask, request, url_for, redirect, render_template
from flask_bootstrap import Bootstrap

app = Flask(__name__)

global local_flag
local_flag = None

@app.route("/web")
def web():
  global local_flag
  local_flag = False
  return render_template("web.html")

@app.route("/local")
def local():
  global local_flag
  local_flag = True
  return render_template("local.html")

@app.route("/logout")
def logout_press():
  if local_flag: return redirect(url_for("local"))
  else: return redirect(url_for("web"))

@app.route("/login")
def login_press():
  return render_template("login.html")

@app.route("/cancel")
def cancel_press():
  if local_flag: return redirect(url_for("local"))
  else: return redirect(url_for("web"))

@app.route("/admin")
def submit_press():
  return render_template("admin.html")

@app.route("/")
def render_static():
  return render_template("access.html")

if __name__ == '__main__':
    Bootstrap(app)
    app.run()
