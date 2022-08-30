class FileManager {
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