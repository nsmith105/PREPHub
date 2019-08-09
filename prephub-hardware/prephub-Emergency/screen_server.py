from flask import Flask, render_template
app = Flask(__name__)

@app.route('/<params>')
def server_screen(params):
    return render_template(params+".html")

if __name__ == '__main__':
    app.run()