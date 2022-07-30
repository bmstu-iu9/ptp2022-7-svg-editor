/**
 * @module Layers 
 *
 * @author wizardOfOz21
 * 
 * */

'use strict'

const opacitySlider = document.querySelector('#opacity_slider');
const layerControlPanel = document.querySelector('#layer_panel');

let currentLayer,
    i;

/**
 * Создаёт и возвращает новый слой
 * (на самом деле в роли слоя выступает div-запись о нём в layerControlPanel,
 * которая содержит ссылку на слой как на html-узел (.layerNode) 
 * и как на элемент библиотеки svgjs (.svg))
 * @param {Element} baseElement - html-узел, который будет преобразован в слой
 * @param {string} layerName - имя создаваемого слоя
 * @returns новый слой
 */
function newLayer(baseElement, layerName) {
    let newSVG = (baseElement === undefined) ? SVG() : SVG(baseElement);

    let newLayer = newLayerNote(layerName);
    newLayer.svg = newSVG;
    newLayer.layerNode = newNote.svg.node;
    newLayer.layerName = layerName;
    newLayer.layerNode.classList.add('layer');
    return newLayer;

    function newLayerNote(layerName) {
        let note = document.createElement('div');
        note.insertAdjacentHTML('beforeend', `
        <div class="top" style="width: 100%; height: 10px;">
        <input type="checkbox" checked/>
        <label>${layerName}</label>
        </div>
        <div class="bottom" style="width: 100%; height: 10px;"></div>
        `);
        note.classList.add('layer_note');
        note.setAttribute('draggable', 'true');
    
        note.svg = relatedLayerSVG;
        return note;
    };
}

/**
 * Добавляет переданный слой в редактор
 * (по умолчанию над остальными)
 * @param {} layer - вставляемый слой
 * @param {string} place - если 'end', слой вставляется под остальные
 */
function addToPanel(layer, place) {
    layer.layerNode.setAttribute("width", workspace.clientWidth);
    layer.layerNode.setAttribute("height", workspace.clientHeight);
    if (place == 'end') {
        workspace.prepend(layer.layerNode);
        layerControlPanel.append(layer);
    } else {
        workspace.append(layer.layerNode);
        layerControlPanel.prepend(layer);
    }
    selectLayer(layer);
}

/**
 * Выбирает переданный слой как текущий активный
 * @param {} layer - выбираемый слой
 */
function selectLayer(layer) {
    if (currentLayer !== null) {
        currentLayer.setAttribute('checked', '');
    }
    layer.setAttribute('checked', 'true');

    currentLayer = layer;

    let opacity = layer.layerNode.getAttribute('opacity');
    opacitySlider.value = opacity == null ? 1 : opacity;
    layerUpdate(layer.svg);
}

function deleteLayer() {
    if (currentLayer === null) return;
    currentLayer.layerNode.remove();
    currentLayer.remove();
    currentLayer = null;
    i--;
}

function deleteAllLayers() {
    workspace.innerHTML = "";
    layerControlPanel.innerHTML = "";

    currentLayer = null;
    i = 0;
}

function changeOpacity() {
    currentLayer.layerNode.setAttribute('opacity', opacitySlider.value);
}

function isDrawAllowed() {
    return !(currentLayer === null || currentLayer.layerNode.getAttribute('display') == 'none');
}

