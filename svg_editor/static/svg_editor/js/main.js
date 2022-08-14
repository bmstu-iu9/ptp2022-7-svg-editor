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
    });

    // Send svg to the server to save it as
    $('#saveAsFileButton').click(function () {
        easel.save(true,
            document.getElementById('fileNameInput').value,
            document.getElementById('save_file_type').value);
    });

    // Upload users file to the server
    $('#file').change(function () {
        let data = new FormData();
        data.append('file', $("#file")[0].files[0]);
        Easel.upload(data);
    });

    // Download file from server
    $('#downloadButton').click(function () {
        Easel.download(currentFileName);
    });

    // Get list of user files at server
    $('#target').click(function () {
        Easel.view();
    });

    // Delete users files from server
    $("#deleteButton").click(function () {
        Easel.delete(currentFileName, document.getElementById("deleteAll").checked);
    })

    // Edit file from server
    $("#editButton").click(function (){
        easel.edit(currentFileName);
    });

    // Choosing a current svg
    $('#list_svg').on("click", ".inner_list_svg", function () {
        currentFileName = this.nextSibling.textContent;
    })

    // Svg save hotkey
    $(document).bind("keydown", function(event) {
        if (event.ctrlKey || event.metaKey) {
            switch (String.fromCharCode(event.which).toLowerCase()) {
                case 'x':
                    easel.save();
            }
        }
    });
})
