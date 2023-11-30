   
// code for some security constrains of chrome 
[{
    "origin": [
        "*"
    ],
    "method": [
        "GET"
    ],
    "maxAgeSeconds": 3600
}]

const sceneDescriptions = [
    "In a living room, you can see a door, and there is a clock on the wall. One person is standing up.",
    "On a sunny day in a forest, people are playing football.",
    "In the kitchen, there is a table, and there is a plate with a whole orange inside.",
    "On the street, you can see some people getting on a bus, and there are benches on the street.",
    "There is a ladder outside of the house. A dog is playing with a ball next to the ladder.",
    "In a music store, a person is playing the violin.",
    "In the kitchen, there is an oven, and a person is preparing a pizza.",
    "On a river, there is a bridge and trees.",
    "On the sea, there is a sailboat and people are talking in it.",
    "On a rainy day, people wait at a bus stop with umbrellas."

];

/**
const sceneDescriptions = [
    "In a living room, you can see a door, and there is a clock on the wall. One person is standing up."

];
 **/

//Element retrieval
let $ = function (id) { return document.getElementById(id) };
let drawingModeEl = $('modeButton');

localStorage.setItem("scene_descriptions", JSON.stringify(sceneDescriptions));
const sceneDescriptionElement = $("sceneDescription");
let currentObjectIndex = 0;
let currentObjectClass = sceneDescriptions[currentObjectIndex];
sceneDescriptionElement.textContent = currentObjectClass;

let customAlert = new CustomAlert();

var canvas = this.__canvas = new fabric.Canvas('canvas', {
    isDrawingMode: true,
    freeDrawingCursor: 'url("images/ic_p.png") 0 30, auto',
});


var ctx = canvas.getContext("2d", { willReadFrequently: true });
let brush = canvas.freeDrawingBrush;
var shadow = new fabric.Shadow({ color: "red", blur: 8});
let canvasDiv = $("canvas");

// Set brush features
brush.color = rgbToHex(0, 0, 0);
brush.width = 3;

// Set the timer
const TIME_LIMIT_PER_WORD = 60; // in seconds
const TOTAL_GAME_TIME = TIME_LIMIT_PER_WORD * sceneDescriptions.length;
let timeLeft = TIME_LIMIT_PER_WORD // in seconds
let startDate, currDate, endDate;
let timerID;

let elapsedMilliseconds=0;
startDate = Date.now();
timer();

//disable user to move strokes on canvas
fabric.Group.prototype.hasControls = false;
fabric.Group.prototype.lockMovementX = true;
fabric.Group.prototype.lockMovementY = true;
fabric.Group.prototype.lockScalingX = true;
fabric.Group.prototype.lockScalingY = true;
fabric.Group.prototype.hasBorders = false;

canvas.selectionColor = 'rgba(0,255,0,0.3)';
canvas.selectionBorderColor = 'rgba(230, 126, 34, 1)';
canvas.selectionLineWidth = 1;
canvas.selectionShadow = shadow;

var mouse = false;
let mDown;
let pDown;
ctx.lineJoin = "round";
ctx.lineCap = "round";
var positionX, positionY;

var drawing = [];
var stroke = []; //should contain 3 array in it
var xCords = [];
var yCords = [];
let times = [];

window.addEventListener("mousemove", getPointerHandler);
window.addEventListener("DOMContentLoaded", startup);

function CustomAlert() {
    this.alert = function (message, title) {
      // Clear any existing pop-up elements
      clearExistingDialog();
  
      let dialogoverlay = document.createElement('div');
      dialogoverlay.id = 'dialogoverlay';
      document.body.appendChild(dialogoverlay);
  
      let dialogbox = document.createElement('div');
      dialogbox.id = 'dialogbox';
      dialogbox.className = 'slit-in-vertical';
      document.body.appendChild(dialogbox);
  
      let dialogboxhead = document.createElement('div');
      dialogboxhead.id = 'dialogboxhead';
      dialogbox.appendChild(dialogboxhead);
  
      let dialogboxbody = document.createElement('div');
      dialogboxbody.id = 'dialogboxbody';
      dialogbox.appendChild(dialogboxbody);
  
      let dialogboxfoot = document.createElement('div');
      dialogboxfoot.id = 'dialogboxfoot';
      dialogbox.appendChild(dialogboxfoot);
  
      let winH = window.innerHeight;
      dialogoverlay.style.height = winH + "px";
  
      dialogbox.style.top = "100px";
  
      dialogoverlay.style.display = "block";
      dialogbox.style.display = "block";
  
      dialogboxhead.style.display = 'block';
  
      if (typeof title === 'undefined') {
        dialogboxhead.style.display = 'none';
      } else {
        dialogboxhead.innerHTML = '<i class="fa fa-exclamation-circle" aria-hidden="true"></i> ' + title;
      }
      dialogboxbody.innerHTML = message;
      dialogboxfoot.innerHTML = '<button class="pure-material-button-contained active" onclick="customAlert.ok()">OK</button>';
    }
  
    this.ok = function () {
      clearExistingDialog();
    }
  
    function clearExistingDialog() {
      let dialogoverlay = $('dialogoverlay');
      let dialogbox = $('dialogbox');
      if (dialogoverlay) {
        dialogoverlay.parentNode.removeChild(dialogoverlay);
      }
      if (dialogbox) {
        dialogbox.parentNode.removeChild(dialogbox);
      }
    }
}
  
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}


