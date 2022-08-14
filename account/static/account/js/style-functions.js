/**
 * @author vyydra
 */

$(document).ready(function () {

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