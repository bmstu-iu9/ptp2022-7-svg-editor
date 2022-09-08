/**
 * @author AngelicHedgehog
 **/

const toolMethods = {
    pencil: { mousedown: pencilDown, mousemove: pencilMove, mouseup: pencilUp },
    line: { mousedown: lineDown, mousemove: lineMove, mouseup: lineUp },
    polygon: { mousedown: polygonDown, mousemove: polygonMove },
    path: { mousedown: pathDown, mousemove: pathMove },
    text: { mousedown: textDown, mousemove: textMove, mouseup: textUp },
    ellipse: {
        mousedown: ellipseDown,
        mousemove: ellipseMove,
        mouseup: ellipseUp,
    },
    rect: { mousedown: rectDown, mousemove: rectMove, mouseup: rectUp },
    fill: { mouseup: fillUp },
    eraser: { mousedown: eraserDown, mousemove: eraserMove },
    move: { mousedown: moveDown, mousemove: moveMove, mouseup: moveUp },
    rotate: { mousedown: rotateDown, mousemove: rotateMove, mouseup: rotateUp },
    deform: { mousedown: deformDown, mousemove: deformMove, mouseup: deformUp },
    scalе: { mousedown: scaleDown, mousemove: scaleMove, mouseup: scaleUp },
    split: { mousedown: splitDown },
    skew: { mousedown: skewDown, mousemove: skewMove, mouseup: skewUp },
    mirror: { mousedown: mirrorDown, mousemove: mirrorMove, mouseup: mirrorUp },
    compress: {
        mousedown: compressDown,
        mousemove: compressMove,
        mouseup: compressUp,
    },
    cursor: { mousedown: cursorDown, mousemove: cursorMove, mouseup: cursorUp },
    star: { mousedown: starDown, mousemove: starMove, mouseup: starUp },
};

let draw,
    canvasRect,
    object = null,
    tool,
    mouseup = true,
    draw_history = { h: [[]], i: 0 };

///////////выполняется при переключении на новый слой/////////////
function layerUpdate(newDraw) {
    if (newDraw == null) return;
    draw = newDraw;
    resizeWindowEvent();
    historyNew();
    breakDrawing();
}
//////////////////////////////////////////

function breakDrawing() {
    if (draw == undefined) return; //заглушка
    if ("select" in draw) {
        if (!mouseup) toolMethods[tool]["mouseup"]();
        selectionClear();
    } else if (object != null) object.remove();
    if (object != null) object = null;
}

function stopDrawing() {
    selectionClear();
    historyNew();
    commonSelectionMake();
    object = null;
}

// <=><=><=><=><=> скрипт функционала истории рисования <=><=><=><=><=>
function historyNew() {
    let new_history = draw_history.h[draw_history.i].filter((obj) => {
        return obj.draw != draw || draw.has(obj);
    });
    for (const obj of draw.children()) {
        obj.draw = draw;
        if (new_history.indexOf(obj) == -1) new_history.push(obj);
    }
    if (
        new_history.length !== draw_history.h[draw_history.i].length ||
        new_history.slice(-1)[0] !== draw_history.h[draw_history.i].slice(-1)[0]
    ) {
        draw_history.h[++draw_history.i] = new_history;
        if (draw_history.h.length != draw_history.i - 1)
            draw_history.h = draw_history.h.slice(0, draw_history.i + 1);
    }
}

function historyСorrection() {
    for (i = draw_history.h.length - 1; i >= 0; i--) {
        draw_history.h[i] = draw_history.h[i].filter((obj) => {
            return $("#workspace")[0].contains(obj.draw.node);
        });
        if (
            i + 1 != draw_history.h.length &&
            draw_history.h[i].length == draw_history.h[i + 1].length &&
            draw_history.h[i].slice(-1)[0] == draw_history.h[i + 1].slice(-1)[0]
        ) {
            draw_history.h.splice(i, 1);
            if (draw_history.i > i) draw_history.i--;
        }
    }
}

function historyBack() {
    breakDrawing();
    if (draw_history.i != 0) historyUpdate(draw_history.i--);
}

function historyUndo() {
    breakDrawing();
    if (draw_history.i + 1 != draw_history.h.length)
        historyUpdate(draw_history.i++);
}

function historyUpdate(last_index) {
    draw_history.h[last_index].forEach((obj) => obj.remove());
    draw_history.h[draw_history.i].forEach((obj) => obj.draw.add(obj));
}

