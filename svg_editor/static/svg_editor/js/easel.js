class Easel extends BaseFactory {
    usedPages;
    currentPage;
    constructor(fileName, fileType) {
        super(document.getElementById('easel'));
        this.usedPages = [];
        this.createPage(fileName, fileType);
    }
    createPage(fileName, fileType) {
        let newPage = new Page(fileName, fileType);
        this.usedPages.push(newPage);
        this.turnTo(newPage.getName());
        return newPage;
    }
    remove(pageName) {
        let indexToDelete = this.usedPages.findIndex(page => page.getName() === pageName),
            deletedPage = this.usedPages[indexToDelete];
        this.usedPages.splice(indexToDelete, 1);
        deletedPage.removeNode();
        if (this.usedPages.length > 0 && pageName === this.currentPage.getName()) {
            this.turnTo(this.usedPages[0].getName());
        } else if (this.usedPages.length <= 0) {
            let a = document.createElement("a");
            a.href = "/account";
            a.click();
        }
    }
    turnTo(pageName) {
        let newPage = this.usedPages.find(page => page.getName() === pageName);
        if (this.currentPage) {
            this.factoryContainer.replaceChild(newPage.getWorkplace(), this.currentPage.getWorkplace());
            this.currentPage.deactivateNode();
        } else {
            this.factoryContainer.appendChild(newPage.getWorkplace());
        }
        newPage.activateNode();
        this.currentPage = newPage;
        this.currentPage.replaceControls();
        this.currentPage.pie.update();
    }
    save(saveAs = false, fileName = this.currentPage.getFileName(), type) {
        $.ajax({
            data: {
                file_name: fileName,
                save_as: saveAs,
                svg: this.currentPage.getPicture(type),
                type: type,
            },
            type: 'POST',
            url: saveURL,
            success: function (response) {
                alert('Поздравляем! Файл с названием ' + response.file_name + ' успешно сохранен!');
            },
            error: function (response) {
                alert(response.responseJSON.errors);
            }
        });
    }
    edit(fileName = this.currentPage.getName()) {
        $.ajax({
            url: loadURL,
            type: 'GET',
            data: {
                file_name: fileName,
            },
            success: function (response) {
                let fileType = response.file_name.split('.').pop().toLowerCase();
                if (fileType == 'svg') {
                    easel.openAsSvg(response.svg, response.file_name);
                } else if (fileType == 'yml') {
                    easel.openAsProject(response.yml, response.file_name);
                }
            },
            error: function (response) {
                alert(response.responseJSON.errors);
            }
        });
    }

    openAsSvg(svgString, fileName) {
        let page = this.createPage(fileName, 'svg')
        let oParser = new DOMParser();
        let oDOM = oParser.parseFromString(svgString, "application/xml");
        page.pie.createNewLayer(oDOM.documentElement, 'base');
    }

    openAsProject(yml, fileName) {
        let page = this.createPage(fileName, 'yml');
        let svgLayer;
        const taskStack = [];
        let i = 0;
        for (let layer of yml.layers) {
            svgLayer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svgLayer.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            svgLayer.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
            svgLayer.setAttribute('version', '1.1');
            taskStack.push({ node: svgLayer, obj: layer });

            while (taskStack.length > 0) {
                const task = taskStack.pop();
                // console.log(task.obj, task.node);
                for (let attr of task.obj.attributes) {
                    let attrName = Object.keys(attr)[0];
                    task.node.setAttribute(attrName, attr[attrName]);
                }
                for (let child of task.obj.outers) {
                    if (typeof (child) != 'object') {
                        task.node.textContent = child;
                        continue;
                    }

                    let childNode;

                    if (Object.keys(child).length != 1) {
                        childNode = document.createElement('svg');
                        task.node.append(childNode);
                        taskStack.push({ node: childNode, obj: child });
                    } else {
                        let childName = Object.keys(child)[0];
                        childNode = document.createElement(childName);
                        task.node.append(childNode);
                        taskStack.push({ node: childNode, obj: child[childName] });
                    }

                }
            }
            let oParser = new DOMParser();
            let oDOM = oParser.parseFromString(svgLayer.outerHTML, "application/xml");
            svgLayer = oDOM.documentElement;
            let remote = page.pie.createLayer(svgLayer, svgLayer.getAttribute("name"));
            page.pie.addLayer(remote,'end');
            // Парсинг происходит по сути дважды, иначе добавленные слои почему-то не отображаются на странице
        }
    }

}