function getPicture(format) {
    let svgString = `<svg xmlns="http://www.w3.org/2000/svg" ` +
        `xmlns:xlink="http://www.w3.org/1999/xlink" ` +
        `version="1.1" ` +
        `width="${workspace.clientHeight}" ` +
        `height="${workspace.clientWidth}">\n`;

    if (format == "svg") {
        for (let layer of layerControlPanel.childNodes) {
            if (layer.layerNode.getAttribute('display') == 'none') continue;
            svgString += `\t<svg height="${layer.layerNode.getAttribute('height')}" ` +
                `width="${layer.layerNode.getAttribute('width')}"` +
                `${getOpacity(layer.layerNode)}` +
                `${getViewBox(layer.layerNode)}>\n`;
            for (let elem of layer.layerNode.children) {
                svgString += `\t\t${elem.outerHTML}\n`;
            }
            svgString += '\t</svg>\n';
        }
    } else {
        for (let layer of layerControlPanel.childNodes) {
            console.log(layer.layerNode);
            svgString += `\t<svg height="${layer.layerNode.getAttribute('height')}" ` +
                `width="${layer.layerNode.getAttribute('width')}"` +
                `${getOpacity(layer.layerNode)}` +
                `${getViewBox(layer.layerNode)}` +
                `${getDisplay(layer.layerNode)}` +
                ` name="${(layer.layerName)}">\n`;
            for (let elem of layer.layerNode.children) {
                svgString += `\t\t${elem.outerHTML}\n`;
            }
            svgString += '\t</svg>\n';
        }
    }
    svgString += '</svg>\n';
    console.log(svgString);
    return svgString;
}

function getOpacity(svg) {
    let opacity = svg.getAttribute('opacity');
    return opacity === null || opacity == 1 ? '' : ` opacity="${opacity}"`;
}

function getViewBox(svg) {
    let viewBox = svg.getAttribute('viewBox');
    return viewBox === null ? '' : ` viewBox="${viewBox}"`;
}

function getDisplay(svg) {
    let display = svg.getAttribute('display');
    return display === null ? '' : ` display="${display}"`;
}

function openAsSvg(svgString, fileName) {
    let oParser = new DOMParser();
    let oDOM = oParser.parseFromString(svgString, "application/xml");
    addToPanel(newLayer(oDOM.documentElement, fileName));
}

function addAfter(layer1, layer2) {
    layer2.layerNode.after(layer1.layerNode);
    layer2.before(layer1);
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
        svgLayer.setAttribute('version', '1.1');
        taskStack.push({ node: svgLayer, obj: layer });

        while (taskStack.length > 0) {
            const task = taskStack.pop();
            // console.log(task.obj, task.node);
            for (let attr of task.obj.attributes) {
                let attrName = Object.keys(attr)[0];
                task.node.setAttribute(attrName, attr[attrName]);
            }
            for (let child of task.obj.outers) {
                if (typeof (child) != 'object') {
                    task.node.textContent = child;
                    continue;
                }

                let childNode;

                if (Object.keys(child).length != 1) {
                    childNode = document.createElement('svg');
                    task.node.append(childNode);
                    taskStack.push({ node: childNode, obj: child });
                } else {
                    // console.log(typeof(child));
                    let childName = Object.keys(child)[0];
                    childNode = document.createElement(childName);
                    task.node.append(childNode);
                    taskStack.push({ node: childNode, obj: child[childName] });
                }

            }
        }
        // console.log(svgLayer);
        // createLayer(svgLayer,'Layer ' + i++);

        let oParser = new DOMParser();
        let oDOM = oParser.parseFromString(svgLayer.outerHTML, "application/xml");
        svgLayer = oDOM.documentElement;
        let newL = newLayer(svgLayer, svgLayer.getAttribute("name"));
        svgLayer.removeAttribute("name");
        addToPanel(newL, "end");
        checkDisplay(newL);
        console.log(svgLayer);
        // Парсинг происходит по сути дважды, иначе добавленные слои почему-то не отображаются на странице
    }

    function checkDisplay(layer) {
        let display = layer.layerNode.getAttribute('display');
        console.log(display);
        if (display == 'none') {
            layer.children[0].children[0].checked = false;
        }
    }
}

