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
    deactivateNode(){
        this.node.deactivate();
    }
}