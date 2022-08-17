class LayerNote extends HTMLDivElement{
	layer;

	constructor(relatedLayer) {
		super();
		this.insertAdjacentHTML('beforeend', `
		<div class="note_top">
		<input type="checkbox" checked/>
		<label>${relatedLayer.layerName}</label>
		</div>
		<div class="note_bottom"></div>
		`);
		this.classList.add('layer_note');
		this.setAttribute('draggable', 'true');

		this.layer = relatedLayer;
	}

	get layer() {
		return this.layer;
	}
}