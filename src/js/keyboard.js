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
            key.action(this.args);
        });
    }

    start(args){
        this.args = args;
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
    (args) => {
        if(args.instance.video.paused){
            args.instance.togglePlay("play");
        } else {
            args.instance.togglePlay("pause");
        }
    }
);

const f = new Key(
    `Toggle Fullscreen`,
    "KeyF",
    false,
    false,
    (args) => {
        args.instance.toggleFullScreen();
    }
);

const m = new Key(
    `Toggle Mute`,
    "KeyM",
    false,
    false,
    (args) => {
        let video = args.instance.video;

        if(video.muted){
            args.instance.toggleMute("unmute");
        } else {
            args.instance.toggleMute("mute");
        }
    }
);

const o = new Key(
    `Open Options`,
    "KeyO",
    false,
    false,
    (args) => {
        console.log("o");
    }
);

const arrowleft = new Key(
    `Go Back 5s`,
    "ArrowLeft",
    false,
    false,
    (args) => {
        let video = args.instance.video;

        video.currentTime -= 5;
        if(video.ended){
            video.play();
        }
    }
);

const arrowright = new Key(
    `Fast Forward 5s`,
    "ArrowRight",
    false,
    false,
    (args) => {
        args.instance.video.currentTime += 5;
    }
);

const arrowup = new Key(
    `Volume +10`,
    "ArrowUp",
    false,
    false,
    (args) => {
        let video = args.instance.video;
        let volumeslider = args.instance.volumeslider;
        let volumesliderfill = args.instance.volumesliderfill;
        
        //set volume of video
        video.volume = (video.volume + 0.1) > 1 ? 1 : (video.volume + 0.1);

        //gui
        args.instance.updateVolumeIcon(video.volume * 100);
        volumeslider.value = video.volume * 100;
        volumesliderfill.style.width = `${volumeslider.value != 0 ? volumeslider.value/2 : 0}px`;
    }
);

const arrowdown = new Key(
    `Volume -10`,
    "ArrowDown",
    false,
    false,
    (args) => {
        let video = args.instance.video;
        let volumeslider = args.instance.volumeslider;
        let volumesliderfill = args.instance.volumesliderfill;
        
        //set volume of video
        video.volume = (video.volume - 0.1) < 0 ? 0 : (video.volume - 0.1);

        //gui
        args.instance.updateVolumeIcon(video.volume * 100);
        volumeslider.value = video.volume * 100;
        volumesliderfill.style.width = `${volumeslider.value != 0 ? volumeslider.value/2 : 0}px`;
    }
);

var keyboard = new KeyBoardInterface([p, f, m, 0, arrowleft, arrowright, arrowup, arrowdown]);
keyboard.start({ instance: two});