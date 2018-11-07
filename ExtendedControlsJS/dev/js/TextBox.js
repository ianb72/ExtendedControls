/*Textbox*/
(function ($) {
    $.fn.textbox = function (options) {
        var control = this;
        var settings = $.extend({
            labelText: "",
            tbText: "",
            textkoBinding: null,
            labelkoBinding: null,
            noLabel: false,
            id: ""
        }, options);

        function labelText(newValue) {
            settings.labelText = newValue;
        }

        if (settings.labelkoBinding != null) {
            settings.labelText = settings.labelkoBinding();
        }

        if (settings.textkoBinding != null) {
            settings.tbText = settings.textkoBinding();
        }

        var newHTML = "";
        newHTML += "<div class='textbox' id='$id$'>".replace("$id$", settings.id);
        newHTML += "<div class='textbox-label'><label>$labelText$</label></div>".replace("$labelText$", settings.labelText);
        newHTML += "<label class='textbox-text'><label>$tbText$</label></v>".replace("$tbText$", settings.tbText);
        newHTML += "</div>";
        control.html(newHTML);

        var mainControl = $(control[0]).find(".textbox");
        var labelControl = $(mainControl).find(".textbox-label")[0];
        var textControl = $(mainControl).find(".textbox-text")[0];

        control.setText = function (textvalue) {
            var textControl = $(mainControl).find(".textbox-text")[0];
            $(textControl).text(textvalue);
        };

        if (settings.noLabel) {
            $(mainControl).addClass("no-label");
        }

        if (settings.labelkoBinding != null) {
            settings.labelkoBinding.subscribe(function () {
                $(labelControl).find("label").text(settings.labelkoBinding().toString());
            });
        }

        if (settings.textkoBinding != null) {
            settings.textkoBinding.subscribe(function () {
                $(textControl).find("label").text(settings.textkoBinding().toString());
            });
        }
        return control;
    };
}(jQuery));