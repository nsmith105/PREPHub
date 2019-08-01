import numpy as np
from flask import Flask, request, url_for, redirect, render_template
from flask_bootstrap import Bootstrap

app = Flask(__name__)
Bootstrap(app)

def is_valid(user, password):
  data = open("admin.txt").readlines()
  data = np.array(list(map(lambda x: x.strip().split(","), data)))
  print(data)
  v_user = np.argwhere(data[0,:] == user)
  print(v_user)
  if np.size(v_user) == 0:
    return False
  return data[v_user[0],1] == password

@app.route("/")
def local():
  return render_template("emergency.html")

@app.route("/logout")
def logout_press():
  return redirect(url_for("emergency"))

@app.route("/login")
def login_press():
  return render_template("login.html")

@app.route("/cancel")
def cancel_press():
  return redirect(url_for("emergency"))

@app.route("/login_submit", methods=["POST"])
def submit_press():
  user = request.form["uname"]
  password = request.form["psw"]
  if not user or not password:
    return redirect(url_for("login_press"))
  elif is_valid(user, password):
    return redirect(url_for("admin"))
  else:
    return redirect(url_for("login_press"))

@app.route("/admin")
def admin():
  return render_template("admin.html")

if __name__ == '__main__':
   app.run()
