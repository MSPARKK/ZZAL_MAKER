var divIntro = document.getElementById('div-intro');
var divMaker = document.getElementById('div-maker');

var canvas = new fabric.Canvas('myCanvas');

canvas.selectionColor = 'rgba(0, 255, 0, 0.3)'; // Green color with 30% transparency
canvas.selectionBorderColor = 'green'; // Green border color

var initialCanvasWidth = 800;
var initialCanvasHeight = 800;

canvas.width = initialCanvasWidth;
canvas.height = initialCanvasHeight;

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
    ctx.arc(0, 0, this.cornerSize / 2, 0, 2 * Math.PI, false);
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
    ctx.arc(0, 0, this.cornerSize / 2, 0, 2 * Math.PI, false);
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
    ctx.arc(0, 0, this.cornerSize / 2, 0, 2 * Math.PI, false);
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

addButton.addEventListener('click', function (e) {
    var fontSize = canvas.width / 10;
    var strokeWidth = canvas.width / 200;
    var text = new fabric.IText("기본 텍스트", {
        left: canvas.width / 2,  // Set left to half of the canvas width
        top: canvas.height / 2,  // Set top to half of the canvas height
        originX: 'center',  // Set originX to 'center'
        originY: 'center',   // Set originY to 'center'
        fontFamily: 'BMEULJIRO',
        fontSize: fontSize,  // Set the font size
        stroke: '#999999',
        strokeWidth: strokeWidth
    });

    canvas.add(text);
    canvas.setActiveObject(text);

    // Make the text object movable and selectable
    text.set({ selectable: true });
    text.set({ editable: true });

    e.stopPropagation();
});

var colorButtons = document.querySelectorAll('#color-buttonss .circle-button');

colorButtons.forEach(function (colorButtons) {
    colorButtons.addEventListener('click', function (e) {
        var activeObject = canvas.getActiveObject();
        if (activeObject && activeObject.type === 'i-text') {
            var color = this.id.replace('Button', '');
            activeObject.set({ fill: color });
            canvas.renderAll();
        }

        e.stopPropagation();
    });
});

var fontMap = {
    'fontEuljiroButton': 'BMEULJIRO',
    'fontJamsilButton': 'TheJamsil5Bold',
    // 추가 폰트 버튼이 있다면 여기에 추가
};

var fontButtons = document.querySelectorAll('.font-button');

fontButtons.forEach(function (button) {
    button.addEventListener('click', function (e) {
        var activeObject = canvas.getActiveObject();
        if (activeObject && activeObject.type === 'i-text') {
            var fontName = fontMap[this.id];
            activeObject.set({ fontFamily: fontName });
            canvas.renderAll();
        }

        e.stopPropagation();
    });
});

function handleSelection(e, event) {
    const textInput = document.getElementById('text-input');
    const textStyle = document.getElementById('text-style')

    switch (event) {
        case 'cleared':
            textInput.classList.remove('hidden');
            textStyle.classList.add('hidden');
            break;
        case 'created':
        case 'updated':
            if (e.selected[0] && e.selected[0].type === 'i-text') {
                textInput.classList.add('hidden');
                textStyle.classList.remove('hidden');
            } else {
                textInput.classList.remove('hidden');
                textStyle.classList.add('hidden');
            }
            break;
        default:
            console.log('Unknown event');
            break;
    }
}

canvas.on('selection:created', function (e) {
    handleSelection(e, 'created');
});

canvas.on('selection:updated', function (e) {
    handleSelection(e, 'updated');
});

canvas.on('selection:cleared', function (e) {
    handleSelection(e, 'cleared');
});

