/* ------------------------------------------------
       FUNCTIONS
       
-------------------------------------------------*/
/* --------------- HELPERS --------------------*/
const getAbsoluteX = (element) => {
    if(element == document.body){//be carefull if margin/padding of body is not 0
        return 0;
    } else if(element.offsetParent == null){//fulscreen
        return 0;
    } else {
        return getAbsoluteX(element.offsetParent) + element.offsetLeft;
    }
}

const secondsTo_hhmmss = (sec) => {
    let minutes = (sec - (sec % 60)) / 60;
    let seconds = sec % 60;
    let hours = (minutes - (minutes % 60)) / 60;
    minutes = minutes % 60;
    return [hours, minutes, seconds]
}


/* --------------- UPDATEVOLUME --------------------*/
//value between 0 - 100
function updateVolume(value) {
    //normalize
    value = value < 0 ? 0 : value;
    value = value > 100 ? 100 : value;

    //set volume of video
    video.volume = value/100;
    
    //gui
    updateVolumeIcon(value);
    volumeslider.value = value;
    volumesliderfill.style.width = `${volumeslider.value/2}px`;
}

function updateVolumeIcon(value){
    if(value > 50){
        volume.src = "img/volumeloud.svg";
        video.muted = false;
    } else if(value > 0) {
        volume.src = "img/volumelow.svg";
        video.muted = false;
    } else {//0
        volume.src = "img/muted.svg";
    }
}


/* --------------- UPDATEPROGRESSBAR --------------------*/
//value between 0 and the width of the progressbar
function updateProgressBar(value) {
    //normalize
    value = value < 0 ? 0 : value;
    value = value > progressbar.offsetWidth ? progressbar.offsetWidth : value;

    //set positon of red dot
    currentposition.style.left = `${value}px`;
    
    value = value / progressbar.offsetWidth; //percent value
    //set progressbarvalue and videotime
    video.currentTime = video.duration * value;
    progressbar.value = progressbar.max * value;
}


/* --------------- TOGGLEPLAY --------------------*/
//stop/start playing
const togglePlay = (state) => {//play or pause
    if(state == "play"){
        video.play();
        //gui
        playpause.src = "img/pause.svg";
        stateimg.src = "img/pause.svg";
        statecontainer.style.display = "block";
        setTimeout(() => {
            statecontainer.style.display = "none";
        }, 500);

    } else {
        video.pause();
        //gui
        playpause.src = "img/play.svg";
        stateimg.src = "img/play.svg";
        statecontainer.style.display = "block";
        setTimeout(() => {
            statecontainer.style.display = "none";
        }, 500);
    }
}


/* --------------- TOGGLEMUTE --------------------*/
const toggleMute = (state) => {//mute or unmute
    if(state == "unmute"){
        video.muted = false;
        volume.src = "img/volumeloud.svg";
    } else {
        video.muted = true;
        volume.src = "img/muted.svg";
    }
}


/* --------------- TOGGLEFULLSCREEN --------------------*/
const toggleFullScreen = (ev) => {
    if(document.fullscreenElement == videoplayer){
        document.exitFullscreen();
        fullscreen.src = "img/enterfullscreen.svg";
    } else {
        videoplayer.requestFullscreen();
        fullscreen.src = "img/leavefullscreen.svg";
    }
};


/* ------------------------------------------------
       MAIN
       
-------------------------------------------------*/
/* ------------------------------------------------
       VIDEOPLAYER
       
-------------------------------------------------*/
var videoplayer = document.querySelector(".videoplayer");

/* --------------- HIDE OR SHOW CONTROLS --------------------*/
videoplayer.addEventListener('mouseenter', (ev) => {
    videocontrols.style.visibility = "visible";
    clearTimeout(hidecontrolstimeout);
    hidecontrolstimeout = setTimeout(() => {
        videocontrols.style.visibility = "hidden";
    }, 3000);
});

videoplayer.addEventListener('mouseleave', (ev) => {
    videocontrols.style.visibility = "hidden";
});

videoplayer.addEventListener('mousemove', (ev) => {
    videocontrols.style.visibility = "visible";
    clearTimeout(hidecontrolstimeout);
    hidecontrolstimeout = setTimeout(() => {
        videocontrols.style.visibility = "hidden"
    }, 3000);
});


