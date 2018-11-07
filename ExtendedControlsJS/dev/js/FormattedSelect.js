/** Formatted Select */
/** Provides a solution to the fact that in a <SELECT></SELECT> the items cannot be formatted */
/**options */
/**koBoundObject: A knockout object to bind the selected value to */
/**listValues: Include the value in the displayed list of items, just show the text by default */
/**additionalHTML: Additonal HTML to use to format the items in the list */
/**--Uses certain tags that will be replaced by the specified value */
/**$text$ -  The text attribute of the <OPTION></OPTION> */
/**$value$ - The value attribute of the <OPTION></OPTION> */
(function ($) {
    $.fn.formattedSelect = function (options) {
        var control = this;
        var selectOptions = $(control).find("option");
        var newList = document.createElement("div");
        var optionsVisible = false;
        var selectedItem;
        var selectionItems;
        var selectionItem;
        var formattedSelectTop;
        var fsID = control[0].id;

        control.selectedOptionText = "";
        control.selectedOptionValue = null;

        var settings = $.extend({
            koBoundObject: null,
            listValues: false,
            additionalHTML: "",
            isBoolean: false
        }, options);

        Init();
        GenerateHTML();
        GetComponents();
        AddHandlers();

        function Init() {
            var text = "";

            if (settings.koBoundObject != null) {
                control.selectedOptionValue = settings.koBoundObject();
                if (control.selectedOptionValue !== null && control.selectedOptionValue !== "") {
                    text = getSelectedOptionText(control.selectedOptionValue.toString())[0].text;
                    control.selectedOptionText = selectionTextHTML(text, control.selectedOptionValue);
                } else {
                    text = selectOptions[0].text;
                    control.selectedOptionValue = selectOptions[0].value;
                    control.selectedOptionText = selectionTextHTML(text, control.selectedOptionValue);
                }
            } else {
                text = selectOptions[0].text;
                control.selectedOptionValue = selectOptions[0].value;
                control.selectedOptionText = selectionTextHTML(text, control.selectedOptionValue);
            }
        }

        function GetComponents() {

            selectedItem = $(newList).find(".selected-item");
            selectionItems = $(newList).find(".selection-items");
            selectionItem = $(newList).find(".selection-item");
            formattedSelectTop = $(newList).find(".formatted-select");
        }

        function AddHandlers() {

            $(selectedItem).on("click", function () {
                $(selectionItems).toggle();
                setVisbile(!optionsVisible);
            });

            $(selectionItem).on("click", function () {
                var selectedValue = $(this).attr("value");
                var selectedText = getSelectedOptionText(selectedValue)[0].text;
                $(selectedItem).html(selectionTextHTML(selectedText, selectedValue));
                control.value = selectedValue;
                $(selectionItems).hide();
                setVisbile(false);

                var parsedValue = control.value;
                if (settings.isBoolean) {
                    parsedValue = control.value == "true";
                    if (control.value == "default") parsedValue = null;
                }

                if (settings.koBoundObject != null) {
                    settings.koBoundObject(parsedValue);
                } else {

                }
            });

            if (settings.koBoundObject != null) {
                settings.koBoundObject.subscribe(function () {
                    var selectedValue = settings.koBoundObject();

                    if (selectedValue == undefined) {
                        selectedValue = "default";
                    } else {
                        selectedValue = selectedValue.toString();
                    }

                    var selectedText = getSelectedOptionText(selectedValue)[0].text;
                    $(selectedItem).html(selectionTextHTML(selectedText, selectedValue));
                    control.value = selectedValue;
                });
            }
        }

        function GenerateHTML() {
            var newHTML = "<div class='formatted-select' id='" + fsID + "'>";
            newHTML += "<div class='selected-item collapsed'>" + control.selectedOptionText + "</div>";
            newHTML += "<div class='selection-items'>";
            newHTML += "<ul>";
            $.each(selectOptions, function (i, e) {
                newHTML += "<li>";
                newHTML += "<div class='selection-item'";
                newHTML += " value=" + e.value;
                newHTML += ">";
                newHTML += selectionTextHTML(e.text, e.value);
                newHTML += "</div>";
                newHTML += "</li>";
            });
            newHTML += "</ul>";
            newHTML += "</div>";
            newHTML += "</div>";
            newList.innerHTML = newHTML.trim();
        }

        function selectionTextHTML(text, value) {
            var selectionHTML = "";
            var textHTML = text;
            var valueHTML = value;

            if (settings.additionalHTML != "") {
                textHTML = settings.additionalHTML.replace("$text$", text).replace("$value$", value);
            }

            selectionHTML += "<span class='selection-item-text'>" + textHTML + "</span>";
            if (settings.listValues) {
                selectionHTML += "<span class='selection-item-value'>" + valueHTML + "</span>";
            }
            return selectionHTML;
        }

        function getSelectedOptionText(selectedOption) {
            return selectOptions.filter(function (i, op) {
                return op.value == selectedOption;
            });
        }

        function setVisbile(visibleState) {
            optionsVisible = visibleState;
            if (visibleState) {
                $(selectedItem).addClass("expanded");
                $(selectedItem).removeClass("collapsed");

                $(formattedSelectTop).addClass("expanded");
            } else {
                $(selectedItem).removeClass("expanded");
                $(selectedItem).addClass("collapsed");

                $(formattedSelectTop).removeClass("expanded");
            }
        }

        $(selectionItems).hide();
        this.replaceWith(newList);

        return control;
    };
}(jQuery));