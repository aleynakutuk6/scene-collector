let $ = function (id) { return document.getElementById(id) };

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
let customAlert = new CustomAlert();

document
.getElementById("submitBtn")
.addEventListener("click", function () {
    
  let email_str = email.value;
  console.log(email_str);
  let check = email_str.includes("@ku.edu.tr");
  if (check){
      localStorage.setItem("email", email_str);
      window.location.href = "./drawing.html";
  }
  else{
      customAlert.alert("Write a valid KU mail.");
      email.value = "";
  }

})