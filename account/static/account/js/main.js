/**
 * @author Kabane-UN
 **/

$(document).ready(function () {

	$.ajaxSetup({
		headers: { "X-CSRFToken": token }
	});

	$('#id_username').keyup(function () {
		$.ajax({
			data: $(this).serialize(),
			type: 'GET',
			url: usernameValidationURL,
			success: function (response) {
				if (response.exists) {
					$('#id_username').removeClass('is-valid').addClass('is-invalid');
				} else {
					$('#id_username').removeClass('is-invalid').addClass('is-valid');
				}
			},
			error: function (response) {
				alert(response.responseJSON.errors);
				console.log(response.responseJSON.errors);
			}
		});
		return false;
	});

	$('#id_email').keyup(function () {
		$.ajax({
			data: $(this).serialize(),
			type: 'GET',
			url: emailValidationURL,
			success: function (response) {
				if (response.exists) {
					$('#id_email').removeClass('is-valid').addClass('is-invalid');
				} else {
					$('#id_email').removeClass('is-invalid').addClass('is-valid');
				}
			},
			error: function (response) {
				alert(response.responseJSON.errors);
				console.log(response.responseJSON.errors);
			}
		});
		return false;
	});
})