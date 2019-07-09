from flask import Flask, request, url_for, redirect, render_template
from flask_bootstrap import Bootstrap

app = Flask(__name__)


@app.route("/")
def local():
  return render_template("local.html")

@app.route("/logout")
def logout_press():
  return redirect(url_for("local"))

@app.route("/login")
def login_press():
  return render_template("login.html")

@app.route("/cancel")
def cancel_press():
  return redirect(url_for("local"))

@app.route("/admin")
def submit_press():
  return render_template("admin.html")

@app.route("/")
def render_static():
  return render_template("local.html")

if __name__ == '__main__':
    Bootstrap(app)
    app.run()