// <=><=><=><=><=> скрипты событий <=><=><=><=><=>
function resizeWindowEvent() {
    canvasRect = $(easel.currentPage.pie.layersPanel)[0].getBoundingClientRect();
    easel.currentPage.pie.resizeLayers();
}

function changeToolEvent() {
    breakDrawing();
    tool = $(".tool-button.tool-clicked").attr("name");
    width_value = $('input[name="stroke-width"]').val();
    color_fill = $("#fillbox").is(":checked") ? "none" : $("#color-main").val();
    color_stroke = $("#color-sub").val();
}

function logMouseEvent(event) {
    if (event.type == "mouseup") mouseup = true;
    else if (event.type == "mousedown") mouseup = false;

    if (
        easel.currentPage == undefined || !easel.currentPage.pie.isDrawAllowed() || //заглушка
        (tool != "cursor" &&
            event.type == "mousedown" &&
            !$("#workspace")[0].contains(event.target))
    )
        return;

    if (
        (event.which == 1 || (mouseup && event.which == 0)) &&
        tool in toolMethods &&
        event.type in toolMethods[tool]
    ) {
        if (
            event.type == "mousedown" &&
            "select" in draw &&
            draw.select.points.length == 0
        )
            selectionClear();
        let x = event.clientX - canvasRect.left,
            y = event.clientY - canvasRect.top;
        toolMethods[tool][event.type](x, y);
    }
}

// <=><=><=><=><=> скрипт инструмента карандаш <=><=><=><=><=>
function commonSelectionMake() {
    if (object != null) {
        if ("select" in draw)
            if (draw.select.points.length == 0) selectionClear();
            else return;
        draw.select = { lines: [], points: [] };
        let box = object.bbox(),
            points = [
                selfCoordsToAbs(object, box.x, box.y),
                selfCoordsToAbs(object, box.x, box.y2),
                selfCoordsToAbs(object, box.x2, box.y2),
                selfCoordsToAbs(object, box.x2, box.y),
            ],
            draw_line = (p1, p2) =>
                draw.select.lines.push(
                    draw
                        .line(p1.x, p1.y, p2.x, p2.y)
                        .stroke({ width: 1, color: "#0ff" })
                );
        for (let i = 0; i < 4; i++) draw_line(points[i], points[(i + 1) % 4]);
    }
}

function selectionClear() {
    if ("select" in draw) {
        draw.select.points.forEach((arr) =>
            arr.forEach((pnt) => (pnt != null ? pnt.remove() : null))
        );
        draw.select.lines.forEach((line) => line.remove());
        delete draw.select;
    }
}

function pencilDown(x, y) {
    object = draw
        .polyline([[x, y]])
        .fill(color_fill)
        .stroke({ width: width_value, color: color_stroke });
}

function pencilMove(x, y) {
    if (object != null) object.plot(object.array().concat([[x, y]]));
}

function pencilUp(x, y) {
    if (object != null) {
        if (object.plot().length === 1) breakDrawing();
        else stopDrawing();
    }
}

// <=><=><=><=><=> скрипт инструмента линия <=><=><=><=><=>
function lineDown(x, y) {
    object = draw
        .line(x, y, x + 1, y + 1)
        .fill(color_fill)
        .stroke({ width: width_value, color: color_stroke });
}

function lineMove(x, y) {
    if (object !== null) object.plot([object.array()[0], [x, y]]);
}

function lineUp(x, y) {
    stopDrawing();
}

// <=><=><=><=><=> скрипт инструмента полигон <=><=><=><=><=>
function distanceTo(x1, y1, x2, y2) {
    return ((x1 - x2) ** 2 + (y1 - y2) ** 2) ** 0.5;
}

function polygonDown(x, y) {
    if (object == null)
        object = draw
            .polygon([
                [x, y],
                [x, y],
            ])
            .fill(color_fill)
            .stroke({ width: width_value, color: color_stroke });
    else object.plot(object.array().concat([[x, y]]));
}

function polygonMove(x, y) {
    if (object != null)
        if (mouseup) {
            let last_point = object.array().slice(-1)[0];
            if (distanceTo(last_point[0], last_point[1], x, y) > 10)
                stopDrawing();
        } else
            object.plot(
                object
                    .array()
                    .slice(0, -1)
                    .concat([[x, y]])
            );
}

