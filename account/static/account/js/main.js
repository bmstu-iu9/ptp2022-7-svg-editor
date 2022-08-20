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
        AccountValidation.validateLogin($(this).val());
        return false;
    });

    // Send email to server to validate it
    $('#id_email').keyup(function () {
        AccountValidation.validateEmail($(this).val());
        return false;
    });

    // Send two password fields to server to validate them
    $('#id_password2, #id_password1').keyup(function () {
        AccountValidation.validatePasswords($('#id_password1').val(), $('#id_password2').val(),
            function (response) {
                if (response.missmatch) {
                    $('#id_password1, #id_password2').removeClass('is-valid').addClass('is-invalid');
                } else {
                    $('#id_password1, #id_password2').removeClass('is-invalid').addClass('is-valid');
                }
            });
        return false;
    });
})