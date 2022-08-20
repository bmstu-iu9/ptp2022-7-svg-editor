class AccountValidation{
    static validateLogin(username){
        $.ajax({
            data: {
                'username':username,
            },
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
    }
    static validateEmail(email){
        $.ajax({
            data: {
                'email': email,
            },
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
    }
    static validatePasswords(password1, password2, onSuccessFunc){
        $.ajax({
            data: {
                'password1': password1,
                'password2': password2,
            },
            type: 'GET',
            url: passwordValidationURL,
            success: onSuccessFunc,
            error: function (response) {
                alert(response.responseJSON.errors);
            }
        });
    }
}