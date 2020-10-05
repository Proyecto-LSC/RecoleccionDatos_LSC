const record = document.querySelector("#btnComenzarGrabacion");
const stop = document.querySelector("#btnDetenerGrabacion");
const $duracion = document.querySelector("#duracion");
var video = document.querySelector("#video");
var canvas = document.querySelector("#canvas");


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
    .then(function (mediaStream) {
        video.srcObject = mediaStream;
        video.play();
        var mediaRecorder = new MediaRecorder(mediaStream, { mimeType: "video/webm; codecs=vp9" });
        record.onclick = function () {
            console.log("pi ti ");
            mediaRecorder.start();
            $('.carousel').carousel(0,{
                interval: 2000
                
              })
            comenzarAContar();
            console.log("hola");
            console.log(mediaRecorder.state);
            console.log("vhao");
            stop.disabled = false;
            record.disabled = true;
        }

        mediaRecorder.ondataavailable = function (e) {
            chunks.push(e.data);
        }

        stop.onclick = function () {
            mediaRecorder.stop();
            detenerConteo();
            console.log(mediaRecorder.state);
            stop.disabled = true;
            record.disabled = false;
        }





        mediaRecorder.onstop = function (e) {
            const blobVideo = new Blob(chunks, { type: "video/mp4" });
            chunks=[];
            
            sendToFlask(blobVideo)
            /*
            // Crear una URL o enlace para descargar
            const urlParaDescargar = URL.createObjectURL(blobVideo);

            // Crear un elemento <a> invisible para descargar el audio
            let a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            a.href = urlParaDescargar;
            a.download = "video.webm";
            // Hacer click en el enlace
            a.click();
            // Y remover el objeto
            window.URL.revokeObjectURL(urlParaDescargar);

            // Crear una URL o enlace para descargar*/

        }
    }).catch(
        function (err) {
            console.log(err.name + ": " + err.message);
        });



        function sendToFlask(videoObj){
            var fd = new FormData();
            fd.append('file', videoObj, ('Secuencia2'+"_1.mp4"));
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











