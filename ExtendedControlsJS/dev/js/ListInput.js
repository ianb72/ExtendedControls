/** List Input */
(function ($) {
    $.fn.listInput = function (options) {
        var baseControl = this;
        var settings = $.extend({
            name: "",
            helpText: "Please enter a value then click add",
            boundArray: null,
            isKO: false,
            inputPanelLabel: "Input",
            addButtonText: "Add",
            removeButtonText: "Remove",
            listItemLabel: "New Item",
            useIndexer: true,
            maxEntries: -1,
            clearInput: false,
            autoAdd: true
        }, options);

        var controlHTML = "";
        var mainControlID = $(baseControl).attr("id");
        controlHTML += "<div class='boundlist-inner'>";
        controlHTML += "<div class='boundlist-input'></div>";
        controlHTML += "<div class='boundlist-items'></div>";
        controlHTML += "</div>";

        $(baseControl).html(controlHTML);
        var innerControl = $(baseControl).find(".boundlist-inner");
        var inputControl = $(baseControl).find(".boundlist-input");
        var inputPanel = $(inputControl).inputPanel({
            hasHelp: true,
            helpText: settings.helpText,
            label: settings.inputPanelLabel,
        });
        var inputGroup = $(inputPanel).find(".input-group");
        var addButtonHTML = "<div class='btn btn-default btn-list btn-list-add'>$text$</div>".replace("$text$", settings.addButtonText);
        $(inputGroup).append(addButtonHTML);

        var listItems = $(innerControl).find(".boundlist-items");

        var limitWarningMessage = $(inputControl).WarningPanel({
            text: "The maximum number of entries has been reached (" + settings.maxEntries + ")",
            warningClass: "error",
            additionalClass: "list-limit-error"
        });
        var limitWarning = $(limitWarningMessage).find(".list-limit-error");
        $(limitWarning).hide();

        UpdateList();

        function UpdateList() {
            $(listItems).html("");
            if (settings.boundArray != null) {
                var boundArray = settings.isKO ? settings.boundArray() : settings.boundArray;
                boundArray.forEach(function (e, i) {
                    var listItemID = mainControlID + "_listItem" + (parseInt(i) + 1);
                    var newTextboxContainerHTML = "<div class='boundlist-item-textbox' id='$itemID$'></div>".replace("$itemID$", listItemID);
                    var newRemoveBtnHTML = "<div class='btn btn-default btn-list btn-list-remove'>$text$</div>".replace("$text$", settings.removeButtonText);
                    $(listItems).append(newTextboxContainerHTML);

                    var textboxLabelText = settings.listItemLabel;
                    if (settings.useIndexer) textboxLabelText += "&nbsp;" + (parseInt(i) + 1);
                    $("#" + listItemID).textbox({
                        labelText: textboxLabelText,
                        tbText: e
                    });

                    var textBoxItem = $("#" + listItemID).find(".textbox");
                    $(textBoxItem).append(newRemoveBtnHTML);
                });

                var removeButtons = $(".textbox .btn-list");
                $(removeButtons).off("click").on("click", function () {
                    var limitWarningMessage = $(this).closest(".boundlist-inner").find(".list-limit-error");
                    $(limitWarningMessage).hide();
                    var itemIndex = parseInt($(this).closest(".boundlist-item-textbox").attr("id").replace("boundList_listItem", "")) - 1;
                    settings.boundArray.splice(itemIndex, 1);
                    UpdateList();
                });
            }
        }

        function AddNewEntry(inputData, sender) {
            var entryCount = settings.isKO ? settings.boundArray().length : settings.boundArray.length;
            var limitWarningMessage = $(sender).closest(".boundlist-input").find(".list-limit-error");
            var inputControl = $(sender).closest(".boundlist-input").find("input");

            if (settings.maxEntries > 0 && entryCount == settings.maxEntries) {
                $(limitWarningMessage).show();
            } else {
                settings.boundArray.push(inputData);
                UpdateList();
                if (settings.clearInput) $(inputControl).val("");
                $(inputControl).focus();
            }
        }

        this.refreshList = function () {
            UpdateList();
        };

        var addButton = $(inputGroup).find(".btn-list");
        $(addButton).off("click").on("click", function () {
            var inputField = $(this).closest(".boundlist-input").find(".input-field");
            AddNewEntry($(inputField).val(), this);
        });

        var inputFieldControl = $(inputControl).find("input");

        $(inputFieldControl).off("keydown").on("keydown", function (e) {
            if (!settings.autoAdd) return;
            var inputData = $(inputFieldControl).val();
            if ((e.which == 13 || e.which == 9) && inputData != "") {
                AddNewEntry(inputData, this);
            }
        });

        if (settings.isKO) {
            settings.boundArray.subscribe(function () {
                UpdateList();
            });
        }

        return this;
    };
}(jQuery));