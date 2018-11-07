/*Validator*/
var validatedControls = [];
var groupValidators = [];
var groupIndex = 0;

function allInputsValid(inputsToValidate) {
    var toReturn = true;
    if (inputsToValidate == null) {
        inputsToValidate = validatedControls;
    }
    inputsToValidate.forEach(function (element) {
        if (element.CheckValid() == false) toReturn = false;
    });
    return toReturn;
}

(function ($) {
    function GenericValidator(control, validationFunction, highlightValid) {

        var inputControl = control.find("input");
        var validationMessage = control.find(".validation-message");

        if (inputControl.length == 0) inputControl = control.find("textarea");
        if (inputControl.length == 0) inputControl = control; //Presume if input not found then control IS an input
        var inputValue = $(inputControl).val();

        control.validInput = validationFunction(inputValue);
        $(validationMessage).hide();

        if (!control.allowBlank && inputValue == "") {
            inputControl.addClass("invalid-input").removeClass("valid-input");
            $(validationMessage).show();
            return false;
        }

        if (!control.validInput && inputValue != "") {
            inputControl.addClass("invalid-input").removeClass("valid-input");
            $(validationMessage).show();
        } else if (inputValue != "") {
            inputControl.removeClass("invalid-input");
            $(validationMessage).hide();
            if (highlightValid) {
                inputControl.addClass("valid-input");
            }

        } else {
            inputControl.removeClass("invalid-input").removeClass("valid-input");
            $(validationMessage).hide();
        }

        return control.validInput;
    }

    $.fn.groupValidator = function (options) {
        var control = this;
        var settings = $.extend({
            boundKOValidationResult: null
        }, options);

        groupValidators[groupIndex] = control;
        groupValidators[groupIndex].attachedControls = [];

        control.groupIndex = groupIndex;
        control.isValid = true;

        control.UpdateValidation = function () {
            if (control.attachedControls.length > 0) {
                control.isValid = true;
                control.attachedControls.forEach(function (e, i) {
                    if (e.CheckValid() == false) control.isValid = false;
                });
                if (settings.boundKOValidationResult != null) settings.boundKOValidationResult(control.isValid);
            }
        };

        groupIndex++;
        return control;
    };

    $.fn.inputValidator = function (options) {
        var control = this;
        control.wrap("<div class='validated-input'></div>");
        control.outerControl = control.closest(".validated-input");
        control.validationMessageControl = null;

        var inputControl = control.find("input");
        if (inputControl.length == 0) inputControl = control.find("textarea");
        if (inputControl.length == 0) inputControl = control; //Presume if input not found then control IS an input

        var settings = $.extend({
            validationFunction: null,
            validationMessage: "Invalid Input",
            useValidationMessage: false,
            realTimeValidation: false,
            highlightValid: true,
            boundKOValue: null,
            boundKOValidationResult: null,
            groupValidator: null,
            allowBlank: true
        }, options);

        control.append("<div class='validation-message-container'></div>");
        control.allowBlank = settings.allowBlank;

        if (settings.realTimeValidation) {
            $(inputControl).on("keyup", function () {
                control.CheckValid();
                if (settings.groupValidator != null) {
                    settings.groupValidator.UpdateValidation();
                }
            });
        }

        if (settings.useValidationMessage) {
            var validationMessageContainer = $(this).find(".validation-message-container");
            $(validationMessageContainer).WarningPanel({
                text: settings.validationMessage,
                warningClass: "error",
                additionalClass: "validation-message"
            });
        }

        control.CheckValid = function () {
            var validationResult = GenericValidator(control, settings.validationFunction, settings.highlightValid);
            if (settings.boundKOValue != null) {
                settings.boundKOValue($(control).val());
            }
            if (settings.boundKOValidationResult != null) {
                settings.boundKOValidationResult(validationResult);
            }
            if (control.validationMessageControl != null) {
                $(control.validationMessageControl).hide();
                if (!validationResult) $(control.validationMessageControl).show();
            }

            return validationResult;
        };

        validatedControls.push(control);

        if (settings.groupValidator != null) {
            settings.groupValidator.attachedControls.push(control);
        }

        return control;
    };

    $.fn.numericValidator = function (options) {
        var numericControl = this;
        numericControl.validInput = false;

        var settings = $.extend({
            validationMessage: "Input is not a number",
            useValidationMessage: false,
            highlightValid: false,
            realTimeValidation: false,
            boundKOValue: null,
            boundKOValidationResult: null,
            groupValidator: null,
            allowBlank: true
        }, options);

        var genericValidator = $(numericControl).inputValidator({
            validationMessage: settings.validationMessage,
            useValidationMessage: settings.useValidationMessage,
            highlightValid: settings.highlightValid,
            realTimeValidation: settings.realTimeValidation,
            validationFunction: validator,
            boundKOValue: settings.boundKOValue,
            boundKOValidationResult: settings.boundKOValidationResult,
            groupValidator: settings.groupValidator,
            allowBlank: settings.allowBlank
        });

        numericControl.validInput = function () {
            genericValidator.CheckValid();
        };
        numericControl.CheckValid = function () {
            return genericValidator.CheckValid();
        };

        function validator(value) {
            var numRegex = new RegExp("^[0-9]*$");
            return numRegex.test(value);
        }

        return numericControl;
    };

    $.fn.alphaValidator = function (options) {
        var alphaControl = this;
        alphaControl.validInput = false;

        var settings = $.extend({
            validationMessage: "Please enter only numbers or letters",
            useValidationMessage: false,
            highlightValid: false,
            realTimeValidation: false,
            boundKOValue: null,
            boundKOValidationResult: null,
            groupValidator: null,
            allowBlank: true
        }, options);

        var genericValidator = $(alphaControl).inputValidator({
            validationMessage: settings.validationMessage,
            useValidationMessage: settings.useValidationMessage,
            highlightValid: settings.highlightValid,
            realTimeValidation: settings.realTimeValidation,
            validationFunction: validator,
            boundKOValue: settings.boundKOValue,
            boundKOValidationResult: settings.boundKOValidationResult,
            groupValidator: settings.groupValidator,
            allowBlank: settings.allowBlank
        });

        alphaControl.validInput = function () {
            genericValidator.CheckValid();
        };
        alphaControl.CheckValid = function () {
            return genericValidator.CheckValid();
        };

        function validator(value) {
            var numRegex = new RegExp("^[a-zA-Z0-9_]*$");
            return numRegex.test(value);
        }

        return alphaControl;
    };

}(jQuery));