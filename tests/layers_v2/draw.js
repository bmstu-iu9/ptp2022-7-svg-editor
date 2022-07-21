/**
 * @author AngelicHedgehog  
 * */

const drawMethods = {
    'pancil': { 'up': pancilUp, 'move': pancilMove, 'down': pancilDown },
    'line': { 'up': lineUp, 'move': lineMove, 'down': lineDown },
    'polygon': { 'up': polygonUp, 'move': polygonMove, 'down': polygonDown },
    'fill': { 'up': 'fillUp', 'move': 'fillMove', 'down': 'fillDown' },
}

function logMouse(type, event) {

    ///////////////
    if (currentLayer === null || currentLayer.getAttribute('display') === 'none') {
        return;
    }
    ///////////////

    if (document.getElementById('panсilTool').checked) {
        tool = 'pancil'
    } else if (document.getElementById('lineTool').checked) {
        tool = 'line'
    } else if (document.getElementById('polygonTool').checked) {
        tool = 'polygon'
    } else if (document.getElementById('fillTool').checked) {
        tool = 'fill'
    }
    fill = document.getElementById('fillButton').checked
    color = document.getElementById('color').value
    width = document.getElementById('width').value
    drawMethods[tool][type](event.x - canvasRect.left, event.y - canvasRect.top)
}

function pancilDown(x, y) {
    if (fill) {
        object = draw.polyline([[x, y], [x + 1, y + 1]]).fill(color)
    } else {
        object = draw.polyline([[x, y], [x + 1, y + 1]]).fill('none').stroke({ width: width, color: color })
    }
}

function pancilMove(x, y) {
    if (object != null) {
        object.plot(object.array().concat([[x, y]]))
    }
}

function pancilUp(x, y) {
    object = null
}

function lineDown(x, y) {
    object = draw.line(x, y, x, y).stroke({ width: width, color: color })
}

function lineMove(x, y) {
    if (object != null) {
        object.plot([object.array()[0], [x, y]])
    }
}

function lineUp(x, y) {
    object = null
}

function polygonDown(x, y) {
    if (object == null) {
        if (fill) {
            object = draw.polygon([[x, y], [x, y]]).fill(color)
        } else {
            object = draw.polygon([[x, y], [x, y]]).fill('none').stroke({ width: width, color: color })
        }
    } else {
        object.plot(object.array().concat([[x, y]]))
    }
}

function polygonMove(x, y) {
    if (object != null) {
        object.plot(object.array().slice(0, -1).concat([[x, y]]))
    }
}

function polygonUp(x, y) {
    if (object != null && object.array().length > 2) {
        firstX = object.array()[0][0]
        firstY = object.array()[0][1]
        if ((firstX - x) ** 2 + (firstY - y) ** 2 <= 10 ** 2) {
            object.plot(object.array().slice(0, -2))
            object = null
        }
    }
}

$(document).ready(function () {
    $('#clearButton').click(function () {
        draw.clear()
        object = null
    })
})

////////////////////////////////////////////////////////////


function drawBush() {
    if (currentLayer === null || currentLayer.getAttribute('display') === 'none') {
        return;
    }
    currentLayer.insertAdjacentHTML('beforeend','<image x=0 y=0 height="400" width="400" xlink:href="./pics/bush.svg" pointer-events="none" />')
}

function drawTower() {
    if (currentLayer === null || currentLayer.getAttribute('display') === 'none') {
        return;
    }
    currentLayer.insertAdjacentHTML('beforeend','<image x="50%" y="25%" xlink:href="./pics/tower.svg" pointer-events="none" />')
}

function drawShrine() {
    if (currentLayer === null || currentLayer.getAttribute('display') === 'none') {
        return;
    }
    currentLayer.insertAdjacentHTML('beforeend','<image x="60%" y="20%" xlink:href="./pics/shrine.svg" pointer-events="none" />')
}