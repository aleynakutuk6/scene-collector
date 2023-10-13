   
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
    "On a sunny day in a forest, people are playing football, and you can see the goals."
];

localStorage.setItem("scene_descriptions", JSON.stringify(sceneDescriptions));
const objectNameElement = document.getElementById("objectName");
let currentObjectIndex = 0;
let currentObjectClass = sceneDescriptions[currentObjectIndex];
objectNameElement.textContent = currentObjectClass;

var canvas = this.__canvas = new fabric.Canvas('canvas', {
    isDrawingMode: true,

});

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
      let dialogoverlay = document.getElementById('dialogoverlay');
      let dialogbox = document.getElementById('dialogbox');
      if (dialogoverlay) {
        dialogoverlay.parentNode.removeChild(dialogoverlay);
      }
      if (dialogbox) {
        dialogbox.parentNode.removeChild(dialogbox);
      }
    }
  }
  
  let customAlert = new CustomAlert();
  
  
  

var ctx = canvas.getContext("2d", { willReadFrequently: true });
let brush = canvas.freeDrawingBrush;

var shadow = new fabric.Shadow({ color: "red", blur: 8});


let canvasDiv = document.getElementById("canvas-wrapper");
canvas.setWidth(canvasDiv.offsetWidth);
canvas.setHeight(canvasDiv.offsetHeight);

//disable user to move strokes on canvas
fabric.Group.prototype.hasControls = false;
fabric.Group.prototype.lockMovementX = true;
fabric.Group.prototype.lockMovementY = true;
fabric.Group.prototype.lockScalingX = true;
fabric.Group.prototype.lockScalingY = true;
fabric.Group.prototype.hasBorders = false;

// add shadow to active strokes

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

//Element retrieval
let $ = function (id) { return document.getElementById(id) };
let drawingModeEl = $('modeButton');

brush.color = 'black';
brush.width = 4;

drawingModeEl.onclick = function () {
    //canvas.getActiveObjects()[canvas.getActiveObjects]
    canvas.isDrawingMode = !canvas.isDrawingMode;

    if (canvas.isDrawingMode) {

        drawingModeEl.innerHTML = '<img src= "eraser.png">';

    }
    else {
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

        drawingModeEl.innerHTML ='<img src= "pencil.png">';

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

/*
// Mouse move and coordinates when it is down(drawing)
canvas.on('mouse:down', function (options) {
    mDown = true;
    canvas.getObjects().forEach(function (o) {
        o.shadow = null;
    });
    if (canvas.getActiveObjects()) {
        canvas.getActiveObjects().forEach(function (o) {
            o.shadow = shadow;
        });
    }
});
canvas.on('mouse:up', function (options) {
    mDown = false;
    canvas.getObjects().forEach(function (o) {
        o.shadow = null;
    });
    if (canvas.getActiveObjects()) {
        canvas.getActiveObjects().forEach(function (o) {
            o.shadow = shadow;
        });
    }
});
*/
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

    // point = canvas.getPointer(); works with IE11, Chrome, but not Firefox
};
window.addEventListener("mousemove", getPointerHandler);

function hideCanvas() {
    document.getElementsByClassName("column-middle").style.display = "none";
    //document.getElementById("button-container").style.display = "none";

}


function startup() {

    const el = document.getElementById('canvas-wrapper');
    el.addEventListener('touchstart', handleStart);
    el.addEventListener('touchmove', handleMove);
    el.addEventListener('touchend', handleEnd);
    el.addEventListener('touchcancel', handleCancel);
}
window.addEventListener("DOMContentLoaded", startup);



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

    // console.log("touchend");
    pDown = false;

    // console.log(canvas.renderAll());

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
    // console.log('touchcancel.');

}

// this function is called from HTML file it trigers when the button is cliked. 
function deleteObjects() {

    //Make each object nonresizable on canvas
    canvas.forEachObject(function (o) { // make not selectable all the objects other than image we provide.
        o.hasControls = false;
        o.lockMovementX = true;
        o.lockMovementY = true;
        o.lockScalingX = true;
        o.lockScalingY = true;
        o.lockUniScaling = true;
        o.perPixelTargetFind = true;

    });

    drawingModeEl.innerHTML = '<img src= "pencil.png">';

    let activeObjects = canvas.getActiveObjects();
    // console.log("ACTIVE OBJECT COUNT IS ", canvas.getActiveObjects().length);
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
            objectNameElement.textContent = currentObjectClass;
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

const TIME_LIMIT_PER_WORD = 180; // in seconds
const TOTAL_GAME_TIME = TIME_LIMIT_PER_WORD * sceneDescriptions.length;
let timeLeft = TIME_LIMIT_PER_WORD // in seconds
let startDate, currDate, endDate;
let timerID;

let elapsedMilliseconds=0;
startDate = Date.now();

function timer() {

    timerID = setInterval(function () {

        timeLeft--;

        var minutes = Math.floor((timeLeft / 60));
        var seconds = Math.floor((timeLeft % 60));

        if (minutes < 1) {
            if (seconds < 10) {
                document.getElementById("seconds").innerHTML = "00:" + "0" + seconds;
            }
            else{
                document.getElementById("seconds").innerHTML = "00:" + seconds;
            }
        }
        else{
            if (seconds < 10) {
                document.getElementById("seconds").innerHTML = "0" + minutes + ":0" + seconds;
            }
            else{
                document.getElementById("seconds").innerHTML = "0" + minutes + ":" + seconds;
            }
        }
        
        if (timeLeft === 0) {

            document.getElementById("seconds").innerHTML = "EXPIRED";
            nextSketch();
            timeLeft = TIME_LIMIT_PER_WORD;
        }
   
    }, 1000);
}

timer();
