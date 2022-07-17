'use strict'

const opacitySlider = document.querySelector('#opacity-slider');
const workspace = document.querySelector('#workspace');
const layerControlPanel = document.querySelector('#layer-control-panel');

const layerNote = function() {
    let note = document.createElement('div');
    note.setAttribute('class','layer_note');
    note.insertAdjacentHTML('beforeend',`
    <button onclick="enableVisibility(this)"></button>
    <label style="margin: auto"></label>`);
    return note;
}();

let currentLayer = {
    layer: null,
    note: null,
};

let i = 0;

function createLayer(){
    let draw = SVG().addTo(workspace).size(workspace.clientWidth, workspace.clientHeight);
    draw.node.setAttribute('class', 'layer');
    currentLayer.layer = draw.node;
    
    opacitySlider.value = 1;
    
    let newNote = layerNote.cloneNode(true); 
    newNote.lastElementChild.textContent = 'Layer '+i++;
    layerControlPanel.append(newNote);
    currentLayer.note = newNote;
}

function changeOpacity() {
    currentLayer.layer.setAttribute('opacity', opacitySlider.value);
}

function deleteLayer() {
    if (currentLayer.layer == null) return;
    currentLayer.layer.remove();
    currentLayer.layer = null;
    currentLayer.note.remove();
    currentLayer.note = null;
}

function drawPlease() {
    if (currentLayer.layer == null) return;
    var a_x, a_y, b_x, b_y, c_x, c_y;
    a_x = document.getElementById('coord_a_x').value;
    a_y = document.getElementById('coord_a_y').value;
    b_x = document.getElementById('coord_b_x').value;
    b_y = document.getElementById('coord_b_y').value;
    c_x = document.getElementById('coord_c_x').value;
    c_y = document.getElementById('coord_c_y').value;
    SVG(currentLayer.layer).polygon([[a_x, a_y], [b_x, b_y], [c_x, c_y]]).fill(document.getElementById("color").value).stroke({ width: 1 })
}

function clearPlease() {
    if (currentLayer.layer == null) return;
    SVG(currentLayer.layer).clear();
}

$(document).ready(function () {
    $('#saveButton').click(function () {
        $.ajax({
            data: {
                svg: draw.svg(),
                file_name: document.getElementById('file_name').value,
                csrfmiddlewaretoken: '{{ csrf_token}}'
            },
            type: 'POST',
            url: "{% url 'files_save' %}",
            success: function (response) {
                alert('Поздравляем! Файл с названием ' + response.file_name + ' успешно создан!');
            },
            error: function (response) {
                alert(response.responseJSON.errors);
                console.log(response.responseJSON.errors)
            }
        });
        return false;
    });
})