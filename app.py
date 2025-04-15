from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/studies')
def studies():
    return render_template('studies.html')

@app.route('/portrait')
def portrait():
    return render_template('portrait.html')

@app.route('/viewer')
def viewer():
    return render_template('viewer.html')

@app.route('/help')
def help_page():
    return render_template('help.html')

if __name__ == '__main__':
    app.run(debug=True)
