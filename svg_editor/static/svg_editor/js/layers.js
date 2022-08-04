/**
 * @author wizardOfOz21
 **/

'use strict'

const opacitySlider = document.querySelector('#opacity_slider');
const layerControlPanel = document.querySelector('#layers-panel-choosing');

let currentLayerNote,
    i;

function getNode() {
    return this.layer.node;
}

function getName() {
    return this.children[0].lastChild.innerText;
}

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

function createLayer(baseElement, layerName) {
    let newLayer = (baseElement === undefined) ? SVG() : SVG(baseElement);
    console.log(newLayer);
    newLayer.addTo(workspace).size(workspace.clientWidth, workspace.clientHeight);  

    console.log(layerName);
    if (layerName === undefined) {
        layerName = prompt('Enter layer name', 'Layer ' + i++);
    }

    let newNote = newLayerNote(newLayer, layerName);
    newNote.getNode = function() {
        return this.layer.node;
    };
    newNote.getName = function() {
        return this.children[0].lastChild.innerText;
    };
    layerControlPanel.prepend(newNote);

    newNote.getNode().classList.add('layer');
    selectLayer(newNote);
}

function selectLayer(layerNote) {
    if (currentLayerNote !== null) {
        currentLayerNote.setAttribute('checked', '');
    }
    layerNote.setAttribute('checked', 'true');

    currentLayerNote = layerNote;

    let opacity = layerNote.getNode().getAttribute('opacity');
    opacitySlider.value = opacity == null ? 1 : opacity;
    layerUpdate(layerNote.layer);
}

function deleteLayer() {
    if (currentLayerNote === null) return;
    currentLayerNote.getNode().remove();
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
    currentLayerNote.getNode().setAttribute('opacity', opacitySlider.value);
}

function isDrawAllowed() {
    return !(currentLayerNote === null || currentLayerNote.getNode().getAttribute('display') == 'none');
}

function getPictureAsSvg() {
    let svgString = `<svg xmlns="http://www.w3.org/2000/svg" ` +
                         `xmlns:xlink="http://www.w3.org/1999/xlink" ` + 
                         `version="1.1" ` +
                         `width="${workspace.clientHeight}" ` + 
                         `height="${workspace.clientWidth}">\n`;

    for (let layer of workspace.childNodes) {
        svgString += `\t<svg height="${layer.getAttribute('height')}" ` +
                                `width="${layer.getAttribute('width')}"` +
                                `${getOpacity(layer)}` +
                                `${getViewBox(layer)}>\n`;
            for (let elem of layer.children) {
                svgString += `\t\t${elem.outerHTML}\n`;
            }
            svgString += '\t</svg>\n';   
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

    for (let layer of workspace.childNodes) {
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
    console.log(projectData);
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

function openAsSvg(svgString) {
    let oParser = new DOMParser();
    let oDOM = oParser.parseFromString(svgString,"application/xml");
    deleteAllLayers();
    console.log(oDOM.documentElement);
    createLayer(oDOM.documentElement);
}

function openAsProject(yml) {
    deleteAllLayers();
    console.log(yml);
    let svgLayer;
    const taskStack = [];
    let i = 0;
    for (let layer of yml.layers) {
        svgLayer = document.createElement("svg");
        svgLayer.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svgLayer.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
        svgLayer.setAttribute('version','1.1');
        taskStack.push({node: svgLayer, obj: layer});

        while (taskStack.length > 0) {
            const task = taskStack.pop();
            for (let attr of task.obj.attributes) {
                let attrName = Object.keys(attr)[0];
                task.node.setAttribute(attrName, attr[attrName]);
            }
            for (let child of task.obj.outers) {
                if (typeof(child) != 'object') {
                    task.node.textContent = child;
                    continue;
                }
                console.log(typeof(child));
                let childName = Object.keys(child)[0];
                let childNode = document.createElement(childName);
                task.node.append(childNode);
                taskStack.push({node: childNode, obj: child[childName]});
            }
        }
        // console.log(svgLayer);
        // createLayer(svgLayer,'Layer ' + i++);

        let oParser = new DOMParser();
        let oDOM = oParser.parseFromString(svgLayer.outerHTML,"application/xml");
        svgLayer = oDOM.documentElement;
        createLayer(svgLayer,'Layer ' + i++);
        console.log(svgLayer);

        // Парсинг происходит по сути дважды, иначе добавленные слои почему-то не отображаются на странице
    }
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

    $("#opacity_slider").on("change", changeOpacity);

    $("#createNewFileButton").click();

    $('#layers-panel-choosing').on("click", ".layer_note", function () {
        selectLayer(this);
        console.log(currentLayerNote);
    })
    $('#layers-panel-choosing').on("dragstart", ".layer-note", function () {
        selectLayer(this);
    })
    $('#layers-panel-choosing').on("dragenter", ".top", function () {
        let layerNote = this.parentElement;
        this.querySelector('input').classList.add('unactive');
        layerNote.classList.add('hovered_top');
    })
    $('#layers-panel-choosing').on("dragleave", ".top", function () {
        let layerNote = this.parentElement;
        this.querySelector('input').classList.remove('unactive');
        layerNote.classList.remove('hovered_top');
    })
    $('#layers-panel-choosing').on("dragenter", ".bottom", function () 
    {
        let layerNote = this.parentElement;
        layerNote.classList.add('hovered_bottom');
    })
    $('#layers-panel-choosing').on("dragleave", ".bottom", function () {
        let layerNote = this.parentElement;
        layerNote.classList.remove('hovered_bottom');
    })
    $('#layers-panel-choosing').on("dragover", ".top, .bottom", function (e) {
        e.preventDefault();
    })
    $('#layers-panel-choosing').on("drop", ".top", function () {
        console.log('dropTop');
        let layerNote = this.parentElement;
        $(this).trigger("dragleave");
        layerNote.getNode().after(currentLayerNote.getNode());
        layerNote.before(currentLayerNote);
    })
    $('#layers-panel-choosing').on("drop", ".bottom", function () {
        console.log('dropBottom');
        let layerNote = this.parentElement;
        $(this).trigger("dragleave");
        layerNote.getNode().before(currentLayerNote.getNode());
        layerNote.after(currentLayerNote);
    })
    $('#layers-panel-choosing').on("click", ".layer_note input", function () {
        let clicked = this.parentElement.parentElement.getNode();
        if (this.checked) {
            clicked.setAttribute('display', '');
            return;
        }
        clicked.setAttribute('display', 'none');
    })
})