// <=><=><=><=><=> скрипт инструмента контур <=><=><=><=><=>
function pathDown(x, y) {
    if (object == null) {
        object = draw
            .path([
                ["M", x, y],
                ["C", x, y, x, y, x, y],
            ])
            .fill(color_fill)
            .stroke({ width: width_value, color: color_stroke });
    } else {
        let first_line = object.array().slice(0, 2),
            last_line = object.array().slice(-2);
        if (distanceTo(first_line[0][1], first_line[0][2], x, y) <= 10) {
            last_line[1][5] = first_line[0][1];
            last_line[1][6] = first_line[0][2];
            last_line[1][3] = first_line[0][1] * 2 - first_line[1][1];
            last_line[1][4] = first_line[0][2] * 2 - first_line[1][2];
            object.plot(
                object
                    .array()
                    .slice(0, -2)
                    .concat(last_line, [["z"]])
            );
            stopDrawing();
        } else if (last_line[0][5] == x && last_line[0][6] == y) {
            object.plot(object.array().slice(0, -1));
            stopDrawing();
        } else object.plot(object.array().concat([["C", x, y, x, y, x, y]]));
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
        object.plot(
            object.array().slice(0, -2).concat([prelast_line, last_line])
        );
    }
}

// <=><=><=><=><=> скрипт инструмента текст <=><=><=><=><=>
function getText(message, _default) {
    $("label[for='text-tool-input']").html(message);
    $("#text-tool-input").val('');
    $("#text-input-menu").css({
        display: "block",
        "z-index": "100",
    });
    return new Promise((resolve, reject) => {
        $("#confirm-text-input").click(function () {
            const inputVal = $("#text-tool-input").val();
            resolve(inputVal || _default);
        });
    });
}

function textDown(x, y) {
    rectDown(x, y);
}

function textMove(x, y) {
    rectMove(x, y);
}

async function textUp(x, y) {
    if (object != null && $("#text-input-menu").css("display") == "none") {
        let rect = object;
        rect.remove();
        if (rect.height() != 0 && rect.width() != 0) {
            object = draw
                .text(await getText("Input text:", ""))
                .font({ size: rect.height() })
                .fill(color_fill)
                .stroke({ width: width_value, color: color_stroke })
                .move(rect.x(), rect.y());
            while (object.bbox().width > rect.width())
                object.text(object.text().slice(0, -1));
            if (object.text() == "") breakDrawing();
            else stopDrawing();
        }
    }
}

