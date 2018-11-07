/*Help modal panel*/
/**Provides a non blocking modal control which is primarily used for a help page */
/**Can take either the provided text as text/html or can embed a page */
/**options */
/**title: The text to display in the title bar of the control */
/**panelHTML: The text/html to display. */
/**name: The id parameter to assign to the control, this is useful if you want to have multiple controls */
/**embedURL: The url of the page to embed in the control. */
(function ($) {
    $.fn.ModalPanel = function (options) {
        var control = this;
        var settings = $.extend({
            title: "",
            panelHTML: "",
            name: "modalPanel",
            embedURL: "",
            button1Text: "Ok",
            button2Text: "Cancel",
            button1Click: null,
            button2Click: null,
            fixedsize: false,
            fixedpos: false,
            width: 300,
            height: 300
        }, options);

        var useEmbeded = settings.embedURL != undefined && settings.embedURL != "";

        var modalHTML = "";
        modalHTML += "<div class='ec-modal-panel hidden' id='modalPanel_$name$' tabindex='-1'>".replace("$name$", settings.name);
        modalHTML += "<div class='modal-dialog' role='document'>";
        modalHTML += "<div class='modal-content'>";
        modalHTML += "<div class='modal-header'>";
        modalHTML += "<button type='button' class='close' title='Close'><span aria-hidden='true'>&times;</span></button>";
        modalHTML += "<icon class='fa fa-question fa'></icon>"
        modalHTML += "<h4 class='modal-title' id='myModalLabel'>$title$</h4>".replace("$title$", settings.title);
        modalHTML += "</div>";
        modalHTML += "<div class='modal-body'>";
        if (!useEmbeded) modalHTML += "<div  class='modal-text'><h4>$panelHTML$</h4></div>".replace("$panelHTML$", settings.panelHTML);
        modalHTML += "<div class='modal-footer'>";
        modalHTML += "<div class='ec-input-buttons'>";
        modalHTML += "<div class='btn modal-btn modal-btn-1'>$button1Text$</div>".replace("$button1Text$", settings.button1Text);
        modalHTML += "<div class='btn modal-btn modal-btn-2'>$button2Text$</div>".replace("$button2Text$", settings.button2Text);
        modalHTML += "</div>";
        modalHTML += "</div>";
        modalHTML += "</div>";
        modalHTML += "</div>";
        modalHTML += "</div>";
        modalHTML += "</div>";
        $(control).append(modalHTML);

        var modalMain = $(control).find("#modalPanel_" + settings.name);
        var modalContent = $(modalMain).find(".modal-content");
        var modalBody = $(modalMain).find(".modal-body");
        var modalText = $(modalMain).find(".modal-text");
        var modalDialog = $(modalMain).find(".modal-dialog");
        var modalTitle = $(modalMain).find(".modal-title");
        var button1 = $(modalMain).find(".modal-btn-1");
        var button2 = $(modalMain).find(".modal-btn-2");
        var closeButton = $(modalMain).find(".close");
        var embededIFrame;

        if (useEmbeded) {
            var embedHTML = "<iframe src='$embedURL$' />".replace("$embedURL$", settings.embedURL);
            $(modalBody).append(embedHTML);
            $(modalMain).addClass("embeded-page");
            embededIFrame = $(modalBody).find("iframe");
        }

        control.resizemodal = function () {
            var contentHeight = $(modalContent).height();
            var contentWidth = $(modalContent).width();
            var bodyHeight = (contentHeight - 32);
            var textHeight = (contentHeight - 120);

            $(modalBody).css("height", bodyHeight);

            $(modalDialog).width(contentWidth);
            $(modalDialog).height(contentHeight);
            $(modalText).height(textHeight);
        }

        //$(modalMain).hide(0);
        if (!settings.fixedsize) {
            $(modalContent).resizable();
        } else {
            $(modalContent).width(settings.width);
            $(modalContent).height(settings.height);
            control.resizemodal();
        }

        if (!settings.fixedpos) {
            $(modalDialog).draggable();
        }

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
                control.resizemodal();
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

        $(button1).on("click", function () {
            control.hide();
            if (settings.button1Click != null) {
                settings.button1Click();
            }
        });

        $(button2).on("click", function () {
            control.hide();
            if (settings.button2Click != null) {
                settings.button2Click();
            }
        });


        $(closeButton).on("click", function () {
            control.hide();
        });


        return control;
    }
}(jQuery));