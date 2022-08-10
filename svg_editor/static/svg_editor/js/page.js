class Page{
    name;
    tag;
    type;
    node;
    fullName;
    constructor(name, type) {
        this.name = name;
        this.type = type;
        this.fullName = name + "." + type;
        let itsSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        itsSvg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
        itsSvg.setAttribute('version','1.1');
        itsSvg.setAttribute("id", "workspace");
        itsSvg.setAttribute("name", name);
        itsSvg.setAttribute('version','1.1');
        this.tag = itsSvg;
        let choosingPanel = document.getElementById('pages-choosing');
        this.node = document.createElement('div');
        this.node.setAttribute("class", "page-node");
        this.node.setAttribute("draggable", "true");
        let label = document.createElement('label');
        label.innerText = this.name+"."+this.type;
        this.node.appendChild(label);
        choosingPanel.appendChild(this.node);
    }
}