/* --------------- VIDEOCONTAINER --------------------*/
var videocontainer = document.querySelector(".videos");

/* --------------- PLAY/PAUSE --------------------*/
videocontainer.addEventListener('click', (ev) => {
    if(video.paused){
        togglePlay("play");
    } else {
        togglePlay("pause");
    }
});

/* --------------- VIDEO --------------------*/
var video = document.querySelector(".video");
//set statevalue for value
video.volume = 0.3;

/* --------------- TIME AND PROGRESSBAR --------------------*/
video.addEventListener('loadedmetadata', () => {
    //show time
    let timeconverted = secondsTo_hhmmss(Math.round(video.duration));

    let hours = timeconverted[0] ? timeconverted[0] + ":": "";
    let minutes = timeconverted[1] ? timeconverted[1] + ":": "";
    let seconds = (timeconverted[2] < 10 ? "0" : "") + timeconverted[2];
    time.innerHTML = `0:00 / ${hours}${minutes}${seconds}`;
    videolength = `${hours}${minutes}${seconds}`;
    //set progressbar
    progressbar.max = video.duration;
});

video.addEventListener('timeupdate', (ev) => {
    progressbar.value = video.currentTime;
    let videoprogress = video.currentTime / video.duration;
    currentposition.style.left = `${progressbar.offsetWidth * videoprogress}px`;
    let currenttimeconverted = secondsTo_hhmmss(Math.round(video.currentTime));
    let hours = currenttimeconverted[0] ? currenttimeconverted[0] + ":": "";
    let minutes = currenttimeconverted[1] ? currenttimeconverted[1] + ":": "0:";
    let seconds = (currenttimeconverted[2] < 10 ? "0" : "") + currenttimeconverted[2];
    time.innerHTML = `${hours}${minutes}${seconds} / ${videolength}`;
});

video.addEventListener('ended', (ev) => {
    
});


/* --------------- SHADOW VIDEO --------------------*/
//get frames for the preview from this video
var shadow = document.querySelector(".shadow-video");


/* ------------------------------------------------
       PLAYER ELEMENTS
       
-------------------------------------------------*/
/* --------------- VIDEOSTATE  --------------------*/
var statecontainer = document.querySelector(".video-state-container");
var stateimg = document.querySelector(".state-img");


/* --------------- CANVAS FOR SKIP AHEAD PREVIEW --------------------*/
var canvas = document.querySelector(".preview-canvas");
var canvascontext = canvas.getContext("2d");


/* --------------- VIDEO CONTROLS --------------------*/
var videocontrols = document.querySelector(".video-controls");


/* ------------------------------------------------
       PROGRESSBAR
       
-------------------------------------------------*/
/* --------------- PROGRESSCONTAINER --------------------*/
var progresscontainer = document.querySelector(".progress");

/* --------------- SKIP AHEAD --------------------*/
progresscontainer.addEventListener('mousedown', (ev) => {
    let value = ev.pageX - getAbsoluteX(progressbar);
    updateProgressBar(value);
    progressDown = true;
});

/* --------------- ShOW/HIDE POSITION DOT AND PREVIEW CANVAS --------------------*/
progresscontainer.addEventListener('mouseenter', (ev) => {
    currentposition.style.display = "block";
    canvas.style.display = "flex";
});

progresscontainer.addEventListener('mouseleave', (ev) => {
    currentposition.style.display = "none";
    canvas.style.display = "none";
});

/* --------------- SKIP AHEAD PREVIEW --------------------*/
progresscontainer.addEventListener('mousemove', (ev) => {
    let value = ev.pageX - getAbsoluteX(progressbar);
    
    //position canvas
    cvposition = value - canvas.offsetWidth/2; 
    cvposition = cvposition < 10 ? 10 : cvposition;
    cvposition = (video.videoWidth - cvposition) < 10 + canvas.offsetWidth ? video.videoWidth - (canvas.offsetWidth + 10) : cvposition;
    canvas.style.left = `${cvposition}px`;

    //get frame from shadow video and paint on canvas
    value = value / progressbar.offsetWidth; //percent value
    let timestamp = video.duration * value;
    shadow.currentTime = timestamp;
    canvascontext.drawImage(shadow, 0, 0, video.videoWidth, video.videoHeight, 0, 0, canvas.width, canvas.height);
});

