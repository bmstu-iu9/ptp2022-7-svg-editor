var num_layers = 0

function clearInputForm() {
    $("input[name='filename']").val("untitled");
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
        /*  if $(this).parent().attr('id') == ... -> создай новый файл/загрузи и тд
            или для каждого случая делать отдельную кнопку
        */

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
});
