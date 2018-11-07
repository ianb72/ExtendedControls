/*Value display*/
(function ($) {
    $.fn.valueDisplay = function (options) {
        var self = this;
        this.addClass("icon-panel");

        var settings = $.extend({
            labelText: "",
            iconClass: "",
            valueBinding: null,
            visibleBinding: null
        }, options);


        var newHTML = "";
        newHTML += "<div class='icon-container false fa-stack'>";


        newHTML += "</div>";
        newHTML = newHTML.replace("$labelText$", settings.labelText);
        newHTML = newHTML.replace("$iconClass$", settings.iconClass);

        this.html(newHTML);
        return self;
    };
}(jQuery));