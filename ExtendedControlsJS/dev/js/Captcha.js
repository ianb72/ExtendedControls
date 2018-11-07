/**Captcha */
/**Provides a simple captcha */
/**Options */
/**actionOnContinue: Function to execute when the continue button is clicked */
/**actionOnClick: Function to execute when the image is clicked on in addtion to the default function */
$(document).ready(function () {
    $(".ec-captcha").each(function (i, e) {
        $(e).Captcha({});
    });
});

(function ($) {
    $.fn.Captcha = function (options) {
        var control = this;
        var settings = $.extend({
            actionOnContinue: null,
            actionOnClick: null,
            confirmIcon: "fa fa-arrow-right fa-2x",
            continueIcon: "fa fa-check fa-2x"
        }, options);

        var captchaHTML = "";
        captchaHTML += "<div class='captcha-container container no'>";
        captchaHTML += "<div class='row'>";
        captchaHTML += "<div class='captcha-button btn-confirm'>";
        captchaHTML += "<div class='btn-text'>I am not a robot</div>";
        captchaHTML += "<div class='captcha-icon $icon$'></div>".replace("$icon$", settings.confirmIcon);
        captchaHTML += "</div>";
        captchaHTML += "<div class='captcha-button btn-continue'>";
        captchaHTML += "<div class='btn-text'>Click here to continue</div>";
        captchaHTML += "<div class='captcha-icon $icon$'></div>".replace("$icon$", settings.continueIcon);
        captchaHTML += "</div>";
        captchaHTML += "</div>";
        captchaHTML += "</div>";
        control.append(captchaHTML);

        var btnContinue = $(control).find(".btn-continue");
        var btnConfirm = $(control).find(".btn-confirm");

        $(btnContinue).addClass("disabled");
        $(btnConfirm).on("click", function () {
            $(btnConfirm).addClass("disabled");
            $(btnContinue).removeClass("disabled");
            if (settings.actionOnClick != null) {
                settings.actionOnClick();
            }
        });

        $(btnContinue).on("click", function () {
            if (settings.actionOnContinue != null) {
                settings.actionOnContinue();
            }
        });

        return control;
    };
}(jQuery));