/**
 * @author Kabane-UN
 **/

let currentFileName = null;

$(document).ready(function () {
    // Validate files collision in new file menu
    $('input[name="new-filename"], #new-file-type').on(
        "keyup change",
        function () {
            FileManager.collisionValidation(
                $('input[name="new-filename"]').val() +
                    "." +
                    $("#new-file-type").val(),
                function (response) {
                    if (response.exists) {
                        $('input[name="new-filename"]')
                            .removeClass("is-valid")
                            .addClass("is-invalid");
                        $("#new-ok-button").prop("disabled", true);
                    } else {
                        $('input[name="new-filename"]')
                            .removeClass("is-invalid")
                            .addClass("is-valid");
                        $("#new-ok-button").prop("disabled", false);
                    }
                }
            );
        }
    );
    // Validate files collision in save as menu
    $('#save-as-name, #save-as-file-type').on(
        "keyup change",
        function () {
            FileManager.collisionValidation(
                $('#save-as-name').val() +
                    "." +
                    $("#save-as-file-type").val(),
                function (response) {
                    if (response.exists) {
                        $('#save-as-name')
                            .removeClass("is-valid")
                            .addClass("is-invalid");
                        $('#save-as-button').prop("disabled", true);
                    } else {
                        $('#save-as-name')
                            .removeClass("is-invalid")
                            .addClass("is-valid");
                        $("#save-as-button").prop("disabled", false);
                    }
                }
            );
        }
    );

    // Send svg to the server to save it
    $('div[name="save-file"]').click(function () {
        breakDrawing();
        easel.save();
    });

    // Send svg to the server to save it as
    $("#save-as-button").click(function () {
        breakDrawing();
        easel.save(
            true,
            $("#save-as-name").val(),
            $("#save-as-file-type").val()
        );
    });

    // Upload users file to the server
    $("#file").change(function () {
        let data = new FormData();
        data.append("file", $("#file")[0].files[0]);
        FileManager.upload(data);
    });

    let $userFiles = $("#user-files");

    // Download file from server
    $userFiles.on("click", "#download-button", function () {
        FileManager.download(currentFileName);
    });


    // Delete users files from server
    $userFiles.on("click", "#delete-button", function () {
        FileManager.delete(
            currentFileName,
            $("#delete-all-input")[0].checked
        );
    });
    // Edit file from server
    $userFiles.on("click", "#edit-button", function () {
        if (currentFileName) {
            easel.remove(currentFileName, false);
            easel.edit(currentFileName.slice(0, -4), currentFileName.slice(-3));
        }
    });

    // Choosing a current svg
    $("#list-svg").on("click", ".inner-list-svg", function () {
        currentFileName = this.nextSibling.textContent;
    });
});
