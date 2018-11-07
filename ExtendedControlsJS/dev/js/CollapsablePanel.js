/**Collapsable Panel */
/**Init any elements with the panel-collapse class */
$(document).ready(function () {
    $(".panel-collapse").each(function () {
        $(this).collapsablePanel({});
    });
});

/**Provides a panel that can be collapsed by clicking on a title bar */
/**Options */
/**paneltitle: The text to display in the panel */
/**collapsed: Start the panel in a collapsed state */
/**showhandler: Function to execute when the panel is expanded/shown */
/**hidehandler: Function to execute when the panel is collapsed/hidden */
/**HTML Attributes */
/**paneltitle */
/**showhandler */
/**hidehandler */
(function ($) {
    $.fn.collapsablePanel = function (options) {
        var control = this;

        $(control).wrap("<div class='cp-container'></div>");

        var attrPanelTitle = $(control).attr("paneltitle");
        var attrShowhandler = $(control).attr("showhandler");
        var attrHidehandler = $(control).attr("hidehandler");

        var settings = $.extend({
            paneltitle: null,
            collapsed: true,
            showhandler: "",
            hidehandler: ""
        }, options);

        if (attrShowhandler != null) {
            settings.showhandler = attrShowhandler;
        }

        if (attrHidehandler != null) settings.hidehandler = attrHidehandler;

        control.paneltitle = attrPanelTitle || settings.paneltitle || "New Panel";
        control.tooltipText = settings.collapsed ? "Click to expand" : "Click to hide";

        var newHTML = "<h2 class='cp-header' title='$toolTipText$' data-toggle='tooltip'>$paneltitle$</h2>".replace("$paneltitle$", control.paneltitle).replace("$toolTipText$", control.tooltipText);
        control.before(newHTML);

        var header = $(control).parent(".cp-container").find(".cp-header");
        var panel = $(control).prevObject;

        $(header).on("click", function () {
            $(control).toggle(300);
            settings.collapsed = !settings.collapsed;
            $(header).attr("title", settings.collapsed ? "Click to expand" : "Click to hide");

            if (settings.collapsed) {
                $(control).removeClass("expanded");
                $(control).addClass("collapsed");
            } else {
                $(control).removeClass("collapsed");
                $(control).addClass("expanded");
            }

            if (settings.collapsed && settings.hidehandler != "") settings.hidehandler;
            if (!settings.collapsed && settings.showhandler != "") settings.showhandler;
        });

        control.collapse = function (collapsed) {
            if (collapsed) {
                $(control.hide());
            } else {
                $(control).show();
            }

        };

        if (settings.collapsed) {
            $(control).hide();
        }

        return control;
    };
}(jQuery));