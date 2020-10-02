const  
        $dispositivosDeVideo = document.querySelector("#dispositivosDeVideo"),
        $duracion = document.querySelector("#duracion"),
        $video = document.querySelector("#video"),
        $btnComenzarGrabacion = document.querySelector("#btnComenzarGrabacion"),
        $btnDetenerGrabacion = document.querySelector("#btnDetenerGrabacion");



if(navigator.mediaDevices.getUserMedia){
    console.log('getUserMedia supported');
    
    var constraints = { video: true};
    var chunks = [];
    
    let onSuccess = function(stream) {
        const mediaRecorder = new mediaRecorder(stream);
        visualize(stream)

        $btnComenzarGrabacion.onclick = function (){
            $video.srcObject = stream;
            $video.play();
            mediaRecorder.start()
            console.log(mediaRecorder.state);
            stop.disabled = false;
            record.disabled = true;
        }

        $btnDetenerGrabacion.onclick = function (){
            mediaRecorder.stop();
            console.log(mediaRecorder.state);
            stop.disabled = true;
            record.disabled = false;
        }
    }

}

        



