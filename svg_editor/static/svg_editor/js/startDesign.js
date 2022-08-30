/**
 * @author vyydra
 */

$(document).ready(function () {

    // Select box customization
    $(".custom-select").each(function () {
        const classes = $(this).attr("class");

        let template = '<div class="' + classes + '">';

        template +=
            '<span class="custom-select-trigger">' +
            $(this).attr("placeholder") +
            "</span>";

        template += '<div class="custom-options">';

        $(this)
            .find("option")
            .each(function () {
                template +=
                    '<span class="custom-option ' +
                    $(this).attr("class") +
                    '" data-value="' +
                    $(this).attr("value") +
                    '">' +
                    $(this).html() +
                    "</span>";
            });

        template += "</div></div>";

        $(this).wrap('<div class="custom-select-wrapper"></div>');
        $(this).hide();
        $(this).after(template);
    });

    $(".custom-option:first-of-type").hover(
        function () {
            $(this)
                .parents(".custom-options")
                .addClass("option-hover");
        },
        function () {
            $(this)
                .parents(".custom-options")
                .removeClass("option-hover");
        }
    );

    $(".custom-select-trigger").on("click", function (event) {
        $("html").one("click", function () {
            $(".custom-select").removeClass("opened");
        });

        $(this)
            .parents(".custom-select")
            .toggleClass("opened");

        event.stopPropagation();
    });

    $(".custom-option").on("click", function () {
        $(this)
            .parents(".custom-select-wrapper")
            .find("select")
            .val($(this).data("value"));

        $(this)
            .parents(".custom-options")
            .find(".custom-option")
            .removeClass("selection");

        $(this).addClass("selection");

        $(this)
            .parents(".custom-select")
            .removeClass("opened");

        $(this)
            .parents(".custom-select")
            .find(".custom-select-trigger")
            .text($(this).text());
        $('#save_file_type').trigger('change');
    });

    // File input customization
    $(".input-file").each(function () {
        $(this).on("change", function (event) {
            let fileName = '';

            if (event.target.value)
                fileName = event.target.value.split("\\").pop();

            if (fileName)
                $(this).next("label").find("span").html(fileName);
            else
                $(this).next("label").html($(this).next("label").html());
        });

        // Firefox bug fix
        $(this)
            .on("focus", function () { $(this).addClass("has-focus"); })
            .on("blur", function () { $(this).removeClass("has-focus"); });
    });
})