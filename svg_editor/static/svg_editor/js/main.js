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

    // Send svg to the server to save it as
    // $('#saveAsFileButton').click(function () {
    //     breakDrawing();
    //     easel.save(true,
    //         document.getElementById('fileNameInput').value,
    //         document.getElementById('save_file_type').value);
    // });

    // Upload users file to the server
    $("#file").change(function () {
        let data = new FormData();
        data.append("file", $("#file")[0].files[0]);
        FileManager.upload(data);
    });

    // Download file from server
    $('#download-button').click(function () {
        FileManager.download(easel.currentPage.getFileName() + '.' + easel.currentPage.getFileType());
    });

    // Get list of user files at server
    $(".drop-moving-button[name='view-file']").click(function () {
        $("#user-files").css({
            display: "block",
            "z-index": 20,
        });
        FileManager.view();
    });

    // Delete users files from server
    $("#delete-button").click(function () {
        FileManager.delete(
            currentFileName,
            $("#delete-all-input")[0].checked
        );
    });
    // Edit file from server
    $(".drop-moving-button[name='edit-file']").click(function () {
        if (currentFileName) {
            easel.remove(currentFileName, false);
            easel.createPage(currentFileName.slice(0, -4), currentFileName.slice(-3));
            workspace = document.getElementById('workspace');
            easel.edit();
        }
    });

    // Choosing a current svg
    $("#list-svg").on("click", ".inner-list-svg", function () {
        currentFileName = this.nextSibling.textContent;
    });
});