// 캔버스 크기 조정 함수
function resizeCanvas() {
    let browserWidth = window.innerWidth;
    let browserHeight = window.innerHeight;

    // 캔버스의 최대 크기
    let maxCanvasSize = 800;

    // 캔버스의 원래 가로 세로 비율
    let aspectRatio = 1; // 여기서는 1:1 (가로:세로) 비율

    // 브라우저 창 크기에 따른 캔버스 크기 조절
    let canvasSize = Math.min(browserWidth * 0.8, browserHeight * 0.8, maxCanvasSize);  // 브라우저 창 크기와 최대 캔버스 크기 중 작은 값

    // 캔버스의 가로 세로 크기 설정
    let canvasWidth = canvasSize * aspectRatio;
    let canvasHeight = canvasSize;

    // canvas.setWidth(canvasWidth);
    // canvas.setHeight(canvasHeight);


    let scaleX = canvasWidth / initialCanvasWidth;
    let scaleY = canvasHeight / initialCanvasHeight;

    // Update canvas size
    canvas.setWidth(canvasWidth);
    canvas.setHeight(canvasHeight);

    // Scale all objects
    let objects = canvas.getObjects();
    for (let i in objects) {
        let scaleX = objects[i].scaleX;
        let scaleY = objects[i].scaleY;
        let left = objects[i].left;
        let top = objects[i].top;

        let tempScaleX = scaleX * (canvasWidth / initialCanvasWidth);
        let tempScaleY = scaleY * (canvasHeight / initialCanvasHeight);
        let tempLeft = left * (canvasWidth / initialCanvasWidth);
        let tempTop = top * (canvasHeight / initialCanvasHeight);

        objects[i].scaleX = tempScaleX;
        objects[i].scaleY = tempScaleY;
        objects[i].left = tempLeft;
        objects[i].top = tempTop;

        objects[i].setCoords();
    }

    canvas.renderAll();
    initialCanvasWidth = canvasWidth;
    initialCanvasHeight = canvasHeight;
}

// 창 크기가 변경될 때마다 캔버스 크기 조정
window.addEventListener('resize', resizeCanvas);

// 페이지 로드 시 캔버스 크기 조정
window.addEventListener('load', resizeCanvas);

// 캔버스 밖을 클릭하더라도 선택된 텍스트가 없게 처리
document.body.addEventListener('click', function (e) {
    var canvasContainer = document.getElementById('myCanvas').parentElement;

    if (e.target == canvasContainer || canvasContainer.contains(e.target)) {
        return;
    }

    canvas.discardActiveObject().requestRenderAll();
});


document.getElementById('imageLoader').addEventListener("change", handleImage, false);

function handleImage(e) {
    var reader = new FileReader();
    reader.onload = function (event) {
        var imgObj = new Image();
        imgObj.src = event.target.result;
        imgObj.onload = function () {
            var image = new fabric.Image(imgObj);
            image.set({
                scaleX: canvas.width / imgObj.width,
                scaleY: canvas.height / imgObj.height,
                lockMovementX: true,  // Prevents moving the image on the x axis
                lockMovementY: true,  // Prevents moving the image on the y axis
                lockScalingX: true,  // Prevents scaling the image on the x axis
                lockScalingY: true,  // Prevents scaling the image on the y axis
                lockRotation: true,  // Prevents rotating the image
                hasBorders: false,  // Removes the border around the image
                hasControls: false,  // Removes the control points around the image
                selectable: false
            });
            image.setCoords();  // Updates the image's coordinates
            canvas.centerObject(image);  // Centers the image on the canvas
            canvas.add(image);
            canvas.sendToBack(image);  // Makes sure the image is always in the back
            canvas.renderAll();

            divIntro.classList.add('hidden');
            divMaker.classList.remove('hidden');
        }
    }
    reader.readAsDataURL(e.target.files[0]);
}

document.getElementById('saveBtn').addEventListener('click', function() {
    // Deselect active object
    canvas.discardActiveObject().renderAll();

    var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"); // here is the most important part because if you don't replace you will get a DOM 18 exception.

    // Create a link element
    var link = document.createElement('a');

    // Use timestamp for unique file names
    var timestamp = Date.now();
    link.download = 'my-image-' + timestamp + '.png';
    
    link.href = image;
    link.click();
});
