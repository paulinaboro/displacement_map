"use strict";

let img;
let mapImg;

let mouseXRatio;
let mouseYRatio;

const outputCanvas = document.getElementById("outputCanvas");
const outputContext = outputCanvas.getContext("2d");
let outputData = outputContext.createImageData(outputCanvas.width, outputCanvas.height)

const sourceCanvas = document.getElementById("sourceCanvas");
const sourceContext = sourceCanvas.getContext("2d");
let sourceData;

const mapCanvas = document.getElementById("mapCanvas");
const mapContext = mapCanvas.getContext("2d");
let mapData;
let MAX_MOVEMENT = 5;


function init() {
    img = new Image();
    img.src = "koala.jpg";

    mapImg = new Image();
    mapImg.src = "map_koala.jpg";
    img.addEventListener("load", drawImgToCanvas);
    mapImg.addEventListener("load", drawMapToCanvas);

    document
        .querySelector("#outputCanvas")
        .addEventListener("mousemove", registerMouseMove);
}

init();

function drawImgToCanvas() {
    sourceContext.drawImage(img, 0, 0);

    getImageData();
}

function drawMapToCanvas() {
    mapContext.drawImage(mapImg, 0, 0);

    getMapData();
}

function getImageData() {
    const w = sourceCanvas.width;
    const h = sourceCanvas.height;
    sourceData = sourceContext.getImageData(0, 0, w, h);
}

function getMapData() {
    const w = mapCanvas.width;
    const h = mapCanvas.height;
    mapData = mapContext.getImageData(0, 0, w, h);
}

function registerMouseMove() {
    let mouseX = event.offsetX;
    let mouseY = event.offsetY;
    //console.log(mouseX);
    console.log("offset", mouseX, mouseY);

    //let mouseClX = event.clientX;
    //let mouseClY = event.clientY;
    //console.log("client", mouseClX, mouseClY);
    calculateRatio(mouseX, mouseY);
    render();
}

function calculateRatio(x, y) {
    mouseXRatio = (x / outputCanvas.width) * 2 - 1;
    mouseYRatio = (y / outputCanvas.height) * 2 - 1;

}

function render() {
    copyPixels(mouseXRatio, mouseYRatio);
    outputContext.putImageData(outputData, 0, 0);
}


function copyPixels(mouseXRatio, mouseYRatio) {

    let displacementX = mouseXRatio * MAX_MOVEMENT;
    let displacementY = mouseYRatio * MAX_MOVEMENT;


    for (let y = 0; y < sourceCanvas.height; y++) {
        for (let x = 0; x < sourceCanvas.width; x++) {
            const pixelIndex = (x + y * sourceCanvas.width) * 4;
            let greyvalue = mapData.data[pixelIndex] / 255;

            let offsetX = Math.round(x + (displacementX * greyvalue));
            let offsetY = Math.round(y + (displacementY * greyvalue));

            const orygPixelIndex = (offsetX + offsetY * sourceCanvas.width) * 4;

            outputData.data[pixelIndex + 0] = sourceData.data[orygPixelIndex + 0];
            outputData.data[pixelIndex + 1] = sourceData.data[orygPixelIndex + 1];
            outputData.data[pixelIndex + 2] = sourceData.data[orygPixelIndex + 2];
            outputData.data[pixelIndex + 3] = sourceData.data[orygPixelIndex + 3];
        }
    }
}