document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("canvas");
    const saveBtn = document.getElementById("saveBtn");
    const deleteBtn = document.getElementById("deleteBtn");
    const uploadBtn = document.getElementById("uploadBtn");
    const objectNameElement = document.getElementById("objectName");
    const modal = document.getElementById("modal");
    const nameInput = document.getElementById("nameInput");
    const penInput = document.getElementById("penInput");
    const mouseInput = document.getElementById("mouseInput");

    const context = canvas.getContext("2d");

    const objectClasses = [
        "airplane",
        "apple",
        "bicycle",
        "campfire",
        "car",
        "chair",
        "clock",
        "computer",
        "door",
        "grass",
        "helicopter",
        "house",
        "ladder",
        "mountain",
        "sink",
        "smiley face",
        "sun",
        "table",
        "television",
        "tree"
    ];

    let currentObjectIndex = 0;
    let currentObjectClass = objectClasses[currentObjectIndex];
    let name = "";
    let tool = "";

    objectNameElement.textContent = currentObjectClass;

    let isDrawing = false;
    let drawings = [];
    let currentStrokeX = [];
    let currentStrokeY = [];
    let data = [];
    let submit_content = {};

    // Event listeners for mouse and touchscreen
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("touchstart", startDrawing);
    canvas.addEventListener("touchmove", draw);
    canvas.addEventListener("touchend", stopDrawing);

    // Start drawing
    function startDrawing(event) {
        isDrawing = true;
        currentStrokeX = [];
        currentStrokeY = [];
        const coordinates = getCoordinates(event);
        currentStrokeX.push(coordinates.x);
        currentStrokeY.push(coordinates.y);
    }

    // Draw on the canvas
    function draw(event) {
        if (!isDrawing) return;
        event.preventDefault();
        const coordinates = getCoordinates(event);
        currentStrokeX.push(coordinates.x);
        currentStrokeY.push(coordinates.y);
        drawStrokes();
    }

    // Stop drawing
    function stopDrawing(event) {
        if (!isDrawing) return;
        isDrawing = false;
        const currentStroke = [currentStrokeX, currentStrokeY];
        drawings.push(currentStroke);
        currentStrokeX = [];
        currentStrokeY = [];
    }

    // Draw all strokes on the canvas
    function drawStrokes() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.lineWidth = 3;
        context.lineCap = "round";
        context.strokeStyle = "#000";
        for (const drawing of drawings) {
            for (let i = 0; i < drawing[0].length - 1; i++) {
                context.beginPath();
                context.moveTo(drawing[0][i], drawing[1][i]);
                context.lineTo(drawing[0][i + 1], drawing[1][i + 1]);
                context.stroke();
            }
        }
        for (let i = 0; i < currentStrokeX.length - 1; i++) {
            context.beginPath();
            context.moveTo(currentStrokeX[i], currentStrokeY[i]);
            context.lineTo(currentStrokeX[i + 1], currentStrokeY[i + 1]);
            context.stroke();
        }
    }

    // Get the coordinates based on the event type (mouse or touch)
    function getCoordinates(event) {
        let x, y;
        if (event.touches) {
            x = event.touches[0].clientX - canvas.offsetLeft;
            y = event.touches[0].clientY - canvas.offsetTop;
        } else {
            x = event.clientX - canvas.offsetLeft;
            y = event.clientY - canvas.offsetTop;
        }
        return { x, y };
    }

    // Show the modal dialog
    function showModal() {

        modal.style.display = "flex";
        modal.style.justifyContent = "center";
        modal.style.alignItems = "center";
        modal.style.height = "100vh";

    }

    // Hide the modal dialog
    function hideModal() {
        modal.style.display = "none";
    }
    function hideCanvas() {
        document.getElementById("canvas-container").style.display = "none";
        document.getElementById("button-container").style.display = "none";

    }

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - document.getElementById("button-container").offsetHeight - document.getElementById("objectNameContainer").offsetHeight;
        drawStrokes();
    }
    // Event listeners for window resize
    window.addEventListener("resize", resizeCanvas);
    
    // Start with initial canvas resize
    resizeCanvas();

    hideModal();

    // Save drawing as JSON file
    saveBtn.addEventListener("click", function () {
        const jsonData = JSON.stringify(submit_content);
        const blob = new Blob([jsonData], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = name + "_" + tool + "_drawing.json";
        a.click();
    });

    // Delete canvas
    deleteBtn.addEventListener("click", function () {
        drawings = [];
        context.clearRect(0, 0, canvas.width, canvas.height);
    });


    // Your web app's Firebase configuration
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

    // Upload drawing as JSON file to Firebase Storage
    uploadBtn.addEventListener("click", function () {
        let database = firebase.storage();

        const jsonData = JSON.stringify(submit_content);
        const blob = new Blob([jsonData], { type: "application/json" });
        const fileName = name + "_" + tool + "_drawing.json";

        // Create a storage reference with the desired filename
        const storageRef = firebase.storage().ref().child(fileName);

        // Upload the JSON file to Firebase Storage
        const uploadTask = storageRef.put(blob);

        // Track the upload progress
        uploadTask.on(
            "state_changed",
            function (snapshot) {
                // Observe the upload progress (optional)
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("Upload progress: " + progress + "%");
            },
            function (error) {
                // Handle unsuccessful uploads
                console.error("Error uploading file:", error);
            },
            function () {
                // Handle successful upload
                console.log("File uploaded successfully!");

                // Clear the drawings and canvas after successful upload
                drawings = [];
                currentStrokeX = [];
                currentStrokeY = [];
                context.clearRect(0, 0, canvas.width, canvas.height);
            }
        );
    });

    // Next object button event listener
    nextBtn.addEventListener("click", function () {
        // Record the current drawing and its category
        const temp_data = {
            "class": currentObjectClass,
            "drawing": drawings
        };
        data.push(temp_data);
        //drawings.push(temp_data);
        deleteBtn.click();
        // Clear the canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Show the next object to draw
        currentObjectIndex++;
        if (currentObjectIndex >= objectClasses.length) {
            // Hide the body
            hideCanvas();
            // If there are no more objects, show the modal dialog
            showModal();

            // Clear the object name
            objectNameElement.textContent = "";
        } else {
            // Show the next object to draw
            currentObjectClass = objectClasses[currentObjectIndex];
            objectNameElement.textContent = currentObjectClass;
        }
    });

    // Submit button event listener
    document.getElementById("submitBtn").addEventListener("click", function () {
        name = nameInput.value;
        tool = penInput.checked ? penInput.value : mouseInput.value;

        // Create a new object to store user information
        const userInfo = {
            "username": name,
            "tool": tool
        };

        submit_content = { "user_info": userInfo, "drawings": data };

        // Hide the modal dialog
        hideModal();

        // Upload the drawing to Firebase Storage


        saveBtn.click();

        uploadBtn.click();
    });
});