/* --------------- PROGRESSBAR --------------------*/
var progressbar = document.querySelector(".video-progress");
var currentposition = document.querySelector(".current-position");


/* --------------- CONTROLS --------------------*/
var controls = document.querySelector(".controls");


/* ------------------------------------------------
       LEFT CONTROLS
       
-------------------------------------------------*/
var playpause = document.querySelector(".playpause");


/* --------------- PLAY/PAUSE --------------------*/
playpause.addEventListener('click', (ev) => {
    if(video.paused){
        togglePlay("play");
    } else {
        togglePlay("pause");
    }
});


/* --------------- VOLUME --------------------*/
var volumecontrol = document.querySelector(".volume-control")

/* --------------- SHOW/HIDE VOLUMESLIDER --------------------*/
volumecontrol.addEventListener('mouseenter', (ev) => {
    volumeslidercontainer.style.display = "flex";
});

volumecontrol.addEventListener('mouseleave', (ev) => {
    volumeslidercontainer.style.display = "none";
});

/* --------------- MUTE/UNMUTE VIDEO --------------------*/
var volume = document.querySelector(".volume");

volume.addEventListener('click', (ev) => {
    if(video.muted){
        toggleMute("unmute");
    } else {
        toggleMute("mute");
    }
});

/* --------------- VOLUMESLIDER CONTAINER --------------------*/
var volumeslidercontainer = document.querySelector(".volume-slider-container");

/* --------------- VOLUMESLIDER --------------------*/
var volumeslider = document.querySelector(".volume-slider");

/* --------------- CHANGE VOLUME --------------------*/
//click
volumeslider.addEventListener('mousedown', (ev) => {
    let value = ev.pageX - getAbsoluteX(volumeslider);
    value = value * 2;
    updateVolume(value);
});
//slide
volumeslider.addEventListener('mousemove', (ev) => {
    if(mouseDown){
        let value = ev.pageX - getAbsoluteX(volumeslider);
        value = value * 2;
        updateVolume(value);
    }
});
//scroll
volumeslider.addEventListener('wheel', (ev) => {
    if(ev.deltaY < 0){
        volumeslider.value = parseFloat(volumeslider.value) + 10;
    } else {
        volumeslider.value = volumeslider.value - 10;
    }
    video.volume = volumeslider.value/100;
    volumesliderfill.style.width = `${volumeslider.value/2}px`;
    updateVolumeIcon(volumeslider.value);
})

/* --------------- VOLUMESLIDER FILL --------------------*/
var volumesliderfill = document.querySelector(".volume-slider-fill");


/* --------------- TIME --------------------*/
var time = document.querySelector(".time-span")

/* ------------------------------------------------
       RIGHT CONTROLS
       
-------------------------------------------------*/
/* --------------- FULLSCREEN --------------------*/
var fullscreen = document.querySelector(".fullscreen");

/* --------------- TOGGLE FULLSCREEN --------------------*/
fullscreen.addEventListener('click', toggleFullScreen);

/* --------------- STATE VARIABLES --------------------*/
var mouseDown = false;
var progressDown = false;
var hidecontrolstimeout;
var videolength;

/* --------------- DOCUMENT --------------------*/
/* --------------- SET STATE VARIABLE --------------------*/
document.body.onmousedown = function() { 
    mouseDown = true;
}

/* --------------- 
RESET STATE VARIABLES + 
CONTINUE PLAYING AFTER DRAG OF POSITIONDOT
 --------------------*/
document.body.onmouseup = function() {    
    if(progressDown && !video.ended){
        togglePlay("play");
    }
    mouseDown = false;
    progressDown = false;
}

/* --------------- UPDATE PROGRESSBAR --------------------*/
//if drag started on progressbar continue on document
document.addEventListener('mousemove', (ev) => {
    if(progressDown){
        if(!video.paused){
            togglePlay("pause");
        }
        currentposition.style.display = "block";
        let value = ev.pageX - getAbsoluteX(progressbar);
        updateProgressBar(value);
    }
});

/* --------------- WINDOW --------------------*/
//if drag of positiondot release it on cursor moving out of window
window.addEventListener('mouseleave', (ev) => {
    if(ev.toElement == null){
        mouseDown = false;
        if(progressDown && !video.ended){
            togglePlay("play");
        }
        progressDown = false;
    }
});

document.addEventListener('dragstart', (ev) => {
    console.log(ev);
});
