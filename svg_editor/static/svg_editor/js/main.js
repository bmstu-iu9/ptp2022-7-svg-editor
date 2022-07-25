$(document).ready(function () {
    const canvasRect = $("#workspace")[0].getBoundingClientRect();
    const draw = SVG()
        .addTo("#workspace")
        .size(canvasRect.width, canvasRect.height);

    const drawMethods = {
        pencil: { up: pencilUp, move: pencilMove, down: pencilDown },
        line: { up: lineUp, move: lineMove, down: lineDown },
        polygon: { up: polygonUp, move: polygonMove, down: polygonDown },
        fill: { up: "fillUp", move: "fillMove", down: "fillDown" },
    };
    const disableselect = (e) => {
        return false;
    };
    var object = null;

    // Очистка формы в менюшках (по сути все приводится к стандарту
    // сразу во всех меню, хотя в этом нет необходимости - баг или фича?)
    function clearInputForm() {
        $("input[type='text']").val("untitled");
        $("input[type='number']").val("0");
    }

    function logMouse(type, event) {
        selectDisable();
        if ($("#pencilTool").data("clicked")) {
            tool = "pencil";
        } else if ($("#lineTool").data("clicked")) {
            tool = "line";
        } else if ($("#polygonTool").data("clicked")) {
            tool = "polygon";
        } else if ($("fillTool").data("clicked")) {
            tool = "fill";
        } else {
            console.log("No tool selected");
            return;
        }
        fill = !$("#fillbox").is(":checked");
        color = $("#color-main").val();
        fillColor = $("#color-sub").val();
        width = $("input[name='stroke-width']").val();
        drawMethods[tool][type](
            event.pageX - canvasRect.left,
            event.pageY - canvasRect.top
        );
    }

    function pencilDown(x, y) {
        if (!fill) {
            fillColor = "none";
        }
        object = draw
            .polyline([
                [x, y],
                [x + 1, y + 1],
            ])
            .fill(fillColor)
            .stroke({ width: width, color: color });
    }

    function pencilMove(x, y) {
        if (object != null) {
            object.plot(object.array().concat([[x, y]]));
        }
    }

    function pencilUp(x, y) {
        object = null;
    }

    function lineDown(x, y) {
        object = draw.line(x, y, x, y).stroke({ width: width, color: color });
    }

    function lineMove(x, y) {
        if (object != null) {
            object.plot([object.array()[0], [x, y]]);
        }
    }

    function lineUp(x, y) {
        object = null;
    }

    function polygonDown(x, y) {
        if (object == null) {
            if (!fill) {
                fillColor = "none";
            }
            object = draw
                .polygon([
                    [x, y],
                    [x, y],
                ])
                .fill(fillColor)
                .stroke({ width: width, color: color });
        } else {
            object.plot(object.array().concat([[x, y]]));
        }
    }

    function polygonMove(x, y) {
        if (object != null) {
            object.plot(
                object
                    .array()
                    .slice(0, -1)
                    .concat([[x, y]])
            );
        }
    }

    function polygonUp(x, y) {
        if (object != null && object.array().length > 2) {
            firstX = object.array()[0][0];
            firstY = object.array()[0][1];
            if ((firstX - x) ** 2 + (firstY - y) ** 2 <= 10 ** 2) {
                object.plot(object.array().slice(0, -2));
                object = null;
            }
        }
    }

    function buttonClick(object, brothers) {
        if (object.data("clicked")) {
            object.data("clicked", false);
            object.removeClass("selected");
        } else {
            brothers.removeClass("selected");
            brothers.data("clicked", false);
            object.data("clicked", true);
            object.addClass("selected");
        }
    }

    // Draggable-объекты
    function selectDisable() {
        document.onselectstart = disableselect;
        document.onmousedown = disableselect;
    }

    function selectEnable() {
        document.onselectstart = !disableselect;
        document.onmousedown = !disableselect;
    }

    function handle_mousedown(e) {
        selectDisable();
        window.my_dragging = {};
        my_dragging.pageX0 = e.pageX;
        my_dragging.pageY0 = e.pageY;
        my_dragging.elem = $(this).parent();
        my_dragging.offset0 = $(this).offset();

        function handle_dragging(e) {
            var left =
                my_dragging.offset0.left + (e.pageX - my_dragging.pageX0);
            var top = my_dragging.offset0.top + (e.pageY - my_dragging.pageY0);
            $(my_dragging.elem).offset({ top: top, left: left });
        }

        function handle_mouseup(e) {
            $("body")
                .off("mousemove", handle_dragging)
                .off("mouseup", handle_mouseup);
            selectEnable();
        }

        $("body")
            .on("mouseup", handle_mouseup)
            .on("mousemove", handle_dragging);
    }
    $(".moveable-part-file-menu").mousedown(handle_mousedown);

    // Инструменты
    $("#pencilTool").on("click", function () {
        buttonClick($(this), $(".tool-button"));
        if ($(this).data("clicked")) {
            $("#width-parameter").css("display", "inline-block");
            $("#filling-type").css("display", "inline-block");
        } else {
            $("#width-parameter").css("display", "none");
            $("#filling-type").css("display", "none");
        }
    });

    $("#lineTool").on("click", function () {
        $("#filling-type").css("display", "none");
        buttonClick($(this), $(".tool-button"));
        if ($(this).data("clicked")) {
            $("#width-parameter").css("display", "inline-block");
        } else {
            $("#width-parameter").css("display", "none");
        }
    });

    $("#polygonTool").on("click", function () {
        buttonClick($(this), $(".tool-button"));
        if ($(this).data("clicked")) {
            $("#width-parameter").css("display", "inline-block");
            $("#filling-type").css("display", "inline-block");
        } else {
            $("#width-parameter").css("display", "none");
            $("#filling-type").css("display", "none");
        }
    });

    $("#fillTool").on("click", function () {
        $("#filling-type").css("display", "none");
        $("#width-parameter").css("display", "none");
        buttonClick($(this), $(".tool-button"));
    });

    $("#clear-button").on("click", function () {
        draw.clear();
        object = null;
    });

    // Рабочая область
    $("#workspace").mousedown(function (e) {
        logMouse("down", e);
    });
    $("#workspace").mouseup(function (e) {
        logMouse("up", e);
        selectEnable();
    });
    $("#workspace").mousemove(function (e) {
        logMouse("move", e);
        selectEnable();
    });
    $("#workspace").mouseleave(function (e) {
        logMouse("up", e);
        selectEnable();
    });

    // Слайдер
    $(document).on("input", ".slider", function () {
        $(".slider-value").val($(this).val());
    });
    $(document).on("input", ".slider-value", function () {
        $(".slider").val($(this).val());
    });

    // Выпадающие кнопки сверху
    $("button.drop-button").on("click", function () {
        $(".drop-content").css("display", "none");
        buttonClick($(this), $(".drop-button"));
        if ($(this).data("clicked")) {
            $(this).parent().find(".drop-content").css("display", "block");
        } else {
            $(".drop-content").css("display", "none");
        }
    });

    // Закрытие из любого места
    $(document).click(function () {
        $(".drop-button").removeClass("selected");
        $(".drop-button").data("clicked", false);
        $(".drop-content").css("display", "none");
    });
    $(".drop-button").click(function (e) {
        e.stopPropagation();
    });

    // Обработка меню нового файла
    $(".drop-moving-button[name='new-file']").on("click", function () {
        $("#new-menu").css({
            "display": "block",
            "z-index": "100",
        });
    });

    $(".ok-button").on("click", function () {
        $(this).parent().css({
            "display": "none",
            "z-index": "0",
        });
        clearInputForm();
    });

    $(".close-menu-button").on("click", function () {
        $(this).parent().parent().css({
            "display": "none",
            "z-index": "0",
        });
        clearInputForm();
    });

    $(".drop-moving-button[name='save-file']").on("click", function () {
        $("#save-menu").css({
            "display": "block",
            "z-index": "100",
        });
    });

    $("#save-button").click(function () {
        $.ajax({
            data: {
                svg: draw.svg(),
                file_name: document.getElementById("file_name").value,
                csrfmiddlewaretoken: "{{csrf_token}}",
            },
            type: "POST",
            url: "{% url 'files_save' %}",
            success: function (response) {
                alert(
                    "Поздравляем! Файл с названием " +
                        response.file_name +
                        " успешно создан!"
                );
            },
            error: function (response) {
                alert(response.responseJSON.errors);
                console.log(response.responseJSON.errors);
            },
        });
        clearInputForm();
        return false;
    });

    $(".drop-moving-button[name='download-file']").on("click", function () {
        $("#download-menu").css({
            "display": "block",
            "z-index": "100",
        });
    });

    $("#download-button").on("click", function () {
        $(this).parent().css({
            "display": "none",
            "z-index": "0",
        });
        clearInputForm();
    });

    $(".drop-moving-button[name='open-file']").on("click", function () {
        $("#open-menu").css({
            "display": "block",
            "z-index": "100",
        });
    });

    $("#file").on("input", function () {
        $(this).parent().parent().css({
            "display": "none",
            "z-index": "0",
        });
        clearInputForm();
    });

    // Работа со слоями
    $("#layers-panel").on("click", ".layer-button", function () {
        buttonClick($(this), $(".layer-button"));
    });
});
