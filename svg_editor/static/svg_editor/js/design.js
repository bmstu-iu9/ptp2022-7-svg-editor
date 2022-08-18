$(window).on('load', function() {
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

    function clearInputForm(obj) {
        obj.find("input[type='text']").val('untitled');
        obj.find("input[type='number']").val('0');
    }

    function clickTool(name) {
        const $this = $(`#${name}Tool`);
        const $lastPressed = $(".tool-button.tool-clicked").not($this).not($("#layers-panel-button"));
        $this.toggleClass("tool-clicked");
        if (!$this.hasClass("addition-open")) {
        $(".hiddenTools").removeClass("open");
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
    // Инструменты
    $("#cursorTool").on("click", function () {
        clickTool("cursor");
    });
    $("#moveTool").on("click", function () {
        clickTool("move");
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
        clickTool("line");
        $("#filling-type").css("display", "none");
        if ($(this).hasClass("tool-clicked")) {
            $("#width-parameter").css("display", "inline-block");
        } else {
            $("#width-parameter").css("display", "none");
        }
        
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

    $("#starTool").on("click", function () {
        clickTool("star");
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
    $("#compressTool").on("click", function () {
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

    $(".ok-button").on("click", function () {
        $(this).parent().css({
            display: "none",
            "z-index": "0",
        });
        let newPageName = document.getElementsByName('new-filename')[0].value,
            newPageType = document.getElementById('save_file_type').value;
        easel.createPage(newPageName, newPageType)
        workspace = easel.currentPage.getWorkplace();
        clearInputForm();
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

    $(".drop-moving-button[name='download-file']").on("click", function () {
        clearInputForm($("#download-menu"));
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
    });

    $(".drop-moving-button[name='open-file']").on("click", function () {
        clearInputForm($("#open-menu"));
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
    });
    let $pagesChoosing = $('#pages-choosing');
    $pagesChoosing.on("click", "label",function (){
        easel.turnTo($(this).text());
        workspace = easel.currentPage.getWorkplace();
    });
    $pagesChoosing.on("click", ".delete-page-button",function (){
        easel.remove($(this).parent().find("label").text());
        workspace = easel.currentPage.getWorkplace();
    });
});
