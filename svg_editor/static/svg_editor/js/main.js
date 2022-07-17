'use strict'

const sliders = document.querySelector('.sliders')
const div = document.querySelector('div');
let currentLayer;

function createLayer(){
    let draw = SVG().addTo(div).size(div.clientWidth, div.clientHeight);
    draw.node.setAttribute('class', 'layer')
    currentLayer = draw.node;
}

function changeOpacity(slider) {
    currentLayer.setAttribute('opacity', slider.value)
}

function deleteLayer() {
    currentLayer.remove();
    currentLayer = div.firstElementChild;
}

function drawPlease() {
    if (currentLayer == null || currentLayer == undefined) return;
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
    SVG(currentLayer).clear();
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