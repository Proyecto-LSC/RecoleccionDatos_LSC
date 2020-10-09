var video = document.querySelector(".video-element");
var record = document.getElementById("record");
var stop = document.getElementById("stop");
var letra_actual = document.getElementById("letra_actual");
var letra_next = document.getElementById("letra_next");
let tiempoInicio, idIntervalo;
const $duracion = document.querySelector("#duracionVideo");
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

const segundosATiempo = numeroDeSegundos => {
    let horas = Math.floor(numeroDeSegundos / 60 / 60);
    numeroDeSegundos -= horas * 60 * 60;
    let minutos = Math.floor(numeroDeSegundos / 60);
    numeroDeSegundos -= minutos * 60;
    numeroDeSegundos = parseInt(numeroDeSegundos);
    if (horas < 10) horas = "0" + horas;
    if (minutos < 10) minutos = "0" + minutos;
    if (numeroDeSegundos < 10) numeroDeSegundos = "0" + numeroDeSegundos;

    return `${horas}:${minutos}:${numeroDeSegundos}`;
};

const refrescar = () => {
    $duracion.textContent = segundosATiempo((Date.now() - tiempoInicio) / 1000);
}

const comenzarAContar = () => {
    tiempoInicio = Date.now();
    idIntervalo = setInterval(refrescar, 500);
};

const detenerConteo = () => {
    clearInterval(idIntervalo);
    tiempoInicio = null;
    $duracion.textContent = "";
}

function antesGrabacion(){
    document.getElementById("inicioTimer").style.display = 'inline-block';
    document.getElementById("circle").style.display = 'inline-flex';
    (function loop (i) {          
        countdown = setTimeout(function () {   
            document.querySelector("#circle").textContent = i;            
            if (i--) loop(i); // call the function until end
        }, 1000); // 1 second delay
    })(3);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

if (navigator.mediaDevices.getUserMedia) {
    var recordedChunks = [];

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
            video.srcObject = stream;
            
            var mediaRecorder = new MediaRecorder(stream);

            record.onclick = async function startRecording() {
                document.getElementById("record").style.display = 'none';
                antesGrabacion();
                await sleep(5000);
                var numSec = 15;
                recordedChunks = [];
                mediaRecorder.start();
                comenzarAContar();
				document.getElementById("recordingIcon").style.display = 'inline-block';
				document.getElementById("textGrabando").style.display = 'inline-block';
				console.log(mediaRecorder.state);
				console.log("recorder started");
				setTimeout(event => {
					console.log("stopping");
					document.getElementById("recordingIcon").style.display = 'none';
                    document.getElementById("textGrabando").style.display = 'none';
                    document.getElementById("record").style.display = 'inline-block';
                    mediaRecorder.stop();
                    detenerConteo();
				}, (numSec*1000));
            }
            stop.onclick = function() {
                document.getElementById("recordingIcon").style.display = 'none';
                document.getElementById("textGrabando").style.display = 'none';
                document.getElementById("record").style.display = 'inline-block';
                mediaRecorder.stop();
                detenerConteo();
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
    document.getElementById("mostrarVideo").pause();
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
    var pathImg = "/static/img/Signs/"+filename+".jpg";
    var pathVideo = "/static/videos/Signs/"+filename+".mp4";
    document.getElementById("mostrarImagen").src = pathImg;
    document.getElementById("sourceVideo").src = pathVideo;
    document.getElementById("mostrarVideo").load();
    document.getElementById("mostrarVideo").play();
}