import os, glob
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
    datasetPath = "static/Dataset_LSC/"
    Path(datasetPath).mkdir(parents=True, exist_ok=True)
    fullpath = datasetPath + filename[:-6] + "/"
    Path(fullpath).mkdir(parents=True, exist_ok=True)
    Path(fullpath + "frames/").mkdir(parents=True, exist_ok=True)
    filepath = Path(fullpath + filename)
    video.save(filepath)
    return Response("success")

def getVideoManos():
    video = request.files['file']
    filename = video.filename
    datasetPath = "static/ManosLSC/"
    Path(datasetPath).mkdir(parents=True, exist_ok=True)
    fullpath = datasetPath + filename[:-6] + "/"
    Path(fullpath).mkdir(parents=True, exist_ok=True)
    Path(fullpath + "frames/").mkdir(parents=True, exist_ok=True)
    filepath = Path(fullpath + filename)
    
    if video:
        if not (os.path.isfile(filepath)):
            video.save(filepath)
        else:
            list_of_files = glob.glob(str(filepath.parents[0]) + '/*')
            latest_file = max(list_of_files, key=os.path.getctime)
            tempPath = Path(latest_file)
            lastVideoNum = int(tempPath.stem.split("_", 1) [1]) + 1
            filename = str(filepath.parents[0].name) + "_" + str(lastVideoNum) + ".mp4"
            video.save(fullpath + filename)
            filepath = Path(fullpath + filename)
            
    return Response("success")
@app.route('/recolectorManos')
def HandsRecollector():
    return render_template('recolectorManos.html')

@app.route('/protocolo')
def protocol():
    return "PaginaDeBrayan"

if __name__ == '__main__':
    app.run(port=3000, debug=True)

