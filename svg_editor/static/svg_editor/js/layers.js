/**
 * @author wizardOfOz21
 **/

'use strict'

const opacitySlider = document.querySelector('#opacity_slider');
const layerControlPanel = document.querySelector('#layer_panel');

let currentLayerNote,
    i;

function newLayerNote(relatedLayer, layerName) {
    let note = document.createElement('div');
    note.insertAdjacentHTML('beforeend', `
    <input type="checkbox" checked/><label>${layerName}</label>`);
    
    note.classList.add('layer_note');
    note.setAttribute('draggable', 'true');

    note.layer = relatedLayer;
    return note;
};

function createLayer(baseElement) {
    let newLayer = (baseElement === undefined) ? SVG() : SVG(baseElement);
    newLayer.addTo(workspace).size(workspace.clientWidth, workspace.clientHeight);  
    newLayer.node.classList.add('layer');

    opacitySlider.value = 1;

    let layerName = prompt('Enter layer name', 'Layer ' + i++);
    let newNote = newLayerNote(newLayer, layerName);
    layerControlPanel.prepend(newNote);
    selectLayer(newNote);
}

function selectLayer(layerNote) {
    if (currentLayerNote !== null) {
        currentLayerNote.setAttribute('checked', '');
    }
    layerNote.setAttribute('checked', 'true');
    
    currentLayerNote = layerNote;

    layerUpdate(layerNote.layer);
}

function deleteLayer() {
    if (currentLayerNote === null) return;
    currentLayerNote.layer.node.remove();
    currentLayerNote.remove();
    currentLayerNote = null;
    i--;
}

function deleteAllLayers() {
    workspace.innerHTML = "";
    layerControlPanel.innerHTML = "";

    currentLayerNote = null;
    i = 0;
}

function changeOpacity() {
    currentLayerNote.layer.node.setAttribute('opacity', opacitySlider.value);
}

function getPictureAsSvg() {
    let svgString = `<svg xmlns="http://www.w3.org/2000/svg" ` +
                         `xmlns:xlink="http://www.w3.org/1999/xlink" ` + 
                         `version="1.1" ` +
                         `width="${workspace.clientHeight}" ` + 
                         `height="${workspace.clientWidth}">\n`

    for (let layer of document.getElementById('workspace').childNodes) {
        svgString += `\t<g height="${layer.getAttribute('height')}" ` +
                            `width="${layer.getAttribute('width')}" ` +
                            `opacity="${layer.getAttribute('opacity')}" ` +
                            `viewBox="${layer.getAttribute('viewBox')}">\n`;
        for (let elem of layer.children) {
            svgString += `\t\t${elem.outerHTML}\n`
        }
        svgString += '\t</g>\n'
    }
    svgString += '</svg>\n'
    return svgString;
}

function getPictureAsProject() {
    let projectData = {attributes: [ `xmlns="http://www.w3.org/2000/svg"`,
                         `xmlns:xlink="http://www.w3.org/1999/xlink"`,
                         `version="1.1"`,
                         `width="${workspace.clientHeight}"`,
                         `height="${workspace.clientWidth}"`]};
    projectData.layers = [];

    for (let layer of document.getElementById('workspace').childNodes) {
        let layerData = {attributes: [`height="${layer.getAttribute('height')}"`,
                            `width="${layer.getAttribute('width')}"`,
                            `opacity="${layer.getAttribute('opacity')}"`,
                            `viewBox="${layer.getAttribute('viewBox')}"`]};
        layerData.outer = '';
        for (let elem of layer.children) {
            layerData.outer += `${elem.outerHTML}`;
        }
        projectData.layers.push(layerData);
    }
    return projectData;
}

function openAsSvg(svgString) {
    let oParser = new DOMParser();
    let oDOM = oParser.parseFromString(svgString,"application/xml");
    deleteAllLayers();
    createLayer(oDOM.documentElement);
}

$(document).ready(function () {
    
    $("#createLayerButton").click(function () {
        createLayer();
    })
    $("#deleteLayerButton").click(function () {
        deleteLayer();
    })
    $("#createNewFileButton").click(function () {
        deleteAllLayers();
        createLayer();
    })

    $("#createNewFileButton").click();

    $('#layer_panel').on("click", ".layer_note", function () {
        selectLayer(this);
    })
    $('#layer_panel').on("dragstart", ".layer_note", function () {
        selectLayer(this);
    })
    $('#layer_panel').on("dragenter", ".layer_note", function () {
        this.querySelector('input').classList.add('unactive');
        this.classList.add('hovered');
    })
    $('#layer_panel').on("dragleave", ".layer_note", function () {
        this.querySelector('input').classList.remove('unactive');
        this.classList.remove('hovered');
    })
    $('#layer_panel').on("dragover", ".layer_note", function (e) {
        e.preventDefault();
    })
    $('#layer_panel').on("drop", ".layer_note", function () {
        console.log('drop');
        $(this).trigger("dragleave");
        this.layer.before(currentLayer);
        this.after(currentLayer.note);
    })
    $('#layer_panel').on("click", ".layer_note input", function () {
        let layer = checkbox.parentElement.layer;
        if (checkbox.checked) {
            layer.node.setAttribute('display', '');
            return;
        }
        layer.node.setAttribute('display', 'none');
    })
})