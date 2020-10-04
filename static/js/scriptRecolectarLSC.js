var video = document.querySelector(".video-element");
var record = document.getElementById("record");
var stop = document.getElementById("stop");
var letra_actual = document.getElementById("letra_actual");
var letra_next = document.getElementById("letra_next");
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

if (navigator.mediaDevices.getUserMedia) {

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
            video.srcObject = stream;
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