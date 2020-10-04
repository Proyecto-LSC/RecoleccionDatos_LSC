const  record = document.querySelector("#btnComenzarGrabacion");
const  stop  = document.querySelector("#btnDetenerGrabacion");

var video = document.querySelector("#video");
var canvas = document.querySelector("#canvas");

        var constraints = { audio: false,  video: {width: 1280 ,   height: 720}};
        let chunks = [];
        
        navigator.mediaDevices.getUserMedia(constraints)
        .then(function(mediaStream){
            video.srcObject = mediaStream;
            video.play();  
            var mediaRecorder = new MediaRecorder(mediaStream , {mimeType: "video/webm; codecs=vp9"});
            record.onclick = function (){
                console.log("pi ti ");
                mediaRecorder.start();
                console.log("hola");
                console.log(mediaRecorder.state);
                console.log("vhao");
                stop.disabled = false;
                record.disabled = true;
            }
            
            mediaRecorder.ondataavailable= function(e){
                chunks.push(e.data);
            }
            stop.onclick = function (){
                mediaRecorder.stop();
                console.log(mediaRecorder.state);
                stop.disabled = true;
                record.disabled = false;
            } 

            

            mediaRecorder.onstop = function(e){
                const blobVideo = new Blob(chunks, {type: "video/webm"} );
                
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

                // Crear una URL o enlace para descargar
                    
            }


        }).catch(
            function(err){
                console.log(err.name + ": " + err.message);});
    

    
                



        



