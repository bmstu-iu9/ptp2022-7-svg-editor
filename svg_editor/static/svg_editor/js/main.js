$(document).ready(function () {
	$.ajaxSetup({
		headers: { "X-CSRFToken": '{{csrf_token}}' }
	});
	$('#saveButton').click(function () {
		let svg_data = "<svg xmlns=\"http://www.w3.org/2000/svg\"" +
			" version=\"1.1\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" " +
			"xmlns:svgjs=\"http://svgjs.com/svgjs\" width=\"" + workspace.clientWidth + "\" height=\"" + workspace.clientHeight + "\" class=\"layer\">"
		for (i = 0; i < document.getElementsByClassName('layer').length; i++) {
			svg_data += '<g>' + document.getElementsByClassName('layer')[i].innerHTML + '</g>'
		}
		svg_data += '</svg>'
		console.log(svg_data)
		$.ajax({
			data: {
				svg: svg_data,
				file_name: document.getElementById('file_name').value,
			},
			type: 'POST',
			url: "{% url 'files_save' %}",
			success: function (response) {
				alert('Поздравляем! Файл с названием ' + response.file_name + ' успешно создан!');
			},
			error: function (response) {
				alert(response.responseJSON.errors);
				console.log(response.responseJSON.errors);
			}
		});
		return false;
	});
	$('#file').change(function () {
		let data = new FormData();
		data.append('file', $("#file")[0].files[0]);
		$.ajax({
			data: data,
			type: 'POST',
			url: "{% url 'files_upload' %}",
			processData: false,
			cache: false,
			contentType: false,
			success: function (response) {
				alert('Поздравляем! Файл с названием ' + response.file_name + ' успешно загружен!');
			},
			error: function (response) {
				alert(response.responseJSON.errors);
				console.log(response.responseJSON.errors);
			}
		});
		return false;
	});
	$('#downloadButton').click(function () {
		$.ajax({
			url: "{% url 'files_download' %}",
			type: 'GET',
			data: {
				file_name: document.getElementById('download_file_name').value
			},
			success: function (response) {
				let a = document.createElement("a");
				a.href = "/files_download?file_name=" + document.getElementById('download_file_name').value;
				a.click();
			},
			error: function (response) {
				alert(response.responseJSON.errors);
				console.log(response.responseJSON.errors);
			},
		})
	});
})

$(document).ready(function () {
	$('#target').click(function () {
		// создаем AJAX-вызов
		$.ajax({ // получаяем данные формы
			// тут используется шаблонизатор
			url: "{% url 'files_view' %}",
			// если успешно, то
			success: function (response) {
				console.log(response.svgs)
				document.getElementById('text').innerHTML = "List of the saved files:";
				let list = document.querySelector('.list_svg');
				list.innerHTML = "";
				let key;
				for (key in response.svgs) {
					list.innerHTML += `<li class="inner_list_svg">${response.svgs[key]}</li>`
				}
			},
			// если ошибка, то
			error: function (response) {
				// предупредим об ошибке
				alert(response.responseJSON.errors);
				console.log(response.responseJSON.errors)
			}
		});
		return false;
	});
})