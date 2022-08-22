class PageNode extends BaseNode{
    constructor(name) {
        super(name, $('#pages-choosing'));
        this.tag.addClass("page-node");
        let label = $(document.createElement('label'));
        label.text(this.name)
        this.tag.append(label);
        let deletePageButton = $(document.createElement('div'));
        deletePageButton.addClass("delete-page-button");
        this.tag.append(deletePageButton);
    }
    deactivate(){
        this.tag.removeClass('active');
    }
    activate(){
        this.tag.addClass('active');
    }
    remove(){
        this.tag.remove();
    }
}