/**
 * @author AngelicHedgehog  
 **/

const fillInput = document.getElementById('fillChoice'),
	colorInput = document.getElementById('colorChoice'),
	widthInput = document.getElementById('widthChoice'),
	toolsInput = document.getElementsByName('toolChoice');

const toolMethods = {
	'pencil': {'mousedown': pencilDown, 'mousemove': pencilMove, 'mouseup': pencilUp},
	'line': {'mousedown': lineDown, 'mousemove': lineMove, 'mouseup': lineUp},
	'polygon': {'mousedown': polygonDown, 'mousemove': polygonMove},
	'path': {'mousedown': pathDown, 'mousemove': pathMove},
	'text': {'mousedown': textDown, 'mousemove': textMove, 'mouseup': textUp},
	'ellipse': {'mousedown': ellipseDown, 'mousemove': ellipseMove, 'mouseup': ellipseUp},
	'rect': {'mousedown': rectDown, 'mousemove': rectMove, 'mouseup': rectUp},
	'fill': {'mouseup': fillUp},
	'eraser': {'mousedown': eraserDown, 'mousemove': eraserMove},
	'move': {'mousedown': moveDown, 'mousemove': moveMove, 'mouseup': moveUp},
	'rotate': {'mousedown': rotateDown, 'mousemove': rotateMove, 'mouseup': rotateUp},
	'deform': {'mousedown': deformDown, 'mousemove': deformMove, 'mouseup': deformUp},
	'scalе': {'mousedown': scaleDown, 'mousemove': scaleMove, 'mouseup': scaleUp},
	
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
		if ('select' in object)
			selectionClear();
		else
			object.remove();
		object = null;
	}
}

function stopDrawing() {
	selectionClear();
	historyNew();
	object = null;
}

