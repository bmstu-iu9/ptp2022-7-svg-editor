$(document).ready(function () {
	$.ajaxSetup({
		headers: { "X-CSRFToken": token }
	});
	$('#saveButton').click(function () {
		let svg_data = `<svg xmlns="http://www.w3.org/2000/svg"
			version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink"
			width="${workspace.clientHeight}" height="${workspace.clientWidth}">\n`
		for (let layer of document.getElementById('workspace').childNodes) {
			// svg_data += `	<svg class="layer" height="${layer.getAttribute('height')}" width="${layer.getAttribute('width')}" viewBox="${layer.getAttribute('viewBox')}">` + e.innerHTML + '</svg>\n'
			svg_data += `	<svg height="${layer.getAttribute('height')}" width="${layer.getAttribute('width')}" opacity="${layer.getAttribute('opacity')}" viewBox="${layer.getAttribute('viewBox')}">\n`;
			for (let elem of layer.childNodes) {
				svg_data += `		${elem.outerHTML}\n`
			}
			svg_data += '	</svg>\n'
		}
		svg_data += '</svg>\n'
		console.log(svg_data)
		$.ajax({
			data: {
				svg: svg_data,
				file_name: document.getElementById('file_name').value,
			},
			type: 'POST',
			url: saveURL,
			success: function (response) {
				alert('Поздравляем! Файл с названием ' + response.file_name + ' успешно создан!');
			},
			error: function (response) {
				console.log(response);
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
			url: uploadURL,
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
			url: downloadURL,
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

	$('#target').click(function () {
		// создаем AJAX-вызов
		$.ajax({ // получаяем данные формы
			// тут используется шаблонизатор
			url: reloadURL,
			// если успешно, то
			success: function (response) {
				console.log(response.svgs)
				document.getElementById('text').innerHTML = "List of the saved files:";
				let list = document.querySelector('.list_svg');
				list.innerHTML = "";
				let key;
				for (key in response.svgs) {
					list.innerHTML += `<input class="inner_list_svg" type='radio' name='selected_file'>${response.svgs[key]}</input>`
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

	$("#editButton").click(function () {
		$.ajax({
			url: downloadURL,
			type: 'GET',
			data: {
				file_name: document.getElementById('download_file_name').value,
			},
			success: function (response) {
				console.log(response);
				let oParser = new DOMParser();
				let oDOM = oParser.parseFromString(response,"application/xml");
				createLayer(oDOM.documentElement);
			},
			error: function (response) {
				alert(response.responseJSON.errors);
				console.log(response.responseJSON.errors);
			},
		})
	})
})