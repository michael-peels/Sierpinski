// Initialize canvas context
const canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
const height = canvas.clientHeight;
const width = canvas.clientWidth;

// Get reference to ordered list
const orderedList = document.getElementById("list");

var currentPoint;
var currentCorner;
var running = false;
var currentStep = 0;

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

// define our initial triangle boundaries
/**
 *               * pointA
 *              / \
 *             /   \
 *    pointB  *- - -*  pointC
 */
const pointA = new Point(width / 2, height / 8);
const pointB = new Point(width / 6, (height / 8) * 7);
const pointC = new Point((width / 6) * 5, (height / 8) * 7);

// If progress was stopped, resume. If cleared, start from beginning
function handleStart() {
    if (currentStep != undefined) {
        running = true;
        switch (currentStep) {
            case 0:
                step0();
                break;
            case 1:
                step1();
                break;
            case 2:
                step2();
                break;
            case 3:
                step3();
                break;
            case 4:
                step4();
                break;
            default:
                step0;
                break;
        }
    } else {
        handleClear();
        step0();
    }
}

// draw a triangle
function step0() {
    running = true;
    currentStep = 0;
    displayStep(currentStep);

    // draw our starting points
    drawPoint(pointA);
    drawPoint(pointB);
    drawPoint(pointC);

    // draw a line connecting them
    drawLine(pointB, pointA, 0.1);
    drawLine(pointC, pointB, 0.1);
    drawLine(pointA, pointC, 0.1, step1);
    currentStep = 1;
}

// choose a random point inside the triangle
function step1() {
    if (running && currentStep === 1) {
        displayStep(currentStep);
        currentPoint = getPointInsideTriangle();
        setTimeout(() => {
            drawPoint(currentPoint, 2, "red");
            callWithDelay(step2, 2000);
        }, 2000);
        currentStep = 2;
    }
}

// choose a random corner
function step2() {
    if (running && currentStep === 2) {
        displayStep(currentStep);
        currentCorner = getRandomCorner();
        setTimeout(() => {
            drawPoint(currentCorner, 6, "red");
            callWithDelay(step3, 2000);
        }, 3000);
        currentStep = 3;
    }
}

// draw a dot halfway between random corner and random point
function step3() {
    if (running && currentStep === 3) {
        displayStep(currentStep);
        currentPoint = getHalfwayPoint(currentPoint, currentCorner);
        drawPoint(currentPoint);
        callWithDelay(step4, 4000);
        currentStep = 4;
    }
}

// repeat 2-3 using new point
function step4() {
    if (running && currentStep === 4) {
        displayStep(currentStep);
        callWithDelay(() => {
            fillLoop();
        }, 1000);
    }
}

function handleClear() {
    running = false;
    currentStep = undefined;
    ctx.clearRect(0, 0, width, height);
    hideSteps();
}

function handleStop() {
    running = false;
}

function displayStep(stepIndex) {
    orderedList.children[stepIndex].classList.remove("hidden");
}

function hideSteps() {
    for (var i = 0; i < orderedList.children.length; i++) {
        orderedList.children[i].classList.add("hidden");
    }
}

// loop handles the logic of drawing the Sierpiński triangle
function fillLoop() {
    if (running && currentStep === 4) {
        // pick random corner of triangle
        var corner = getRandomCorner();

        // update currentPoint to be a new point halfway between currentPoint and corner
        currentPoint = getHalfwayPoint(currentPoint, corner);
        drawPoint(currentPoint);

        setTimeout(fillLoop, 1);
        setTimeout(fillLoop, 1500);
    }
}

function getRandomCorner() {
    var cornerNumber = Math.floor(Math.random() * 3) + 1;
    return cornerNumber == 1 ? pointA : cornerNumber == 2 ? pointB : pointC;
}

function getHalfwayPoint(a, b) {
    return new Point(Math.floor((a.x + b.x) / 2), Math.floor((a.y + b.y) / 2));
}

// draws a rectangle centered on the point
function drawPoint(point, size = 1, color = "black", clear = false) {
    ctx.fillStyle = color;
    var halfSize = Math.ceil(size / 2);
    if (clear) {
        ctx.clearRect(point.x - halfSize, point.y - halfSize, size, size);
    } else {
        ctx.fillRect(point.x - halfSize, point.y - halfSize, size, size);
    }
}

function callWithDelay(method, delay) {
    setTimeout(() => {
        if (currentStep != undefined) {
            method();
        }
    }, delay);
}

// gradually draws a line with optional callback when finished
function drawLine(start, end, ratio, callback, callbackDelay = 2000) {
    x2 = start.x + ratio * (end.x - start.x);
    y2 = start.y + ratio * (end.y - start.y);
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    if (ratio < 1) {
        setTimeout(() => {
            drawLine(start, end, ratio + 0.02, callback, callbackDelay);
        }, 50);
    } else {
        if (callback !== undefined) {
            callWithDelay(callback, callbackDelay);
        }
    }
}

// code 'borrowed' from
// https://stackoverflow.com/questions/19654251/random-point-inside-triangle-inside-java
function getPointInsideTriangle() {
    var r1 = Math.random();
    var r2 = Math.random();
    x =
        (1 - Math.sqrt(r1)) * pointB.x +
        Math.sqrt(r1) * (1 - r2) * pointA.x +
        Math.sqrt(r1) * r2 * pointC.x;
    y =
        (1 - Math.sqrt(r1)) * pointB.y +
        Math.sqrt(r1) * (1 - r2) * pointA.y +
        Math.sqrt(r1) * r2 * pointC.y;

    return new Point(x, y);
}
