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

	$('#id_password2, #id_password1').keyup(function (){
		$.ajax({
			data: $('#id_password2, #id_password1').serialize(),
			type: 'GET',
			url: passwordValidationURL,
			success: function (response) {
				if (response.missmatch) {
					$('#id_password1').removeClass('is-valid').addClass('is-invalid');
					$('#id_password2').removeClass('is-valid').addClass('is-invalid');
				} else {
					$('#id_password1').removeClass('is-invalid').addClass('is-valid');
					$('#id_password2').removeClass('is-invalid').addClass('is-valid');
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