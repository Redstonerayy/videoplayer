/* ------------------------------------------------
       VIDEOPLAYER CLASS
       
-------------------------------------------------*/

class VideoPlayer{
    constructor(id){
        //initialize player
        //use queryselector with complete paths
        //to make using multiple players possible

        /* ------------------------------------------------
            VIDEOPLAYER
            
        -------------------------------------------------*/
        this.videoplayer = document.querySelector(`#${id}`);

        /* --------------- HIDE OR SHOW CONTROLS --------------------*/
        this.videoplayer.addEventListener('mouseenter', (ev) => {
            this.videocontrols.style.visibility = "visible";
            clearTimeout(this.hidecontrolstimeout);
            this.hidecontrolstimeout = setTimeout(() => {
                this.videocontrols.style.visibility = "hidden";
            }, 3000);
        });

        this.videoplayer.addEventListener('mouseleave', (ev) => {
            this.videocontrols.style.visibility = "hidden";
        });

        this.videoplayer.addEventListener('mousemove', (ev) => {
            this.videocontrols.style.visibility = "visible";
            clearTimeout(this.hidecontrolstimeout);
            if(!this.mouseovercontrols){
                this.hidecontrolstimeout = setTimeout(() => {
                    this.videocontrols.style.visibility = "hidden"
                }, 3000);
            }
        });


        /* --------------- VIDEOCONTAINER --------------------*/
        this.videocontainer = document.querySelector(`#${id} > .videos`);

        /* --------------- PLAY/PAUSE --------------------*/
        this.videocontainer.addEventListener('click', (ev) => {
            if(this.video.paused){
                this.togglePlay("play");
            } else {
                this.togglePlay("pause");
            }
        });

        /* --------------- VIDEO --------------------*/
        this.video = document.querySelector(`#${id} > .videos > .video`);
        //set statevalue for value
        this.video.volume = 0.3;

        /* --------------- TIME AND PROGRESSBAR --------------------*/
        this.video.addEventListener('loadedmetadata', (ev) => {
            //show time
            let timeconverted = this.secondsTo_hhmmss(Math.round(this.video.duration));

            let hours = timeconverted[0] ? timeconverted[0] + ":": "";
            let minutes = timeconverted[1] ? timeconverted[1] + ":": "";
            let seconds = (timeconverted[2] < 10 ? "0" : "") + timeconverted[2];
            this.time.innerHTML = `0:00 / ${hours}${minutes}${seconds}`;
            this.videolength = `${hours}${minutes}${seconds}`;
            //set progressbar
            this.progressbar.max = this.video.duration;
        });

        this.video.addEventListener('timeupdate', (ev) => {
            this.progressbar.value = this.video.currentTime;
            let videoprogress = this.video.currentTime / this.video.duration;
            this.currentposition.style.left = `${this.progressbar.offsetWidth * videoprogress}px`;
            let currenttimeconverted = this.secondsTo_hhmmss(Math.round(this.video.currentTime));
            let hours = currenttimeconverted[0] ? currenttimeconverted[0] + ":": "";
            let minutes = currenttimeconverted[1] ? currenttimeconverted[1] + ":": "0:";
            let seconds = (currenttimeconverted[2] < 10 ? "0" : "") + currenttimeconverted[2];
            this.time.innerHTML = `${hours}${minutes}${seconds} / ${this.videolength}`;
        });

        this.video.addEventListener('ended', (ev) => {
            
        });


        /* --------------- SHADOW VIDEO --------------------*/
        //get frames for the preview from this video
        this.shadowvideo = document.querySelector(`#${id} > .videos > .shadow-video`);


        /* ------------------------------------------------
            PLAYER ELEMENTS
            
        -------------------------------------------------*/
        /* --------------- VIDEOSTATE  --------------------*/
        this.statecontainer = document.querySelector(`#${id} > .video-state-container`);
        this.stateimg = document.querySelector(`#${id} > .video-state-container > .state-img`);


        /* --------------- CANVAS FOR SKIP AHEAD PREVIEW --------------------*/
        this.canvas = document.querySelector(`#${id} > .preview-canvas`);
        this.canvascontext = this.canvas.getContext("2d");


        /* --------------- VIDEO CONTROLS --------------------*/
        this.videocontrols = document.querySelector(`#${id} > .video-controls`);

        //prevent hide if mouse is over it
        this.videocontrols.addEventListener('mouseenter', (ev) => {
            this.mouseovercontrols = true;
        });

        this.videocontrols.addEventListener('mouseleave', (ev) => {
            this.mouseovercontrols = false;
        });

        /* ------------------------------------------------
            PROGRESSBAR
            
        -------------------------------------------------*/
        /* --------------- PROGRESSCONTAINER --------------------*/
        this.progresscontainer = document.querySelector(`#${id} > .video-controls > .progress`);

        /* --------------- SKIP AHEAD --------------------*/
        this.progresscontainer.addEventListener('mousedown', (ev) => {
            let value = ev.pageX - this.getAbsoluteX(this.progressbar);
            this.updateProgressBar(value);
            this.progressDown = true;
        });

        /* --------------- ShOW/HIDE POSITION DOT AND PREVIEW CANVAS --------------------*/
        this.progresscontainer.addEventListener('mouseenter', (ev) => {
            this.currentposition.style.display = "block";
            this.canvas.style.display = "flex";
        });

        this.progresscontainer.addEventListener('mouseleave', (ev) => {
            this.currentposition.style.display = "none";
            this.canvas.style.display = "none";
        });

        /* --------------- SKIP AHEAD PREVIEW --------------------*/
        this.progresscontainer.addEventListener('mousemove', (ev) => {
            let value = ev.pageX - this.getAbsoluteX(this.progressbar);
            
            //position canvas
            let cvposition = value - this.canvas.offsetWidth/2; 
            cvposition = cvposition < 10 ? 10 : cvposition;
            cvposition = (this.video.videoWidth - cvposition) < 10 + this.canvas.offsetWidth ? this.video.videoWidth - (this.canvas.offsetWidth + 10) : cvposition;
            this.canvas.style.left = `${cvposition}px`;

            //get frame from shadow video and paint on canvas
            value = value / this.progressbar.offsetWidth; //percent value
            let timestamp = this.video.duration * value;
            this.shadowvideo.currentTime = timestamp;
            this.canvascontext.drawImage(this.shadowvideo, 0, 0, this.video.videoWidth, this.video.videoHeight, 0, 0, this.canvas.width, this.canvas.height);
        });

        /* --------------- PROGRESSBAR --------------------*/
        this.progressbar = document.querySelector(`#${id} > .video-controls > .progress > .video-progress`);
        this.currentposition = document.querySelector(`#${id} > .video-controls > .progress > .current-position`);


        /* --------------- CONTROLS --------------------*/
        this.controls = document.querySelector(`#${id} > .video-controls > .controls`);


        /* ------------------------------------------------
            LEFT CONTROLS
        
        -------------------------------------------------*/
        this.playpause = document.querySelector(`#${id} > .video-controls > .controls > .left-controls > .track-controls > .playpause`);


        /* --------------- PLAY/PAUSE --------------------*/
        this.playpause.addEventListener('click', (ev) => {
            if(this.video.paused){
                this.togglePlay("play");
            } else {
                this.togglePlay("pause");
            }
        });


        /* --------------- VOLUME --------------------*/
        this.volumecontrol = document.querySelector(`#${id} > .video-controls > .controls > .left-controls > .volume-control`);

        /* --------------- CHANGE VOLUME --------------------*/
        //scroll
        this.volumecontrol.addEventListener('wheel', (ev) => {
            if(ev.deltaY < 0){
                this.volumeslider.value = parseFloat(this.volumeslider.value) + 10;
            } else {
                this.volumeslider.value = this.volumeslider.value - 10;
            }
            this.video.volume = this.volumeslider.value/100;
            this.volumesliderfill.style.width = `${this.volumeslider.value/2}px`;
            this.updateVolumeIcon(this.volumeslider.value);
        })

        /* --------------- SHOW/HIDE VOLUMESLIDER --------------------*/
        this.volumecontrol.addEventListener('mouseenter', (ev) => {
            this.volumeslidercontainer.style.display = "flex";
        });

        this.volumecontrol.addEventListener('mouseleave', (ev) => {
            this.volumeslidercontainer.style.display = "none";
        });

        /* --------------- MUTE/UNMUTE VIDEO --------------------*/
        this.volume = document.querySelector(`#${id} > .video-controls > .controls > .left-controls > .volume-control > .volume`);

        this.volume.addEventListener('click', (ev) => {
            if(this.video.muted){
                this.toggleMute("unmute");
            } else {
                this.toggleMute("mute");
            }
        });

        /* --------------- VOLUMESLIDER CONTAINER --------------------*/
        this.volumeslidercontainer = document.querySelector(`#${id} > .video-controls > .controls > .left-controls > .volume-control > .volume-slider-container`);

        /* --------------- VOLUMESLIDER --------------------*/
        this.volumeslider = document.querySelector(`#${id} > .video-controls > .controls > .left-controls > .volume-control > .volume-slider-container > .volume-slider`);

        /* --------------- CHANGE VOLUME --------------------*/
        //click
        this.volumeslider.addEventListener('mousedown', (ev) => {
            let value = ev.pageX - this.getAbsoluteX(this.volumeslider);
            value = value * 2;
            this.updateVolume(value);
        });
        //slide
        this.volumeslider.addEventListener('mousemove', (ev) => {
            if(this.mouseDown){
                let value = ev.pageX - this.getAbsoluteX(this.volumeslider);
                value = value * 2;
                this.updateVolume(value);
            }
        });

        /* --------------- VOLUMESLIDER FILL --------------------*/
        this.volumesliderfill = document.querySelector(`#${id} > .video-controls > .controls > .left-controls > .volume-control > .volume-slider-container > .volume-slider-fill`);


        /* --------------- TIME --------------------*/
        this.time = document.querySelector(`#${id} > .video-controls > .controls > .left-controls > .time > .time-span`);

        /* ------------------------------------------------
            RIGHT CONTROLS
            
        -------------------------------------------------*/
        /* --------------- FULLSCREEN --------------------*/
        this.fullscreen = document.querySelector(`#${id} > .video-controls > .controls > .right-controls > .screen-modes > .fullscreen`);

        /* --------------- TOGGLE FULLSCREEN --------------------*/
        this.fullscreen.addEventListener('click', (ev) => {
            this.toggleFullScreen();
        });

        /* --------------- STATE VARIABLES --------------------*/
        this.mouseDown = false;
        this.progressDown = false;
        this.hidecontrolstimeout = undefined;
        this.videolength = undefined;

        /* --------------- DOCUMENT --------------------*/
        /* --------------- SET STATE VARIABLE --------------------*/

        document.addEventListener('mousedown', () => { 
            this.mouseDown = true;
        });

        /* --------------- 
        RESET STATE VARIABLES + 
        CONTINUE PLAYING AFTER DRAG OF POSITIONDOT
        --------------------*/
        document.addEventListener('mouseup', () => {    
            if(this.progressDown && !this.video.ended){
                this.togglePlay("play");
            }
            this.mouseDown = false;
            this.progressDown = false;
        });

        /* --------------- UPDATE PROGRESSBAR --------------------*/
        //if drag started on progressbar continue on document
        document.addEventListener('mousemove', (ev) => {
            if(this.progressDown){
                if(!this.video.paused){
                    this.togglePlay("pause");
                }
                this.currentposition.style.display = "block";
                let value = ev.pageX - this.getAbsoluteX(this.progressbar);
                this.updateProgressBar(value);
            }
        });
        
        /* --------------- WINDOW --------------------*/
        //if drag of positiondot release it on cursor moving out of window
        window.addEventListener('mouseleave', (ev) => {
            if(ev.toElement == null){
                this.mouseDown = false;
                if(this.progressDown && !this.video.ended){
                    this.togglePlay("play");
                }
                this.progressDown = false;
            }
        });
    }


