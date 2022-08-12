$(window).on('load', function() {
    $('#preloader').fadeOut("slow");
    $("body").addClass("loaded");
  });

$(document).ready(function () {
    $('#preloader').fadeOut("slow");
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

    function clickTool(name) {
        const $this = $(`#${name}Tool`);
        const $lastPressed = $(".tool-button.tool-clicked").not($this);
        $this.toggleClass("tool-clicked");
        if ($lastPressed.length) {
            $lastPressed.css(
                "background-image",
                $lastPressed.css("background-image").replace("-active", "")
            );
            $lastPressed.removeClass("tool-clicked");
        }
        if ($this.hasClass("tool-clicked")) {
            $this.css(
                "background-image",
                `url('/static/svg_editor/icons/${name}-active.svg')`
            );
            changeToolEvent();
        } else {
            $this.css(
                "background-image",
                `url('/static/svg_editor/icons/${name}.svg')`
            );
        }
    }
    // Инструменты
    $("#cursorTool").on("click", function () {
        $("#filling-type").css("display", "none");
        $("#width-parameter").css("display", "none");
        clickTool("cursor");
    });

    $("#pencilTool").on("click", function () {
        clickTool("pencil");
        if ($(this).hasClass("tool-clicked")) {
            $("#width-parameter").css("display", "inline-block");
            $("#filling-type").css("display", "inline-block");
        } else {
            $("#width-parameter").css("display", "none");
            $("#filling-type").css("display", "none");
        }
    });

    $("#lineTool").on("click", function () {
        $("#filling-type").css("display", "none");
        clickTool("line");
    });

    $("#polygonTool").on("click", function () {
        clickTool("polygon");
        $("#geometry").toggleClass("open");
        if ($(this).hasClass("tool-clicked")) {
            $("#width-parameter").css("display", "inline-block");
            $("#filling-type").css("display", "inline-block");
        } else {
            $("#width-parameter").css("display", "none");
            $("#filling-type").css("display", "none");
        }
    });

    $("#rectTool").on("click", function () {
        clickTool("rect");
        if ($(this).hasClass("tool-clicked")) {
            $("#width-parameter").css("display", "inline-block");
            $("#filling-type").css("display", "inline-block");
        } else {
            $("#width-parameter").css("display", "none");
            $("#filling-type").css("display", "none");
        }
    });

    $("#ellipseTool").on("click", function () {
        clickTool("ellipse");
        if ($(this).hasClass("tool-clicked")) {
            $("#width-parameter").css("display", "inline-block");
            $("#filling-type").css("display", "inline-block");
        } else {
            $("#width-parameter").css("display", "none");
            $("#filling-type").css("display", "none");
        }
    });

    $("#pathTool").on("click", function () {
        clickTool("path");
        if ($(this).hasClass("tool-clicked")) {
            $("#width-parameter").css("display", "inline-block");
        } else {
            $("#width-parameter").css("display", "none");
        }
    });

    $("#textTool").on("click", function () {
        clickTool("text");
    });

    $("#fillTool").on("click", function () {
        clickTool("fill");
    });

    $("#eraserTool").on("click", function () {
        clickTool("eraser");
    });

    $("#cursorTool").on("click", function () {
        $(this).toggleClass("tool-clicked");
        const $lastPressed = $(".tool-button.tool-clicked").not(this);
        if ($lastPressed.length) {
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
            changeToolEvent();
        } else {
            $(this).css(
                "background-image",
                "url('/static/svg_editor/icons/cursor.svg')"
            );
        }
    });

    $("#rotateTool").on("click", function () {
        clickTool("rotate");
        $("#manage").toggleClass("open");
    });
    
    $("#deformTool").on("click", function () {
        clickTool("deform");
    });

    $("#scaleTool").on("click", function () {
        clickTool("scale");
    });

    $("#splitTool").on("click", function () {
        clickTool("split");
    });

    $("#skewTool").on("click", function () {
        clickTool("skew");
    });
    
    $("#mirrorTool").on("click", function () {
        clickTool("mirror"); 
    });
    $("#tenscompressTool").on("click", function () {
        clickTool("tenscompress");
    });    

    $("#clear-button").on("click", function () {
        draw.clear();
        object = null;
    });
    // Слайдер ширины
    $(document).on("input", "#width-slider", function () {
        $("#width-slider-value").val($(this).val());
    });
    $(document).on("input", "#width-slider-value", function () {
        $("#width-slider").val($(this).val());
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
    // Слои
    $("#layers-panel-button").on("click", function () {
        let $currentDropdown = $("#layers-panel-content");
        $(this).toggleClass("tool-clicked");
        if ($(this).hasClass("tool-clicked")) {
            $(this).css(
                "background-image",
                "url('/static/svg_editor/icons/layers-active.svg')"
            );
            changeToolEvent();
        } else {
            $(this).css(
                "background-image",
                "url('/static/svg_editor/icons/layers.svg')"
            );
        }
        $currentDropdown.toggleClass("open");
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
});
