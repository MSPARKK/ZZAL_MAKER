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

var buttonSize = 20;

var texts = [];

var selectedText = null; // Add a variable to keep track of the selected text

canvas.addEventListener('mousedown', function (e) {
    var mouseX = e.clientX - canvas.offsetLeft;
    var mouseY = e.clientY - canvas.offsetTop;

    // Check each text object to see if we've clicked inside
    texts.forEach(function (textObj, index) {
        if (
            mouseX > textObj.deleteButtonX &&
            mouseX < textObj.deleteButtonX + textObj.buttonSize &&
            mouseY > textObj.deleteButtonY &&
            mouseY < textObj.deleteButtonY + textObj.buttonSize
        ) {
            textObj.isDeleteButtonClicked = true;
        } else if (
            mouseX > textObj.resizeButtonX &&
            mouseX < textObj.resizeButtonX + textObj.buttonSize &&
            mouseY > textObj.resizeButtonY &&
            mouseY < textObj.resizeButtonY + textObj.buttonSize
        ) {
            textObj.isResizeButtonClicked = true;
            textObj.resizeStartX = mouseX;
            textObj.resizeStartY = mouseY;
            textObj.resizeStartWidth = textObj.width;
            textObj.resizeStartHeight = textObj.height;
        } else if (mouseX > textObj.x - dragPadding && mouseX < textObj.x + textObj.width + dragPadding &&
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

        // Draw the delete button
        ctx.fillStyle = "#FF0000"; // Set the delete button color to red
        ctx.fillRect(textObj.deleteButtonX, textObj.deleteButtonY, textObj.buttonSize, textObj.buttonSize);

        // Draw the resize button
        ctx.fillStyle = "#000000"; // Set the black button color to black
        ctx.fillRect(textObj.resizeButtonX, textObj.resizeButtonY, textObj.buttonSize, textObj.buttonSize);
    }

    ctx.fillStyle = "black";
    ctx.fillText(textObj.text, textObj.x, textObj.y);
}

canvas.addEventListener('mouseup', function (e) {
    texts.forEach(function (textObj, index) {
        if (textObj.isDeleteButtonClicked) {
            // Remove the text from the array
            texts.splice(index, 1);

            // If this was the selected text, clear the selection
            if (textObj === selectedText) {
                selectedText = null;
            }
        } else {
            textObj.isDragging = false;
            textObj.isResizeButtonClicked = false;
        }

        // Clear the button clicked state
        textObj.isDeleteButtonClicked = false;
    });

    // Redraw everything
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    texts.forEach(drawText);
});

// // mousemove event
canvas.addEventListener('mousemove', function (e) {
    texts.forEach(function (textObj) {
        if (textObj.isDragging) {
            const textObjX = e.clientX - canvas.offsetLeft - textObj.offsetX;
            const textObjY = e.clientY - canvas.offsetTop - textObj.offsetY;

            textObj.x = textObjX;
            textObj.y = textObjY;

            // Calculate the new button position based on the new text position
            var newDeleteButtonX = textObjX + textObj.width + dragPadding;
            var newDeleteButtonY = textObjY - textObj.height - dragPadding - buttonSize;

            textObj.deleteButtonX = newDeleteButtonX;
            textObj.deleteButtonY = newDeleteButtonY;

            var newResizeButtonX = textObjX + textObj.width + dragPadding;
            var newResizeButtonY = textObjY + dragPadding;

            textObj.resizeButtonX = newResizeButtonX;
            textObj.resizeButtonY = newResizeButtonY;
        } else if (textObj.isResizeButtonClicked) {
            const mouseX = e.clientX - canvas.offsetLeft;
            const mouseY = e.clientY - canvas.offsetTop;

            // Calculate the distance moved by the mouse
            const deltaX = mouseX - textObj.resizeStartX;
            const deltaY = mouseY - textObj.resizeStartY;

            // Calculate the new width and height based on the mouse movement
            const newWidth = textObj.resizeStartWidth + deltaX;
            const newHeight = textObj.resizeStartHeight + deltaY;

            // Update the text object's width and height
            textObj.width = newWidth;
            textObj.height = newHeight;
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

        // Add a button size to the text object

        var newText = {
            text: inputText,
            x: canvas.width / 2 - measureText(inputText, "20px Arial").width / 2, // Subtract half the width of the text
            y: canvas.height / 2 + measureText(inputText, "20px Arial").height / 2, // Add half the height of the text
            width: measureText(inputText, "20px Arial").width,
            height: measureText(inputText, "20px Arial").height,
            isDragging: false,
            offsetX: 0,
            offsetY: 0,
            deleteButtonX: (canvas.width / 2 + measureText(inputText, "20px Arial").width / 2) + dragPadding,
            deleteButtonY: (canvas.height / 2 - measureText(inputText, "20px Arial").height / 2) - dragPadding - buttonSize,
            resizeButtonX: (canvas.width / 2 - measureText(inputText, "20px Arial").width / 2) + measureText(inputText, "20px Arial").width + dragPadding,
            resizeButtonY: (canvas.height / 2 + measureText(inputText, "20px Arial").height / 2) + dragPadding,
            buttonSize: buttonSize,
            isDeleteButtonClicked: false,
            isResizeButtonClicked: false,
            resizeStartX: 0,
            resizeStartY: 0,
            resizeStartWidth: 0,
            resizeStartHeight: 0
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





