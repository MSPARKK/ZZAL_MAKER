
var canvas = new fabric.Canvas('myCanvas');

canvas.width = 800;
canvas.height = 800;

// Button and input field
var addButton = document.getElementById('addText'); // Select the button
var inputField = document.getElementById('inputText'); // Select the input field

addButton.addEventListener('click', function () {
    var inputText = inputField.value; // Get the text from the input field

    if (inputText) { // Only add the text if the input is not empty

        var text = new fabric.Text(inputText, { left: 10, top: 10 });
        canvas.add(text);

        // Make the text object movable and selectable
        text.set({ selectable: true });
    }

    inputField.value = ''; // Clear the input field after adding the text
});