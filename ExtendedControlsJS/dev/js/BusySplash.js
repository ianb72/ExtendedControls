/**Busy Splash */
/**Displays a blocking modal splash busy box */
/**Options */
/**disableInput: Prevent input on the parent page */
(function ($) {
    $.fn.busySplash = function (options) {
        var control = this;
        var settings = $.extend({
            disableInput: false,
            text: "Fetching data",
            title: "Please Wait"
        }, options);

        var modalDivHTML = "<div class='modal busy-splash-modal'></div>";
        $(control).append(modalDivHTML);

        var modal = $(control).find(".busy-splash-modal")[0];

        control.busyBox = $(modal).busyBox({
            show: false,
            text: settings.text,
            title: settings.title
        });

        control.show = function () {
            if (settings.disableInput) {
                $(modal).modal({
                    backdrop: "static",
                    keyboard: false
                });
            } else {
                $(modal).modal("show");
            }


        };

        control.hide = function () {
            $(modal).modal("hide");
        };



        return control;

    };
}(jQuery));