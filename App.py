from flask import Flask, render_template, request, Response
from pathlib import Path

app = Flask(__name__)

@app.route('/')
def Index():
    return render_template("recolectarLSC.html")

@app.route("/guardarVideo", methods=['POST'])
def getVideo():
    video = request.files['file']
    filename = video.filename
    datasetPath = "static/Dataset_LSC2/Manos/"
    Path(datasetPath).mkdir(parents=True, exist_ok=True)
    fullpath = datasetPath + filename[:-6] + "/"
    Path(fullpath).mkdir(parents=True, exist_ok=True)
    Path(fullpath + "frames/").mkdir(parents=True, exist_ok=True)
    filepath = Path(fullpath + filename)
    video.save(filepath)
    return Response("success")

@app.route('/recolectorManos')
def HandsRecollector():
    return render_template('recolectorManos.html')

@app.route('/protocolo')
def protocol():
    return "PaginaDeBrayan"

if __name__ == '__main__':
    app.run(port=3000, debug=True)

