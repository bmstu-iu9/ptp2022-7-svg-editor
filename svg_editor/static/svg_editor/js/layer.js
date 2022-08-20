class Layer extends SVG.Svg{
	name;

	constructor(baseElement, layerName) {
		super(baseElement);
		this.name = layerName;
		this.node.classList.add("layer");
	}

	clone() {
		return new Layer(this.node.cloneNode(true),this.name);
	}
}