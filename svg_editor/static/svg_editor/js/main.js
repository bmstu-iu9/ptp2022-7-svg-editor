/**
 * @author Kabane-UN
 **/

let currentFileName = null;

$(document).ready(function () {

    // Validate files collision
    $('input[name="new-filename"], #save_file_type').on("keyup change", function (){
        FileManager.collisionValidation($('input[name="new-filename"]').val()+'.'+$('#save_file_type').val(),
            function (response) {
                if (response.exists) {
                    $('input[name="new-filename"]').removeClass('is-valid').addClass('is-invalid');
                    $('.ok-button').prop('disabled', true);
                } else {
                    $('input[name="new-filename"]').removeClass('is-invalid').addClass('is-valid');
                    $('.ok-button').prop('disabled', false);
                }
            });
    })

    // Send svg to the server to save it
    $('#save-button').click(function (){
        breakDrawing();
        easel.save();
    });

    // Send svg to the server to save it as
    $('#saveAsFileButton').click(function () {
        breakDrawing();
        easel.save(true,
            document.getElementById('fileNameInput').value,
            document.getElementById('save_file_type').value);
    });

    // Upload users file to the server
    $('#file').change(function () {
        let data = new FormData();
        data.append('file', $("#file")[0].files[0]);
        FileManager.upload(data);
    });

    // Download file from server
    $('#downloadButton').click(function () {
        FileManager.download(currentFileName);
    });

    // Get list of user files at server
    $('#target').click(function () {
        FileManager.view();
    });

    // Delete users files from server
    $("#deleteButton").click(function () {
        FileManager.delete(currentFileName, document.getElementById("deleteAll").checked);
    })

    // Edit file from server
    $("#editButton").click(function (){
        easel.edit(currentFileName);
    });

    // Choosing a current svg
    $('#list_svg').on("click", ".inner_list_svg", function () {
        currentFileName = this.nextSibling.textContent;
    })

})
