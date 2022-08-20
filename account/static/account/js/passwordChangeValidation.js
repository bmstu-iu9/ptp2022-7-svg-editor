$(document).ready(function () {

    // Get csrf_token
    $.ajaxSetup({
        headers: { "X-CSRFToken": token }
    });

    // Send two password fields to server to validate them
    $('#id_new_password2, #id_new_password1').keyup(function () {
        AccountValidation.validatePasswords($('#id_new_password1').val(), $('#id_new_password2').val(),
            function (response) {
                if (response.missmatch) {
                    $('#id_new_password1, #id_new_password2').removeClass('is-valid').addClass('is-invalid');
                    $(".input-field.button input").prop('disabled', true);
                } else {
                    $('#id_new_password1, #id_new_password2').removeClass('is-invalid').addClass('is-valid');
                    $(".input-field.button input").prop('disabled', false);
                }
            });
        return false;
    });
})