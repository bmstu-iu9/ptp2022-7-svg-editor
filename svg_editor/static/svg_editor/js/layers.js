'use strict'

const opacitySlider = document.querySelector('#opacity-slider');
const layerControlPanel = document.querySelector('#layer-control-panel');
const workspace = document.querySelector('#workspace');

const layerNote = function() {
    let note = document.createElement('div');
    note.setAttribute('class','layer_note');
    note.insertAdjacentHTML('beforeend',`
    <input type="checkbox" checked/>
    <label></label>`);
    return note;
}();

let currentLayer = null,
    draw = null,
    canvasRect = null,
    object = null,
    i = 0;

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

function checkVisibility(checkbox) {
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
    note.setAttribute('checked',!(note.getAttribute('checked') === 'true'));
    currentLayer = note.layer;
    draw = SVG(currentLayer);
    canvasRect = currentLayer.getBoundingClientRect();
    object = null
}

function deleteLayer() {
    if (currentLayer === null) return;
    currentLayer.remove();
    currentLayer.note.remove();
    currentLayer = null;
}

$('#layer-control-panel').on("click",".layer_note",function () {
    selectLayer(this);
})

$('#layer-control-panel').on("click",".layer_note input",function () {
    checkVisibility(this);
})