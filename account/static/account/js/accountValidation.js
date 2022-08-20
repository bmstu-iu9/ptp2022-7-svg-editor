class AccountValidation{
    static validateLogin(username, onSuccessFunc){
        $.ajax({
            data: {
                'username':username,
            },
            type: 'GET',
            url: usernameValidationURL,
            success: onSuccessFunc,
            error: function (response) {
                alert(response.responseJSON.errors);
            }
        });
    }
    static validateEmail(email, onSuccessFunc){
        $.ajax({
            data: {
                'email': email,
            },
            type: 'GET',
            url: emailValidationURL,
            success: onSuccessFunc,
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