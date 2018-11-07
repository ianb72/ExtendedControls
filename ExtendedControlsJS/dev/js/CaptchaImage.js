/**Captcha using captcha image api */
(function ($) {
    $.fn.CaptchaImage = function (options) {
        var control = this;
        control.sessionID = "";
        control.addClass("captcha-image-container");

        var settings = $.extend({
            captchaProviderURL: null,
            submitHandler: null
        }, options);

        var captchaImageURL = settings.captchaProviderURL + "GetImage";
        var captchaValueURL = settings.captchaProviderURL + "GetCaptchaResult";
        var captchaHTML = "<div class='captcha-image'>";
        captchaHTML += "<div class='row'><img class='captcha-img' /></div>";
        captchaHTML += "<div class='row'><h5>Please enter the the numbers shown above.</h5></div>";
        captchaHTML += "<div class='row incorrect-input'>The last entry did not match, please try again.</div>"
        captchaHTML += "<div class='row'>";
        captchaHTML += "<div class='col-sm-9'><h6>If you can't read the numbers click here to fetch a different set.</h6></div>";
        captchaHTML += "<div class='col-sm-2'><div class='btn btn-default btn-refresh'><icon class='fa fa-refresh fa-2x'></icon></div></div>";
        captchaHTML += "</div>";
        captchaHTML += "<div class='row'><input class='captcha-input' type='text'/></div>";
        captchaHTML += "<div class='row'><div class='btn btn-default btn-submit'>Submit</div></div>";
        captchaHTML += "</div>";
        control.append(captchaHTML);

        var captchaInput = $(control).find(".captcha-input");
        var submitButton = $(control).find(".btn-submit");
        var captchaimg = $(control).find(".captcha-img");
        var incorrect = $(control).find(".incorrect-input");
        var refreshButton = $(control).find(".btn-refresh");
        $(refreshButton).on("click", function () {
            control.getImageData();
            $(captchaInput).val("");
            $(captchaInput).focus();
        });

        $(submitButton).on("click", function () {
            control.checkInput();
        });

        control.checkInput = function () {
            var inputtext = $(captchaInput).val();
            var args = {};
            args["inputtext"] = inputtext;
            args["sessionID"] = control.sessionID;

            $.ajax({
                url: captchaValueURL,
                type: "get",
                data: args,
                success: function (result) {
                    console.log(result);
                    control.inputCheckCallbback(result);
                },
                error: function (error) {
                    console.warn("Error check captcha value");
                }

            });
        };

        control.inputCheckCallbback = function (result) {
            if (result === "True") {
                if (settings.submitHandler != null) {
                    settings.submitHandler();
                }
            } else {
                $(incorrect).addClass("shown");
                control.getImageData();
                $(captchaInput).val("");
                $(captchaInput).focus();
            }
        };

        control.getImageData = function () {
            $.ajax({
                url: captchaImageURL,
                type: "get",
                success: function (results) {
                    var parsedResults = JSON.parse(results);
                    $(captchaimg).attr("src", "data:image/png;base64," + parsedResults.imageData);
                    control.sessionID = parsedResults.SessionID;
                },
                error: function (error) {
                    console.log("Error getting image data");

                }
            });
        };
        control.getImageData();

        $(captchaInput).focus();

        return control;
    };
}(jQuery));