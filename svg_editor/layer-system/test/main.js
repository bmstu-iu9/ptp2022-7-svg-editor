'use strict'

const sliders = document.querySelector('.sliders')
const div = document.querySelector('div');
let currentLayer;

function createLayer(){
    let draw = SVG().addTo(div).size(div.clientWidth, div.clientHeight);
    draw.node.setAttribute('class', 'layer')
    currentLayer = draw.node;
}

function drawBall() {
    currentLayer.insertAdjacentHTML('afterbegin','<image x=0 y=0 xlink:href="./pics/ball.svg"/>')
}

function drawTower() {
    currentLayer.insertAdjacentHTML('afterbegin','<image x="50%" y="50%" xlink:href="./pics/tower.svg"/>')
}

function drawShrine() {
    currentLayer.insertAdjacentHTML('afterbegin','<image x="60%" y="20%" xlink:href="./pics/shrine.svg"/>')
}

function changeOpacity(slider) {
    currentLayer.setAttribute('opacity', slider.value)
}

function deleteLayer() {
    currentLayer.remove();
    currentLayer = div.lastChild;
}