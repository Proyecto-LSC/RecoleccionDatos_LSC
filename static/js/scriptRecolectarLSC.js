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

/*const antesGrabacion = () => {
    document.getElementById("inicioTimer").style.display = 'inline-block';
    document.getElementById("circle").style.display = 'inline-flex';
    var numSeg = 5;
    for (let i = 1; i <= 5; i++) {
        document.querySelector('#circle').textContent = numSeg;
        setTimeout(() => console.log(`#${i}`), 1000 * i);
        numSeg -= 1;
    }
    document.getElementById("inicioTimer").style.display = 'none';
    document.getElementById("circle").style.display = 'none';
}*/

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
                comenzarAContar();
				document.getElementById("recordingIcon").style.display = 'inline-block';
				document.getElementById("textGrabando").style.display = 'inline-block';
				console.log(mediaRecorder.state);
				console.log("recorder started");
				setTimeout(event => {
					console.log("stopping");
					document.getElementById("recordingIcon").style.display = 'none';
					document.getElementById("textGrabando").style.display = 'none';
                    mediaRecorder.stop();
                    detenerConteo();
				}, (numSec*1000));
            }
            stop.onclick = function() {
                document.getElementById("recordingIcon").style.display = 'none';
                document.getElementById("textGrabando").style.display = 'none';
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