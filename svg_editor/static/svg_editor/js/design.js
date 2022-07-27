$(document).ready(function () {
    const disableSelect = (e) => {
        return false;
    };
    // Draggable-объекты
    function selectDisable() {
        document.onselectstart = disableSelect;
        document.onmousedown = disableSelect;
    }

    function selectEnable() {
        document.onselectstart = !disableSelect;
        document.onmousedown = !disableSelect;
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
    $("#cursorTool").on("click", function () {
        $("#filling-type").css("display", "none");
        $("#width-parameter").css("display", "none");
        $(this).toggleClass("tool-clicked");
        //buttonClick($(this), $(".tool-button"));
        const $lastPressed = $(".tool-button.tool-clicked").not(this);
        if ($lastPressed.length) {
            console.log($lastPressed);
            $lastPressed.css(
                "background-image",
                $lastPressed.css("background-image").replace("-active", "")
            );
            $lastPressed.removeClass("tool-clicked");
        }
        if ($(this).hasClass("tool-clicked")) {
            $(this).css(
                "background-image",
                "url('/static/svg_editor/icons/cursor-active.svg')"
            );
            changeToolEvent(this.value);
        } else {
            $(this).css(
                "background-image",
                "url('/static/svg_editor/icons/cursor.svg')"
            );
        }
    });

    $("#pencilTool").on("click", function () {
        $(this).toggleClass("tool-clicked");
        const $lastPressed = $(".tool-button.tool-clicked").not(this);
        if ($lastPressed.length) {
            console.log($lastPressed);
            $lastPressed.css(
                "background-image",
                $lastPressed.css("background-image").replace("-active", "")
            );
            $lastPressed.removeClass("tool-clicked");
        }
        if ($(this).hasClass("tool-clicked")) {
            $("#width-parameter").css("display", "inline-block");
            $("#filling-type").css("display", "inline-block");
            $(this).css(
                "background-image",
                "url('/static/svg_editor/icons/pencil-active.svg')"
            );
        } else {
            $("#width-parameter").css("display", "none");
            $("#filling-type").css("display", "none");
            $(this).css(
                "background-image",
                "url('/static/svg_editor/icons/pencil.svg')"
            );
        }
    });

    $("#lineTool").on("click", function () {
        $("#filling-type").css("display", "none");
        $(this).toggleClass("tool-clicked");
        const $lastPressed = $(".tool-button.tool-clicked").not(this);
        if ($lastPressed.length) {
            console.log($lastPressed);
            $lastPressed.css(
                "background-image",
                $lastPressed.css("background-image").replace("-active", "")
            );
            $lastPressed.removeClass("tool-clicked");
        }
        if ($(this).hasClass("tool-clicked")) {
            $(this).css(
                "background-image",
                "url('/static/svg_editor/icons/line-active.svg')"
            );
        } else {
            $(this).css(
                "background-image",
                "url('/static/svg_editor/icons/line.svg')"
            );
        }
    });

    $("#polygonTool").on("click", function () {
        $(this).toggleClass("tool-clicked");
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
        $(this).toggleClass("tool-clicked");
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
    $(".drop-button").on("click", function () {
        $(".drop-button").not(this).removeClass("selected");
        let currentDropdown = $(this).parent().find(".drop-content");
        //buttonClick($(this), $(".drop-button"));
        $(this).toggleClass("selected");
        currentDropdown.toggleClass("open");
        $(".drop-content").not(currentDropdown).removeClass("open");
    });

    // Закрытие из любого места
    $(document).click(function () {
        $(".drop-button").removeClass("selected");
        //$(".drop-button").data("clicked", false);
        $(".drop-content").removeClass("open");
    });
    $(".drop-button").click(function (e) {
        e.stopPropagation();
    });

    // Обработка меню нового файла
    $(".drop-moving-button[name='new-file']").on("click", function () {
        $("#new-menu").css({
            display: "block",
            "z-index": "100",
        });
    });

    $(".ok-button").on("click", function () {
        $(this).parent().css({
            display: "none",
            "z-index": "0",
        });
        clearInputForm();
    });

    $(".close-menu-button").on("click", function () {
        $(this).parent().parent().css({
            display: "none",
            "z-index": "0",
        });
        clearInputForm();
    });

    $(".drop-moving-button[name='save-file']").on("click", function () {
        $("#save-menu").css({
            display: "block",
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
            display: "block",
            "z-index": "100",
        });
    });

    $("#download-button").on("click", function () {
        $(this).parent().css({
            display: "none",
            "z-index": "0",
        });
        clearInputForm();
    });

    $(".drop-moving-button[name='open-file']").on("click", function () {
        $("#open-menu").css({
            display: "block",
            "z-index": "100",
        });
    });

    $("#file").on("input", function () {
        $(this).parent().parent().css({
            display: "none",
            "z-index": "0",
        });
        clearInputForm();
    });

    // Работа со слоями
    $("#layers-panel").on("click", ".layer-button", function () {
        buttonClick($(this), $(".layer-button"));
    });
});
