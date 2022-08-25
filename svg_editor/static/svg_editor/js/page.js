class Page extends BaseSvgElement {
    fileName;
    fileType;
    node;
    pie;

    constructor(name, type) {
        super(name + "." + type);
        this.fileName = name;
        this.fileType = type;
        this.tag.setAttribute('id', 'workspace');
        this.node = new PageNode(this.name);
        let controlPanel = document.createElement('div');
        controlPanel.setAttribute('id', 'layers-panel-choosing');
        this.pie = new Pie(this.tag, controlPanel);
    }

    replaceControls() {
        $('#layers-panel-choosing').replaceWith(this.pie.getControlPanel());
    }

    removeNode() {
        this.node.remove();
    }
    deactivateNode() {
        this.node.deactivate();
    }
    getFileName() {
        return this.fileName;
    }
    getFileType() {
        return this.fileType;
    }
    activateNode() {
        this.node.activate();
    }

    getPicture(format) {
        let svg = document.createElement("svg");
        svg.setAttribute('xmlns',"http://www.w3.org/2000/svg");
        svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
        svg.setAttribute('version', '1.1');
        if (format == "svg") {
            for (let note of this.pie.getControlPanel().childNodes) {
                let remote = note.layerRemote;
                if (!remote.isEnabled()) continue;
                svg.append(remote.getSvg());
            }
        } else {
            for (let note of this.pie.getControlPanel().childNodes) {
                let remote = note.layerRemote;
                svg.append(remote.getLayerSvg())
            }
        }
        return svg.outerHTML;
    }
}