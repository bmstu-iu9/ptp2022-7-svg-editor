'use strict'

const opacitySlider = document.querySelector('#opacity-slider');
const workspace = document.querySelector('#workspace');
const layerControlPanel = document.querySelector('#layer-control-panel');

const layerNote = function() {
    let note = document.createElement('div');
    note.setAttribute('class','layer_note');
    note.setAttribute('onclick','selectLayer(this)');
    note.insertAdjacentHTML('beforeend',`
    <input onclick="checkVisibility(this,event)" type="checkbox" checked/>
    <label style="margin: auto; -webkit-user-select: none"></label>`);
    return note;
}();

let currentLayer = null;
let i = 0;

function createLayer(){
    let draw = SVG().addTo(workspace).size(workspace.clientWidth, workspace.clientHeight);
    let newLayer = draw.node;
    newLayer.setAttribute('class', 'layer');
    
    opacitySlider.value = 1;
    
    let newNote = layerNote.cloneNode(true);
    newNote.setAttribute('checked',false);
    newNote.lastElementChild.textContent = 'Layer '+i++;
    layerControlPanel.prepend(newNote);

    newLayer.note = newNote;
    newNote.layer = newLayer;
    selectLayer(newNote);
}

function changeOpacity() {
    currentLayer.setAttribute('opacity', opacitySlider.value);
}

function checkVisibility(checkbox,ev) {
    ev.stopPropagation();
    let layer = checkbox.parentElement.layer;
    if (checkbox.checked) {
        layer.setAttribute('display', '');
        return;
    }
    layer.setAttribute('display', 'none');
}

function selectLayer(note) {
    if (currentLayer !== null) {
        currentLayer.note.setAttribute('checked','');
    }
    note.setAttribute('checked',note.getAttribute('checked') === 'true' ? false : true);
    currentLayer = note.layer;
}

function deleteLayer() {
    if (currentLayer === null) return;
    currentLayer.remove();
    currentLayer.note.remove();
    currentLayer = null;
}

function drawPlease() {
    if (currentLayer === null) return;
    var a_x, a_y, b_x, b_y, c_x, c_y;
    a_x = document.getElementById('coord_a_x').value;
    a_y = document.getElementById('coord_a_y').value;
    b_x = document.getElementById('coord_b_x').value;
    b_y = document.getElementById('coord_b_y').value;
    c_x = document.getElementById('coord_c_x').value;
    c_y = document.getElementById('coord_c_y').value;
    SVG(currentLayer).polygon([[a_x, a_y], [b_x, b_y], [c_x, c_y]]).fill(document.getElementById("color").value).stroke({ width: 1 })
}

function clearPlease() {
    if (currentLayer === null) return;
    SVG(currentLayer).clear();
}

/*$(document).ready(function () {
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
})*/