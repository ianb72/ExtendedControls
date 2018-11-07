/*Input panel*/
/**Provides an input panel with a label and an input box */
/**options */
/**label: The text to display in the label */
/**koBinding: The knockout object to bind the input value to */
/**hasHelp: Add a help ribbon to the control */
/**helpText: If has help is true, the text to display in the help ribbon */
/**inputType: The HTML input type */
/**isDate: Is the input a date, will provide additional parsing if true */
/**defaultValue: The default value to display in the input box */
/**useFormatedDD: Use the formatted select to format the dropdown if the type is dropdown */
/**hasValidationMessage: If the control has a validator assigned, specify a message to show when input is invalid */
/**validationMessage: The message to display on invalid input */
(function ($) {
    $.fn.inputPanel = function (options) {
        var control = this;
        $(control).addClass("input-panel");
        var hasDD = false;
        var settings = $.extend({
            label: "",
            koBinding: null,
            hasHelp: false,
            helpText: "",
            inputType: "text",
            isDate: false,
            defaultValue: null,
            useFormattedDD: false,
            hasValidationMessage: false,
            validationMessage: "Invalid input"
        }, (options));

        //Check if data-bind attribute set
        var databindingAttr = control.attr("data-bind");
        if (databindingAttr != undefined && settings.koBinding == null) {
            var splitBindingsDef = databindingAttr.split(":");
            var bindingType = splitBindingsDef[0].trim();
            var boundValueName = splitBindingsDef[1].trim();
            var bindingContext = ko.contextFor(control[0]);

            settings.koBinding = bindingContext.$data[boundValueName];
        }

        //var newHTML = "<div class='input-panel'>";
        var newHTML = "";
        newHTML += "<div class='input-group'>";
        newHTML += "<span class='input-group-addon'>$label$</span>".replace("$label$", settings.label);
        switch (settings.inputType) {
            case "text":
            case "date":
                newHTML += "<input class='form-control input-field' type='$inputType$' />".replace("$inputType$", settings.inputType);
                break;
            case "textarea":
                newHTML += "<textarea class='form-control input-field' rows='6' type='text'></textarea>".replace("$inputType$", settings.inputType);
                break;
            case "yesno":
                newHTML += "<select class='input-field dd-yesno' id='$ddID$'>".replace("$ddID$", $(control)[0].id + "DD");
                newHTML += "<option value=true>Yes</option>";
                newHTML += "<option value=false>No</option>";
                newHTML += "</select>";
                hasDD = true;
                break;
        }
        //newHTML += "</div>";
        control.html(newHTML);

        if (settings.hasHelp) control.helpControl({
            helpText: settings.helpText
        });

        if (hasDD && settings.useFormattedDD) {
            var selectOption = $(control).find("select")[0];
            var inputPanel = $(control).find(".input-panel")[0];

            $(inputPanel).addClass("has-formatted-dd");

            $(selectOption).formattedSelect({
                isBoolean: true,
                koBoundObject: settings.koBinding
            });
        }

        if (settings.hasValidationMessage) {
            control.validationMessage = control.WarningPanel({
                text: settings.validationMessage,
                warningClass: "error"
            });
            var validationMessageControl = $(control).find(".warning-panel");
            $(validationMessageControl).addClass("validation-message");
            validationMessageControl.hide();
        }

        var inputField = $(control).find(".input-field")[0];
        if (settings.koBinding != undefined) {
            var ignoreChange = false;
            $(inputField).off("change").on("change", function () {
                ignoreChange = true;
                settings.koBinding(this.value);
                ignoreChange = false;
            });

            settings.koBinding.subscribe(function () {
                if (ignoreChange) return;
                $(inputField).val(settings.koBinding());
            });
        }

        if (settings.defaultValue != null) {
            settings.koBinding(settings.defaultValue);
        }

        if (settings.hasHelp) {

        }

        switch (settings.inputType) {
            case "date":
                $(inputField).datepicker({
                    dateFormat: "dd/mm/yy"
                });
                break;
            case "text":
                //Add date picker to text field, this is for browsers that add their own date picker for date fields.
                if (settings.isDate) {
                    $(inputField).datepicker({
                        dateFormat: "dd/mm/yy"
                    });
                }
                break;
        }

        var formattedSelectControl = $(control).find(".formatted-select");
        if (formattedSelectControl.length > 0) {
            $(formattedSelectControl).addClass("is-input-panel");
        }
        return control;
    };
}(jQuery));