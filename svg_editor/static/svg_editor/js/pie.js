class Pie extends BaseFactory {
	currentLayer = null;
	layerNumber = 0;

	constructor(factoryContainer) {
		super(factoryContainer);
	}

	get currentLayer() {
		return this.currentLayer;
	}

	createLayer(baseElement, layerName) {
		return new LayerNote(new Layer(baseElement, layerName));
	}
}