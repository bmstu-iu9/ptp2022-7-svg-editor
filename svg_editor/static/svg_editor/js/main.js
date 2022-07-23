let currentFileName = null;  

$(document).ready(function () {

	$.ajaxSetup({
		headers: { "X-CSRFToken": token }
	});

	$('#saveButton').click(function () {

		let dataToSave = {
			file_name: document.getElementById('file_name').value,
		}
		if (document.getElementById('save_file_type').value === 'svg'){
			dataToSave.svg = getPictureAsSvg();
		} else {
			dataToSave.yml = JSON.stringify(getPictureAsProject());
		}
		console.log(dataToSave)
		$.ajax({
			data: dataToSave,
			type: 'POST',
			url: saveURL,
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
			url: viewURL,
			// если успешно, то
			success: function (response) {
				console.log(response.svgs)
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

	$("#editButton").click(function () {
		$.ajax({
			url: loadURL,
			type: 'GET',
			data: {
				file_name: currentFileName,
			},
			success: function (response) {
				console.log(response);
				openAsSvg(response);
			},
			error: function (response) {
				alert(response.responseJSON.errors);
				console.log(response.responseJSON.errors);
			},
		})
	})

	$('#list_svg').on("click",".inner_list_svg",function () {
		currentFileName = this.nextSibling.textContent.slice(0,-4);
	})
})