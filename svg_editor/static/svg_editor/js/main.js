let currentFileName = null;  

$(document).ready(function () {

	$.ajaxSetup({
		headers: { "X-CSRFToken": token }
	});

	$('#saveFileButton').click(function () {
		$.ajax({
			data: {
				file_name: document.getElementById('fileNameInput').value,
				save_as: false,
				svg: getPictureAsSvg(),
				type: document.getElementById('save_file_type').value,
			},
			type: 'POST',
			url: saveURL,
			success: function (response) {
				alert('Поздравляем! Файл с названием ' + response.file_name + ' успешно сохранен!');
				document.getElementById('fileNameInput').value = response.file_name.slice(0,-4);
			},
			error: function (response) {
				alert(response.responseJSON.errors);
				console.log(response.responseJSON.errors);
			}
		});
		return false;
	});

	$('#saveAsFileButton').click(function () {
		$.ajax({
			data: {
				file_name: document.getElementById('fileNameInput').value,
				save_as: true,
				svg: getPictureAsSvg(),
				type: document.getElementById('save_file_type').value,
			},
			type: 'POST',
			url: saveURL,
			success: function (response) {
				alert('Поздравляем! Файл с названием ' + response.file_name + ' успешно создан!');
				document.getElementById('fileNameInput').value = response.file_name.slice(0,-4);
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
				file_name: currentFileName
			},
			success: function (response) {
				let a = document.createElement("a");
				a.href = "/files_download?file_name=" + currentFileName;
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
		$.ajax({ // получаем данные формы
			// тут используется шаблонизатор
			url: viewURL,
			// если успешно, то
			success: function (response) {
				document.getElementById('text').innerHTML = "List of the saved files:";
				let list = document.querySelector('#list_svg');
				list.innerHTML = "";
				let key;
				for (key in response.svgs) {
					list.innerHTML += `<input class="inner_list_svg" type='radio' name='selected_file'>${response.svgs[key]}`
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

	$("#deleteButton").click(function () {
		$.ajax({
			url: deleteURL,
			type: 'POST',
			data: {
				file_name: currentFileName,
				all: document.getElementById("deleteAll").checked,
			},
			success: function (response) {
				alert('Поздравляем! ' + response.num_of_del + ' файл(ов) успешно удалено!');
			},
			error: function (response) {
				alert(response.responseJSON.errors);
				console.log(response.responseJSON.errors);
			},
		})
	})

	$("#editButton").click(function () {
		$.ajax({
			url: loadURL,
			type: 'GET',
			data: {
				file_name: currentFileName,
			},
			success: function (response) {
				if (response.file_name.split('.').pop().toLowerCase() === 'svg') {
					openAsSvg(response.svg);
				} else {
					console.log(response.yml);
				}

			},
			error: function (response) {
				alert(response.responseJSON.errors);
				console.log(response.responseJSON.errors);
			},
		})
	})

	$('#list_svg').on("click",".inner_list_svg",function () {
		currentFileName = this.nextSibling.textContent;
	})
})