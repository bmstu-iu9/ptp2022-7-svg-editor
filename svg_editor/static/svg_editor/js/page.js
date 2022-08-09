class Page{
    name;
    tag;
    type;
    constructor(name, type) {
        this.name = name;
        this.type = type;
        let itsSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        itsSvg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
        itsSvg.setAttribute('version','1.1');
        itsSvg.setAttribute("id", "workspace");
        itsSvg.setAttribute("name", name);
        itsSvg.setAttribute('version','1.1');
        document.getElementById('easel').appendChild(itsSvg);
        this.tag = itsSvg;
    }
}