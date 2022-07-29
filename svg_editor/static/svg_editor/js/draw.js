/**
 * @author AngelicHedgehog  
 **/

const fillInput = document.getElementById('fillChoice');
const colorInput = document.getElementById('colorChoice');
const widthInput = document.getElementById('widthChoice');
const toolsInput = document.getElementsByName('toolChoice');

const toolMethods = {
	'pencil': {'mousedown': pencilDown, 'mousemove': pencilMove, 'mouseup': pencilUp},
	'line': {'mousedown': lineDown, 'mousemove': lineMove, 'mouseup': lineUp},
	'polygon': {'mousedown': polygonDown, 'mousemove': polygonMove},
	'path': {'mousedown': pathDown, 'mousemove': pathMove},
	'text': {'mousedown': textDown, 'mousemove': textMove, 'mouseup': textUp},
	'ellipse': {'mousedown': ellipseDown, 'mousemove': ellipseMove, 'mouseup': ellipseUp},
	'rect': {'mousedown': rectDown, 'mousemove': rectMove, 'mouseup': rectUp},
};

let	draw,
	canvasRect,
	object = null,
	tool,
	mouseup = true,
	draw_history = {h: [[]], i: 0};

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
		historyNew();
	}
}

function stopDrawing() {
	historyNew();
	object = null;
}

function historyNew() {
	new_history = draw_history.h[draw_history.i].filter(obj => {
		return obj.root != draw || draw.has(obj);
	});
	for (const obj of draw.children()) {
		obj.root = draw;
		if (new_history.indexOf(obj) == -1) {
			new_history.push(obj);
		}
	}
	if (new_history.length !== draw_history.h[draw_history.i].length || 
		new_history.slice(-1)[0] !== draw_history.h[draw_history.i].slice(-1)[0]) {
		draw_history.h[++draw_history.i] = new_history;
		if (draw_history.h.length != draw_history.i - 1)
			draw_history.h = draw_history.h.slice(0, draw_history.i + 1)
	}
}

function historyOld(old_layer) {
	for (i = draw_history.h.length - 1; i >= 0; i--) {
		draw_history.h[i] = draw_history.h[i].filter(obj => {
			return old_layer != obj.root.node;
		});
		if (i + 1 != draw_history.h.length && draw_history.h[i].length == draw_history.h[i + 1].length && 
			draw_history.h[i].slice(-1)[0] == draw_history.h[i + 1].slice(-1)[0]) {
			draw_history.h.splice(i, 1);
			if (draw_history.i > i)
				draw_history.i--;
		}
	}
}

function historyBack() {
	if (draw_history.i != 0)
		historyUpdate(draw_history.i--);
}

function historyUndo() {
	if (draw_history.i + 1 != draw_history.h.length)
		historyUpdate(draw_history.i++);
}

function historyUpdate(last_index) {
	draw_history.h[last_index].forEach(obj => obj.remove());
	draw_history.h[draw_history.i].forEach(obj => obj.root.add(obj));
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

    if (!isDrawAllowed() || event.type == 'mousedown' && !workspace.contains(event.target)) return;

	if ((event.which == 1 || mouseup && event.which == 0) &&
		tool in toolMethods && event.type in toolMethods[tool]) {
		x = event.clientX - canvasRect.left;
		y = event.clientY - canvasRect.top;
		toolMethods[tool][event.type](x, y);
	}
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
	if (object != null) {
		object.plot(object.array().concat([[x, y]]));
	}
}

function pencilUp(x, y) {
	if (object != null) {
		if (object.plot().length === 1)
			breakDrawing();
		else
			stopDrawing();
	}
}

// <=><=><=><=><=>	скрипт инструмента линия <=><=><=><=><=>
function lineDown(x, y) {
	object = draw.line(x, y, x + 1, y + 1).stroke({width: widthValue, color: colorValue});
}

function lineMove(x, y) {
	if (object !== null) {
		object.plot([object.array()[0], [x, y]]);
	}
}

function lineUp(x, y) {
	if (object != null)
		stopDrawing();
}

// <=><=><=><=><=>	скрипт инструмента полигон <=><=><=><=><=>
function polygonDown(x, y) {
	if (object == null) {
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
	if (object != null) {
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

// <=><=><=><=><=>	скрипт инструмента контур <=><=><=><=><=>
function pathDown(x, y) {
	if (object == null) {
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

// <=><=><=><=><=>	скрипт инструмента текст <=><=><=><=><=>
function textDown(x, y) {
	if (object == null) {
		object = draw.rect(0, 0)
			.move(x, y)
			.fill('none')
			.stroke({ width: widthValue, color: colorValue });
		object.x0 = x;
		object.y0 = y;
	}
}

function textMove(x, y) {
	rectMove(x, y);
}

function textUp(x, y) {
	if (object != null) {
		if (object.height() != 0 && object.width() != 0) {
			draw.text(prompt('Введите желаемый текст'))
				.font({size: object.height(), fill: colorValue})
				.x(object.x())
				.y(object.y());
		}
		breakDrawing();
	}
}

// <=><=><=><=><=>	скрипт инструмента эллипс <=><=><=><=><=>
function ellipseDown(x, y) {
	if (object == null) {
		object = draw.ellipse(0, 0)
			.move(x, y)
			.fill(fillValue ? colorValue : 'none')
			.stroke({ width: widthValue, color: colorValue });
		object.x0 = x;
		object.y0 = y;
	}
}

function ellipseMove(x, y) {
	rectMove(x, y);
}

function ellipseUp(x, y) {
	stopDrawing();
}

// <=><=><=><=><=>	скрипт инструмента прямоугольник <=><=><=><=><=>
function rectDown(x, y) {
	if (object == null) {
		object = draw.rect(0, 0)
			.move(x, y)
			.fill(fillValue ? colorValue : 'none')
			.stroke({ width: widthValue, color: colorValue });
		object.x0 = x;
		object.y0 = y;
	}
}

function rectMove(x, y) {
	if (object != null) {
		if (x > object.x0) {
			object.x(object.x0);
			object.width(x - object.x0);
		} else {
			object.width(object.width() + object.x() - x);
			object.x(x);
		}
		if (y > object.y0) {
			object.y(object.y0);
			object.height(y - object.y0);
		} else {
			object.height(object.height() + object.y() - y);
			object.y(y);
		}
	}
}

function rectUp(x, y) {
	stopDrawing();
}


$(document).ready(function () {
	changeToolEvent();
	resizeWindowEvent();
	$('#clearWorkspaceButton').click(function () {
		draw.clear();
		object = null;
		draw_history.i = 0;
	})
});

$(document).bind('keypress', function(event) {
    if (event.which === 26 && event.ctrlKey) {
		if (event.shiftKey) {
			historyUndo();
		} else {
			historyBack();
		}
    }
});

$(document).bind("DOMNodeRemoved", function(e) {
	if (e.target.nodeName == 'svg')
		historyOld(e.target);
});

$(window)
	.mousedown(logMouseEvent)
	.mouseup(logMouseEvent)
	.mousemove(logMouseEvent)
	.on('resize', resizeWindowEvent)
	.on('scroll', resizeWindowEvent);