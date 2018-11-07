/**Busy box*/
/**Options */
/**text: The text to display below the busy icon */
/**title: The text to display as a title above the busy icon */
/**show: Display the busy box by default */
/**align: The alignment of the busy box in its parent */
/**boxstyle: The style of busybox to show */
/**(default - shows both title and text) */
/**(pleasewait - sets the title to Please Wait and adds an additional please wait css class) */
/**inverse: Invert the colours in the busybox according to the css styling */
/**spinner: The actual icon class to use as the spinner (defaults to 'fa-spinner') */
(function ($) {
    $.fn.busyBox = function (options) {
        var control = this;

        if (options === "hide") {
            control.hide();
            return this;
        }
        if (options === "show") {
            control.show();
            return this;
        }

        var settings = $.extend({
            text: "Busy Box - Text",
            title: "BUSY BOX - Title",
            show: true,
            align: "centre",
            boxstyle: "default",
            inverse: false,
            spinner: "fa-spinner"
        }, options);

        var busyBoxhtml = "<div class='busy-box'>";
        busyBoxhtml += "<div class='row busy-title'>";
        busyBoxhtml += "<p>" + settings.title + "</p>";
        busyBoxhtml += "</div>";
        busyBoxhtml += "<div class='row busy-icon'>";
        busyBoxhtml += "<i class='fa fa-2x fa-spin " + settings.spinner + "'></i> ";
        busyBoxhtml += "</div>";
        busyBoxhtml += "<div class='row  busy-text'>";
        busyBoxhtml += "<p>" + settings.text + "</p>";
        busyBoxhtml += "</div>";
        busyBoxhtml += "</div>";

        this.html(busyBoxhtml);

        var busyBoxNode = $(this).find(".busy-box");
        var busyText = $(this).find(".busy-text");
        var busyTitle = $(this).find(".busy-title");
        var busyIcon = $(this).find(".busy-icon");

        switch (settings.boxstyle) {
            case "pleasewait":
                $(busyTitle).text("Please Wait");
                $(busyBoxNode).addClass("please-wait");
                break;
        }

        if (settings.inverse) $(busyBoxNode).addClass("inverse");

        this.css({
            display: settings.show ? "block" : "none"
        });

        Object.defineProperty(control, 'text', {
            get: function () {
                return $(busyText).text();;
            },
            set: function (value) {
                $(busyText).text(value);
            }
        });

        Object.defineProperty(control, "title", {
            get: function () {
                return $(busyTitle).text();
            },
            set: function (value) {
                $(busyTitle).text(value);
            }
        });

        return this;
    };
}(jQuery));