
const firebaseConfig = {
  apiKey: "AIzaSyAqiFPYSpf0LbOCOqgtAbiYo34hPa7MzPg",
  authDomain: "scenedata-725a7.firebaseapp.com",
  projectId: "scenedata-725a7",
  storageBucket: "scenedata-725a7.appspot.com",
  messagingSenderId: "586766327573",
  appId: "1:586766327573:web:452989856b9fd8356bd31c",
  measurementId: "G-5K181C85RW"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// get firebase database
let database = firebase.database();
let usersRefInDatabase = database.ref("sceneData");

let email = localStorage.getItem("email");
let agreement = localStorage.getItem("agreement");

// DATABASE BURAYA BAK

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

let numScenes = localStorage.getItem("num_cases");
let full_data = JSON.parse(localStorage.getItem("full_data"));
let user_data = [];
let color_palette = {}; 
let currentSceneIndex = 0;
let currentObjIndex = 1;
let sceneDescriptions = JSON.parse(localStorage.getItem("scene_descriptions"));
let scene = localStorage.getItem(currentObjIndex.toString());
let canvas_data = JSON.parse(scene);

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
    o.perPixelTargetFind = true; 
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

function getSelectedStrokes(stroke_color) {
  let activeObjects = canvas.getActiveObjects();
  let active_strokes = [];

  if (activeObjects.length > 0) {
      for (let i = 0; i < activeObjects.length; i++) {

          activeObjects[i].set("stroke", stroke_color);
          activeObjects[i].set("strokeWidth", 4);

          var vec = activeObjects[i].get('vectorRepresentation');
          active_strokes.push(vec);
          //vec = full_data["drawing"][i];
          //active_strokes.push(vec);

      }
      canvas.renderAll();
      return active_strokes;
  }
  else {
      customAlert.alert("Please draw something.");
      return "small_strokes";
  }
}

/**function saveCategory(){

  let categoryname = $('categoryname');
  let active_strokes = getSelectedStrokes(color_palette[categoryname.value]);

  const new_data = {
      "labels": categoryname.value,
      "drawing": active_strokes
  };
  
  user_data.push(new_data);

} */
function saveCategory() {
  let categoryname = $('categoryname');
  let active_strokes = getSelectedStrokes(color_palette[categoryname.value]);

  // Remove any previous labels for the same strokes
  user_data = user_data.filter(function (data) {
    return !active_strokes.some(function (stroke) {
      return data.drawing.some(function (existingStroke) {
        // Compare strokes by some unique property, for example, vectorRepresentation
        return existingStroke.vectorRepresentation === stroke.vectorRepresentation;
      });
    });
  });

  // Add the new label to user_data
  const new_data = {
    "labels": categoryname.value,
    "drawing": active_strokes
  };

  user_data.push(new_data);
}

  
function nextSketch(){
  
  let objs = canvas.getObjects();
  let labelled = 0;
  for (let i = 0; i < objs.length; i++) {
      let rgb_color = hex2rgb(objs[i].get("stroke"));
      if (rgb_color[0] >= 80 && rgb_color[1] >= 80 && rgb_color[2] >= 80){
         labelled += 1;
      }
  }
  if (labelled != objs.length){
      customAlert.alert("Please label every object that appear in the given scene.");
  }
  else{

      let currentScene = sceneDescriptions[currentSceneIndex];
    // todo: 
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
           o.perPixelTargetFind = true; });  


        }
      
      

  }

}
