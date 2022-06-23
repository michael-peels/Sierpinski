const canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
const height = canvas.clientHeight;
const width = canvas.clientWidth;
var currentPoint;
var running = false;

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

function drawPoint(point) {
    this.ctx.fillRect(point.x, point.y, 1, 1);
}

// Set the three corners
const pointOne = new Point(width / 2, height / 8);
const pointTwo = new Point(width / 5, (height / 8) * 7);
const pointThree = new Point((width / 5) * 4, (height / 8) * 7);

function handleStart() {
    if (currentPoint == undefined) {
        // need to pick a random initial point inside the triangle
        currentPoint = getPointInsideTriangle();
        drawPoint(currentPoint);
    }
    running = true;
    fillLoop();
}

function fillLoop() {
    // pick random corner of triangle
    var cornerNumber = Math.floor(Math.random() * 3) + 1;
    var corner = cornerNumber == 1 ? pointOne : cornerNumber == 2 ? pointTwo : pointThree;

    // draw dot half way between currentpoint and corner
    currentPoint = getHalfwayPoint(currentPoint, corner);
    drawPoint(currentPoint);

    if (running) {
        // repeat until clear clicked
        setTimeout(() => {
            fillLoop();
        }, 1);
    }
}

function getHalfwayPoint(pointA, pointB) {
    return new Point((pointA.x + pointB.x) / 2, (pointA.y + pointB.y) / 2);
}

function getPointInsideTriangle() {
    var r1 = Math.random();
    var r2 = Math.random();
    x =
        (1 - Math.sqrt(r1)) * pointTwo.x +
        Math.sqrt(r1) * (1 - r2) * pointOne.x +
        Math.sqrt(r1) * r2 * pointThree.x;
    y =
        (1 - Math.sqrt(r1)) * pointTwo.y +
        Math.sqrt(r1) * (1 - r2) * pointOne.y +
        Math.sqrt(r1) * r2 * pointThree.y;

    return new Point(x, y);
}

function handleClear() {
    running = false;
    ctx.clearRect(0, 0, width, height);
}

function handleStop() {
    running = false;
}