    /* --------------- HELPERS --------------------*/
    getAbsoluteX(element){
        if(element == document.body){//be carefull if margin/padding of body is not 0
            return 0;
        } else if(element.offsetParent == null){//fulscreen
            return 0;
        } else {
            return this.getAbsoluteX(element.offsetParent) + element.offsetLeft;
        }
    }

    secondsTo_hhmmss(sec){
        let minutes = (sec - (sec % 60)) / 60;
        let seconds = sec % 60;
        let hours = (minutes - (minutes % 60)) / 60;
        minutes = minutes % 60;
        return [hours, minutes, seconds]
    }


    /* --------------- UPDATEVOLUME --------------------*/
    //value between 0 - 100
    updateVolume(value){
        //normalize
        value = value < 0 ? 0 : value;
        value = value > 100 ? 100 : value;

        //set volume of video
        this.video.volume = value/100;
        
        //gui
        this.updateVolumeIcon(value);
        this.volumeslider.value = value;
        this.volumesliderfill.style.width = `${this.volumeslider.value/2}px`;
    }

    updateVolumeIcon(value){
        if(value > 50){
            this.volume.src = "img/volumeloud.svg";
            this.video.muted = false;
        } else if(value > 0) {
            this.volume.src = "img/volumelow.svg";
            this.video.muted = false;
        } else {//0
            this.volume.src = "img/muted.svg";
        }
    }


