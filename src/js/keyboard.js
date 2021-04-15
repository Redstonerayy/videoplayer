/* ------------------------------------------------
       KEYCLASS
       
-------------------------------------------------*/

class Key{
    constructor(description, keycode, shift, ctrl, action){
        this.description = description;
        this.keycode = keycode;
        this.shift = shift;
        this.ctrl = ctrl;
        this.action = action
    }
}

/* ------------------------------------------------
       KEYBOARDINTERFACE
       
-------------------------------------------------*/

class KeyBoardInterface{
    constructor(keys){
        this.keys = keys;
    }

    keylistener(event){
        let pressedkeys = this.keys.filter((key) => {
            return(
                key.keycode == event.code &&
                key.shift == event.shiftKey &&
                key.ctrl == event.ctrlKey
            )
        });
        
        pressedkeys.forEach(key => {
            key.action();
        });
    }

    start(){
        window.addEventListener("keydown", this.keylistener.bind(this));
    }

    stop(){
        window.removeEventListener("keydown", this.keylistener);
    }

    registerKey(key){
        if(!this.keys.includes(key)){
            this.keys.push(key);
        }
    }
}

/* ------------------------------------------------
                   KEYS
                   
-------------------------------------------------*/

const p = new Key(
    `Play or Pause`,
    "KeyP",
    false,
    false,
    () => {
        if(video.paused){
            togglePlay("play");
        } else {
            togglePlay("pause");
        }
    }
);

const f = new Key(
    `Toggle Fullscreen`,
    "KeyF",
    false,
    false,
    (ev) => {
        toggleFullScreen();
    }
);

const m = new Key(
    `Toggle Mute`,
    "KeyM",
    false,
    false,
    () => {
        if(video.muted){
            toggleMute("unmute");
        } else {
            toggleMute("mute");
        }
    }
);

const o = new Key(
    `Open Options`,
    "KeyO",
    false,
    false,
    () => {
        console.log("o");
    }
);

const arrowleft = new Key(
    `Go Back 5s`,
    "ArrowLeft",
    false,
    false,
    () => {
        video.currentTime -= 5;
        if(video.ended){
            console.log("a");
            video.play();
        }
    }
);

const arrowright = new Key(
    `Fast Forward 5s`,
    "ArrowRight",
    false,
    false,
    () => {
        video.currentTime += 5;
    }
);

const arrowup = new Key(
    `Volume +10`,
    "ArrowUp",
    false,
    false,
    () => {
        video.volume = video.volume + (video.volume <= 0.9 ? 0.1 : 0);
        volumeslider.value = parseFloat(volumeslider.value) + (volumeslider.value <= 90 ? 10 : 0);
        volumesliderfill.style.width = `${volumeslider.value/2}px`;
        if(volumeslider.value > 50){
            volume.src = "img/volumeloud.svg";
            video.muted = false;
        } else if(volumeslider.value > 0) {
            volume.src = "img/volumelow.svg";
            video.muted = false;
        } else {//0
            volume.src = "img/muted.svg";
        }
    }
);

const arrowdown = new Key(
    `Volume -10`,
    "ArrowDown",
    false,
    false,
    () => {
        video.volume = video.volume - (video.volume >= 0.1 ? 0.1 : 0);
        volumeslider.value = parseFloat(volumeslider.value) - (volumeslider.value >= 10 ? 10 : 0);
        volumesliderfill.style.width = `${volumeslider.value/2}px`;
        if(volumeslider.value > 50){
            volume.src = "img/volumeloud.svg";
            video.muted = false;
        } else if(volumeslider.value > 0) {
            volume.src = "img/volumelow.svg";
            video.muted = false;
        } else {//0
            volume.src = "img/muted.svg";
        }
    }
);

//var keyboard = new KeyBoardInterface([p, f, m, 0, arrowleft, arrowright, arrowup, arrowdown]);
//keyboard.start();