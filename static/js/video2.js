const  
        $dispositivosDeVideo = document.querySelector("#dispositivosDeVideo"),
        $duracion = document.querySelector("#duracion"),
        $video = document.querySelector("#video"),
        $btnComenzarGrabacion = document.querySelector("#btnComenzarGrabacion"),
        $btnDetenerGrabacion = document.querySelector("#btnDetenerGrabacion");

const comenzarAGrabar =()=>{

    if(navigator.mediaDevices){
        console.log('getUserMedia supported');
        
        var constraints = { video: true};
        var chunks = [];
        
        navigator.mediaDevices.getUserMedia(constraints).then(
            function (stream){
                var mediaRecorder = new mediaRecorder( stream);
                visualize(stream);
                $video.srcObject = stream;
                $video.play();
                mediaRecorder.start();
                console.log(mediaRecorder.state);
            }
        );
        
        
        
        
        }
}  


$btnComenzarGrabacion.addEventListener("click", comenzarAGrabar);
$btnDetenerGrabacion.addEventListener("click", detenerGrabacion);
