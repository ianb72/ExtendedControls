/**Modal Input */
/**Provides a blocking modal with an input box */
/**options*/
/**modalText: The text to display in the title bar of the control */
/**button1Click: The function to execute when button1 is clicked, takes the returnValue as a parameter  */
/**button2Click: The function to execute when button2 is clicked, takes the returnValue as a parameter  */
/**password: Is this a password input? */
/**values */
/**returnValue: The current value in the input box */
(function ($) {
    $.fn.ModalInput = function (options) {
        var control = this;
        var settings = $.extend({
            modalText: "Title",
            password: false,
            button1Click: null,
            button2Click: null
        }, options);

        control.returnValue = "";
        control.modalText = settings.modalText;

        var inputtype = settings.password ? "password" : "text";

        /**Main html generation */
        var controlHTML = "";
        controlHTML += "<div class='ec-input-modal modal'>";
        controlHTML += "<div class='ec-modal-text'>$modalText$</div>".replace("$modalText$", control.modalText);
        controlHTML += "<div class='input-container'>";
        controlHTML += "<input class='ec-input-modal-input' type='$inputtype$' />".replace("$inputtype$", inputtype);
        controlHTML += "</div>";
        controlHTML += "<div class='ec-input-buttons'>";
        controlHTML += "<div class='btn btn-default btn1'>Ok</div>";
        controlHTML += "<div class='btn btn-default btn2'>Cancel</div>";
        controlHTML += "</div>";
        controlHTML += "</div>";
        control.html(controlHTML);

        var mainModal = $(control).find(".ec-input-modal");

        /**Public facing methods */
        control.showModal = function () {
            var modalTextElement = $(control).find(".ec-modal-text")[0];
            $(modalTextElement).text(control.modalText);
            $(mainModal).modal("show");
        };

        control.hideModal = function () {
            $(mainModal).modal("hide");
        };

        /**Local event handlers */
        var button1 = $(control).find(".btn1")[0];
        var button2 = $(control).find(".btn2")[0];

        $(button1).on("click", function () {
            var inputControl = control.find("input[type=text]");
            control.returnValue = inputControl.val();
            control.hideModal();
            if (settings.button1Click != null) settings.button1Click(control.returnValue);
        });

        $(button2).on("click", function () {
            control.hideModal();
            if (settings.button2Click != null) settings.button2Click(control.returnValue);
        });

        return control;

    };
}(jQuery));