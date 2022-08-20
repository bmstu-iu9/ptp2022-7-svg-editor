class Page extends BaseSvgElement{
    fileName;
    fileType;
    node;
    pie;

    constructor(name, type) {
        super(name + "." + type);
        this.fileName = name;
        this.fileType = type;
        this.tag.setAttribute('id','workspace');
        this.node = new PageNode(this.name);
        let controlPanel = document.createElement('div');
        controlPanel.setAttribute('id','layers-panel-choosing');
        this.pie = new Pie(this.tag, controlPanel);
    }

    replaceControls(){
        $('#layers-panel-choosing').replaceWith(this.pie.getControlPanel());
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