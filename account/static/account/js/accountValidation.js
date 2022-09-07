/**
 * @author Kabane-UN
 **/

// Class that contains user data pre-validation
class AccountValidation{
    // Sending a username to the server to verify its uniqueness
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
    // Sending a user email to the server to verify its uniqueness
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
    // Sending a passwords fields to the server to verify theirs missmatch
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