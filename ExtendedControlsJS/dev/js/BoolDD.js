/**Bool DD */
/**Add dd for boolean variable types*/
/**Requires knockout if ko bindings are used*/
/**Options */
/**koBoundObject : knockout object to bind value to (optional) */
/**trueText: The text to display in the dropdown if the value is true */
/**falseText: The text to display in the dropdown if the value is false */
/**OnValueChanged: A function to call when the value changes */
(function ($) {
    $.fn.boolDD = function (options) {
        var self = this;
        var settings = $.extend({
            koBoundObject: null,
            trueText: "Yes",
            falseText: "No",
            OnValueChanged: null
        }, options);

        if (settings.koBoundObject != null) {
            self.value = settings.koBoundObject();
        }

        var ddHTML = "";
        ddHTML += "<select class='boolDDSelect'>";
        ddHTML += "<option class='boolDDYes' value='true'>" + settings.trueText + "</option>";
        ddHTML += "<option class='boolDDNo' value='false'>" + settings.falseText + "</option>";
        ddHTML += "</select>";
        this.html(ddHTML);

        var ddSelect = $(this).find(".boolDDSelect")[0];
        ddSelect.value = this.value != undefined ? this.value : true;

        $(ddSelect).on("change", function () {
            self.val(ddSelect.value);
            self.value = ddSelect.value;
            if (settings.koBoundObject != null) {
                settings.koBoundObject(ddSelect.value);
            }
            if (settings.OnValueChanged != null) {
                settings.OnValueChanged(self.value);
            }
        });

        if (settings.koBoundObject != null) {
            settings.koBoundObject.subscribe(function () {
                ddSelect.value = settings.koBoundObject();
            });
        }

        return this;
    };
}(jQuery));