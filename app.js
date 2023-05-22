const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 800;


// Define expanded draggable area
var dragPadding = 10; // 10px padding on each side


// // Draw the initial text
ctx.fillStyle = "black";
ctx.font = '20px Arial';

// Track whether we're currently dragging
var isDragging = false;

var offsetX, offsetY;

var texts = [

];


var selectedText = null; // Add a variable to keep track of the selected text


canvas.addEventListener('mousedown', function (e) {
    var mouseX = e.clientX - canvas.offsetLeft;
    var mouseY = e.clientY - canvas.offsetTop;

    // Check each text object to see if we've clicked inside
    texts.forEach(function (textObj, index) {
        if (mouseX > textObj.x - dragPadding && mouseX < textObj.x + textObj.width + dragPadding &&
            mouseY > textObj.y - textObj.height - dragPadding && mouseY < textObj.y + dragPadding) {
            textObj.isDragging = true;
            textObj.offsetX = mouseX - textObj.x;
            textObj.offsetY = mouseY - textObj.y;

            // Move the selected text to the end of the array
            texts.splice(index, 1);
            texts.push(textObj);

            // Update the selected text when starting to drag
            selectedText = textObj;
        }
    });
});

function drawText(textObj) {
    // Only draw the background if this is the selected text
    if (textObj === selectedText) {
        ctx.fillStyle = "#FFEEAA";
        ctx.fillRect(textObj.x - dragPadding, textObj.y - textObj.height - dragPadding,
            textObj.width + (2 * dragPadding), textObj.height + (2 * dragPadding));
    }

    ctx.fillStyle = "black";
    ctx.fillText(textObj.text, textObj.x, textObj.y);
}

canvas.addEventListener('mouseup', function (e) {
    texts.forEach(function (textObj) {
        textObj.isDragging = false;
    });

    // Optional: You can clear the selection when releasing the mouse
    // selectedText = null;
});

// // mousemove event
canvas.addEventListener('mousemove', function (e) {
    texts.forEach(function (textObj) {
        if (textObj.isDragging) {
            textObj.x = e.clientX - canvas.offsetLeft - textObj.offsetX;
            textObj.y = e.clientY - canvas.offsetTop - textObj.offsetY;
        }
    });
    // Redraw everything
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    texts.forEach(drawText);
});

// Initial draw
texts.forEach(drawText);

// Button
var addButton = document.getElementById('addText'); // Select the button
var inputField = document.getElementById('inputText'); // Select the input field

addButton.addEventListener('click', function () {
    var inputText = inputField.value; // Get the text from the input field

    if (inputText) { // Only add the text if the input is not empty
        var newText = {
            text: inputText,
            x: 50,
            y: 50,
            width: measureText(inputText, "20px Arial").width,
            height: measureText(inputText, "20px Arial").height,
            isDragging: false,
            offsetX: 0,
            offsetY: 0
        };

        // If there was a previously selected text, deselect it
        if (selectedText) {
            selectedText = null;
        }

        texts.push(newText);

        // Make the new text the selected text
        selectedText = newText;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        texts.forEach(drawText);
    }

    inputField.value = ''; // Clear the input field after adding the text
});





