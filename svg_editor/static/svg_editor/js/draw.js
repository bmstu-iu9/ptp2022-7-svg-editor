/**
 * @author AngelicHedgehog  
 **/

const fillInput = document.getElementById('fillChoice');
const colorInput = document.getElementById('colorChoice');
const widthInput = document.getElementById('widthChoice');
const toolsInput = document.getElementsByName('toolChoice');

const toolMethods = {
	'pencil': {'down': pencilDown, 'move': pencilMove, 'up': pencilUp},
	'line': {'down': lineDown, 'move': lineMove, 'up': lineUp},
	'polygon': {'down': polygonDown, 'move': polygonMove, 'up': polygonUp},
	'path': {'down': pathDown, 'move': pathMove, 'up': pathUp},
	'text': {'down': textDown, 'move': textMove, 'up': textUp},
};

let	draw,
	canvasRect,
	object = null,
	tool,
	mouseup = true;

///////////выполняется при переключении на новый слой/////////////
function layerUpdate(newDraw) {
	draw = newDraw; 
	breakDrawing();
}
//////////////////////////////////////////

function breakDrawing() {
	if (object != null) {
		object.remove();
		object = null;
	}
}

function resizeWindowEvent() {
	canvasRect = workspace.getBoundingClientRect();
}

function changeToolEvent() {
	breakDrawing();
	for (const el of toolsInput.values()) {
		if (el.checked) {
			tool = el.value;
			break;
		}
	}
	fillValue = fillInput.checked;
	colorValue = colorInput.value;
	widthValue = Math.max(1, widthInput.value);
}

function logMouseEvent(event) {
	if (event.type == 'mouseup') {
		mouseup = true;
	} else if (event.type == 'mousedown') {
		mouseup = false;
	}

    	if (!isDrawAllowed()) return;

	if ((event.which == 1 || mouseup && event.which == 0) &&
		tool in toolMethods && event.type.slice(5) in toolMethods[tool]) {
		x = event.x - canvasRect.x;
		y = event.y - canvasRect.y;
		if (event.type == 'mousedown') {
			if (0 <= x && x <= canvasRect.width &&
				0 <= y && y <= canvasRect.height) {
					toolMethods[tool][event.type.slice(5)](x, y);
				}
		} else {
			toolMethods[tool][event.type.slice(5)](x, y);
		}
	}
}

function stopDrawing() {
	// здесь будет сохранение ссылки на нарисованный объект для последующего обращения к ней
	object = null;
}

function distanceTo(x1, y1, x2, y2) {
	return ((x1 - x2) ** 2 + (y1 - y2) ** 2) ** .5;
}

// <=><=><=><=><=>	скрипт инструмента карандаш <=><=><=><=><=>
function pencilDown(x, y) {
	object = draw.polyline([[x, y]]);
	if (fillValue) {
		object.fill(colorValue);
	} else {
		object.fill('none').stroke({width: widthValue, color: colorValue});
	}
}

function pencilMove(x, y) {
	if (object !== null) {
		object.plot(object.array().concat([[x, y]]));
	}
}

function pencilUp(x, y) {
	stopDrawing();
}

// <=><=><=><=><=>	скрипт инструмента линия <=><=><=><=><=>
function lineDown(x, y) {
	object = draw.line(x, y, x, y).stroke({width: widthValue, color: colorValue});
}

function lineMove(x, y) {
	if (object !== null) {
		object.plot([object.array()[0], [x, y]]);
	}
}

function lineUp(x, y) {
	stopDrawing();
}

// <=><=><=><=><=>	скрипт инструмента полигон <=><=><=><=><=>
function polygonDown(x, y) {
	if (object === null) {
		object = draw.polygon([[x, y], [x, y]]);
		if (fillValue) {
			object.fill(colorValue);
		} else {
			object.fill('none').stroke({ width: widthValue, color: colorValue});
		}
	} else {
		object.plot(object.array().concat([[x, y]]));
	}
}

function polygonMove(x, y) {
	if (object !== null) {
		if (mouseup) {
			last_point = object.array().slice(-1)[0];
			if (distanceTo(last_point[0], last_point[1], x, y) > 10) {
				stopDrawing();
			}
		} else {
			object.plot(object.array().slice(0, -1).concat([[x, y]]));
		}
	}
}

function polygonUp(x, y) {
	null;
}

// <=><=><=><=><=>	скрипт инструмента контур <=><=><=><=><=>
function pathDown(x, y) {
	if (object === null) {
		object = draw.path([['M', x, y], ['C', x, y, x, y, x, y]]);
		if (fillValue) {
			object.fill(colorValue);
		} else {
			object.fill('none').stroke({ width: widthValue, color: colorValue});
		}
	} else {
		first_line = object.array().slice(0, 2);
		last_line = object.array().slice(-2);
		if (distanceTo(first_line[0][1], first_line[0][2], x, y) <= 10) {
			last_line[1][5] = first_line[0][1];
			last_line[1][6] = first_line[0][2];
			last_line[1][3] = first_line[0][1] * 2 - first_line[1][1];
			last_line[1][4] = first_line[0][2] * 2 - first_line[1][2];
			object.plot(object.array().slice(0, -2).concat(last_line, [['z']]));
			stopDrawing();
		} else if (last_line[0][5] == x && last_line[0][6] == y) {
			stopDrawing();
		} else {
			object.plot(object.array().concat([['C', x, y, x, y, x, y]]));
		}
	}
}

function pathMove(x, y) {
	if (object !== null) {
		last_line = object.array().slice(-1)[0];
		prelast_line = object.array().slice(-2)[0];
		if (mouseup) {
			last_line[3] = x;
			last_line[4] = y;
			last_line[5] = x;
			last_line[6] = y;
		} else {
			last_line[1] = x;
			last_line[2] = y;
			if (object.array().length !== 2) {
				prelast_line[3] = prelast_line[5] * 2 - x;
				prelast_line[4] = prelast_line[6] * 2 - y;
			}
		}
		object.plot(object.array().slice(0, -2).concat([prelast_line, last_line]));
	}
}

function pathUp(x, y) {
	null;
}

// <=><=><=><=><=>	скрипт инструмента текст <=><=><=><=><=>

function textDown(x, y) {
	path = [['M', x, y], ['L', x, y], ['L', x, y], ['L', x, y], ['z']]
	object = draw.path(path).fill('none').stroke({ width: widthValue, color: colorValue});
}

function textMove(x, y) {
	if (object !== null) {
		array_points = object.array();
		array_points[1][1] = x;
		array_points[2] = ['L', x, y];
		array_points[3][2] = y;
		object.plot(array_points);
	}
}

function textUp(x, y) {
	if (object !== null) {
		array_points = object.array();
		x1 = array_points[0][1];
		y1 = array_points[0][2];
		x2 = array_points[2][1];
		y2 = array_points[2][2];
		if (x1 > x2) {
			x = x1;
			x1 = x2;
			x2 = x;
		}
		if (x1 != x2 && y1 != y2) {
			object.remove();
			object = draw.text(prompt('Введите желаемый текст'));
			object.path([['M', x1, (y1 + y2) / 2], ['L', x2, (y1 + y2) / 2]]);
			object.font({size: Math.abs(y2 - y1), fill: colorValue});
			stopDrawing();
		} else {
			breakDrawing();
		}
	}
}

$(document).ready(function () {
	changeToolEvent();
	resizeWindowEvent();
	$('#clearWorkspaceButton').click(function () {
		draw.clear();
		object = null;	
	})
})