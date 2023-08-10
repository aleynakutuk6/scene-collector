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

let email = localStorage.getItem("email");
let agreement = localStorage.getItem("agreement");

var canvas = this.__canvas = new fabric.Canvas('canvas', {isDrawingMode: false });
var ctx = canvas.getContext("2d");
var mouse = false;
var shadow = new fabric.Shadow({ color: "red", blur: 4});

let canvasDiv = document.getElementById("canvas-wrapper");
canvas.setWidth(canvasDiv.offsetWidth);
canvas.setHeight(canvasDiv.offsetHeight);

let $ = function (id) { return document.getElementById(id) };

// add shadow to active strokes
canvas.selectionColor = 'rgba(0,255,0,0.3)';
canvas.selectionBorderColor = 'rgba(230, 126, 34, 1)';
canvas.selectionLineWidth = 1;
canvas.selectionShadow = shadow;
canvas.selectionKey = "ctrlKey";

let currentObjIndex = 1;
let numScenes = localStorage.getItem("num_cases");
let scene = localStorage.getItem(currentObjIndex.toString());
let full_data = JSON.parse(localStorage.getItem("full_data"));
let canvas_data = JSON.parse(scene);
let user_data = [];

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

  let categoryname = $('categoryname');
  let activeObjects = canvas.getActiveObjects();
  let active_strokes = [];
  let drawing = [];

  for (let i = 0; i < activeObjects.length; i++) {
      
      vec = full_data["drawing"][i]
      active_strokes.push(vec);
      
      activeObjects[i].set("stroke", "green");
      activeObjects[i].set("strokeWidth", 4);

      canvas.renderAll();

      if (active_strokes != "small_strokes") {
        drawing.push(active_strokes);
      }
  } 

  const new_data = {
      "labels": categoryname.value,
      "drawing": drawing
  };
  
  user_data.push(new_data);

}
  
function nextSketch(){

  if (currentObjIndex > numScenes) {
    window.location.href = "./end.html";
  }

  
  let submit_content = { "user_email": email, "agreement": agreement, "scene_info": user_data };
  user_data = [];
  
  usersRefInDatabase.push(submit_content, (error) => {
    if (error) {
      window.alert("Error while pushing data to the firebase.");
    } else {
      console.log("Data sent successfully!");
    }
      
  });

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
      o.lockUniScaling = true; });  

}