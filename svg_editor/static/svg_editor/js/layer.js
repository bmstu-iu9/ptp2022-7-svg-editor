class Layer extends SVG.Svg{
	name;

	constructor(baseElement, layerName) {
		if (baseElement === undefined) {
			super();
		} else {
			super(baseElement);
		}
		this.name = layerName;
		this.node.classList.add("layer");
	}

	get name() {
		return this.name;
	}

	get svgJS() {
		return this.svgJsElement;
	}
}