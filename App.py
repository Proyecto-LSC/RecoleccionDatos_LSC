import os, glob, cv2
from flask import Flask, render_template, request, Response
from pathlib import Path

app = Flask(__name__)

@app.route('/')
def Index():
    return render_template("recolectarLSC.html")

@app.route("/guardarVideoMano", methods=['POST'])
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
            
    video2frames(filepath)
            
            
    return Response("success")


@app.route("/guardarVideo", methods=['POST'])
def getVideo():
    video = request.files['file']
    
    if video.filename!='ñ_1.mp4':
        filename = video.filename
    else:
        filename = 'ne_1.mp4'

    datasetPath = "static/Dataset_LSC/"
    Path(datasetPath).mkdir(parents=True, exist_ok=True)
    fullpath = datasetPath + filename[:-6] + "/"
    Path(fullpath).mkdir(parents=True, exist_ok=True)
    Path(fullpath + "frames/").mkdir(parents=True, exist_ok=True)
    Path(fullpath + "videos/").mkdir(parents=True, exist_ok=True)
    filepath = Path(fullpath + "videos/" + filename)
    if video:
        if not (os.path.isfile(filepath)):
            video.save(filepath)
        else:
            list_of_files = glob.glob(str(filepath.parents[0]) + "/*")
            latest_file = max(list_of_files, key=os.path.getctime)
            tempPath = Path(latest_file)
            lastVideoNum = int(tempPath.stem.split("_") [1]) + 1
            filename = str(filepath.parents[1].name) + "_" + str(lastVideoNum) + ".mp4"
            video.save(fullpath + "videos/" + filename)
            filepath = Path(fullpath + "videos/" + filename)   
    video2frames(filepath)
    return Response("success")


def video2frames(filepath):
    vidcap = cv2.VideoCapture(str(filepath))
    list_of_files = glob.glob(str(filepath.parents[1]) + '/frames/*')
    success = True
    fps = vidcap.get(cv2.CAP_PROP_FPS)
    count = 0
    imgNum = 0
    
    if (fps==1000):
        fps=30
    else:
        fps=15

    while success:
        success,image = vidcap.read()
        if not list_of_files:
            if count%(0.6*fps) == 0 :
                imgNum +=1
                cv2.imwrite((str(filepath.parents[1]) + "/frames/" + str(filepath.parents[1].name) + "_%d.jpg") % imgNum, image) # save frame as JPEG file
        else:
            list_of_files = glob.glob(str(filepath.parents[1]) + '/frames/*')
            latest_file = max(list_of_files, key=os.path.getctime)
            tempPath = Path(latest_file)
            lastImgNum = int(tempPath.stem.split("_") [1]) + 1
            if count%(0.6*fps) == 0 :
                cv2.imwrite((str(filepath.parents[1]) + "/frames/" + str(filepath.parents[1].name) + "_%d.jpg") % lastImgNum, image) # save frame as JPEG file
        count += 1

@app.route('/recolectorManos')
def HandsRecollector():
    return render_template('recolectorManos.html')

@app.route('/protocolo')
def protocol():
    return "PaginaDeBrayan"

if __name__ == '__main__':
    app.run(port=3000, debug=True)