$(document).ready(function () {

    $("#createLayerButton").click(function () {
        let layerName = prompt('Enter layer name', 'Layer ' + i);
        if (layerName == null) {
            return;
        }
        i++;
        addToPanel(newLayer(undefined, layerName));
    })

    $("#deleteLayerButton").click(function () {
        deleteLayer();
    })

    $("#createNewFileButton").click(function () {
        deleteAllLayers();
        addToPanel(newLayer(undefined, "фон"));
    })

    $("#mergeWithPrevious").click(function () {
        let targetLayer = currentLayer;
        let previousLayer = currentLayer.nextElementSibling;
        if (targetLayer == null || previousLayer == null) return;
        console.log(targetLayer);
        console.log(previousLayer);
        let union = newLayer(undefined, targetLayer.layerName);
        addAfter(union, targetLayer);
        union.layerNode.append(previousLayer.layerNode);
        union.layerNode.append(targetLayer.layerNode);
        targetLayer.layerNode.removeAttribute("xmlns:svgjs");
        targetLayer.layerNode.removeAttribute("xmlns:xlink");
        targetLayer.layerNode.removeAttribute("xmlns");
        targetLayer.layerNode.removeAttribute("version");
        targetLayer.layerNode.removeAttribute("class");
        previousLayer.layerNode.removeAttribute("xmlns:svgjs");
        previousLayer.layerNode.removeAttribute("xmlns:xlink");
        previousLayer.layerNode.removeAttribute("xmlns");
        previousLayer.layerNode.removeAttribute("version");
        previousLayer.layerNode.removeAttribute("class");
        previousLayer.remove();
        targetLayer.remove();
        selectLayer(union);
    })

    $("#mergeVisible").click(function () {
        let visibleLayers = [];
        for (let layer of layerControlPanel.childNodes) {
            if (layer.layerNode.getAttribute('display') == 'none') continue;
            layer.layerNode.removeAttribute("xmlns:xlink");
            layer.layerNode.removeAttribute("xmlns:svgjs");
            layer.layerNode.removeAttribute("xmlns");
            layer.layerNode.removeAttribute("version");
            layer.layerNode.removeAttribute("class");
            layer.layerNode.removeAttribute("display");
            visibleLayers.push(layer);
        }
        if (visibleLayers.length < 2) return;
        let lastVisible = visibleLayers[visibleLayers.length - 1];
        let union = newLayer(undefined, lastVisible.layerName);
        addAfter(union, lastVisible);

        for (let layer of visibleLayers) {
            union.layerNode.prepend(layer.layerNode);
            layer.remove();
        }
    })

    $('#layerUp').click(function () {
        let nextLayer = currentLayer.previousElementSibling;
        if (currentLayer == null || nextLayer == null) return;
        addAfter(currentLayer, nextLayer);
    })

    $('#layerDown').click(function () {
        let previousLayer = currentLayer.nextElementSibling;
        if (currentLayer == null || previousLayer == null) return;
        addAfter(previousLayer, currentLayer);
    })

    $('#copyLayer').click(function () {
        if (currentLayer == null) return;
        let copyNode = currentLayer.layerNode.cloneNode(true);
        let copyLayer = newLayer(copyNode, currentLayer.layerName);
        addAfter(copyLayer, currentLayer);
        selectLayer(copyLayer);
    })

    $('#createFromVisible').click(function () {
        let visibleNodes = [];
        for (let layer of layerControlPanel.childNodes) {
            if (layer.layerNode.getAttribute('display') == 'none') continue;
            let copy = layer.layerNode.cloneNode(true);
            copy.removeAttribute("xmlns:xlink");
            copy.removeAttribute("xmlns:svgjs");
            copy.removeAttribute("xmlns");
            copy.removeAttribute("version");
            copy.removeAttribute("class");
            copy.removeAttribute("display");
            visibleNodes.push(copy);
        }
        if (visibleNodes.length < 1) return;
        let union = newLayer(undefined, "Visible");

        for (let layer of visibleNodes) {
            union.layerNode.prepend(layer);
        }
        addToPanel(union);
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
    $('#layer_panel').on("dragenter", ".bottom", function () {
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
        layerNote.layerNode.after(currentLayer.layerNode);
        layerNote.before(currentLayer);
    })
    $('#layer_panel').on("drop", ".bottom", function () {
        console.log('dropBottom');
        let layerNote = this.parentElement;
        $(this).trigger("dragleave");
        layerNote.layerNode.before(currentLayer.layerNode);
        layerNote.after(currentLayer);
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