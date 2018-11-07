/*Formatted Input*/
/**Provides an input bbox that will automatically format any input data into a specific format */
/**The underlying data will remain the same */
(function ($) {
    /**Formats the data as currency */
    /**Default format is GBP with the en-uk number format */
    $.fn.formattedCurrency = function (options) {
        var inputControl = this;
        var settings = $.extend({
            Formatter: formatter
        }, options);

        $(inputControl).formattedInput(settings);

        function formatter(inputText) {
            var currencyFormatter = new Intl.NumberFormat("en-uk", {
                style: "currency",
                currency: "GBP",
                minimumFractionDigits: 2
            });

            return currencyFormatter.format(inputText);
        }
    };

    /**Formats the data as a date DD/MM/YYYY */
    $.fn.formattedDate = function (options) {
        var inputControl = this;
        var settings = $.extend({
            Formatter: formatter
        }, options);

        $(inputControl).formattedInput(settings);

        function formatter(inputDate) {
            var newDateString = new moment(inputDate).format("DD/MM/YYYY");
            return newDateString;
        }
    };

    /**Provides the generic input formatter */
    /**Options*/
    /**Formatter: The function to use to format the data */
    $.fn.formattedInput = function (options) {
        var inputControl = this;
        inputControl.inputText = null;
        inputControl.inputData = null;

        inputControl.addClass("formatted-input-data");
        inputControl.wrap("<div class='formatted-input-container'></div>");

        var settings = $.extend({
            Formatter: null
        }, options);

        var newHTML = "";
        newHTML += "<div class='formatted-input-text'></div>";
        inputControl.after(newHTML);

        inputControl.inputText = inputControl.closest(".formatted-input-container").find(".formatted-input-text");
        inputControl.inputData = inputControl.closest(".formatted-input-container").find(".formatted-input-data");

        $(inputControl.inputText).on("click", function () {
            $(this).hide();
            $(inputControl.inputData).show();
            $(inputControl.inputData).focus();
        });

        $(inputControl.inputData).on("blur", function () {
            $(this).hide();
            $(inputControl.inputText).show();
            $(inputControl.inputText).text(settings.Formatter(inputControl.inputData.val()));
        });
        return inputControl;
    };

}(jQuery));