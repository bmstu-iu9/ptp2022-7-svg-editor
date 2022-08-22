class BaseNode{
    tag;
    container;
    name;
    constructor(name, container) {
        this.name = name;
        this.tag = $(document.createElement('div'));
        this.container = container;
        this.container.append(this.tag);
    }
    getName(){
        return this.name;
    }
    deactivate(){

    }
    activate(){

    }
}