function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}


drawingModeEl.onclick = function () {
    //canvas.getActiveObjects()[canvas.getActiveObjects]
    canvas.isDrawingMode = !canvas.isDrawingMode;
    if (canvas.isDrawingMode) {
        drawingModeEl.innerHTML = '<img src= "images/eraser.png">';

    }
    else {
        canvas.hoverCursor = 'url(images/ic-e.png) 0 32, auto';
        //Make each object nonresizable on canvas
        canvas.forEachObject(function (o) { // make not selectable all the objects.
            o.hasControls = false;
            o.lockMovementX = true;
            o.lockMovementY = true;
            o.lockScalingX = true;
            o.lockScalingY = true;
            o.lockUniScaling = true;
            o.perPixelTargetFind = true;
        });

        drawingModeEl.innerHTML ='<img src= "images/pencil.png">';
    }
};
canvas.on('mouse:down', function (options) {
    mDown = true;
    if (!canvas.isDrawingMode) {
       deleteObjects();
    }
});

canvas.on('mouse:up', function (options) {
    mDown = false;
    if (!canvas.isDrawingMode) {
        deleteObjects();
    }
});

function getPointerHandler(evt) {
    var point = null;
    if (mDown & canvas.isDrawingMode) {
        point = canvas.getPointer(evt);
        currDate = Date.now();
        elapsedMilliseconds = currDate - startDate;

        xCords.push(point.x);
        yCords.push(point.y);
        times.push(elapsedMilliseconds);

        stroke[0] = xCords;
        stroke[1] = yCords;
        stroke[2] = times;

    }
    if (!mDown & canvas.isDrawingMode & stroke.length != 0) { // if not drawing and in drawing mode (at least this is what I wait :)

        //attach drawing to the stroke object 
        // get stroke stroke object and attach drawing to it
        // This way we can send only part of canvas for prediction
        canvas.getObjects()[canvas.getObjects().length - 1].vectorRepresentation = stroke;

        stroke = [];
        xCords = [];
        yCords = [];
        times = [];
    }
};

function hideCanvas() {
    document.getElementsByClassName("column-middle").style.display = "none";
}

function startup() {

    const el = $('canvas-wrapper');
    el.addEventListener('touchstart', handleStart);
    el.addEventListener('touchmove', handleMove);
    el.addEventListener('touchend', handleEnd);
    el.addEventListener('touchcancel', handleCancel);
}


function handleStart(evt) {
    evt.preventDefault();
    // console.log('touchstart.');
    // console.log("START touch coordinates are ", canvas.getPointer(evt));
    canvas.renderAll();
    pDown = true;

    canvas.getObjects().forEach(function (o) {
        o.shadow = null;
    });
    if (canvas.getActiveObjects()) {
        canvas.getActiveObjects().forEach(function (o) {
            o.shadow = shadow;

        });
    }
}
function handleMove(evt) {
    evt.preventDefault();

    pDown = true;

    canvas.getObjects().forEach(function (o) {
        o.shadow = null;
    });
    if (canvas.getActiveObjects()) {
        canvas.getActiveObjects().forEach(function (o) {
            o.shadow = shadow;
        });
    }

    let point = null;
    if (pDown & canvas.isDrawingMode) {
        point = canvas.getPointer(evt);
        currDate = Date.now();
        elapsedMilliseconds = currDate - startDate;

        xCords.push(point.x);
        yCords.push(point.y);
        times.push(elapsedMilliseconds);

        stroke[0] = xCords;
        stroke[1] = yCords;
        stroke[2] = times;
    }
}


function handleEnd(evt) {
    evt.preventDefault();
    pDown = false;

    canvas.getObjects().forEach(function (o) {
        o.shadow = null;
    });
    if (canvas.getActiveObjects()) {
        canvas.getActiveObjects().forEach(function (o) {
            o.shadow = shadow;
        });
    }

    if (!pDown && canvas.isDrawingMode && stroke.length != 0) { // if not drawing and in drawing mode (at least this is what I wait :)

        //attach drawing to the stroke object 
        // get stroke stroke object and attach drawing to it
        // This way we can send only part of canvas for prediction
        canvas.renderAll();
        let canvasObjects = canvas.getObjects();

        if (canvas.getObjects().length == 0) {
            temp_stroke_vec = stroke;
        } else {

            canvasObjects[canvas.getObjects().length - 1].vectorRepresentation = temp_stroke_vec;
            temp_stroke_vec = stroke;
        }

        stroke = [];
        xCords = [];
        yCords = [];
        times = [];
    }
}