// <=><=><=><=><=> скрипт инструмента эллипс <=><=><=><=><=>
function ellipseDown(x, y) {
    if (object == null) {
        object = draw
            .ellipse(0, 0)
            .move(x, y)
            .fill(color_fill)
            .stroke({ width: width_value, color: color_stroke });
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

// <=><=><=><=><=> скрипт инструмента прямоугольник <=><=><=><=><=>
function rectDown(x, y) {
    if (object == null) {
        object = draw
            .rect(0, 0)
            .move(x, y)
            .fill(color_fill)
            .stroke({ width: width_value, color: color_stroke });
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

// <=><=><=><=><=> скрипт инструмента заливка <=><=><=><=><=>
function findTopOnCoords(x, y) {
    for (const obj of [...draw.children()].reverse()) {
        let selfCoords = absCoordsToSelf(obj, x, y);
        if (obj.inside(selfCoords.x, selfCoords.y)) return obj;
    }
}

function selfCoordsToAbs(object, x, y) {
    let tr = object.transform();
    return {
        x: x * tr.a + y * tr.c + tr.e,
        y: x * tr.b + y * tr.d + tr.f,
    };
}

function absCoordsToSelf(object, x, y) {
    let tr = object.transform();
    return {
        x:
            (x * tr.d - y * tr.c - tr.d * tr.e + tr.c * tr.f) /
            (tr.a * tr.d - tr.b * tr.c),
        y:
            (x * tr.b - y * tr.a - tr.b * tr.e + tr.a * tr.f) /
            (tr.b * tr.c - tr.a * tr.d),
    };
}

function fillUp(x, y) {
    let obj = findTopOnCoords(x, y);
    if (obj == null) return;
    obj.clone()
        .fill(color_fill)
        .stroke({ width: width_value, color: color_stroke })
        .insertAfter(obj);
    obj.remove();
    historyNew();
}

// <=><=><=><=><=> скрипт инструмента ластик <=><=><=><=><=>
function eraserDown(x, y) {
    let obj = findTopOnCoords(x, y);
    if (obj == null) return;
    obj.remove();
    historyNew();
}

function eraserMove(x, y) {
    if (!mouseup) eraserDown(x, y);
}

// <=><=><=><=><=> скрипт инструмента перемещение <=><=><=><=><=>
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

// <=><=><=><=><=> скрипт инструмента вращение <=><=><=><=><=>
function angleFromTo(center, point) {
    let angle =
        (Math.acos(
            (point.x - center.x) /
            distanceTo(point.x, point.y, center.x, center.y)
        ) *
            180) /
        Math.PI;
    if (point.y > center.y) angle = 360 - angle;
    return angle;
}

function rotateDown(x, y) {
    if (object == null) {
        let obj = findTopOnCoords(x, y);
        if (obj == null) return;
        object = obj.clone().insertAfter(obj);
        obj.remove();
        object.angle = angleFromTo(
            selfCoordsToAbs(object, object.cx(), object.cy()),
            { x: x, y: y }
        );
    }
}

function rotateMove(x, y) {
    if (object != null) {
        object.rotate(object.angle);
        object.angle = angleFromTo(
            selfCoordsToAbs(object, object.cx(), object.cy()),
            { x: x, y: y }
        );
        object.rotate(-object.angle);
    }
}

function rotateUp(x, y) {
    stopDrawing();
}

// <=><=><=><=><=> скрипт инструмента деформация <=><=><=><=><=>
function deformSelectionMake(object) {
    selectionClear();
    draw.select = { lines: [], points: [] };
    let draw_ellipse = (coords) =>
        draw
            .ellipse(10)
            .move(coords.x - 5, coords.y - 5)
            .fill("#0cf");
    if (object.array != null)
        if (object.type == "path") {
            let array = object.array(),
                first = draw.rect(0, 0),
                draw_line = (...coords) =>
                    draw
                        .line(coords)
                        .stroke({ width: 1, color: "#0ff" })
                        .insertAfter(first);
            draw.select.lines.push(first);
            for (let i = 0; i < array.length; i++) {
                if (array[i][0] == "z") break;
                draw.select.points[i] = [null];
                for (let j = 1; j < array[i].length; j += 2)
                    draw.select.points[i] = draw.select.points[i].concat([
                        draw_ellipse(
                            selfCoordsToAbs(
                                object,
                                array[i][j],
                                array[i][j + 1]
                            )
                        ),
                        null,
                    ]);
                if (i != 0)
                    draw.select.lines = draw.select.lines.concat([
                        draw_line(
                            draw.select.points[i][1].cx(),
                            draw.select.points[i][1].cy(),
                            draw.select.points[i - 1].slice(-2)[0].cx(),
                            draw.select.points[i - 1].slice(-2)[0].cy()
                        ),
                        draw_line(
                            draw.select.points[i][3].cx(),
                            draw.select.points[i][3].cy(),
                            draw.select.points[i][5].cx(),
                            draw.select.points[i][5].cy()
                        ),
                    ]);
            }
        } else
            for (const point of object.array())
                draw.select.points.push([
                    draw_ellipse(selfCoordsToAbs(object, ...point)),
                ]);
}

function deformDown(x, y) {
    if (object == null) {
        let obj = findTopOnCoords(x, y);
        if (obj != null && obj.array != null) {
            object = obj;
            deformSelectionMake(obj);
        }
    } else {
        for (let i = 0; i < draw.select.points.length; i++)
            for (let j = 0; j < draw.select.points[i].length; j++)
                if (
                    draw.select.points[i][j] != null &&
                    draw.select.points[i][j].inside(x, y)
                ) {
                    let obj = object.clone().insertAfter(object);
                    object.remove();
                    object = Object.assign(obj, { i: i, j: j });
                    return;
                }
        breakDrawing();
        deformDown(x, y);
    }
}

function deformMove(x, y) {
    if (object != null && "i" in object) {
        let selfCoords = absCoordsToSelf(object, x, y),
            array = object.array();
        array[object.i][object.j] = selfCoords.x;
        array[object.i][object.j + 1] = selfCoords.y;
        object.plot(array);
        deformSelectionMake(object);
    }
}

function deformUp(x, y) {
    if (object != null && "i" in object) {
        selectionClear();
        historyNew();
        delete object.i, object.j;
        deformSelectionMake(object);
    }
}

// <=><=><=><=><=> скрипт инструмента масштабирование <=><=><=><=><=>
function scaleSelectionMake(object) {
    selectionClear();
    draw.select = { lines: [], points: [[]] };
    let box = object.bbox(),
        points = [
            selfCoordsToAbs(object, box.x, box.y),
            selfCoordsToAbs(object, box.x, box.y2),
            selfCoordsToAbs(object, box.x2, box.y2),
            selfCoordsToAbs(object, box.x2, box.y),
        ],
        draw_line = (p1, p2) =>
            draw.select.lines.push(
                draw
                    .line(p1.x, p1.y, p2.x, p2.y)
                    .stroke({ width: 1, color: "#0ff" })
            ),
        draw_ellipse = (coords) =>
            draw.select.points[0].push(
                draw
                    .ellipse(10)
                    .move(coords.x - 5, coords.y - 5)
                    .fill("#0cf")
            );
    for (let i = 0; i < 4; i++) draw_line(points[i], points[(i + 1) % 4]);
    for (let i = 0; i < 4; i++) draw_ellipse(points[i]);
    draw.select.points = [[]].concat(draw.select.points);
    for (let i = 0; i < 4; i++)
        draw_ellipse({
            x: (points[i].x + points[(i + 1) % 4].x) / 2,
            y: (points[i].y + points[(i + 1) % 4].y) / 2,
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
                if (draw.select.points[i][j].inside(x, y)) {
                    let obj = object.clone().insertAfter(object);
                    object.remove();
                    object = Object.assign(obj, { i: i, j: j });
                    return;
                }
        breakDrawing();
        scaleDown(x, y);
    }
}

function scaleMove(x, y) {
    if (object != null && "i" in object) {
        let moving = draw.select.points[object.i][object.j],
            staying = draw.select.points[object.i][(object.j + 2) % 4],
            mv_pnt = { x: moving.cx(), y: moving.cy() },
            st_pnt = { x: staying.cx(), y: staying.cy() },
            st_pnt_self = absCoordsToSelf(object, st_pnt.x, st_pnt.y),
            x_a = mv_pnt.x - st_pnt.x,
            y_a = mv_pnt.y - st_pnt.y,
            x_b = x - st_pnt.x,
            y_b = y - st_pnt.y,
            k =
                y_a == 0
                    ? x_b / x_a -
                    (((y_a * x_b) / x_a - y_b) * y_a) / (x_a ** 2 + y_a ** 2)
                    : y_b / y_a -
                    (((x_a * y_b) / y_a - x_b) * x_a) / (x_a ** 2 + y_a ** 2);
        if (k) object.scale(k, st_pnt_self.x, st_pnt_self.y);
        scaleSelectionMake(object);
    }
}

function scaleUp(x, y) {
    if (object != null && "i" in object) {
        selectionClear();
        historyNew();
        delete object.i, object.j;
        scaleSelectionMake(object);
    }
}

// <=><=><=><=><=> скрипт инструмента разбиение <=><=><=><=><=>
function splitDown(x, y) {
    let obj = findTopOnCoords(x, y);
    if (obj == null || obj.type.indexOf("poly") == 0) return;
    obj = obj.toPath().toPoly(width_value + "px");
    historyNew();
}

// <=><=><=><=><=> скрипт инструмента скос <=><=><=><=><=>
function skewDown(x, y) {
    if (object == null) {
        let obj = findTopOnCoords(x, y);
        if (obj == null) return;
        object = obj;
        scaleSelectionMake(object);
    } else {
        for (i = 0; i < 2; i++)
            for (let j = 0; j < 4; j++)
                if (draw.select.points[i][j].inside(x, y)) {
                    let obj = object.clone().insertAfter(object);
                    object.remove();
                    object = Object.assign(obj, { i: i, j: j, angle: 0 });
                    return;
                }
        breakDrawing();
        skewDown(x, y);
    }
}

function skewMove(x, y) {
    if (object != null && "i" in object) {
        let moving = draw.select.points[object.i][object.j],
            staying = draw.select.points[object.i][(object.j + 2) % 4],
            st_pnt = absCoordsToSelf(object, staying.cx(), staying.cy()),
            mv_pnt = absCoordsToSelf(object, moving.cx(), moving.cy()),
            coords = absCoordsToSelf(object, x, y),
            Matrix = new SVG.Matrix(object.transform()),
            matrix;
        if (object.i == 0) {
            if (object.j % 2 == 0) {
                if (Math.abs(coords.x - st_pnt.x) < 5) return;
            } else if (Math.abs(coords.y - st_pnt.y) < 5) return;
            switch (object.j) {
                case 0:
                    matrix = new SVG.Matrix(
                        (coords.x - st_pnt.x) / (mv_pnt.x - st_pnt.x),
                        (st_pnt.y - coords.y) / st_pnt.x,
                        0,
                        1,
                        st_pnt.x -
                        (st_pnt.x * (coords.x - st_pnt.x)) /
                        (mv_pnt.x - st_pnt.x),
                        coords.y - st_pnt.y
                    );
                    break;
                case 1:
                    matrix = new SVG.Matrix(
                        1,
                        0,
                        (coords.x - st_pnt.x) / st_pnt.y,
                        (coords.y - st_pnt.y) / (mv_pnt.y - st_pnt.y),
                        st_pnt.x - coords.x,
                        st_pnt.y -
                        (st_pnt.y * (coords.y - st_pnt.y)) /
                        (mv_pnt.y - st_pnt.y)
                    );
                    break;
                case 2:
                    matrix = new SVG.Matrix(
                        (coords.x - st_pnt.x) / (mv_pnt.x - st_pnt.x),
                        (coords.y - st_pnt.y) / st_pnt.x,
                        0,
                        1,
                        st_pnt.x -
                        (st_pnt.x * (coords.x - st_pnt.x)) /
                        (mv_pnt.x - st_pnt.x),
                        st_pnt.y - coords.y
                    );
                    break;
                case 3:
                    matrix = new SVG.Matrix(
                        1,
                        0,
                        (st_pnt.x - coords.x) / st_pnt.y,
                        (coords.y - st_pnt.y) / (mv_pnt.y - st_pnt.y),
                        coords.x - st_pnt.x,
                        st_pnt.y -
                        (st_pnt.y * (coords.y - st_pnt.y)) /
                        (mv_pnt.y - st_pnt.y)
                    );
                    break;
            }
        } else {
            if (
                Math.abs(coords.y - st_pnt.y) < 10 ||
                Math.abs(coords.x - st_pnt.x) < 10
            )
                return;
            switch (object.j) {
                case 0:
                    matrix = new SVG.Matrix(
                        1,
                        (mv_pnt.y - coords.y) / st_pnt.x,
                        (mv_pnt.x - coords.x) / st_pnt.y,
                        1,
                        coords.x - mv_pnt.x,
                        coords.y - mv_pnt.y
                    );
                    break;
                case 1:
                    matrix = new SVG.Matrix(
                        1,
                        (mv_pnt.y - coords.y) / st_pnt.x,
                        (coords.x - mv_pnt.x) / st_pnt.y,
                        1,
                        mv_pnt.x - coords.x,
                        coords.y - mv_pnt.y
                    );
                    break;
                case 2:
                    matrix = new SVG.Matrix(
                        1,
                        (coords.y - mv_pnt.y) / st_pnt.x,
                        (coords.x - mv_pnt.x) / st_pnt.y,
                        1,
                        mv_pnt.x - coords.x,
                        mv_pnt.y - coords.y
                    );
                    break;
                case 3:
                    matrix = new SVG.Matrix(
                        1,
                        (coords.y - mv_pnt.y) / st_pnt.x,
                        (mv_pnt.x - coords.x) / st_pnt.y,
                        1,
                        coords.x - mv_pnt.x,
                        mv_pnt.y - coords.y
                    );
                    break;
            }
        }
        object.transform(Matrix.multiply(matrix));
        scaleSelectionMake(object);
    }
}

function skewUp(x, y) {
    scaleUp(x, y);
}

// <=><=><=><=><=> скрипт инструмента отражение <=><=><=><=><=>
function mirrorDown(x, y) {
    if ("select" in draw) {
        if (draw.select.points[0][0].inside(x, y)) {
            draw.select.lines[0].plot(draw.select.lines[0].plot().reverse());
            draw.select.points[0] = draw.select.points[0].reverse();
            object = true;
        } else if (draw.select.points[0][1].inside(x, y)) object = true;
        else {
            let select = draw.select;
            selectionClear();
            let obj = findTopOnCoords(x, y);
            if (obj != null) {
                object = obj.clone().insertAfter(obj);
                obj.remove();
                let point1 = absCoordsToSelf(
                    object,
                    select.points[0][0].cx(),
                    select.points[0][0].cy()
                ),
                    point2 = absCoordsToSelf(
                        object,
                        select.points[0][1].cx(),
                        select.points[0][1].cy()
                    ),
                    n = { x: point1.y - point2.y, y: point2.x - point1.x },
                    i_ = {
                        x: (n.y ** 2 - n.x ** 2) / (n.x ** 2 + n.y ** 2),
                        y: (-2 * n.x * n.y) / (n.x ** 2 + n.y ** 2),
                    },
                    j_ = {
                        x: (-2 * n.x * n.y) / (n.x ** 2 + n.y ** 2),
                        y: (n.x ** 2 - n.y ** 2) / (n.x ** 2 + n.y ** 2),
                    },
                    O_ = {
                        x: point1.x - i_.x * point1.x - j_.x * point1.y,
                        y: point1.y - i_.y * point1.x - j_.y * point1.y,
                    },
                    Matrix = new SVG.Matrix(object.transform()),
                    matrix = new SVG.Matrix(i_.x, i_.y, j_.x, j_.y, O_.x, O_.y);
                object.transform(Matrix.multiply(matrix));
                stopDrawing();
                selectionClear();
            }
            draw.add(select.lines[0]);
            draw.add(select.points[0][0]);
            draw.add(select.points[0][1]);
            draw.select = select;
        }
    } else {
        draw.select = {
            lines: [draw.line(x, y, x, y).stroke({ width: 1, color: "#0ff" })],
            points: [
                [
                    draw
                        .ellipse(10)
                        .move(x - 5, y - 5)
                        .fill("#0cf"),
                    draw
                        .ellipse(10)
                        .move(x - 5, y - 5)
                        .fill("#0cf"),
                ],
            ],
        };
        object = true;
    }
}

function mirrorMove(x, y) {
    if (object != null) {
        draw.select.lines[0].plot([draw.select.lines[0].plot()[0], [x, y]]);
        draw.select.points[0][1].move(x - 5, y - 5);
    }
}

function mirrorUp(x, y) {
    if (object != null) {
        if (
            distanceTo(
                ...draw.select.lines[0].plot()[0],
                ...draw.select.lines[0].plot()[1]
            ) == 0
        )
            selectionClear();
        object = null;
    }
}

// <=><=><=><=><=> скрипт инструмента растяжение/сжатие <=><=><=><=><=>
function compressDown(x, y) {
    scaleDown(x, y);
}

function compressMove(x, y) {
    if (object != null && "i" in object) {
        let moving = draw.select.points[object.i][object.j],
            staying = draw.select.points[object.i][(object.j + 2) % 4],
            mv_pnt = absCoordsToSelf(object, moving.cx(), moving.cy()),
            st_pnt = absCoordsToSelf(object, staying.cx(), staying.cy()),
            coords = absCoordsToSelf(object, x, y),
            Matrix = new SVG.Matrix(object.transform()),
            matrix = new SVG.Matrix(
                (coords.x - st_pnt.x) / (mv_pnt.x - st_pnt.x),
                0,
                0,
                (coords.y - st_pnt.y) / (mv_pnt.y - st_pnt.y),
                st_pnt.x -
                (st_pnt.x * (coords.x - st_pnt.x)) / (mv_pnt.x - st_pnt.x),
                st_pnt.y -
                (st_pnt.y * (coords.y - st_pnt.y)) / (mv_pnt.y - st_pnt.y)
            );
        if (Math.abs(mv_pnt.x - st_pnt.x) < 1) {
            matrix.a = 1;
            matrix.e = 0;
        }
        if (Math.abs(mv_pnt.y - st_pnt.y) < 1) {
            matrix.d = 1;
            matrix.f = 0;
        }
        object.transform(Matrix.multiply(matrix));
        scaleSelectionMake(object);
    }
}

function compressUp(x, y) {
    scaleUp(x, y);
}

// <=><=><=><=><=> скрипт инструмента курсор <=><=><=><=><=>
function canvasUpsize(x, y) {
    let width = $("#workspace").css("width").slice(0, -2) * 1 + x,
        height = $("#workspace").css("height").slice(0, -2) * 1 + y;
    if (width <= 0) {
        draw.X *= -1;
        return;
    }
    if (height <= 0) {
        draw.Y *= -1;
        return;
    }
    $("#workspace").css({ width: width, height: height });
    $(".layer").attr({ width: width, height: height });
}

function canvasMove(x, y) {
    let left = $("#workspace").css("margin-left").slice(0, -2) * 1 + x,
        top = $("#workspace").css("margin-top").slice(0, -2) * 1 + y;
    $("#workspace").css({ "margin-left": left, "margin-top": top });
    resizeWindowEvent();
}

function cursorDown(x, y) {
    if (Math.abs(canvasRect.width - x) < 30) draw.X = 1;
    else if (Math.abs(x) < 30) draw.X = -1;
    else if (0 <= x && x <= canvasRect.width) draw.X = 0;
    if (Math.abs(canvasRect.height - y) < 30) draw.Y = 1;
    else if (Math.abs(y) < 30) draw.Y = -1;
    else if (0 <= y && y <= canvasRect.height) draw.Y = 0;
    draw.xy = { x: x, y: y };
}

function cursorMove(x, y) {
    if ("X" in draw && "Y" in draw) {
        if (draw.X == 0 && draw.Y == 0)
            canvasMove(x - draw.xy.x, y - draw.xy.y);
        else {
            if (draw.X == -1) {
                canvasUpsize(draw.xy.x - x, 0);
                canvasMove(x - draw.xy.x, 0);
                for (const hist of draw_history.h)
                    for (const obj of hist)
                        if (!("used" in obj)) {
                            let selfCoords = absCoordsToSelf(obj, draw.xy.x, 0),
                                selfCoords_ = absCoordsToSelf(obj, x, 0);
                            obj.dx(selfCoords.x - selfCoords_.x);
                            obj.dy(selfCoords.y - selfCoords_.y);
                            obj.used = null;
                        }
                for (const hist of draw_history.h)
                    for (const obj of hist) delete obj.used;
            } else if (draw.X == 1) {
                canvasUpsize(x - draw.xy.x, 0);
                draw.xy.x = x;
            }
            if (draw.Y == -1) {
                canvasUpsize(0, draw.xy.y - y);
                canvasMove(0, y - draw.xy.y);
                for (const hist of draw_history.h)
                    for (const obj of hist)
                        if (!("used" in obj)) {
                            let selfCoords = absCoordsToSelf(obj, 0, draw.xy.y),
                                selfCoords_ = absCoordsToSelf(obj, 0, y);
                            obj.dx(selfCoords.x - selfCoords_.x);
                            obj.dy(selfCoords.y - selfCoords_.y);
                            obj.used = null;
                        }
                for (const hist of draw_history.h)
                    for (const obj of hist) delete obj.used;
            } else if (draw.Y == 1) {
                canvasUpsize(0, y - draw.xy.y);
                draw.xy.y = y;
            }
        }
    }
}

function cursorUp(x, y) {
    delete draw.X, draw.Y, draw.xy;
}

// <=><=><=><=><=> скрипт инструмента звезда <=><=><=><=><=>
function starDown(x, y) {
    if (object == null) {
        object = draw
            .polygon(new Array(5).fill([0, 0]))
            .move(x, y)
            .fill(color_fill)
            .stroke({ width: width_value, color: color_stroke });
        object.x0 = x;
        object.y0 = y;
    }
}

function starMove(x, y) {
    if (object != null) {
        if (object.x0 == x || object.y0 == y) return;
        let w = x - object.x0,
            h = y - object.y0,
            R_y = h / (1 - Math.sin(1.3 * Math.PI)),
            r_y = (R_y * Math.cos(Math.PI * 0.4)) / Math.cos(Math.PI * 0.2),
            R_x = (R_y * w) / h,
            r_x = (r_y * w) / h,
            k1 = Math.cos((Math.PI * Math.sqrt(2)) / 10),
            k2 = Math.cos(Math.PI / 10),
            plot = [];
        for (let i = 0; i < 10; i++)
            if (i % 2 == 0)
                plot.push([
                    object.x0 +
                    R_x * k1 +
                    R_x * Math.cos(Math.PI * (i * 0.2 + 0.1)) * k2,
                    object.y0 + R_y - R_y * Math.sin(Math.PI * (i * 0.2 + 0.1)),
                ]);
            else
                plot.push([
                    object.x0 +
                    R_x * k1 +
                    r_x * Math.cos(Math.PI * (i * 0.2 + 0.1)) * k2,
                    object.y0 + R_y - r_y * Math.sin(Math.PI * (i * 0.2 + 0.1)),
                ]);
        object.plot(plot);
        commonSelectionMake();
    }
}

function starUp(x, y) {
    stopDrawing();
}

// <=><=><=><=><=> скрипт перехвата событий документа и окна <=><=><=><=><=>
$(document)
    /* подготовка параметров после прогрузки страницы
    и подключение отслеживания измженения параметров иструментов*/
    .ready(function () {
        changeToolEvent();

        $("#control-panel").change(changeToolEvent);
        $("#tools-panel").change(changeToolEvent);
    });

// перехват событий окна, влияющих на рисование
$(window)
    .mousedown(logMouseEvent)
    .mousemove(logMouseEvent)
    .mouseup(logMouseEvent)
    .resize(resizeWindowEvent);