    /* --------------- UPDATEPROGRESSBAR --------------------*/
    //value between 0 and the width of the progressbar
    updateProgressBar(value){
        //normalize
        value = value < 0 ? 0 : value;
        value = value > this.progressbar.offsetWidth ? this.progressbar.offsetWidth : value;

        //set positon of red dot
        this.currentposition.style.left = `${value}px`;
        
        value = value / this.progressbar.offsetWidth; //percent value
        //set progressbarvalue and videotime
        this.video.currentTime = this.video.duration * value;
        this.progressbar.value = this.progressbar.max * value;
    }


    /* --------------- TOGGLEPLAY --------------------*/
    //stop/start playing
    togglePlay(state){//play or pause
        if(state == "play"){
            this.video.play();
            //gui
            this.playpause.src = "img/pause.svg";
            this.stateimg.src = "img/pause.svg";
            this.statecontainer.style.display = "block";
            this.statecontainerhide = setTimeout(() => {
                this.statecontainer.style.display = "none";
            }, 500);

            this.videocontrols.style.visibility = "visible";
            this.hidecontrolstimeout = setTimeout(() => {
                this.videocontrols.style.visibility = "hidden";                
            }, 3000);
        } else {
            this.video.pause();
            //gui
            this.playpause.src = "img/play.svg";
            this.stateimg.src = "img/play.svg";
            this.statecontainer.style.display = "block";
            this.statecontainerhide = setTimeout(() => {
                this.statecontainer.style.display = "none";
            }, 500);

            this.videocontrols.style.visibility = "visible";
            clearInterval(this.hidecontrolstimeout);
            this.hidecontrolstimeout = null;
        }
    }


    /* --------------- TOGGLEMUTE --------------------*/
    toggleMute(state){//mute or unmute
        if(state == "unmute"){
            this.video.muted = false;
            this.volume.src = "img/volumeloud.svg";
        } else {
            this.video.muted = true;
            this.volume.src = "img/muted.svg";
        }
    }


    /* --------------- TOGGLEFULLSCREEN --------------------*/
    toggleFullScreen(){
        if(document.fullscreenElement == this.videoplayer){
            document.exitFullscreen();
            this.fullscreen.src = "img/enterfullscreen.svg";
        } else {
            this.videoplayer.requestFullscreen();
            this.fullscreen.src = "img/leavefullscreen.svg";
        }
    }
}

var videoplayer = new VideoPlayer("one");
var two = new VideoPlayer("two");

document.addEventListener('dragstart', (ev) => {
    console.log(ev);
})