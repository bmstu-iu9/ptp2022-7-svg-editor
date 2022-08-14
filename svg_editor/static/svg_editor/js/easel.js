class Easel {
    usedPages;
    currentPage;
    constructor(usedPages) {
        this.usedPages = usedPages;
        this.turnTo(this.usedPages[0].fullName)
    }
    add(page){
        this.usedPages.push(page);
        this.turnTo(page.fullName)
    }
    remove(pageFullName){
       let indexToDelete = this.usedPages.findIndex(page => page.fullName === pageFullName),
           deletedPage = this.usedPages[indexToDelete];
       this.usedPages.splice(
            indexToDelete, 1);
       deletedPage.deactivateNode();
       if (this.usedPages.length > 0 && pageFullName === this.currentPage.fullName) {
           this.turnTo(this.usedPages[0].fullName);
       } else if (this.usedPages.length <= 0) {
           let a = document.createElement("a");
           a.href = "/account";
           a.click();
       }

    }
    turnTo(pageFullName){
        let tag = document.getElementById('easel'),
            newPage = this.usedPages.find(page => page.fullName === pageFullName);
        if (this.currentPage){
            tag.replaceChild(newPage.tag, this.currentPage.tag);
            this.currentPage.node.classList.remove('active');
        } else {
            tag.appendChild(newPage.tag);
        }
        newPage.node.classList.add('active');
        this.currentPage = newPage;
    }
    save(saveAs=false, fileName=this.currentPage.name, type=this.currentPage.type){
        $.ajax({
            data: {
                file_name: fileName,
                save_as: saveAs,
                svg: getPictureAsSvg(),
                type: type,
            },
            type: 'POST',
            url: saveURL,
            success: function (response) {
                alert('Поздравляем! Файл с названием ' + response.file_name + ' успешно сохранен!');
            },
            error: function (response) {
                alert(response.responseJSON.errors);
            }
        });
    }
    edit(fileName=this.currentPage.fullName){
        $.ajax({
            url: loadURL,
            type: 'GET',
            data: {
                file_name: fileName,
            },
            success: function (response) {
                if (response.file_name.split('.').pop().toLowerCase() === 'svg') {
                    openAsSvg(response.svg);
                } else {
                    openAsProject(response.yml);
                }
            },
            error: function (response) {
                alert(response.responseJSON.errors);
            }
        });
    }
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
                    list.innerHTML += `<input class="inner_list_svg" type='radio' name='selected_file'>${response.svgs[key]}`
                }
            },
            error: function (response) {
                alert(response.responseJSON.errors);
            }
        });
    }
}