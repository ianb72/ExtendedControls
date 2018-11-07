/*Help control*/
/**Adds an inline help ribbon to the control */
/**options: helpText: The text to display in the help ribbon */
(function ($) {
    $.fn.helpControl = function (options) {
        var control = this;
        var settings = $.extend({
            helpText: ""
        }, options);

        var helpControlHTML = "";
        helpControlHTML += "<div class='help-control'>";
        helpControlHTML += "<div class='help-icon-container pull-left'><icon class='fa fa-question-circle'></icon></div>";
        helpControlHTML += "<div class='help-panel hide'>";
        helpControlHTML += "<span>$helpText$</span>".replace("$helpText$", settings.helpText);
        helpControlHTML += "</div>";
        helpControlHTML += "</div>";
        var helpPanelHTML = "";
        control.append(helpControlHTML);

        var helpIconContainer = $(control).find(".help-icon-container")[0];
        $(helpIconContainer).attr("title", "Show/Hide Help");
        $(helpIconContainer).attr("data-toggle", "tooltip");
        var parentHeight = parseFloat($(this).css("height").replace("px", ""));
        $(helpIconContainer).css("top", "-" + (parentHeight) + "px");
        $(helpIconContainer).tooltip();

        $(helpIconContainer).off("click").on("click", function () {
            var helpPanel = $(this.parentElement).find(".help-panel");
            if (helpPanel == undefined) return;
            if (helpPanel.hasClass("hide")) {
                $(helpPanel).removeClass("hide").addClass("show");
            } else {
                $(helpPanel).removeClass("show").addClass("hide");
            }
        });

        return control;
    };
}(jQuery));