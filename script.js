// Initialize canvas context
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

function handleStart() {
    if (currentPoint == undefined) {
        // need to pick a random initial point inside the triangle
        currentPoint = getPointInsideTriangle();
        drawPoint(currentPoint);
    }
    running = true;
    fillLoop();
}

function handleClear() {
    running = false;
    ctx.clearRect(0, 0, width, height);
}

function handleStop() {
    running = false;
}

// loop handles the logic of drawing the Sierpiński triangle
function fillLoop() {
    if (running) {
        // pick random corner of triangle
        var cornerNumber = Math.floor(Math.random() * 3) + 1;
        var corner = cornerNumber == 1 ? pointA : cornerNumber == 2 ? pointB : pointC;

        // update currentPoint to be a new point halfway between currentPoint and corner
        currentPoint = getHalfwayPoint(currentPoint, corner);
        drawPoint(currentPoint);

        // repeat until clear clicked
        // speed up drawing by setting multiple timeouts
        for (var i = 0; i < 2; i++) {
            setTimeout(() => {
                fillLoop();
            }, 1);
        }
    }
}

function getHalfwayPoint(a, b) {
    return new Point(Math.floor((a.x + b.x) / 2), Math.floor((a.y + b.y) / 2));
}

function drawPoint(point) {
    ctx.fillRect(point.x, point.y, 1, 1);
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
