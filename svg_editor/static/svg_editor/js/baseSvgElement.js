class BaseSvgElement{
    tag;
    name;
    constructor(name) {
        this.tag = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.tag.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
        this.tag.setAttribute('version', '1.1');
        this.name = name;
    }
    getName(){
        return this.name;
    }
    getWorkplace(){
        return this.tag;
    }
}