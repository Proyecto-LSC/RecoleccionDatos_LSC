var video = document.querySelector(".video-element");
var record = document.getElementById("record");
var stop = document.getElementById("stop");
var letra_actual = document.getElementById("letra_actual");
var letra_next = document.getElementById("letra_next");
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

if (navigator.mediaDevices.getUserMedia) {
    var recordedChunks = [];

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
            video.srcObject = stream;
            var mediaRecorder = new MediaRecorder(stream);

            record.onclick = function startRecording() {
                var numSec = 15;
				recordedChunks = [];
				mediaRecorder.start();
				document.getElementById("recordingIcon").style.display = 'inline-block';
				document.getElementById("textGrabando").style.display = 'inline-block';
				console.log(mediaRecorder.state);
				console.log("recorder started");
				setTimeout(event => {
					console.log("stopping");
					document.getElementById("recordingIcon").style.display = 'none';
					document.getElementById("textGrabando").style.display = 'none';
					mediaRecorder.stop();
				}, (numSec*1000));
            }
            stop.onclick = function() {
                document.getElementById("recordingIcon").style.display = 'none';
                document.getElementById("textGrabando").style.display = 'none';
                mediaRecorder.stop();
                console.log("recorder stopped");
            }
    })

    .catch(function (err0r) {
      console.log("Something went wrong!");
    });
    //es un evento en donde carga la infomación del video
    video.addEventListener('loadeddata', ()=>{
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
    })
}