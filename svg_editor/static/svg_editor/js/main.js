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
        /*  if $(this).parent().attr('id') == ... -> создай новый файл/загрузи и тд
            или для каждого случая делать отдельную кнопку
        */

    });

    $(".drop-moving-button[name='save-file']").on("click", function() {
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
        clearInputForm();
    });

    $(".drop-moving-button[name='download-file']").on("click", function() {
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
        clearInputForm();
    });

    $(".drop-moving-button[name='open-file']").on("click", function() {
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
        clearInputForm();
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

    $.ajaxSetup({
        headers: { "X-CSRFToken": '{{csrf_token}}' }
      });
      $('#save-button').click(function () {
          let svg_data = "<svg xmlns=\"http://www.w3.org/2000/svg\"" +
          " version=\"1.1\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" " +
          "xmlns:svgjs=\"http://svgjs.com/svgjs\" width=\"" + workspace.clientWidth + "\" height=\"" + workspace.clientHeight + "\" class=\"layer\">"
          for (i = 0; i < document.getElementsByClassName('layer').length; i++){
          svg_data += '<g>'+ document.getElementsByClassName('layer')[i].innerHTML+'</g>'
          }
          svg_data += '</svg>'
    console.log(svg_data)
          $.ajax({
              data: {
                  svg: svg_data,
                  file_name: document.getElementById('file_name').value,
              },
              type: 'POST',
              url: "{% url 'files_save' %}",
              success: function (response) {
                  alert('Поздравляем! Файл с названием ' + response.file_name + ' успешно создан!');
              },
              error: function (response) {
                  alert(response.responseJSON.errors);
                  console.log(response.responseJSON.errors);
              }
          });
          return false;
      });
      $('#file').change(function () {
          let data = new FormData();
          data.append('file', $("#file")[0].files[0]);
          $.ajax({
              data: data,
              type: 'POST',
              url: "{% url 'files_upload' %}",
              processData: false,
              cache: false,
              contentType: false,
              success: function (response) {
                  alert('Поздравляем! Файл с названием ' + response.file_name + ' успешно загружен!');
              },
              error: function (response) {
                  alert(response.responseJSON.errors);
                  console.log(response.responseJSON.errors);
              }
          });
          return false;
      });
      $('#download-button').click(function () {
          $.ajax({
               url: "{% url 'files_download' %}",
               type: 'GET',
              data: {
                   file_name: document.getElementById('download_file_name').value
              },
               success: function(response) {
                   let a = document.createElement("a");
                   a.href = "/files_download?file_name=" + document.getElementById('download_file_name').value;
                  a.click();
               },
               error: function(response){
                   alert(response.responseJSON.errors);
                  console.log(response.responseJSON.errors);
               },
           })
      });
})
