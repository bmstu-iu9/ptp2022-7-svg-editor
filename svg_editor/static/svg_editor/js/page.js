class Page extends BaseSvgElement{
    fileName;
    fileType;
    node;
    constructor(name, type) {
        super(name + "." + type);
        this.fileName = name;
        this.fileType = type;
        this.tag.setAttribute('id','workspace');
        this.node = new PageNode(this.name);
    }
    removeNode(){
        this.node.remove();
    }
    deactivateNode(){
        this.node.deactivate();
    }
    getFileName(){
        return this.fileName;
    }
    getFileType(){
        return this.fileType;
    }
    activateNode(){
        this.node.activate();
    }

}