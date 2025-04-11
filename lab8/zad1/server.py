from flask import Flask

app = Flask(__name__)

@app.route("/home")
def home():
    return "Hello Flask!"

app.run(port=8080,host="0.0.0.0")