function historyNew() {
	let new_history = draw_history.h[draw_history.i].filter(obj => {
		return obj.root != draw || draw.has(obj);
	});
	for (const obj of draw.children()) {
		obj.root = draw;
		if (new_history.indexOf(obj) == -1)
			new_history.push(obj);
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
	breakDrawing();
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
	if (event.type == 'mouseup')
		mouseup = true;
	else if (event.type == 'mousedown')
		mouseup = false;

    if (!isDrawAllowed() || event.type == 'mousedown' && !workspace.contains(event.target)) return;

	if ((event.which == 1 || mouseup && event.which == 0) && 
			tool in toolMethods && event.type in toolMethods[tool]) {
		let x = event.clientX - canvasRect.left,
			y = event.clientY - canvasRect.top;
		toolMethods[tool][event.type](x, y);
	}
}

function distanceTo(x1, y1, x2, y2) {
	return ((x1 - x2) ** 2 + (y1 - y2) ** 2) ** .5;
}

// <=><=><=><=><=>	скрипт инструмента карандаш <=><=><=><=><=>
function pencilDown(x, y) {
	object = draw.polyline([[x, y]])
		.fill(fillValue ? colorValue : 'none')
		.stroke({ width: widthValue, color: colorValue });
}

function pencilMove(x, y) {
	if (object != null)
		object.plot(object.array().concat([[x, y]]));
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
	object = draw.line(x, y, x + 1, y + 1)
		.fill(fillValue ? colorValue : 'none')
		.stroke({ width: widthValue, color: colorValue });;
}

function lineMove(x, y) {
	if (object !== null)
		object.plot([object.array()[0], [x, y]]);
}

function lineUp(x, y) {
	stopDrawing();
}

// <=><=><=><=><=>	скрипт инструмента полигон <=><=><=><=><=>
function polygonDown(x, y) {
	if (object == null)
		object = draw.polygon([[x, y], [x, y]])
			.fill(fillValue ? colorValue : 'none')
			.stroke({ width: widthValue, color: colorValue });
	else
		object.plot(object.array().concat([[x, y]]));
}

function polygonMove(x, y) {
	if (object != null)
		if (mouseup) {
			let last_point = object.array().slice(-1)[0];
			if (distanceTo(last_point[0], last_point[1], x, y) > 10)
				stopDrawing();
		} else
			object.plot(object.array().slice(0, -1).concat([[x, y]]));
}

// <=><=><=><=><=>	скрипт инструмента контур <=><=><=><=><=>
function pathDown(x, y) {
	if (object == null) {
		object = draw.path([['M', x, y], ['C', x, y, x, y, x, y]])
			.fill(fillValue ? colorValue : 'none')
			.stroke({ width: widthValue, color: colorValue });;
	} else {
		let first_line = object.array().slice(0, 2),
			last_line = object.array().slice(-2);
		if (distanceTo(first_line[0][1], first_line[0][2], x, y) <= 10) {
			last_line[1][5] = first_line[0][1];
			last_line[1][6] = first_line[0][2];
			last_line[1][3] = first_line[0][1] * 2 - first_line[1][1];
			last_line[1][4] = first_line[0][2] * 2 - first_line[1][2];
			object.plot(object.array().slice(0, -2).concat(last_line, [['z']]));
			stopDrawing();
		} else if (last_line[0][5] == x && last_line[0][6] == y)
			stopDrawing();
		else
			object.plot(object.array().concat([['C', x, y, x, y, x, y]]));
	}
}

function pathMove(x, y) {
	if (object !== null) {
		let last_line = object.array().slice(-1)[0],
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
	rectDown(x, y);
}

function textMove(x, y) {
	rectMove(x, y);
}

function textUp(x, y) {
	if (object != null) {
		if (object.height() != 0 && object.width() != 0) {
			draw.text(prompt('Введите желаемый текст'))
				.font({size: object.height()})
				.fill(fillValue ? colorValue : 'none')
				.stroke({ width: widthValue, color: colorValue })
				.move(object.x(), object.y());
			while (draw.last().bbox().width > object.width())
				draw.last().text(draw.last().text().slice(0, -1));
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

// <=><=><=><=><=>	скрипт инструмента заливка <=><=><=><=><=>
function fillUp(x, y) {
	let obj = findTopOnCoords(x, y);
	if (obj == null) return;
	obj.clone()
		.fill(fillValue ? colorValue : 'none')
		.stroke({ width: widthValue, color: colorValue })
		.insertAfter(obj);
	obj.remove();
	historyNew();
}

function findTopOnCoords(x, y) {
	for (const obj of [...draw.children()].reverse()) {
		let selfCoords = absCoordsToSelf(obj, x, y);
		if (obj.inside(selfCoords.x, selfCoords.y))
			return obj;
	}
}

function selfCoordsToAbs(object, x, y) {
	let tr = object.transform();
	return {
		x: x * tr.a + y * tr.c + tr.e,
		y: x * tr.b + y * tr.d + tr.f
	};
}

function absCoordsToSelf(object, x, y) {
	let tr = object.transform();
	return {
		x: (x * tr.d - y * tr.c - tr.d * tr.e + tr.c * tr.f) / (tr.a * tr.d - tr.b * tr.c),
		y: (x * tr.b - y * tr.a - tr.b * tr.e + tr.a * tr.f) / (tr.b * tr.c - tr.a * tr.d)
	};
}

// <=><=><=><=><=>	скрипт инструмента ластик <=><=><=><=><=>
function eraserDown(x, y) {
	let obj = findTopOnCoords(x, y);
	if (obj == null) return;
	obj.remove();
	historyNew();
}

function eraserMove(x, y) {
	if (!mouseup)
		eraserDown(x, y);
}

// <=><=><=><=><=>	скрипт инструмента перемещение <=><=><=><=><=>
function moveDown(x, y) {
	if (object == null) {
		let obj = findTopOnCoords(x, y);
		if (obj == null) return;
		let selfCoords = absCoordsToSelf(obj, x, y);
		object = obj.clone().insertAfter(obj);
		obj.remove();
		object.x0 = selfCoords.x;
		object.y0 = selfCoords.y;
	}
}

function moveMove(x, y) {
	if (object != null) {
		let selfCoords = absCoordsToSelf(object, x, y);
		object.dx(selfCoords.x - object.x0);
		object.dy(selfCoords.y - object.y0);
		object.x0 = selfCoords.x;
		object.y0 = selfCoords.y;
	}
}

function moveUp(x, y) {
	stopDrawing();
}

// <=><=><=><=><=>	скрипт инструмента вращение <=><=><=><=><=>
function rotateDown(x, y) {
	if (object == null) {
		let obj = findTopOnCoords(x, y);
		if (obj == null) return;
		let absCoords = selfCoordsToAbs(obj, obj.cx(), obj.cy());
		object = obj.clone().insertAfter(obj);
		obj.remove();
		object.angle = Math.acos((x - absCoords.x) / 
					distanceTo(x, y, absCoords.x, absCoords.y)) * 
					180 / Math.PI;
		if (y > absCoords.y)
			object.angle = 360 - object.angle;
	}
}

function rotateMove(x, y) {
	if (object != null) {
		let absCorrds = selfCoordsToAbs(object, object.cx(), object.cy());
		object.rotate(object.angle);
		object.angle = Math.acos((x - absCorrds.x) / 
					distanceTo(x, y, absCorrds.x, absCorrds.y)) * 
					180 / Math.PI;
		if (y > absCorrds.y)
			object.angle = 360 - object.angle;
		object.rotate(-object.angle);
	}
}

function rotateUp(x, y) {
	stopDrawing();
}

// <=><=><=><=><=>	скрипт инструмента деформация <=><=><=><=><=>
function deformSelectionMake(object) {
	selectionClear();
	object.select = { lines: [], points: [] };
	let draw_ellipse = (coords => draw.ellipse(10).move(coords.x - 5, coords.y - 5).fill("#0cf"));
	if (object.array != null)
		if (object.type == 'path') {
			let array = object.array(),
				first = draw.rect(0, 0),
				draw_line = ((...coords) => 
					draw.line(coords).stroke({width: 1, color: "#0ff"}).insertAfter(first));
			object.select.lines.push(first);
			for (let i = 0; i < array.length - 1; i++) {
				object.select.points[i] = [null];
				for (let j = 1; j < array[i].length; j += 2)
					object.select.points[i] = object.select.points[i].concat([
						draw_ellipse(
							selfCoordsToAbs(object, array[i][j], array[i][j + 1])
						),
						null
					]);
				if (i != 0)
					object.select.lines = object.select.lines.concat([
						draw_line(
							object.select.points[i][1].cx(),
							object.select.points[i][1].cy(),
							object.select.points[i - 1].slice(-2)[0].cx(),
							object.select.points[i - 1].slice(-2)[0].cy()
						),
						draw_line(
							object.select.points[i][3].cx(),
							object.select.points[i][3].cy(),
							object.select.points[i][5].cx(),
							object.select.points[i][5].cy()
						)
					]);
			}
		}
		else
			for (const point of object.array())
				object.select.points.push([
					draw_ellipse(
						selfCoordsToAbs(object, ...point)
					)
				]);
}

function selectionClear() {
	for (var object of draw.children()) {
		if ('select' in object) {
			object.select.points.forEach(arr => arr.forEach(pnt => pnt != null ? pnt.remove() : null));
			object.select.lines.forEach(line => line.remove());
			delete object.select;
		}
	}
}

function deformDown(x, y) {
	if (object == null) {
		let obj = findTopOnCoords(x, y);
		if (obj != null && obj.array != null) {
			object = obj;
			deformSelectionMake(obj);
		}
	} else
		for (let i = 0; i < object.select.points.length; i++)
			for (let j = 0; j < object.select.points[i].length; j++)
				if (object.select.points[i][j] != null && object.select.points[i][j].inside(x, y)) {
					let obj = object.clone().insertAfter(object);
					object.remove();
					obj.select = object.select;
					object = obj;
					object.i = i;
					object.j = j;
				}
}

function deformMove(x, y) {
	if (object != null && 'i' in object) {
		let selfCoords = absCoordsToSelf(object, x, y),
			array = object.array();
		array[object.i][object.j] = selfCoords.x;
		array[object.i][object.j + 1] = selfCoords.y;
		object.plot(array);
		deformSelectionMake(object);
	}
}

function deformUp(x, y) {
	if (object != null && 'i' in object) {
		selectionClear();
		historyNew();
		delete object.i,
			object.j;
		deformSelectionMake(object);
	}
}

// <=><=><=><=><=>	скрипт инструмента масштабирование <=><=><=><=><=>
function scaleSelectionMake(object) {
	selectionClear();
	object.select = { lines: [], points: [[]] };
	let box = object.bbox(),
		points = [
			selfCoordsToAbs(object, box.x, box.y),
			selfCoordsToAbs(object, box.x, box.y2),
			selfCoordsToAbs(object, box.x2, box.y2),
			selfCoordsToAbs(object, box.x2, box.y),
		],
		draw_line = ((p1, p2) => object.select.lines.push(
				draw.line(p1.x, p1.y, p2.x, p2.y).stroke({width: 1, color: "#0ff"})
			)),
		draw_ellipse = (coords => object.select.points[0].push(
				draw.ellipse(10).move(coords.x - 5, coords.y - 5).fill("#0cf")
			));
	for (let i = 0; i < 4; i++)
		draw_line(points[i], points[(i + 1) % 4]);
	for (let i = 0; i < 4; i++)
		draw_ellipse(points[i]);
	object.select.points = [[]].concat(object.select.points)
	for (let i = 0; i < 4; i++)
		draw_ellipse({
			x: (points[i].x + points[(i + 1) % 4].x) / 2,
			y: (points[i].y + points[(i + 1) % 4].y) / 2
		});
}

function scaleDown(x, y) {
	if (object == null) {
		let obj = findTopOnCoords(x, y);
		if (obj == null) return;
		object = obj;
		scaleSelectionMake(object);
	} else {
		for (let i = 0; i < 2; i++)
			for (let j = 0; j < 4; j++)
				if (object.select.points[i][j].inside(x, y)) {
					let obj = object.clone().insertAfter(object);
					object.remove();
					obj.select = object.select;
					object = obj;
					object.i = i;
					object.j = j;
				}
	}
}

function scaleMove(x, y) {
	if (object != null && 'i' in object) {
		let moving = object.select.points[object.i][object.j],
			staying = object.select.points[object.i][(object.j + 2) % 4],
			mv_pnt = { x: moving.cx(), y: moving.cy() },
			st_pnt = { x: staying.cx(), y: staying.cy() },
			st_pnt_self = absCoordsToSelf(object, st_pnt.x, st_pnt.y);
			x_a = mv_pnt.x - st_pnt.x, y_a = mv_pnt.y - st_pnt.y,
			x_b = x - st_pnt.x, y_b = y - st_pnt.y;
			k = y_a == 0 ? 
				x_b / x_a - (y_a * x_b / x_a - y_b) * y_a / (x_a ** 2 + y_a ** 2) :
				k = y_b / y_a - (x_a * y_b / y_a - x_b) * x_a / (x_a ** 2 + y_a ** 2);
		object.scale(k, st_pnt_self.x, st_pnt_self.y);
		scaleSelectionMake(object);
	}
}

function scaleUp(x, y) {
	if (object != null && 'i' in object) {
		selectionClear();
		historyNew();
		delete object.i,
			object.j;
		scaleSelectionMake(object);
	}
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

$(document).bind('keydown', function(event) {
    if (event.key === 'Escape')
		breakDrawing();
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