function handleCancel(evt) {
    evt.preventDefault();

}

// this function is called from HTML file it trigers when the button is cliked. 
function deleteObjects() {

    canvas.forEachObject(function (o) { // make not selectable all the objects other than image we provide.
        o.hasControls = false;
        o.lockMovementX = true;
        o.lockMovementY = true;
        o.lockScalingX = true;
        o.lockScalingY = true;
        o.lockUniScaling = true;
        o.perPixelTargetFind = true;

    });
    
    drawingModeEl.innerHTML = '<img src= "images/pencil.png">';

    let activeObjects = canvas.getActiveObjects();
    for (let i = 0; i < activeObjects.length; i++) {
        canvas.remove(activeObjects[i]);
    }

}


function getDrawing() {
    let activeObjects = canvas.getObjects();
    let active_strokes = [];

    if (activeObjects.length > 0) {
        for (let i = 0; i < activeObjects.length; i++) {
            active_strokes.push(activeObjects[i].vectorRepresentation);

            activeObjects[i].set({
                vectorRepresentation: activeObjects[i].vectorRepresentation
            });
        }
        return active_strokes;
    }
    else {
        
        customAlert.alert("Please draw something.");
        return "small_strokes";
    }
}

/*
    This function is called when user clicks on "Next" button
*/
function nextSketch() {
    
    let drawing = getDrawing();

    if (drawing != "small_strokes") {

        // Record the current drawing and its category
        const full_data = {
            "class": currentObjectClass,
            "drawing": drawing
        };

        // Show the next scene to draw
        currentObjectIndex++;
        if (currentObjectIndex == sceneDescriptions.length) {
            localStorage.setItem("num_cases", sceneDescriptions.length);
            localStorage.setItem("full_data", JSON.stringify(full_data));
            const customKeys = ['vectorRepresentation'];
            var json = canvas.toJSON(customKeys);
            localStorage.setItem(currentObjectIndex.toString(), JSON.stringify(json));
            window.location.href = "./label_info.html";
        } 
        else {
            currentObjectClass = sceneDescriptions[currentObjectIndex];
            sceneDescriptionElement.textContent = currentObjectClass;
            const customKeys = ['vectorRepresentation'];
            var json = canvas.toJSON(customKeys);
            localStorage.setItem(currentObjectIndex.toString(), JSON.stringify(json));
            timeLeft = TIME_LIMIT_PER_WORD;
            startDate = Date.now();
        }

        // Clear the canvas and the drawing variables for the next sketch
        drawing = [];
        stroke = [];
        xCords = [];
        yCords = [];
        clearCanvas();
    }

}

function clearCanvas() {
    let activeObjects = canvas.getObjects();
    // console.log("ACTIVE OBJECT COUNT IS ", canvas.getActiveObjects().length);
    for (let i = 0; i < activeObjects.length; i++) {
        // console.log("active stroke is ");
        // console.log(activeObjects[i].vectorRepresentation);
        canvas.remove(activeObjects[i]);


    }
}

function showDescription() {
    var x = document.getElementById("ShowDescription");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }

}


function timer() {

    timerID = setInterval(function () {

        timeLeft--;

        var minutes = Math.floor((timeLeft / 60));
        var seconds = Math.floor((timeLeft % 60));

        if (minutes < 1) {
            if (seconds < 10) {
                $("seconds").innerHTML = "00:" + "0" + seconds;
            }
            else{
                $("seconds").innerHTML = "00:" + seconds;
            }
        }
        else{
            if (seconds < 10) {
                $("seconds").innerHTML = "0" + minutes + ":0" + seconds;
            }
            else{
                $("seconds").innerHTML = "0" + minutes + ":" + seconds;
            }
        }
        
        if (timeLeft === 0) {

            $("seconds").innerHTML = "EXPIRED";
            customAlert.alert("Time is up !! You will be directed to the NEXT SCENE !!");
            nextSketch();
            timeLeft = TIME_LIMIT_PER_WORD;
        }
   
    }, 1000);
}

function showInstructions() {
    let instructions = ["To use the eraser, click the eraser button.",
                        "To use the pencil again, click the same button again.",
                        "Describe what you draw verbally",
                        "Then, click the NEXT button."];
    let message = "";
    for (let i = 0; i < instructions.length; i++) {
      message += "‣"+ instructions[i] + "<br><br>" ;
    }
    customAlert.alert(message);
  
  }