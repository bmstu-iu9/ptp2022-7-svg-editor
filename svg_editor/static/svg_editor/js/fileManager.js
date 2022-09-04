/**
 * @author Kabane-UN
 **/

// Class with files work methods
class FileManager {
    // Check file names collision
    static collisionValidation(fileName, onSuccessFunc){
        $.ajax({
            data: {file_name: fileName},
            type: 'GET',
            url: collisionValidationURL,
            success: onSuccessFunc,
            error: function (response) {
                alert(response.responseJSON.errors);
            }
        });
    }
    // Create a new file
    static create(fileName, type, onSuccessFunc){
        $.ajax({
            data: {
                file_name: fileName,
                save_as: false,
                svg: '',
                type: type,
            },
            type: 'POST',
            url: saveURL,
            success: onSuccessFunc,
            error: function (response) {
                alert(response.responseJSON.errors);
            }
        });
    }
    // Upload new file from user PC to the server
    static upload(data){
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
    }
    // Download file from server to user PC
    static download(fileName){
        $.ajax({
            url: downloadURL,
            type: 'GET',
            data: {
                file_name: fileName
            },
            success: function () {
                let a = document.createElement("a");
                a.href = "/files_download?file_name=" + currentFileName;
                a.click();
            },
            error: function (response) {
                alert(response.responseJSON.errors);
            },
        });
    }
    // Delete selected file from server or delete all
    static delete(fileName, all=false){
        $.ajax({
            url: deleteURL,
            type: 'POST',
            data: {
                file_name: fileName,
                all: all,
            },
            success: function (response) {
                alert('Поздравляем! ' + response.num_of_del + ' файл(ов) успешно удалено!');
            },
            error: function (response) {
                alert(response.responseJSON.errors);
            },
        });
    }
    // Get a list of files on the server
    static view(){
        $.ajax({
            url: viewURL,
            type: 'GET',
            success: function (response) {
                document.getElementById('text').innerHTML = "List of the saved files:";
                let list = document.querySelector('#list_svg');
                list.innerHTML = "";
                let key;
                for (key in response.svgs) {
                    list.innerHTML += `<li><input class="inner_list_svg" type='radio' name='selected_file'>${response.svgs[key]}</li>`
                }
            },
            error: function (response) {
                alert(response.responseJSON.errors);
            }
        });
    }
}