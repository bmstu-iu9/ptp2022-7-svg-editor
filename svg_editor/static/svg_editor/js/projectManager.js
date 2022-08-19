$(document).ready(function () {
    $.ajaxSetup({
			headers: {"X-CSRFToken": token}
    });
    $("#createFileButton").click(function () {
        FileManager.create(document.getElementById("fileNameInput").value,
            document.getElementById("save_file_type").value, function (response) {
                let a = document.createElement("a");
        a.href = "../?file_name=" + document.getElementById("fileNameInput")
            .value + "&type=" + document.getElementById("save_file_type").value;
        a.click();
            });
    });
    $("#openButton").click(function () {
        console.log(currentFileName.slice(0, -4));
        let a = document.createElement("a");
        a.href = "../?file_name=" + currentFileName.slice(0, -4)
             + "&type=" + currentFileName.slice(-3);
        a.click();
    });
    $("#uploadButton").change(function (){
        let data = new FormData();
        data.append('file', $(this)[0].files[0]);
        FileManager.upload(data);
    })
    // Validate files collision
    $('#fileNameInput, #save_file_type').on("keyup change", function (){
        FileManager.collisionValidation($('#fileNameInput').val()+'.'+$('#save_file_type').val(), function (response) {
                if (response.exists) {
                    $('#fileNameInput').removeClass('is-valid').addClass('is-invalid');
                    $('#createFileButton').prop('disabled', true);
                } else {
                    $('#fileNameInput').removeClass('is-invalid').addClass('is-valid');
                    $('#createFileButton').prop('disabled', false);
                }
            });
    })
});