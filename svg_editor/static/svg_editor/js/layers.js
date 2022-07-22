'use strict'

const opacitySlider = document.querySelector('#opacity_slider');
const layerControlPanel = document.querySelector('#layer_panel');
const workspace = document.querySelector('#workspace');

const layerNote = function () {
    let note = document.createElement('div');
    note.setAttribute('class', 'layer_note');
    note.insertAdjacentHTML('beforeend', `
    <input type="checkbox" checked/>
    <label></label>`);
    return note;
}();

let currentLayer,
    draw,
    canvasRect,
    object,
    i;

function createLayer(baseElement) {
    let draw = (baseElement === undefined) ? SVG() : SVG(baseElement);
    draw.addTo(workspace).size(workspace.clientWidth, workspace.clientHeight);
    let newLayer = draw.node;

    newLayer.classList.add('layer');

    opacitySlider.value = 1;

    let newNote = layerNote.cloneNode(true);
    newNote.setAttribute('checked', false);
    newNote.lastElementChild.textContent = 'Layer ' + i++;
    layerControlPanel.prepend(newNote);

    newLayer.note = newNote;
    newNote.layer = newLayer;
    selectLayer(newNote);
}

function selectLayer(note) {

    if (currentLayer !== null) {
        currentLayer.note.setAttribute('checked', '');
    }
    note.setAttribute('checked', !(note.getAttribute('checked') === 'true'));
    currentLayer = note.layer;


    draw = SVG(currentLayer);
    canvasRect = currentLayer.getBoundingClientRect();
    object = null
}

function deleteLayer(layer) {
    if (currentLayer === null) return;
    currentLayer.remove();
    currentLayer.note.remove();
    currentLayer = null;
    i--;
}

function deleteAllLayers() {
    workspace.innerHTML = "";
    layerControlPanel.innerHTML = "";
    currentLayer = null;
    draw = null;
    canvasRect = null;
    object = null;
    i = 0;
}

function changeOpacity() {
    currentLayer.setAttribute('opacity', opacitySlider.value);
}

function checkActivity(checkbox) {
    let layer = checkbox.parentElement.layer;
    if (checkbox.checked) {
        layer.setAttribute('display', '');
        return;
    }
    layer.setAttribute('display', 'none');
}

function getPictureAsSvg() {
    let svgString = `<svg xmlns="http://www.w3.org/2000/svg" ` +
                         `xmlns:xlink="http://www.w3.org/1999/xlink" ` + 
                         `version="1.1" ` +
                         `width="${workspace.clientHeight}" ` + 
                         `height="${workspace.clientWidth}">\n`

    for (let layer of document.getElementById('workspace').childNodes) {
        svgString += `\t<svg height="${layer.getAttribute('height')}" ` +
                            `width="${layer.getAttribute('width')}" ` +
                            `opacity="${layer.getAttribute('opacity')}" ` +
                            `viewBox="${layer.getAttribute('viewBox')}">\n`;
        for (let elem of layer.children) {
            svgString += `\t\t${elem.outerHTML}\n`
        }
        svgString += '\t</svg>\n'
    }
    svgString += '</svg>\n'
    return svgString;
}

function openAsSvg(svgString) {
    let oParser = new DOMParser();
    let oDOM = oParser.parseFromString(svgString,"application/xml");
    deleteAllLayers();
    createLayer(oDOM.documentElement);
}

$(document).ready(function () {
    deleteAllLayers();
    createLayer();
    $('#layer_panel').on("click", ".layer_note", function () {
        selectLayer(this);
    })
    $('#layer_panel').on("click", ".layer_note input", function () {
        checkActivity(this);
    })
})
