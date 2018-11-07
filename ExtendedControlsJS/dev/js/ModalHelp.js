/*Help modal panel*/
/**Provides a non blocking modal control which is primarily used for a help page */
/**Can take either the provided text as text/html or can embed a page */
/**options */
/**title: The text to display in the title bar of the control */
/**helptext: The text/html to display. */
/**name: The id parameter to assign to the control, this is useful if you want to have multiple controls */
/**embedURL: The url of the page to embed in the control. */
(function ($) {
    $.fn.ModalHelp = function (options) {
        var control = this;
        var settings = $.extend({
            title: "",
            helptext: "",
            name: "helpModal",
            embedURL: ""
        }, options);

        var useEmbeded = settings.embedURL != undefined && settings.embedURL != "";

        var modalHTML = "";
        modalHTML += "<div class='ec-help-modal hidden' id='helpModal_$name$' tabindex='-1'>".replace("$name$", settings.name);
        modalHTML += "<div class='modal-dialog' role='document'>";
        modalHTML += "<div class='modal-content'>";
        modalHTML += "<div class='modal-header'>";
        modalHTML += "<button type='button' class='close' title='Close'><span aria-hidden='true'>&times;</span></button>";
        modalHTML += "<icon class='fa fa-question fa'></icon>"
        modalHTML += "<h4 class='modal-title' id='myModalLabel'>$title$</h4>".replace("$title$", settings.title);
        modalHTML += "</div>";
        modalHTML += "<div class='modal-body'>";
        if (!useEmbeded) modalHTML += "<div  class='help-text'><h4>$helptext$</h4></div>".replace("$helptext$", settings.helptext);
        modalHTML += "</div>";
        modalHTML += "</div>";
        modalHTML += "</div>";
        modalHTML += "</div>";
        $(control).append(modalHTML);

        var modalMain = $(control).find("#helpModal_" + settings.name);
        var modalContent = $(modalMain).find(".modal-content");
        var modalBody = $(modalMain).find(".modal-body");
        var modalDialog = $(modalMain).find(".modal-dialog");
        var modalTitle = $(modalMain).find(".modal-title");
        var closeButton = $(modalMain).find(".close");
        var embededIFrame;

        if (useEmbeded) {
            var embedHTML = "<iframe src='$embedURL$' />".replace("$embedURL$", settings.embedURL);
            $(modalBody).append(embedHTML);
            $(modalMain).addClass("embeded-page");
            embededIFrame = $(modalBody).find("iframe");
        }

        //$(modalMain).hide(0);
        $(modalContent).resizable();
        $(modalDialog).draggable();

        var mouseDown = false;
        var resizeHandle = $(modalMain).find(".ui-resizable-handle");
        $(resizeHandle).on("mousedown", function () {
            mouseDown = true;
        });

        $(resizeHandle).on("mouseup", function () {
            mouseDown = false;
        });

        $(resizeHandle).on("mousemove", function () {
            if (mouseDown) {
                var contentHeight = $(modalContent).height();
                var newHeight = (contentHeight - 32);
                $(modalBody).css("height", newHeight);
            }
        });

        control.show = function () {
            $(modalMain).removeClass("hidden");
            $(modalMain).addClass("shown");
        };

        control.hide = function () {
            $(modalMain).removeClass("shown");
            $(modalMain).addClass("hidden");
        };

        control.loadPage = function (url) {
            $(embededIFrame).attr("src", url);
        };

        control.setHTML = function (html) {
            $(modalBody).empty();
            $(modalBody).prepend(html);
        };

        control.setTitle = function (title) {
            $(modalTitle).text(title);
        };

        $(closeButton).on("click", function () {
            control.hide();
        });

        return control;
    }
}(jQuery));