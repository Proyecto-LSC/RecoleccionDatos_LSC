import os, glob, cv2
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
    
    video2frames(filepath)
    return Response("success")

def video2frames(filepath):
    vidcap = cv2.VideoCapture(str(filepath))
    list_of_files = glob.glob(str(filepath.parents[0]) + '/frames/*')
    success = True
    count = 0
    imgNum = 0
    
    while success:
        success,image = vidcap.read()
        if not list_of_files:
            if count%(0.6*30) == 0 :
                imgNum +=1
                cv2.imwrite((str(filepath.parents[0]) + "/frames/" + str(filepath.parents[0].name) + "_%d.jpg") % imgNum, image) # save frame as JPEG file
        else:
            list_of_files = glob.glob(str(filepath.parents[0]) + '/frames/*')
            latest_file = max(list_of_files, key=os.path.getctime)
            tempPath = Path(latest_file)
            lastImgNum = int(tempPath.stem.split("_", 1) [1]) + 1
            if count%(0.6*30) == 0 :
                cv2.imwrite((str(filepath.parents[0]) + "/frames/" + str(filepath.parents[0].name) + "_%d.jpg") % lastImgNum, image) # save frame as JPEG file
        count += 1

@app.route('/recolectorManos')
def HandsRecollector():
    return render_template('recolectorManos.html')

@app.route('/protocolo')
def protocol():
    return "PaginaDeBrayan"

if __name__ == '__main__':
    app.run(port=3000, debug=True)

