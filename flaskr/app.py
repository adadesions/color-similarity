from flask import Flask, render_template, send_from_directory

app = Flask(__name__)
app.debug = True

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/data/<filename>')
def serve_data(filename):
    return send_from_directory('data', filename)