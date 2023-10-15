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

let email = localStorage.getItem("email");
let agreement = localStorage.getItem("agreement");
let numScenes = localStorage.getItem("num_cases");
let full_data = JSON.parse(localStorage.getItem("full_data"));
let user_data = [];
let color_palette = {}; 
let currentSceneIndex = 0;
let sceneDescriptions = JSON.parse(localStorage.getItem("scene_descriptions"));
let customAlert = new CustomAlert();
let currentObjIndex = 1;
let active_strokes = [];
let labelled_obj_indices = [];
let stroke_num = -1;
getSceneData(currentObjIndex);

window.addEventListener("DOMContentLoaded", startup);

function getSceneData(currentObjIndex) {

  let scene = localStorage.getItem(currentObjIndex.toString());
  let canvas_data = JSON.parse(scene);
  let greycolor = rgbToHex(211, 211, 211);

  canvas.loadFromJSON(canvas_data, function() {
    let allObjects = canvas.getObjects();
    if (allObjects.length > 0) {
      for (let i = 0; i < allObjects.length; i++) {

        allObjects[i].set("stroke", greycolor);
        allObjects[i].set("strokeWidth", 4);
      }
      canvas.renderAll();
     }
  });

  canvas.forEachObject(function (o) { // make not selectable all the objects.
    o.hasControls = false;
    o.lockMovementX = true;
    o.lockMovementY = true;
    o.lockScalingX = true;
    o.lockScalingY = true;
    o.lockUniScaling = true;
    o.perPixelTargetFind = true; 

  });

}

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

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

const hex2rgb = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

for (let i = 0; i < obj_classes.length; i++) {
  let hexcolor = rgbToHex(getRandomInt(80,255), getRandomInt(80,255), getRandomInt(80,255));
  color_palette[obj_classes[i]] = hexcolor;
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
}      

function moveSceneBackward() {
  const includesIdx = labelled_obj_indices.includes(stroke_num);
  if (stroke_num < -1){
    customAlert.alert("You should click to RIGHT ARROW!!");
    stroke_num = -1;
  }
  else if(stroke_num == -1)
  {
    customAlert.alert("You should click to RIGHT ARROW!!");
  }
  else if(includesIdx){
    customAlert.alert("You cannot label an object twice!!");
    stroke_num -= 1;
  }
  else{
    changeStrokeColor("grey");
    stroke_num -= 1;
  }
}


function moveSceneForward() {
    stroke_num += 1;
    let allObjects = canvas.getObjects();
    if (stroke_num >= allObjects.length){
      customAlert.alert("You should click to LEFT ARROW!!");
      stroke_num -= 1;
    }
    else{
      changeStrokeColor("black");
    }
}

function changeStrokeColor(stroke_color) {
  let allObjects = canvas.getObjects();
  
  if (allObjects.length > 0) {

    if (stroke_color == "grey"){
      let stroke_color = rgbToHex(211, 211, 211);
      allObjects[stroke_num].set("stroke", stroke_color);
    }
    else if(stroke_color == "black"){
      let stroke_color = rgbToHex(0, 0, 0);
      allObjects[stroke_num].set("stroke", stroke_color);
    }
    canvas.renderAll();
  }
}

function findLabelledObject(){
    let objs = canvas.getObjects();
    for (let i = 0; i < objs.length; i++) {
      let rgb_color = hex2rgb(objs[i].get("stroke"));
      if (rgb_color[0] == 0 && rgb_color[1] == 0 && rgb_color[2] == 0){
         
        const includesIdx = labelled_obj_indices.includes(i);

         if(includesIdx == false){
            var vec = objs[i].get('vectorRepresentation');
            active_strokes.push(vec);
            labelled_obj_indices.push(i);
         }
      }   
    }
  
}

function saveCategory(){

  let categoryname = $('categoryname');
  findLabelledObject();

  const new_data = {
      "labels": categoryname.value,
      "drawing": active_strokes
  };

  categoryname.value = ""
  user_data.push(new_data);
  active_strokes = [];

} 

function saveOther() {

  let categoryname = $("labelname");
  findLabelledObject();

  const new_data = {
    "labels": categoryname.value,
    "drawing": active_strokes
  };

  categoryname.value = ""
  user_data.push(new_data);
  active_strokes = [];
}
  
function nextSketch(){
  
  let objs = canvas.getObjects();

  if (labelled_obj_indices.length != objs.length){
      customAlert.alert("Please label every object that appear in the given scene.");
  }
  else{

      let currentScene = sceneDescriptions[currentSceneIndex];
      let submit_content = { "user_email": email, "agreement": agreement, "scene_info": user_data, "scene_description": currentScene};
      user_data = [];
  
      usersRefInDatabase.push(submit_content, (error) => {
       if (error) {
        customAlert.alert("Error while pushing data to the firebase.");
       } else {
         console.log("Data sent successfully!");
       }
      
      });

      currentObjIndex++;
      currentSceneIndex++;

      if (currentObjIndex > numScenes) {
        window.location.href = "./end.html";
      }
      else{
          stroke_num = -1;
          getSceneData(currentObjIndex);
      }
  }
}
