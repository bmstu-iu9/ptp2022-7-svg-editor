class Pie {
	layersPanel;
	controlPanel;
	currentLayer;

	constructor(layersPanel, controlPanel) {
		this.layersPanel = layersPanel;
		this.controlPanel = controlPanel;
		this.currentLayer = null;
	}

	getCurrentLayer() { return this.currentLayer };

	createNewLayer(baseElement, layerName = 'layer') {
		let remote = new LayerRemote(new Layer(baseElement, layerName));
		this.addLayer(remote);
		this.selectLayer(remote);
	}

	createLayer(baseElement, layerName = 'layer') {
		let remote = new LayerRemote(new Layer(baseElement, layerName));
		return remote;
	}

	deleteCurrentLayer() {
		let nextLayer = this.currentLayer.getPrevious();
		this.currentLayer.remove();
		if (nextLayer != null) {
			this.selectLayer(nextLayer);
		}
	}

	selectLayer(remote) {
		if (this.currentLayer !== null) {
			this.currentLayer.switch();
		}
		remote.switch();

		this.currentLayer = remote;

		let opacity = remote.getOpacity();
		opacitySlider.value = opacity == null ? 1 : opacity;
		this.update();
	}

	addLayer(remote, place) {
		remote.setLayerSize(this.layersPanel.clientWidth, this.layersPanel.clientHeight);
		if (place == 'end') {
			this.layersPanel.prepend(remote.getLayerNode());
			this.controlPanel.append(remote.getNote());
		} else {
			this.layersPanel.append(remote.getLayerNode());
			this.controlPanel.prepend(remote.getNote());
		}
	}

	changeCurrentLayerOpacity() {
		this.currentLayer.setOpacity(opacitySlider.value);
	}

	getControlPanel() {
		return this.controlPanel;
	}

	update() {
		if (this.currentLayer == null) {
			layerUpdate(undefined);
			return;
		}
		layerUpdate(this.currentLayer.getLayer());
	}

	isDrawAllowed() {
		return !(this.currentLayer == null || !this.currentLayer.isEnabled());
	}

	currentLayerUp() {
		if (this.currentLayer == null) { return; }
		let prev = this.currentLayer.getNext();
		if (prev == null) { return; }
		prev.after(this.currentLayer);
	}

	currentLayerDown() {
		if (this.currentLayer == null) { return; }
		let next = this.currentLayer.getPrevious();
		if (next == null) { return; }
		next.before(this.currentLayer);
	}

	currentLayerCopy() {
		let copy = this.currentLayer.clone();
		this.currentLayer.after(copy);
		this.selectLayer(copy);
	}

	mergeCurrentWithPrevious() {
		let current = this.currentLayer;
		let previous = current.getPrevious();
		if (current == null || previous == null) return;
		let union = new LayerRemote(new Layer(undefined, current.getName()));
		current.after(union);
		union.getLayerNode().append(previous.getLayerNode());
		union.getLayerNode().append(current.getLayerNode());
		current.clearAtts();
		previous.clearAtts();
		previous.removeRemote();
		current.removeRemote();
		this.selectLayer(union);
	}

	mergeVisible() {
		let visibleLayers = [];
		for (let node of this.controlPanel.childNodes) {
			let remote = node.layerRemote;
			if (!remote.isEnabled()) continue;
			remote.clearAtts();
			visibleLayers.push(remote);
		}
		if (visibleLayers.length < 2) return;
		let lastVisible = visibleLayers[visibleLayers.length - 1];
		let union = new LayerRemote(new Layer(undefined, lastVisible.getName()));
		lastVisible.after(union);

		for (let layer of visibleLayers) {
			union.getLayerNode().prepend(layer.getLayerNode());
			layer.removeRemote();
		}
		this.selectLayer(union);
	}

	createFromVisible() {
		let visibleLayers = [];
		for (let node of this.controlPanel.childNodes) {
			let remote = node.layerRemote.clone();
			if (!remote.isEnabled()) continue;
			remote.clearAtts();
			visibleLayers.push(remote);
		}
		if (visibleLayers.length < 1) return;
		let lastVisible = visibleLayers[visibleLayers.length - 1];
		let union = new LayerRemote(new Layer(undefined, "Visible"));

		for (let layer of visibleLayers) {
			union.getLayerNode().prepend(layer.getLayerNode());
			layer.removeRemote();
		}
		this.addLayer(union);
	}

}