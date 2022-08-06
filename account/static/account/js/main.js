/**
 * @author Kabane-UN
 * @author vyydra
 **/

$(document).ready(function () {

    // Get csrf_token
    $.ajaxSetup({
        headers: { "X-CSRFToken": token }
    });

    // Send username to server to validate it
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
            }
        });
        return false;
    });

    // Send email to server to validate it
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
            }
        });
        return false;
    });

    // Send two password fields to server to validate them
    $('#id_password2, #id_password1').keyup(function () {
        $.ajax({
            data: $('#id_password2, #id_password1').serialize(),
            type: 'GET',
            url: passwordValidationURL,
            success: function (response) {
                if (response.missmatch) {
                    $('#id_password1, #id_password2').removeClass('is-valid').addClass('is-invalid');
                } else {
                    $('#id_password1, #id_password2').removeClass('is-invalid').addClass('is-valid');
                }
            },
            error: function (response) {
                alert(response.responseJSON.errors);
            }
        });
        return false;
    });

    // Show/hide password
    $("#showHidePassword").on("click", function () {
        if ($(".password").attr("type") === "password") {
            $(".password").attr("type", "text");
            $("#showHidePassword").toggleClass("fi-rr-eye fi-rr-eye-crossed");
        } else {
            $(".password").attr("type", "password");
            $("#showHidePassword").toggleClass("fi-rr-eye fi-rr-eye-crossed");
        }
    });
})