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
            mediaRecorder.ondataavailable = function(e) {
                recordedChunks.push(e.data);
                videoData();
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
    function videoData() {
        var blob = new Blob(recordedChunks, {
            type: "video/mp4"
        });
        sendToFlask(blob);
    }
    function sendToFlask(videoObj){
        var valorLetra = letra_actual.value;
        var fd = new FormData();
        fd.append('file', videoObj, (valorLetra+"_1.mp4"));
        $.ajax({
            type: "POST",
            url: '/guardarVideo',
            data: fd,
            processData: false,
            contentType: false,
            success: function() {
                console.log("Elemento Enviado");
            }
        });
    }
}
function nextLetra(){
	var letraNext = letra_next.value;
	var signs = ['a','b','c','d','e','f','i','k','l','m','n','o','p','q','r','t','u','v','w','x','y','espacio','parar'];
	var index = signs.indexOf(letraNext);

	document.querySelector('#letra_actual').textContent = 'Letra ' + letraNext.toUpperCase();
	document.getElementById('letra_actual').value = letraNext;
	if (letraNext!='parar'){
		document.querySelector('#letra_next').textContent = 'Letra ' + signs[index+1].toUpperCase();
		document.getElementById('letra_next').value = signs[index+1];
	}else{
		document.querySelector('#letra_next').textContent = 'Letra A';
		document.getElementById('letra_next').value = 'a';
	}
	var filename = "letra"+letraNext;
    var path = "/static/img/Signs/"+filename+".jpg";
	document.getElementById("mostrarImagen").src = path;
}