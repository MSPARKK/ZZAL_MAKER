var canvas = new fabric.Canvas('myCanvas');

canvas.selectionColor = 'rgba(0, 255, 0, 0.3)'; // Green color with 30% transparency
canvas.selectionBorderColor = 'green'; // Green border color

canvas.width = 800;
canvas.height = 800;

// Custom control for scaling
var scaleControl = new fabric.Control({
    x: 0.5,
    y: 0.5,
    actionHandler: fabric.controlsUtils.scalingEqually,
    actionName: 'scale',
    cursorStyle: 'se-resize',
    cornerSize: 26,
    render: renderCircleControl,
});

// Render function for custom controls
function renderCircleControl(ctx, left, top, styleOverride, fabricObject) {
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
    ctx.beginPath();
    ctx.arc(0, 0, this.cornerSize/2, 0, 2 * Math.PI, false);
    ctx.fillStyle = styleOverride.cornerColor || 'rgba(255, 255, 255, 1)';
    ctx.strokeStyle = styleOverride.cornerStrokeColor || 'rgba(20, 20, 20, 0.5)';
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();
    ctx.restore();
}

// Replace all controls with custom controls
fabric.Object.prototype.controls = {
  mtr: rotateControl,  // Custom rotate control
  br: scaleControl,  // Custom scale control
  deleteControl: deleteControl  // Custom delete control
};

var controllerColor = 'rgba(20, 20, 20, 0.5)';

fabric.Object.prototype.set({
    transparentCorners: false,
    borderColor: controllerColor,
    cornerSize: 12,
    padding: 10,
    borderScaleFactor: 3
});


var deleteControl = new fabric.Control({
    x: 0.5,
    y: -0.5,
    cursorStyle: 'pointer',
    mouseUpHandler: deleteObject,
    render: renderDeleteIcon,
    cornerSize: 26
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
    ctx.arc(0, 0, this.cornerSize/2, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.strokeStyle = 'rgba(20, 20, 20, 0.5)';
    ctx.lineWidth = 2; // Set the thickness of the stroke
    ctx.stroke();
    ctx.restore();
}

fabric.Object.prototype.controls.deleteControl = deleteControl;

var rotateControl = new fabric.Control({
    x: -0.5, // position the control to the bottom right
    y: -0.5,
    cursorStyle: 'pointer',
    actionHandler: fabric.controlsUtils.rotationWithSnapping,
    actionName: 'rotate',
    render: renderRotateIcon, // use custom render method
    cornerSize: 26
});

function renderRotateIcon(ctx, left, top, styleOverride, fabricObject) {
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
    ctx.beginPath();
    ctx.arc(0, 0, this.cornerSize/2, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.strokeStyle = 'rgba(20, 20, 20, 0.5)';
    ctx.lineWidth = 2; // Set the thickness of the stroke
    ctx.stroke();
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

addButton.addEventListener('click', function () {
    var text = new fabric.IText("기본 텍스트", { 
        left: canvas.width / 2,  // Set left to half of the canvas width
        top: canvas.height / 2,  // Set top to half of the canvas height
        originX: 'center',  // Set originX to 'center'
        originY: 'center',   // Set originY to 'center'
        fontFamily: 'BMEULJIRO'
    });
    canvas.add(text);
    canvas.setActiveObject(text);

    // Make the text object movable and selectable
    text.set({ selectable: true });
    text.set({ editable: true });
});

var colorButtons = document.querySelectorAll('#color-buttonss .circle-button');

colorButtons.forEach(function(colorButtons) {
    colorButtons.addEventListener('click', function() {
        var activeObject = canvas.getActiveObject();
        if (activeObject && activeObject.type === 'i-text') {
            var color = this.id.replace('Button', '');
            activeObject.set({ fill: color });
            canvas.renderAll();
        }
    });
});


var euljiroButton = document.getElementById('fontEuljiroButton');
var jamsilButton = document.getElementById('fontJamsilButton');

euljiroButton.addEventListener('click', function() {
    var activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'i-text') {
        activeObject.set({ fontFamily: 'BMEULJIRO' });
        canvas.renderAll();
    }
});

jamsilButton.addEventListener('click', function() {
    var activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'i-text') {
        activeObject.set({ fontFamily: 'TheJamsil5Bold' });
        canvas.renderAll();
    }
});

function handleSelection(e, event) {
    const textInput = document.getElementById('text-input');
    const colorButtons = document.getElementById('color-buttonss');
    const fontButtons = document.getElementById('font-buttonss')

    switch (event) {
        case 'cleared':
            textInput.classList.remove('hidden');
            colorButtons.classList.add('hidden');
            fontButtons.classList.add('hidden');
            break;
        case 'created':
        case 'updated':
            if (e.selected[0] && e.selected[0].type === 'i-text') {
                textInput.classList.add('hidden');
                colorButtons.classList.remove('hidden');
                fontButtons.classList.remove('hidden');
            } else {
                textInput.classList.remove('hidden');
                colorButtons.classList.add('hidden');
                fontButtons.classList.add('hidden');
            }
            break;
        default:
            console.log('Unknown event');
            break;
    }
}

canvas.on('selection:created', function(e) {
    handleSelection(e, 'created');
});

canvas.on('selection:updated', function(e) {
    handleSelection(e, 'updated');
});

canvas.on('selection:cleared', function(e) {
    handleSelection(e, 'cleared');
});