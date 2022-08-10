$(document).ready(function () {
    $("#create_file_button").click(function () {
        let a = document.createElement("a");
        a.href = "../?file_name=" + document.getElementById("fileNameInput")
            .value + "&type=" + document.getElementById("save_file_type").value+ "&method=create";
        a.click();
    });
    $("#openButton").click(function () {
        console.log(currentFileName.slice(0, -4));
        let a = document.createElement("a");
        a.href = "../?file_name=" + currentFileName.slice(0, -4)
             + "&type=" + currentFileName.slice(-3) + "&method=open";
        a.click();
    });
});