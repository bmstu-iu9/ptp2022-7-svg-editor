/**
 * @author Kabane-UN
 **/

let currentFileName = null;

$(document).ready(function () {

    // Get csrf_token
    $.ajaxSetup({
        headers: {"X-CSRFToken": token}
    });

    // Send svg to the server to save it
    $('#save-button').click(function (){
        easel.save();
        return false;
    });

    // Send svg to the server to save it as
    $('#saveAsFileButton').click(function () {
        $.ajax({
            data: {
                file_name: document.getElementById('fileNameInput').value,
                save_as: true,
                svg: getPictureAsSvg(),
                type: document.getElementById('save_file_type').value,
            },
            type: 'POST',
            url: saveURL,
            success: function (response) {
                alert('Поздравляем! Файл с названием ' + response.file_name + ' успешно создан!');
                document.getElementById('fileNameInput').value = response.file_name.slice(0, -4);
            },
            error: function (response) {
                alert(response.responseJSON.errors);
            }
        });
        return false;
    });

    // Upload users file to the server
    $('#file').change(function () {
        let data = new FormData();
        data.append('file', $("#file")[0].files[0]);
        $.ajax({
            data: data,
            type: 'POST',
            url: uploadURL,
            processData: false,
            cache: false,
            contentType: false,
            success: function (response) {
                alert('Поздравляем! Файл с названием ' + response.file_name + ' успешно загружен!');
            },
            error: function (response) {
                alert(response.responseJSON.errors);
            }
        });
        return false;
    });

    // Download file from server
    $('#downloadButton').click(function () {
        $.ajax({
            url: downloadURL,
            type: 'GET',
            data: {
                file_name: currentFileName
            },
            success: function () {
                let a = document.createElement("a");
                a.href = "/files_download?file_name=" + currentFileName;
                a.click();
            },
            error: function (response) {
                alert(response.responseJSON.errors);
            },
        })
    });

    // Get list of user files at server
    $('#target').click(function () {
        $.ajax({
            url: viewURL,
            type: 'GET',
            success: function (response) {
                document.getElementById('text').innerHTML = "List of the saved files:";
                let list = document.querySelector('#list_svg');
                list.innerHTML = "";
                let key;
                for (key in response.svgs) {
                    list.innerHTML += `<input class="inner_list_svg" type='radio' name='selected_file'>${response.svgs[key]}`
                }
            },
            error: function (response) {
                alert(response.responseJSON.errors);
            }
        });
        return false;
    });

    // Delete users files from server
    $("#deleteButton").click(function () {
        $.ajax({
            url: deleteURL,
            type: 'POST',
            data: {
                file_name: currentFileName,
                all: document.getElementById("deleteAll").checked,
            },
            success: function (response) {
                alert('Поздравляем! ' + response.num_of_del + ' файл(ов) успешно удалено!');
            },
            error: function (response) {
                alert(response.responseJSON.errors);
            },
        })
    })

    // Edit file from server
    $("#editButton").click(function (){
        easel.edit(currentFileName)
        return false;
    });

    // Choosing a current svg
    $('#list_svg').on("click", ".inner_list_svg", function () {
        currentFileName = this.nextSibling.textContent;
    })
})
