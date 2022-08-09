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
    turnTo(pageFullName){
        let tag = document.getElementById('easel'),
            newPage = this.usedPages.find(page => page.fullName === pageFullName);
        if (this.currentPage){
            tag.replaceChild(newPage.tag, this.currentPage.tag);
        } else {
            tag.appendChild(newPage.tag)
        }
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
        return false;
    }
    edit(fileName=this.fullName){
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
            },
        });
    }
}