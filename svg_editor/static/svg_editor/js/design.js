/**
 * @author Kabane-UN
 * @author GarryNeKasparov
 **/

$(window).on('load', function () {
    $('#preloader').fadeOut("slow");
});

$(document).ready(function () {
    $("#preloader").fadeOut("slow");
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

    function clearInputForm(obj) {
        obj.find("input[type='text']").val("untitled");
        obj.find("input[type='number']").val("0");
    }

    function clickTool(name) {
        const $this = $(`#${name}-tool`);
        const $lastPressed = $(".tool-button.tool-clicked")
            .not($this)
            .not($("#layers-panel-button"));
        $this.toggleClass("tool-clicked");
        if (!$this.hasClass("addition-open")) {
            $(".hidden-tools").removeClass("open");
        }
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
    function swap(a, b) {
        var tmp = $("<span>").hide();
        a.before(tmp);
        b.before(a);
        tmp.replaceWith(b);
    }
    // Инструменты
    $("#cursor-tool").on("click", function () {
        $("#width-parameter").css("display", "none");
        $("#filling-type").css("display", "none");
        clickTool("cursor");
    });
    $("#move-tool").on("click", function () {
        clickTool("move");
    });

    $("#pencil-tool").on("click", function () {
        clickTool("pencil");
        if ($(this).hasClass("tool-clicked")) {
            $("#width-parameter").css("display", "inline-block");
            $("#filling-type").css("display", "inline-block");
        } else {
            $("#width-parameter").css("display", "none");
            $("#filling-type").css("display", "none");
        }
    });

    $("#line-tool").on("click", function () {
        clickTool("line");
        $("#filling-type").css("display", "none");
        if ($(this).hasClass("tool-clicked")) {
            $("#width-parameter").css("display", "inline-block");
        } else {
            $("#width-parameter").css("display", "none");
        }
    });

    $("#tools-choosing").on("click", ".addition-open", function () {
        if ($(this).hasClass("tool-clicked")) {
            $(this).next().toggleClass("open");
        }
    });

    $("#tools-choosing").on("click", "#geometry .tool-button", function (e) {
        const $this = $(`#${e.target.id}`);
        const $curAdditionOpen = $("#geometry").prev();
        $this.addClass("addition-open");
        $curAdditionOpen.removeClass("addition-open");
        swap($this, $curAdditionOpen);
    });

    $("#tools-choosing").on("click", "#manage .tool-button", function (e) {
        const $this = $(`#${e.target.id}`);
        const $curAdditionOpen = $("#manage").prev();
        $this.addClass("addition-open");
        $curAdditionOpen.removeClass("addition-open");
        swap($this, $curAdditionOpen);
    });

    $("#polygon-tool").on("click", function () {
        clickTool("polygon");
        if ($(this).hasClass("tool-clicked")) {
            $("#width-parameter").css("display", "inline-block");
            $("#filling-type").css("display", "inline-block");
        } else {
            $("#width-parameter").css("display", "none");
            $("#filling-type").css("display", "none");
        }
    });

    $("#rect-tool").on("click", function () {
        clickTool("rect");
        if ($(this).hasClass("tool-clicked")) {
            $("#width-parameter").css("display", "inline-block");
            $("#filling-type").css("display", "inline-block");
        } else {
            $("#width-parameter").css("display", "none");
            $("#filling-type").css("display", "none");
        }
    });

    $("#ellipse-tool").on("click", function () {
        clickTool("ellipse");
        if ($(this).hasClass("tool-clicked")) {
            $("#width-parameter").css("display", "inline-block");
            $("#filling-type").css("display", "inline-block");
        } else {
            $("#width-parameter").css("display", "none");
            $("#filling-type").css("display", "none");
        }
    });

    $("#star-tool").on("click", function () {
        clickTool("star");
        if ($(this).hasClass("tool-clicked")) {
            $("#width-parameter").css("display", "inline-block");
            $("#filling-type").css("display", "inline-block");
        } else {
            $("#width-parameter").css("display", "none");
            $("#filling-type").css("display", "none");
        }
    });

    $("#path-tool").on("click", function () {
        clickTool("path");
        if ($(this).hasClass("tool-clicked")) {
            $("#width-parameter").css("display", "inline-block");
        } else {
            $("#width-parameter").css("display", "none");
        }
    });

    $("#text-tool").on("click", function () {
        $("#width-parameter").css("display", "none");
        $("#filling-type").css("display", "none");
        clickTool("text");
    });

    $("#fill-tool").on("click", function () {
        $("#width-parameter").css("display", "none");
        $("#filling-type").css("display", "none");
        clickTool("fill");
    });

    $("#eraser-tool").on("click", function () {
        $("#width-parameter").css("display", "none");
        $("#filling-type").css("display", "none");
        clickTool("eraser");
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

    $("#scale-tool").on("click", function () {
        $("#width-parameter").css("display", "none");
        $("#filling-type").css("display", "none");
        clickTool("scale");
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

    $("#skew-tool").on("click", function () {
        $("#width-parameter").css("display", "none");
        $("#filling-type").css("display", "none");
        clickTool("skew");
    });

    $("#mirror-tool").on("click", function () {
        $("#width-parameter").css("display", "none");
        $("#filling-type").css("display", "none");
        clickTool("mirror");
    });
    $("#compress-tool").on("click", function () {
        $("#width-parameter").css("display", "none");
        $("#filling-type").css("display", "none");
        clickTool("compress");
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
        clearInputForm($("#new-menu"));
        $("#new-menu").css({
            display: "block",
            "z-index": "100",
        });
    });

    $(".drop-moving-button[name='save-as-file']").on("click", function () {
        clearInputForm($("#new-menu"));
        $("#save-as-menu").css({
            display: "block",
            "z-index": "100",
        });
    });

    $(".ok-button").on("click", function () {
        $(this).parent().css({
            display: "none",
            "z-index": "0",
        });
    });

    $("#new-ok-button").on("click", function () {
        let newPageName = document.getElementsByName("new-filename")[0].value,
            newPageType = document.getElementById("new-file-type").value;
        easel.remove(`${newPageName}.${newPageType}`, false);
        easel.createPage(newPageName, newPageType);
        easel.currentPage.pie.createNewLayer(undefined,'base');
    });

    $(".close-menu-button").on("click", function () {
        $(this).parent().parent().css({
            display: "none",
            "z-index": "0",
        });
    });

    $(".drop-moving-button[name='save-file']").on("click", function () {
        clearInputForm($("#save-menu"));
        $("#save-menu").css({
            display: "block",
            "z-index": "100",
        });
    });

    $(".drop-moving-button[name='open-file']").on("click", function () {
        clearInputForm($("#open-menu"));
        $("#open-menu").css({
            display: "block",
            "z-index": "100",
        });
    });

    $(".drop-moving-button[name='delete-file']").on("click", function () {
        $("#delete-menu").css({
            display: "block",
            "z-index": "100",
        });
    });

    $(".drop-moving-button[name='undo']").on("click", function () {
        historyBack();
    });
    
    $(".drop-moving-button[name='redo']").on("click", function () {
        historyUndo();
    });

    $("#file").on("input", function () {
        $(this).parent().parent().css({
            display: "none",
            "z-index": "0",
        });
    });

    let $pagesChoosing = $("#pages-choosing");
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
