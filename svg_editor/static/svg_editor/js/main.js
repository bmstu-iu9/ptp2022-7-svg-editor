var num_layers = 0

function clearInputForm() {
    $("input[name='file_name']").val("untitled");
    $("input[name='width']").val("0");
    $("input[name='height']").val("0");
}


$(document).ready(function () {
    /* Выпадающие кнопки сверху */
    $("button.drop-button").on("click", function () {
        $(".drop-content").css("display", "none");
        if ($(this).data("clicked")) {
            $(this).data("clicked", false)
            $(this).removeClass("selected");
            $(".drop-content").css("display", "none");
        } else {
            $("button.drop-button").removeClass("selected");
            $("button.drop-button").data("clicked", false)
            $(this).data("clicked", true)
            $(this).addClass("selected");
            $(this).parent().find(".drop-content").css("display", "block");
        }
    });

    /* Закрытие из любого места */
    $(document).click(function () {
        $("button.drop-button").removeClass("selected");
        $("button.drop-button").data("clicked", false)
        $(".drop-content").css("display", "none");
    });

    $("button.drop-button").click(function(e) {
        e.stopPropagation();
    });

    /* Обработка меню нового файла */
    $(".drop-moving-button[name='new-file']").on("click", function () {
        $(".file-menu-panel").css({
            'display': 'none',
            'z-index': '0'
        })
        $("#new-menu").css({
            'display': 'block',
            'z-index': '1'
        });
    });
    $(".ok-button").on("click", function () {
        $(this).parent().css({
            'display': 'none',
            'z-index': '0'
        });
        clearInputForm();
    });

    $(".drop-moving-button[name='save-file']").on("click", function() {
        $(".file-menu-panel").css({
            'display': 'none',
            'z-index': '0'
        })
        $("#save-menu").css({
            'display': 'block',
            'z-index': '1'
        });
    });
    $("#save-button").on("click", function () {
        $(this).parent().css({
            'display': 'none',
            'z-index': '0'
        });
    });

    $(".drop-moving-button[name='download-file']").on("click", function() {
        $(".file-menu-panel").css({
            'display': 'none',
            'z-index': '0'
        })
        $("#download-menu").css({
            'display': 'block',
            'z-index': '1'
        });
    });
    $("#download-button").on("click", function () {
        $(this).parent().css({
            'display': 'none',
            'z-index': '0'
        });
    });

    $(".drop-moving-button[name='open-file']").on("click", function() {
        $(".file-menu-panel").css({
            'display': 'none',
            'z-index': '0'
        })
        $("#open-menu").css({
            'display': 'block',
            'z-index': '1'
        });
    });
    $("#file").on("input", function () {
        $(this).parent().parent().css({
            'display': 'none',
            'z-index': '0'
        });
    });

    $(".close-menu-button").on("click", function () {
        $(this).parent().parent().css({
            'display': 'none',
            'z-index': '0'
        });
        clearInputForm();
    });

    /* Работа со слоями */
    $("#layers-panel").on("click", ".layer-button", function () {
        if ($(this).data("clicked")) {
            $(this).data("clicked", false)
            $(this).removeClass("selected");
        } else {
            $("button.layer-button").removeClass("selected");
            $("button.layer-button").data("clicked", false);
            $(this).data("clicked", true)
            $(this).addClass("selected")
        }
    });

    /* Нужно поправить добавление слоев (иногда отрицательные или с одинаковой цифрой) */
    $("button#layers-panel-control-button.new").on("click", function () {
        num_layers++;
        var appended_layer = '<div class="layer"><button class="layer-button">Layer ' + num_layers + '</button></div>';
        $(this).parents("#layers-panel").append(appended_layer);
    });
    $("button#layers-panel-control-button.delete").on("click", function () {
        if ($(".layer-button.selected").length) {
            num_layers--;
            $(".layer-button.selected").parent().remove();
            $(".layer-button.selected").remove();
        }
    });
})

const canvas = document.querySelector('#canvas');
var draw = SVG(canvas).size(500, 500);
		
function drawPlease() {
	var a_x, a_y, b_x, b_y, c_x, c_y;
	a_x = document.getElementById('coord_a_x').value;
	a_y = document.getElementById('coord_a_y').value;
	b_x = document.getElementById('coord_b_x').value;
	b_y = document.getElementById('coord_b_y').value;
	c_x = document.getElementById('coord_c_x').value;
	c_y = document.getElementById('coord_c_y').value;
	draw.polygon([[a_x, a_y], [b_x, b_y], [c_x, c_y]]).fill(document.getElementById("color").value).stroke({ width: 1 })
}
		
function clearPlease() {
	draw.clear();
}
