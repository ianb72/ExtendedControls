/**Auto suggestion list */
(function ($) {
    $.fn.AutoSuggestionList = function (options) {
        var settings = $.extend({
            datasource: null, //A javascript array that contains the base data.
            dataURL: null, //The URL of the data.
            dataURLParam: null, //The parameter to pass to the url.
            itemText: null, //The property of the data array to use as displayed text.
            itemValue: null, //The propert of the data array to use as the item value.
            startswith: false, //Limit the results to mataches that start with the input data.
            minlength: 1, //The minimum length of input before getting suggestions.
            useOverlay: false
        }, options);

        var selectedItemText;
        var selectedItemValue;
        var currentSuggestions;
        var currentSelectionIndex = 0;

        var orignalControl = this;
        var outerHTML = "<div class='input-with-suggestions-container'></div>";
        $(orignalControl).wrap(outerHTML);

        var control = $(orignalControl).closest(".input-with-suggestions-container");
        var suggestionListHTML = "<div class='suggestion-list hidden'><ul></ul></div>";
        var originalWidth = $(orignalControl).css("width");
        var originalHeight = $(orignalControl).css("height");
        var overlaytop = (-parseFloat(originalHeight.replace("px", ""))) + "px";
        var overlayedSuggestionHTML = "<div class='suggestion-overlay'></div>";

        $(control).append(overlayedSuggestionHTML);
        $(control).append(suggestionListHTML);

        var overlayedSuggestion = $(control).find(".suggestion-overlay");
        var suggestionListContainer = $(control).find(".suggestion-list");
        var suggestionList = $(suggestionListContainer).find("ul");

        $(control).css("width", originalWidth);

        $(overlayedSuggestion).css("min-height", originalHeight);
        $(overlayedSuggestion).css("height", originalHeight);
        $(overlayedSuggestion).css("width", originalWidth);
        $(overlayedSuggestion).css("margin-top", overlaytop);

        var input = $(control).find("input");
        var inputData;

        $(input).keyup(function (event) {
            console.log(currentSelectionIndex);
            switch (event.which) {
                case 38:
                    if (currentSelectionIndex > 0) {
                        currentSelectionIndex--;
                        $(input).val(currentSuggestions[currentSelectionIndex]);

                    }
                    break;
                case 40:
                    if (currentSelectionIndex < currentSuggestions.length - 1) {
                        $(input).val(currentSuggestions[currentSelectionIndex]);
                        currentSelectionIndex++;
                    }
                    break;

                default:
                    inputData = $(input).val();
                    currentSelectionIndex = 0;
                    if (inputData.length === 0) {
                        $(overlayedSuggestion).text("");
                    }

                    if (inputData.length >= settings.minlength) {
                        GetSuggestions();
                        control.show();
                    } else {
                        control.hide();
                    }
                    break;
            }


        });

        control.show = function () {
            $(suggestionListContainer).removeClass("hidden");
        };

        control.hide = function () {
            $(suggestionListContainer).addClass("hidden");
        };

        function GetSuggestions() {
            if (settings.datasource != null) {
                GetSuggestionsFromData();
            } else if (settings.dataURL != null) {
                GetSuggestionsFromURL();
            } else {
                console.error("No data source for Auto Suggestions");
            }
        }

        function GetSuggestionsFromData() {
            UpdateList();
        }

        function GetSuggestionsFromURL() {

        }

        function UpdateList() {
            $(suggestionList).empty();
            currentSuggestions = settings.datasource.filter(function (e) {
                var matched = false;
                if (settings.startswith == true) {
                    matched = e.toLowerCase().startsWith(inputData.toLowerCase());
                } else {
                    matched = e.toLowerCase().indexOf(inputData.toLowerCase()) >= 0;
                }
                return matched;
            });

            currentSuggestions.forEach(element => {
                var newItem = "<li>$data$</li>".replace("$data$", element);
                $(suggestionList).append(newItem);
            });

            if (settings.useOverlay) {
                if (currentSuggestions.length > 0) {
                    $(overlayedSuggestion).text(currentSuggestions[0]);
                } else {
                    $(overlayedSuggestion).text("");
                }
            }
        }
        return control;
    };
}(jQuery));