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
    <div class="top" style="width: 100%; height: 10px;"><input type="checkbox" checked/><label>${layerName}</label></div>
    <div class="bottom" style="width: 100%; height: 10px;"></div>
    `);
    note.classList.add('layer_note');
    note.setAttribute('draggable', 'true');

    note.layer = relatedLayer;
    return note;
};

function newLayer(baseElement, layerName) {
    let newLayer = (baseElement === undefined) ? SVG() : SVG(baseElement);
    newLayer.addTo(workspace).size(workspace.clientWidth, workspace.clientHeight);  

    if (layerName === undefined) {
        layerName = prompt('Enter layer name', 'Layer ' + i++);
    }
    let newNote = newLayerNote(newLayer, layerName);
    newNote.layerNode = newNote.layer.node;
    newNote.layerName = newNote.children[0].lastChild.innerText;
    newNote.layerNode.classList.add('layer');
    return newNote;
}

function addToPanel(layer) {
    layerControlPanel.prepend(layer);
    selectLayer(layer);
}

function selectLayer(layerNote) {
    if (currentLayerNote !== null) {
        currentLayerNote.setAttribute('checked', '');
    }
    layerNote.setAttribute('checked', 'true');

    currentLayerNote = layerNote;

    let opacity = layerNote.layerNode.getAttribute('opacity');
    opacitySlider.value = opacity == null ? 1 : opacity;
    layerUpdate(layerNote.layer);
}

function deleteLayer() {
    if (currentLayerNote === null) return;
    currentLayerNote.layerNode.remove();
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
    currentLayerNote.layerNode.setAttribute('opacity', opacitySlider.value);
}

function isDrawAllowed() {
    return !(currentLayerNote === null || currentLayerNote.layerNode.getAttribute('display') == 'none');
}

function getPictureAsSvg() {
    let svgString = `<svg xmlns="http://www.w3.org/2000/svg" ` +
                         `xmlns:xlink="http://www.w3.org/1999/xlink" ` + 
                         `version="1.1" ` +
                         `width="${workspace.clientHeight}" ` + 
                         `height="${workspace.clientWidth}">\n`;

    for (let layer of workspace.childNodes) {
        if (layer.nodeName == 'svg') {
            svgString += `\t<svg height="${layer.getAttribute('height')}" ` +
                                `width="${layer.getAttribute('width')}"` +
                                `${getOpacity(layer)}` +
                                `${getViewBox(layer)}>\n`;
            for (let elem of layer.children) {
                svgString += `\t\t${elem.outerHTML}\n`;
            }
            svgString += '\t</svg>\n';
        } else {
            svgString += layer.outerHTML;
        }
    }
    svgString += '</svg>\n';
    console.log(svgString);
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
                            `${getOpacity(layer)}`,
                            `${getViewBox(layer)}>`]};
        layerData.outer = '';
        for (let elem of layer.children) {
            layerData.outer += `${elem.outerHTML}`;
        }
        projectData.layers.push(layerData);
    }
    return projectData;
}

function getOpacity(svg) {
    let opacity = svg.getAttribute('opacity');
    return opacity === null || opacity == 1 ? '' : ` opacity="${opacity}"`;
}

function getViewBox(svg) {
    let viewBox = svg.getAttribute('viewBox');
    return viewBox === null? '' : ` viewBox="${viewBox}"`;
}

function openAsSvg(svgString, fileName) {
    let oParser = new DOMParser();
    let oDOM = oParser.parseFromString(svgString,"application/xml");
    addToPanel(newLayer(oDOM.documentElement, fileName));
}

$(document).ready(function () {

    $("#createLayerButton").click(function () {
        addToPanel(newLayer());
    })

    $("#deleteLayerButton").click(function () {
        deleteLayer();
    })

    $("#createNewFileButton").click(function () {
        deleteAllLayers();
        addToPanel(newLayer(undefined, "фон"));
    })

    $("#mergeWithPrevious").click(function () {
        let targetLayer = currentLayerNote;
        let previousLayer = currentLayerNote.nextElementSibling;
        console.log(targetLayer);
        console.log(previousLayer);
        let layer = newLayer(undefined,targetLayer.layerName);
        layer.layerNode.append(previousLayer.layerNode);
        layer.layerNode.append(targetLayer.layerNode);
        targetLayer.before(layer);
        targetLayer.layerNode.removeAttribute("xmlns:svgjs");
        previousLayer.layerNode.removeAttribute("xmlns:svgjs");
        previousLayer.remove();
        targetLayer.remove();
        selectLayer(layer);
    })

    $("#createNewFileButton").click();

    $('#layer_panel').on("click", ".layer_note", function () {
        selectLayer(this);
    })
    $('#layer_panel').on("dragstart", ".layer_note", function () {
        selectLayer(this);
    })
    $('#layer_panel').on("dragenter", ".top", function () {
        let layerNote = this.parentElement;
        this.querySelector('input').classList.add('unactive');
        layerNote.classList.add('hovered_top');
    })
    $('#layer_panel').on("dragleave", ".top", function () {
        let layerNote = this.parentElement;
        this.querySelector('input').classList.remove('unactive');
        layerNote.classList.remove('hovered_top');
    })
    $('#layer_panel').on("dragenter", ".bottom", function () 
    {
        let layerNote = this.parentElement;
        layerNote.classList.add('hovered_bottom');
    })
    $('#layer_panel').on("dragleave", ".bottom", function () {
        let layerNote = this.parentElement;
        layerNote.classList.remove('hovered_bottom');
    })
    $('#layer_panel').on("dragover", ".top, .bottom", function (e) {
        e.preventDefault();
    })
    $('#layer_panel').on("drop", ".top", function () {
        console.log('dropTop');
        let layerNote = this.parentElement;
        $(this).trigger("dragleave");
        layerNote.layerNode.after(currentLayerNote.layerNode);
        layerNote.before(currentLayerNote);
    })
    $('#layer_panel').on("drop", ".bottom", function () {
        console.log('dropBottom');
        let layerNote = this.parentElement;
        $(this).trigger("dragleave");
        layerNote.layerNode.before(currentLayerNote.layerNode);
        layerNote.after(currentLayerNote);
    })
    $('#layer_panel').on("click", ".layer_note input", function () {
        let clicked = this.parentElement.parentElement.layerNode;
        if (this.checked) {
            clicked.setAttribute('display', '');
            return;
        }
        clicked.setAttribute('display', 'none');
    })
})