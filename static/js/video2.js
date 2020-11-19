const record = document.querySelector("#btnComenzarGrabacion");
const stop = document.querySelector("#btnDetenerGrabacion");
const $duracion = document.querySelector("#duracion");
var video = document.querySelector("#video");
var canvas = document.querySelector("#canvas");
var listo = document.querySelector("#listo")

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
var constraints = { audio: false, video: { width: 1280, height: 720 } };
let chunks = [];
let tiempoInicio, idIntervalo;
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

navigator.mediaDevices.getUserMedia(constraints)
    .then(function(mediaStream) {
        video.srcObject = mediaStream;
        video.play();
        var mediaRecorder = new MediaRecorder(mediaStream, { mimeType: "video/webm; codecs=vp9" });
        record.onclick = function() {
            var numSec = 112;
            console.log("pi ti ");
            mediaRecorder.start();
            /*$('.carousel').carousel(0,{
                interval: 2000
                
              })*/
            comenzarAContar();
            console.log("hola");
            console.log(mediaRecorder.state);
            console.log("vhao");
            stop.disabled = false;
            record.disabled = true;
            setTimeout(event => {
                console.log("stopping");
                mediaRecorder.stop();
                detenerConteo();
                stop.disabled = true;
                record.disabled = false;
            }, (numSec * 1000));
        }

        mediaRecorder.ondataavailable = function(e) {
            chunks.push(e.data);
        }

        stop.onclick = function() {
            mediaRecorder.stop();
            detenerConteo();
            console.log(mediaRecorder.state);
            stop.disabled = true;
            record.disabled = false;
        }

        mediaRecorder.onstop = function(e) {
            const blobVideo = new Blob(chunks, { type: "video/mp4" });
            chunks = [];

            sendToFlask(blobVideo)
        }
    }).catch(
        function(err) {
            console.log(err.name + ": " + err.message);
        });



function sendToFlask(videoObj) {
    var fd = new FormData();
    fd.append('file', videoObj, ('Secuencia1' + "_1.mp4"));
    $.ajax({
        type: "POST",
        url: '/guardarVideoMano',
        data: fd,
        processData: false,
        contentType: false,
        success: function() {
            console.log("Elemento Enviado");
        }
    });
}


function muestra_oculta() {
    var el = document.getElementById("imagenesCarou");
    var ela = document.getElementById("grabar"); //se define la variable "el" igual a nuestro div
    el.style.display = (el.style.display == 'none') ? 'block' : 'none'; //damos un atributo display:none que oculta el div
    ela.style.display = (ela.style.display == 'none') ? 'block' : 'none';
}

listo.onclick = function() {
    var gravar = document.getElementById("grabar");
    gravar.style.display = (gravar.style.display = 'none') ? 'block' : 'none';
    var ela = document.getElementById("imagenesCarou");
    ela.style.display = (ela.style.display == 'none') ? 'block' : 'none';
    var el = document.getElementById("instrucciones");
    el.style.display = (el.style.display == 'none') ? 'block' : 'none'; //damos un atributo display:none que oculta el div
}


muestra_oculta();