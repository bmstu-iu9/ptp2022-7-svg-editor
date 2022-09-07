/**
 * @author Kabane-UN
 **/

// The class of the easel on which the canvases are placed
class Easel extends BaseFactory {
    usedPages;
    currentPage;
    constructor(fileName, fileType) {
        super($('#easel'));
        this.usedPages = [];
        this.edit(file_name, type);
    }
    getCurrentPage() {
        return this.currentPage;
    }
    // Create a new page
    createPage(fileName, fileType) {
        let newPage = new Page(fileName, fileType);
        this.usedPages.push(newPage);
        this.turnTo(newPage.getName());
        return newPage;
    }
    // Remove page with this name
    remove(pageName, redirect = true) {
        let indexToDelete = this.usedPages.findIndex(page => page.getName() === pageName);
        if (indexToDelete !== -1) {
            let deletedPage = this.usedPages[indexToDelete];
            this.usedPages.splice(indexToDelete, 1);
            deletedPage.removeNode();
            if (this.usedPages.length > 0 && pageName === this.currentPage.getName()) {
                this.turnTo(this.usedPages[0].getName());
            } else if (this.usedPages.length <= 0 && redirect) {
                let a = document.createElement("a");
                a.href = "/account";
                a.click();
            }
        }
    }
    // Turn to page with this name
    turnTo(pageName) {
        let newPage = this.usedPages.find(page => page.getName() === pageName);
        if (this.currentPage) {
            this.currentPage.getWorkplace().replaceWith(newPage.getWorkplace());
            this.currentPage.deactivateNode();
        } else {
            this.factoryContainer.append(newPage.getWorkplace());
        }
        newPage.activateNode();
        this.currentPage = newPage;
        this.currentPage.replaceControls();
        this.currentPage.pie.update();
    }
    // Request server to save chosen page
    save(saveAs = false, fileName = this.currentPage.getFileName(), type = this.currentPage.getFileType()) {
        $.ajax({
            data: {
                file_name: fileName,
                save_as: saveAs,
                svg: this.currentPage.getPicture(type),
                type: type,
            },
            type: 'POST',
            url: saveURL
        });
    }
    // Get load from server svg with this name
    edit(fileName = this.currentPage.getName(), fileType) {
        $.ajax({
            url: loadURL,
            type: 'GET',
            data: {
                file_name: fileName + '.' + fileType,
            },
            success: function (response) {
                if (fileType == 'svg') {
                    easel.openAsSvg(response.svg, fileName);
                } else if (fileType == 'yml') {
                    easel.openAsProject(response.yml, fileName);
                }
            }
        });
    }

    openAsSvg(svgString, fileName) {
        let page = this.createPage(fileName, 'svg')
        if (svgString == '') {
            page.pie.createNewLayer(undefined, 'base');
            return;
        }
        let oParser = new DOMParser();
        let oDOM = oParser.parseFromString(svgString, "application/xml");
        if (oDOM.documentElement.tagName == 'parsererror') {
            alert('parsererror');
            return;
        }
        page.pie.createNewLayer(oDOM.documentElement, 'base');
    }

    openAsProject(yml, fileName) {
        let page = this.createPage(fileName, 'yml');
        if ($.isEmptyObject(yml)) {
            page.pie.createNewLayer(undefined, 'base');
            return;
        }
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
            page.pie.addLayer(remote, 'end');
            // Парсинг происходит по сути дважды, иначе добавленные слои почему-то не отображаются на странице
        }
    }

}