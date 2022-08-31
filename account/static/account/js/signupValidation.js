/**
 * @author Kabane-UN
 **/

$(document).ready(function () {

    // Get csrf_token
    $.ajaxSetup({
        headers: { "X-CSRFToken": token }
    });

    // Send username to server to validate it
    $('#id_username').keyup(function () {
        AccountValidation.validateLogin($(this).val(), function (response) {
                if (response.exists) {
                    $('#id_username').removeClass('is-valid').addClass('is-invalid');
                    $('#signup-button').prop('disabled', true);
                } else {
                    $('#id_username').removeClass('is-invalid').addClass('is-valid');
                    $('#id_email').hasClass('is-valid') &&
                    $('#id_password1, #id_password2').hasClass('is-valid') &&
                    $('#signup-button').prop('disabled', false);
                }
            });
        return false;
    });

    // Send email to server to validate it
    $('#id_email').keyup(function () {
        AccountValidation.validateEmail($(this).val(), function (response) {
                if (response.exists) {
                    $('#id_email').removeClass('is-valid').addClass('is-invalid');
                    $('#signup-button').prop('disabled', true);
                } else {
                    $('#id_email').removeClass('is-invalid').addClass('is-valid');
                    $('#id_username').hasClass('is-valid') &&
                    $('#id_password1, #id_password2').hasClass('is-valid') &&
                    $('#signup-button').prop('disabled', false);
                }
            });
        return false;
    });

    // Send two password fields to server to validate them
    $('#id_password2, #id_password1').keyup(function () {
        AccountValidation.validatePasswords($('#id_password1').val(), $('#id_password2').val(),
            function (response) {
                if (response.missmatch) {
                    $('#id_password1, #id_password2').removeClass('is-valid').addClass('is-invalid');
                    $('#signup-button').prop('disabled', true);
                } else {
                    $('#id_password1, #id_password2').removeClass('is-invalid').addClass('is-valid');
                    $('#id_username').hasClass('is-valid') &&
                    $('#id_email').hasClass('is-valid') &&
                    $('#signup-button').prop('disabled', false);
                }
            });
        return false;
    });
})