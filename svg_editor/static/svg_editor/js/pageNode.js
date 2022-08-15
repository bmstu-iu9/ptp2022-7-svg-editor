class PageNode extends BaseNode{
    constructor(name) {
        super(name, document.getElementById('pages-choosing'));
        this.tag.setAttribute("class", "page-node");
        this.tag.setAttribute("draggable", "true");
        let label = document.createElement('label');
        label.innerText = this.name;
        this.tag.appendChild(label);
        let deletePageButton = document.createElement('div');
        deletePageButton.setAttribute("class", "delete-page-button");
        this.tag.appendChild(deletePageButton);
    }
    deactivate(){
        this.tag.classList.remove('active');
    }
    activate(){
        this.tag.classList.add('active');
    }
    remove(){
        this.container.removeChild(this.tag);
    }
}