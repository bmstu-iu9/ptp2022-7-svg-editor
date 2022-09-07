/**
 * @author Kabane-UN
 **/

let currentFileName = null;

$(document).ready(function () {
    // Validate files collision
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

    // Send svg to the server to save it
    $("#save-button").click(function () {
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

    // Download file from server
    $("#user-files").on("click", "#download-button", function () {
        FileManager.download(currentFileName);
    });


    // Delete users files from server
    $("#user-files").on("click", "#delete-button", function () {
        FileManager.delete(
            currentFileName,
            $("#delete-all-input")[0].checked
        );
    });
    // Edit file from server
    $("#user-files").on("click", "#edit-button", function () {
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
