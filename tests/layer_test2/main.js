'use strict'

const opacitySlider = document.querySelector('#opacity-slider');
const workspace = document.querySelector('#workspace');
const layerControlPanel = document.querySelector('#layer-control-panel');

const layerNote = function() {
    let note = document.createElement('div');
    note.setAttribute('class','layer_note');
    note.setAttribute('onclick','selectLayer(this)');
    note.insertAdjacentHTML('beforeend',`
    <input onclick="checkVisibility(this,event)" type="checkbox" checked/>
    <label style="margin: auto; -webkit-user-select: none"></label>`);
    return note;
}();

let currentLayer = null;
let i = 0;

function createLayer(){
    let draw = SVG().addTo(workspace).size(workspace.clientWidth, workspace.clientHeight);
    let newLayer = draw.node;
    newLayer.setAttribute('class', 'layer');
    
    opacitySlider.value = 1;
    
    let newNote = layerNote.cloneNode(true);
    newNote.setAttribute('checked',false);
    newNote.lastElementChild.textContent = 'Layer '+i++;
    layerControlPanel.prepend(newNote);

    newLayer.note = newNote;
    newNote.layer = newLayer;
    selectLayer(newNote);
}

function changeOpacity() {
    currentLayer.setAttribute('opacity', opacitySlider.value);
}

function checkVisibility(checkbox,ev) {
    ev.stopPropagation();
    let layer = checkbox.parentElement.layer;
    if (checkbox.checked) {
        layer.setAttribute('display', '');
        return;
    }
    layer.setAttribute('display', 'none');
}

function selectLayer(note) {
    if (currentLayer !== null) {
        currentLayer.note.setAttribute('checked','');
    }
    note.setAttribute('checked',note.getAttribute('checked') === 'true' ? false : true);
    currentLayer = note.layer;
}

function deleteLayer() {
    if (currentLayer === null) return;
    currentLayer.remove();
    currentLayer.note.remove();
    currentLayer = null;
}

function drawBush() {
    currentLayer.insertAdjacentHTML('beforeend','<image x=0 y=0 height="400" width="400" xlink:href="./pics/bush.svg"/>')
}

function drawTower() {
    currentLayer.insertAdjacentHTML('beforeend','<image x="50%" y="25%" xlink:href="./pics/tower.svg"/>')
}

function drawShrine() {
    currentLayer.insertAdjacentHTML('beforeend','<image x="60%" y="20%" xlink:href="./pics/shrine.svg"/>')
}

function clearPlease() {
    if (currentLayer === null) return;
    SVG(currentLayer).clear();
}
