# Videoplayer

A modern videoplayer for the web. No additional libaries.
It implements a VideoPlayer class, where each object represents a 
videoplayer.

## Test/Build
Setup
```
git clone
npm install
```
Then run one of these commands
```
npm run dev
npm run build
```

```npm run dev``` will provide an easy testing enviroment and will open a tab in your
default browser

## Usage
* Include both files, videoclass.js and keyboard.js.
You don`t need vttjson.js.
* Add the html code of videoplayer.html into a container on
you webpage, it expands into 100% width and height
* asign a unique id to the div with the videoplayer class (the toplevel div)
* in your main javascript file, create an instance of the Videoplayer class
and pass the id given before to it
* if you wan`t keyboard commands, create an instance of the KeyboardInterface
class and start it with an object as parameter with the key "instance" containing
the VideoPlayer object to which the bindings should go


## Possible Improments
* subtitles
* visual upgrades
* make working with HTML easier

## (Possible) Issues
* some HTML elements like images and videos are draggable by default.
dragging a HTML element causes a bug which leads to the mousemove event
beeing fired. This leads to the currentposition of the video following
the mousecursor when it shouldn`t
Possible some ways to fix this Issue could be    
    * First, adding "dragstart" EventListener to document or
    window to find out which element got dragged. It`s most likely
    an image or video
    * Disable the drag via CSS 
    ```
    pointer-events: none
    ```
    * Javascript 
    ```
    elementcausingtheerror.addEventListener('dragstart', (ev) => {
        ev.preventDefault();
        //return false may also work
    })
    ```
    * HTML
    ```
    <image draggable="false">
    ```
