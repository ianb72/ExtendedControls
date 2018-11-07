/** Modal Requestor */
/**Provides a generic requestor modal with an icon, a message and buttons */
/**options */
/**title: The text to display in the title bar of the modal */
/**name: The HTML ID of the modal */
/**button1Text: The text to display on button1 (leftmost button) */
/**button2Text: The text to display on button2 (rightmost button) */
/**modalType: The type of modal to display */
/**-- twobutton : Show two buttons on the modal */
/**-- alert: Show an alert with only one button, */
/**addtionalCSSClass: An extra CSS class to add to the modal */
/**useIcon: Show an icon on the left hand side of the modal */
/**iconClass: Specify the CSS class of the icon to show in the modal */
/**buttonAlignment: Set the alignment of the button group (left/right/center) */
/**onButton1Click: Function to execute when button 1 is clicked */
/**onButton2Click: Function to execute when button 2 is clicked */
(function ($) {
    $.fn.ModalRequestor = function (options) {
        var control = this;

        var settings = $.extend({
            title: "Modal",
            name: "modalRequestor",
            modalBodyText: "Requestor modal",
            button1Text: "Ok",
            button2Text: "Cancel",
            modalType: "twobutton",
            additionalCSSClass: "",
            useIcon: false,
            iconClass: "fa-info-circle fa-3x",
            buttonAlignment: "right",
            onButton1Click: null,
            onButton2Click: null
        }, options);

        var modalHTML = "";
        modalHTML += "<div class='modal modal-requestor-container $additionalCSSClass$' id=$modalID$>".replace("$additionalCSSClass$", settings.addtionalCSSClass).replace("$modalID$", settings.name);
        modalHTML += "<div class='modal-title'>$title$</div>".replace("$title$", settings.title);
        modalHTML += "<div class='modal-body'></div>";
        modalHTML += "<div class='modal-buttons'></div>";
        modalHTML += "</div>";
        $(control).append(modalHTML);

        var modalControl = $(control).find("#" + settings.name);

        /*Body*/
        var modalBody = $(modalControl).find(".modal-body");
        var modalBodyHTML = "";
        modalBodyHTML += "<div class='modal-icon-container'><i class='fa'></i></div>";
        modalBodyHTML += "<div class='modal-body-text'>$modalBodyText$</div>".replace("$modalBodyText$", settings.modalBodyText);
        $(modalBody).append(modalBodyHTML);

        if (settings.useIcon) {
            $(modalBody).find(".modal-icon-container").addClass("col-sm-3");
            $(modalBody).find(".modal-icon-container > i").addClass(settings.iconClass);
            $(modalBody).find(".modal-body-text").addClass("col-sm-9");
            $(modalBody).addClass("has-icon");
        }

        /*Buttons*/
        var modalButtonsArea = $(modalControl).find(".modal-buttons");
        var modalButtonsHTML = "";
        modalButtonsHTML += "<div class='modal-buttons-container'>";
        modalButtonsHTML += "<div class='btn btn-default modal-btn modal-btn-1'>$button1Text$</div>".replace("$button1Text$", settings.button1Text);
        modalButtonsHTML += "<div class='btn btn-default modal-btn modal-btn-2'>$button2Text$</div>".replace("$button2Text$", settings.button2Text);
        modalButtonsHTML += "</div>";
        $(modalButtonsArea).append(modalButtonsHTML);
        $(modalButtonsArea).addClass(settings.buttonAlignment);

        switch (settings.modalType) {
            case "alert":
                $(modalButtonsArea).find(".modal-btn-2").addClass("hide");
                break;
        }

        $(modalButtonsArea).find(".modal-btn-1").off("click").on("click", function () {
            $(modalControl).modal("hide");
            if (settings.onButton1Click != null) {
                settings.onButton1Click();
            }
        });

        $(modalButtonsArea).find(".modal-btn-2").off("click").on("click", function () {
            $(modalControl).modal("hide");
            if (settings.onButton2Click != null) {
                settings.onButton2Click();
            }
        });

        control.show = function () {
            $(modalControl).modal("show");
        };



        return control;
    };
}(jQuery));