class Easel extends BaseFactory{
    usedPages;
    currentPage;
    constructor(fileName, fileType) {
        super(document.getElementById('easel'));
        this.usedPages = [];
        this.createPage(fileName, fileType);
    }
    createPage(fileName, fileType){
        let newPage = new Page(fileName, fileType);
        this.usedPages.push(newPage);
        this.turnTo(newPage.getName());
    }
    remove(pageName){
       let indexToDelete = this.usedPages.findIndex(page => page.getName() === pageName),
           deletedPage = this.usedPages[indexToDelete];
       this.usedPages.splice(indexToDelete, 1);
       deletedPage.removeNode();
       if (this.usedPages.length > 0 && pageName === this.currentPage.getName()) {
           this.turnTo(this.usedPages[0].getName());
       } else if (this.usedPages.length <= 0) {
           let a = document.createElement("a");
           a.href = "/account";
           a.click();
       }
    }
    turnTo(pageName){
        let newPage = this.usedPages.find(page => page.getName() === pageName);
        if (this.currentPage){
            this.factoryContainer.replaceChild(newPage.getWorkplace(), this.currentPage.getWorkplace());
            this.currentPage.deactivateNode();
        } else {
            this.factoryContainer.appendChild(newPage.getWorkplace());
        }
        newPage.activateNode();
        this.currentPage = newPage;
    }
    save(saveAs=false, fileName=this.currentPage.getFileName(), type=this.currentPage.getFileType()){
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
    edit(fileName=this.currentPage.getName()){
        $.ajax({
            url: loadURL,
            type: 'GET',
            data: {
                file_name: fileName,
            },
            success: function (response) {
                if (response.file_name.split('.').pop().toLowerCase() === 'svg' && response.svg) {
                    openAsSvg(response.svg);
                } else if (!$.isEmptyObject(response.yml)) {
                    openAsProject(response.yml);
                }
            },
            error: function (response) {
                alert(response.responseJSON.errors);
            }
        });
    }
}