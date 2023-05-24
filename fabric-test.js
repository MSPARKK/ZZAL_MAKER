
var canvas = new fabric.Canvas('myCanvas');

canvas.width = 800;
canvas.height = 800;


fabric.Object.prototype.set({
    transparentCorners: false,
    cornerColor: 'rgba(255, 87, 34, 0.7)',
    cornerStrokeColor: 'rgba(255, 87, 34, 0.5)',
    borderColor: 'rgba(255, 87, 34, 0.5)',
    cornerSize: 12,
    padding: 10
});

var deleteControl = new fabric.Control({
    x: 0.5,
    y: -0.5,
    cursorStyle: 'pointer',
    mouseUpHandler: deleteObject,
    render: renderDeleteIcon,
    cornerSize: 30
});

function deleteObject(eventData, transform) {
    var target = transform.target;
    var canvas = target.canvas;
    canvas.remove(target);
    canvas.requestRenderAll();
  }

function renderDeleteIcon(ctx, left, top, styleOverride, fabricObject) {
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
    ctx.beginPath();
    ctx.arc(0, 0, 15, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.restore();
}

fabric.Object.prototype.controls.deleteControl = deleteControl;

var rotateControl = new fabric.Control({
    x: 0.5, // position the control to the bottom right
    y: 0.5,
    cursorStyle: 'pointer',
    actionHandler: fabric.controlsUtils.rotationWithSnapping,
    actionName: 'rotate',
    render: renderRotateIcon, // use custom render method
    cornerSize: 30
});

function renderRotateIcon(ctx, left, top, styleOverride, fabricObject) {
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
    ctx.beginPath();
    ctx.arc(0, 0, 15, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'black'; // draw a black circle
    ctx.fill();
    ctx.restore();
}

fabric.Object.prototype.controls.mtr = rotateControl; // replace the default rotation control


// Helper function to render an icon
function renderIcon(url) {
    return function (ctx, left, top, styleOverride, fabricObject) {
        var size = this.sizeX;
        ctx.drawImage(img, -size / 2, -size / 2, size, size);
    }
}

// Button and input field
var addButton = document.getElementById('addText'); // Select the button
var inputField = document.getElementById('inputText'); // Select the input field

addButton.addEventListener('click', function () {
    var inputText = inputField.value; // Get the text from the input field

    if (inputText) { // Only add the text if the input is not empty

        var text = new fabric.Text(inputText, { left: 10, top: 10 });
        canvas.add(text);
        canvas.setActiveObject(text);

        // Make the text object movable and selectable
        text.set({ selectable: true });
    }

    inputField.value = ''; // Clear the input field after adding the text
});

var blackButton = document.getElementById('blackButton'); // Select the black button
var redButton = document.getElementById('redButton'); // Select the red button

blackButton.addEventListener('click', function() {
    var activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'text') {
        activeObject.set({ fill: 'black' });
        canvas.renderAll();
    }
});

redButton.addEventListener('click', function() {
    var activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'text') {
        activeObject.set({ fill: 'red' });
        canvas.renderAll();
    }
});

blueButton.addEventListener('click', function() {
    var activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'text') {
        activeObject.set({ fill: 'blue' });
        canvas.renderAll();
    }
});