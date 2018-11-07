/**Warning Panel */
(function ($) {
    $.fn.WarningPanel = function (options) {
        var control = this;
        var settings = $.extend({
            text: "Warning Panel",
            warningClass: "",
            additionalClass: ""
        }, options);

        var WarningPanelHTML = "";
        WarningPanelHTML += "<div class='warning-panel'>";
        WarningPanelHTML += "<div class='warning-text'>$text$</div>".replace("$text$", settings.text);
        WarningPanelHTML += "</div>";
        $(control).append(WarningPanelHTML);

        var warningControl = $(control).find(".warning-panel")[0];
        $(warningControl).addClass(settings.warningClass);
        $(warningControl).addClass(settings.additionalClass);

        return control;
    };
}(jQuery));