/**
 * @author Kabane-UN
 * @author GarryNeKasparov
 **/

$(window).on('load', function () {
    $('#preloader').fadeOut("slow");
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

    // Инструменты
    $("#moveTool").on("click", function () {
        $("#filling-type").css("display", "none");
        $("#width-parameter").css("display", "none");
        $(this).toggleClass("tool-clicked");
        //buttonClick($(this), $(".tool-button"));
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
                "url('/static/svg_editor/icons/move-active.svg')"
            );
            changeToolEvent();
        } else {
            $(this).css(
                "background-image",
                "url('/static/svg_editor/icons/move.svg')"
            );
        }
    });

    $("#pencilTool").on("click", function () {
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
            $("#width-parameter").css("display", "inline-block");
            $("#filling-type").css("display", "inline-block");
            $(this).css(
                "background-image",
                "url('/static/svg_editor/icons/pencil-active.svg')"
            );
            changeToolEvent();
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
            changeToolEvent();
        } else {
            $(this).css(
                "background-image",
                "url('/static/svg_editor/icons/line.svg')"
            );
        }
    });

    $("#polygonTool").on("click", function () {
        $(this).toggleClass("tool-clicked");
        const $lastPressed = $(".tool-button.tool-clicked").not(this);
        if ($lastPressed.length) {
            $lastPressed.css(
                "background-image",
                $lastPressed.css("background-image").replace("-active", "")
            );
            $lastPressed.removeClass("tool-clicked");
        }
        $(this).next().toggleClass("open");
        if ($(this).hasClass("tool-clicked")) {
            $("#width-parameter").css("display", "inline-block");
            $("#filling-type").css("display", "inline-block");
            $(this).css(
                "background-image",
                "url('/static/svg_editor/icons/polygon-active.svg')"
            );
            changeToolEvent();
        } else {
            $(this).css(
                "background-image",
                "url('/static/svg_editor/icons/polygon.svg')"
            );
            $("#width-parameter").css("display", "none");
            $("#filling-type").css("display", "none");
        }
    });

    $("#rectTool").on("click", function () {
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
                "url('/static/svg_editor/icons/rect-active.svg')"
            );
            changeToolEvent();
        } else {
            $(this).css(
                "background-image",
                "url('/static/svg_editor/icons/rect.svg')"
            );
        }
    });

    $("#ellipseTool").on("click", function () {
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
                "url('/static/svg_editor/icons/ellipse-active.svg')"
            );
            changeToolEvent();
        } else {
            $(this).css(
                "background-image",
                "url('/static/svg_editor/icons/ellipse.svg')"
            );
        }
    });

    $("#pathTool").on("click", function () {
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
            $("#width-parameter").css("display", "inline-block");
            $("#filling-type").css("display", "inline-block");
            $(this).css(
                "background-image",
                "url('/static/svg_editor/icons/path-active.svg')"
            );
            changeToolEvent();
        } else {
            $(this).css(
                "background-image",
                "url('/static/svg_editor/icons/path.svg')"
            );
            $("#width-parameter").css("display", "none");
            $("#filling-type").css("display", "none");
        }
    });

    $("#textTool").on("click", function () {
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
            $("#width-parameter").css("display", "inline-block");
            $(this).css(
                "background-image",
                "url('/static/svg_editor/icons/text-active.svg')"
            );
            changeToolEvent();
        } else {
            $(this).css(
                "background-image",
                "url('/static/svg_editor/icons/text.svg')"
            );
            $("#width-parameter").css("display", "none");
        }
    });

    $("#fillTool").on("click", function () {
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
                "url('/static/svg_editor/icons/fill-active.svg')"
            );
            changeToolEvent();
        } else {
            $(this).css(
                "background-image",
                "url('/static/svg_editor/icons/fill.svg')"
            );
        }
    });

    $("#eraserTool").on("click", function () {
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
                "url('/static/svg_editor/icons/eraser-active.svg')"
            );
            changeToolEvent();
        } else {
            $(this).css(
                "background-image",
                "url('/static/svg_editor/icons/eraser.svg')"
            );
        }
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
        $(this).toggleClass("tool-clicked");
        const $lastPressed = $(".tool-button.tool-clicked").not(this);
        if ($lastPressed.length) {
            $lastPressed.css(
                "background-image",
                $lastPressed.css("background-image").replace("-active", "")
            );
            $lastPressed.removeClass("tool-clicked");
        }
        $(this).next().toggleClass("open");
        if ($(this).hasClass("tool-clicked")) {
            $(this).css(
                "background-image",
                "url('/static/svg_editor/icons/rotate-active.svg')"
            );
            changeToolEvent();
        } else {
            $(this).css(
                "background-image",
                "url('/static/svg_editor/icons/rotate.svg')"
            );
        }
    });

    $("#deformTool").on("click", function () {
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
                "url('/static/svg_editor/icons/deform-active.svg')"
            );
            changeToolEvent();
        } else {
            $(this).css(
                "background-image",
                "url('/static/svg_editor/icons/deform.svg')"
            );
        }
    });

    $("#scaleTool").on("click", function () {
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
                "url('/static/svg_editor/icons/scale-active.svg')"
            );
            changeToolEvent();
        } else {
            $(this).css(
                "background-image",
                "url('/static/svg_editor/icons/scale.svg')"
            );
        }
    });

    $("#splitTool").on("click", function () {
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
                "url('/static/svg_editor/icons/split-active.svg')"
            );
            changeToolEvent();
        } else {
            $(this).css(
                "background-image",
                "url('/static/svg_editor/icons/split.svg')"
            );
        }
    });

    $("#skewTool").on("click", function () {
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
                "url('/static/svg_editor/icons/skew-active.svg')"
            );
            changeToolEvent();
        } else {
            $(this).css(
                "background-image",
                "url('/static/svg_editor/icons/skew.svg')"
            );
        }
    });

    $("#mirrorTool").on("click", function () {
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
                "url('/static/svg_editor/icons/mirror-active.svg')"
            );
            changeToolEvent();
        } else {
            $(this).css(
                "background-image",
                "url('/static/svg_editor/icons/mirror.svg')"
            );
        }
    });

    $("#compressTool").on("click", function () {
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
                "url('/static/svg_editor/icons/compress-active.svg')"
            );
            changeToolEvent();
        } else {
            $(this).css(
                "background-image",
                "url('/static/svg_editor/icons/compress.svg')"
            );
        }
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
        let newPageName = document.getElementsByName('new-filename')[0].value,
            newPageType = document.getElementById('save_file_type').value;
        easel.createPage(newPageName, newPageType);
        FileManager.create(newPageName, newPageType, function () { })
        $(this).prop('disabled', true);
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
    let $pagesChoosing = $('#pages-choosing');
    $pagesChoosing.on("click", "label", function () {
        easel.turnTo($(this).text());
        workspace = document.getElementById('workspace');
    });
    $pagesChoosing.on("click", ".delete-page-button", function () {
        easel.remove($(this).parent().find("label").text());
        workspace = document.getElementById('workspace');
    });

    //////////Layers-controls
    $("#createLayerButton").click(function () {
        easel.currentPage.pie.createNewLayer();
    })

    // $("#createLayerButton").click();

    $("#deleteLayerButton").click(function () {
        easel.currentPage.pie.deleteCurrentLayer();
    });

    $("#opacity_slider").on("change", function () {
        easel.currentPage.pie.changeCurrentLayerOpacity();
    });

    $('#layers-panel-content').on("click", "#layers-panel-choosing .layer_note", function () {
        easel.currentPage.pie.selectLayer(this.layerRemote);
    })

    $('#layerUp').click(function () { easel.currentPage.pie.currentLayerUp() });

    $('#layerDown').click(function () { easel.currentPage.pie.currentLayerDown() });

    $('#copyLayer').click(function () { easel.currentPage.pie.currentLayerCopy() });

    $('#layers-panel-content').on("dragstart", "#layers-panel-choosing .layer_note", function () {
        easel.currentPage.pie.selectLayer(this.layerRemote)
    });

    $('#layers-panel-content').on("dragenter", "#layers-panel-choosing .note_top", function () {
        this.parentElement.layerRemote.coverTop()
    })

    $('#layers-panel-content').on("dragenter", "#layers-panel-choosing .note_bottom", function () {
        this.parentElement.layerRemote.coverBottom()
    })

    $('#layers-panel-content').on("dragleave", "#layers-panel-choosing .note_top", function () {
        this.parentElement.layerRemote.uncoverTop()
    })

    $('#layers-panel-content').on("dragleave", "#layers-panel-choosing .note_bottom", function () {
        this.parentElement.layerRemote.uncoverBottom()
    })

    $('#layers-panel-content').on("dragover", "#layers-panel-choosing .note_top, .note_bottom", function (e) {
        e.preventDefault()
    })

    $('#layers-panel-content').on("drop", "#layers-panel-choosing .note_top", function () {
        $(this).trigger("dragleave");
        let thisRemote = this.parentElement.layerRemote;
        let current = easel.currentPage.pie.getCurrentLayer()
        thisRemote.after(current);
    })

    $('#layers-panel-content').on("drop", "#layers-panel-choosing .note_bottom", function () {
        $(this).trigger("dragleave");
        let thisRemote = this.parentElement.layerRemote;
        let current = easel.currentPage.pie.getCurrentLayer()
        thisRemote.before(current);
    })

    $('#layers-panel-content').on("click", "#layers-panel-choosing input", function (e) {
        let clicked = this.parentElement.parentElement.layerRemote;
        clicked.switchDisplay();
        e.stopPropagation();
    })

    $("#mergeWithPrevious").click(function () {
        easel.currentPage.pie.mergeCurrentWithPrevious();
    });

    $("#mergeVisible").click(function () {
        easel.currentPage.pie.mergeVisible();
    });

    $('#createFromVisible').click(function () {
        easel.currentPage.pie.createFromVisible();
    });
});
