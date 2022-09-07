class LayerRemote {
	htmlNode;
	relatedLayer;

	constructor(relatedLayer) {
		this.htmlNode = document.createElement('div');
		this.htmlNode.insertAdjacentHTML('beforeend', `
		<div class="note-top">
		<input type="checkbox" checked/>
		<label>${relatedLayer.name}</label>
		</div>
		<div class="note-bottom"></div>
		`);
		this.htmlNode.classList.add('layer-note');
		this.htmlNode.setAttribute('draggable', 'true');

		this.htmlNode.layerRemote = this;
		this.relatedLayer = relatedLayer;
	}

	clearAtts() {
		this.relatedLayer.node.removeAttribute("xmlns:svgjs");
		this.relatedLayer.node.removeAttribute("xmlns:xlink");
		this.relatedLayer.node.removeAttribute("xmlns");
		this.relatedLayer.node.removeAttribute("version");
		this.relatedLayer.node.removeAttribute("class");
		this.relatedLayer.node.removeAttribute("display");
	}

	removeRemote() {
		this.htmlNode.remove();
	}

	remove() {
		if (this.relatedLayer == null) return;
		this.relatedLayer.remove();
		this.htmlNode.remove();
		historyСorrection();
	}

	setLayerSize(width, height) {
		this.relatedLayer.node.setAttribute("width", width);
		this.relatedLayer.node.setAttribute("height", height);
	}

	getLayerNode() {
		return this.relatedLayer.node;
	}

	getLayer() {
		return this.relatedLayer;
	}

	getNote() {
		return this.htmlNode;
	}

	getName() {
		return this.relatedLayer.name;
	}

	getNext() {
		let sibling = this.htmlNode.previousElementSibling;
		return (sibling == null) ? null : sibling.layerRemote;
	}

	getPrevious() {
		let sibling = this.htmlNode.nextElementSibling;
		return (sibling == null) ? null : sibling.layerRemote;
	}

	switch() {
		$(this.htmlNode).toggleClass('active-note');
	}

	getOpacity() {
		return this.relatedLayer.node.getAttribute('opacity');
	}

	setOpacity(num) {
		this.relatedLayer.node.setAttribute('opacity', num);
	}

	isEnabled() {
		return !$(this.relatedLayer.node).hasClass('non-displayable');
	}

	after(layer) {
		this.relatedLayer.node.after(layer.getLayerNode());
		this.htmlNode.before(layer.getNote());
	}

	before(layer) {
		this.relatedLayer.node.before(layer.getLayerNode());
		this.htmlNode.after(layer.getNote());
	}

	clone() {
		return new LayerRemote(this.relatedLayer.clone());
	}

	coverTop() {
		this.htmlNode.querySelector('input').classList.add('unactive');
		this.htmlNode.classList.add('hovered-top');
	}

	uncoverTop() {
		this.htmlNode.querySelector('input').classList.remove('unactive');
		this.htmlNode.classList.remove('hovered-top');
	}

	coverBottom() {
		this.htmlNode.querySelector('input').classList.add('unactive');
		this.htmlNode.classList.add('hovered-bottom');
	}

	uncoverBottom() {
		this.htmlNode.querySelector('input').classList.remove('unactive');
		this.htmlNode.classList.remove('hovered-bottom');
	}

	switchDisplay() {
		$(this.relatedLayer.node).toggleClass('non-displayable');
	}

	getSvg() {
		let svg = this.relatedLayer.clone().node;
		svg.removeAttribute("xmlns:svgjs");
		svg.removeAttribute("xmlns:xlink");
		svg.removeAttribute("xmlns");
		svg.removeAttribute("version");
		svg.removeAttribute("class");
		return svg;
	}

	getLayerSvg() {
		let layer = this.relatedLayer.clone().node;
		layer.removeAttribute("xmlns:svgjs");
		layer.removeAttribute("xmlns:xlink");
		layer.removeAttribute("xmlns");
		layer.removeAttribute("version");
		layer.setAttribute('name', this.getName());
		return layer;
	}
}