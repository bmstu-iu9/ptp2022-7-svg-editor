/**
 * @author Kabane-UN
 **/

$(document).ready(function () {
    $.ajaxSetup({
			headers: {"X-CSRFToken": token}
    });
    // Create a new file and load with it to editor page
    $("#create-file-button").click(function () {
        FileManager.create($("#file-name-input").val(),
            $("#save-file-type").val(), function () {
                let a = document.createElement("a");
        a.href = "../?file_name=" + $("#file-name-input").val() + "&type=" + $("#save-file-type").val();
        a.click();
            });
    });
    // Open chosen file and load with it to editor page
    $("#open-button").click(function () {
        let a = document.createElement("a");
        a.href = "../?file_name=" + currentFileName.slice(0, -4)
             + "&type=" + currentFileName.slice(-3);
        a.click();
    });
    // Upload new file to the server
    $("#upload-button").change(function (){
        let data = new FormData();
        data.append('file', $(this)[0].files[0]);
        FileManager.upload(data);
    })
    // Validate files collision
    $('#file-name-input, #save-file-type').on("keyup change", function (){
        FileManager.collisionValidation($('#file-name-input').val()+'.'+$('#save-file-type').val(), function (response) {
                if (response.exists) {
                    $('#file-name-input').removeClass('is-valid').addClass('is-invalid');
                    $('#create-file-button').prop('disabled', true);
                } else {
                    $('#file-name-input').removeClass('is-invalid').addClass('is-valid');
                    $('#create-file-button').prop('disabled', false);
                }
            });
    });

    // Get list of user files at server
    $('#reload-button').click(function () {
        FileManager.view();
    });
});