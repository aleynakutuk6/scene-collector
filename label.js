const firebaseConfig = {
    apiKey: "AIzaSyCAZOblzgyVbrGCRbGO_mskKSQAV1-PUhs",
    authDomain: "scene-dataset.firebaseapp.com",
    databaseURL: "https://scene-dataset-default-rtdb.firebaseio.com",
    projectId: "scene-dataset",
    storageBucket: "scene-dataset.appspot.com",
    messagingSenderId: "613884392238",
    appId: "1:613884392238:web:60996e315f709dbc0e80bf"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// get firebase database
let database = firebase.database();
let usersRefInDatabase = database.ref("sceneData/");

var canvas = this.__canvas = new fabric.Canvas('canvas', {isDrawingMode: false });
var ctx = canvas.getContext("2d");
var mouse = false;
var shadow = new fabric.Shadow({ color: "red", blur: 4});

let canvasDiv = document.getElementById("canvas-wrapper");
canvas.setWidth(canvasDiv.offsetWidth);
canvas.setHeight(canvasDiv.offsetHeight);

//Element retrieval
let $ = function (id) { return document.getElementById(id) };
let drawingModeEl = $('modeButton');

// add shadow to active strokes
canvas.selectionColor = 'rgba(0,255,0,0.3)';
canvas.selectionBorderColor = 'rgba(230, 126, 34, 1)';
canvas.selectionLineWidth = 1;
canvas.selectionShadow = shadow;

let currentObjIndex = 1;
let new_data = [];
let numScenes = localStorage.getItem("num_cases");
let scene = localStorage.getItem(currentObjIndex.toString());
let canvas_data = JSON.parse(scene); 
canvas.loadFromJSON(canvas_data, function() {
    canvas.renderAll();
  });

canvas.forEachObject(function (o) { // make not selectable all the objects.
    o.hasControls = false;
    o.lockMovementX = true;
    o.lockMovementY = true;
    o.lockScalingX = true;
    o.lockScalingY = true;
    o.lockUniScaling = true;
    //o.hasBorders = false;
    // o.hasBorders = false;

});

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
  
function startup() {

  const el = document.getElementById('canvas-wrapper');
  el.addEventListener('touchstart', handleStart);
  el.addEventListener('touchmove', handleMove);
  el.addEventListener('touchend', handleEnd);
  el.addEventListener('touchcancel', handleCancel);
  // console.log('Initialized.');
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
}

function handleCancel(evt) {
  evt.preventDefault();
  // console.log('touchcancel.');

}      
  
function saveCategory(){

  categoryname = categoryname.value;
  let activeObjects = canvas.getActiveObjects();
  let active_strokes = [];
  let stroke_labels = [];
      
  for (let i = 0; i < activeObjects.length; i++) {
      activeObjects[i].label = categoryname;
      active_strokes.push(activeObjects[i].vectorRepresentation);
      stroke_labels.push(activeObjects[i].label);

      console.log(active_strokes);
      console.log(stroke_labels);
      
      activeObjects[i].set("stroke", "green");
      canvas.renderAll();

      if (active_strokes != "small_strokes") {
        const temp_data = {
              "labels": stroke_labels,
              "drawing": active_strokes
        };
        new_data.push(temp_data);
        console.log(new_data);
        localStorage.setItem("new_data", JSON.stringify(new_data));
    }
  } 
}
  
function nextSketch(){
    
    if (currentObjIndex < numScenes) {
      currentObjIndex++;
      let scene = localStorage.getItem(currentObjIndex.toString());
      let canvas_data = JSON.parse(scene);
      canvas.loadFromJSON(canvas_data, function() {
        canvas.renderAll();
       });
      
      //Make each object nonresizable on canvas
      canvas.forEachObject(function (o) { // make not selectable all the objects.
        o.hasControls = false;
        o.lockMovementX = true;
        o.lockMovementY = true;
        o.lockScalingX = true;
        o.lockScalingY = true;
        o.lockUniScaling = true;
        //o.hasBorders = false;
        // o.hasBorders = false;

    });  

    }
    else{
      window.location.href = "./end.html";
    }

  }