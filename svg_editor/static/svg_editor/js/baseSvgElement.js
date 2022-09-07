/**
 * @author Kabane-UN
 **/

class BaseSvgElement{
    tag;
    name;
    constructor(name) {
        this.tag = $(document.createElementNS("http://www.w3.org/2000/svg", "svg"));
        this.tag.attr('xmlns:xlink', 'http://www.w3.org/1999/xlink');
        this.tag.attr('version', '1.1');
        this.name = name;
    }
    getName(){
        return this.name;
    }
    getWorkplace(){
        return this.tag;
    }
}