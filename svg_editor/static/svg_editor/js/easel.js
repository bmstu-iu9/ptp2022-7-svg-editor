class Easel {
    usedPages;
    currentPage;
    constructor(usedPages) {
        this.usedPages = usedPages;
        this.turnTo(this.usedPages[0].name)
    }
    turnTo(pageName){
        if (this.currentPage){
            this.currentPage.classList.remove('public');
            this.currentPage.classList.add('private');
        }
        this.currentPage = this.usedPages.find(page => page.name === pageName);
        this.currentPage.tag.classList.remove('private');
        this.currentPage.tag.classList.add('public')
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
    edit(fileName=this.currentPage.name+'.'+this.currentPage.type){
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