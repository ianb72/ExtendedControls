/**Panelled Buttons */
(function ($) {
    $.fn.buttonGroup = function (options) {
        var control = this;
        control.addClass("button-group");
        control.disabled = false;

        var settings = $.extend({
            isBool: false,
            bindings: {
                viewModel: null,
                value: null
            }
        }, options);

        control.viewModel = $(control).attr("viewModel") ? $(control).attr("viewModel") : settings.bindings.viewModel;
        control.boundValue = $(control).attr("boundValue") ? $(control).attr("boundValue") : settings.bindings.value;
        control.isBool = $(control).attr("isBool") ? $(control).attr("isBool") : settings.isBool;

        if (control.viewModel !== null && control.boundValue !== null) {
            control.boundValueObject = window[control.viewModel][control.boundValue];
        } else {
            control.boundValueObject = null;
        }

        control.updateBoundValue = function (newValue) {
            var objectType = typeof (control.boundValueObject());
            if (control.isBool || objectType == "boolean") {
                control.boundValueObject(newValue.toLowerCase() == "true");
            }
        };

        control.buttons = [];
        control.setActiveButton = function (index) {
            var button = control.buttons[index];
            button.SetAsActive();
        };

        return control;
    };

    $.fn.selectionButton = function (options) {
        var control = this;
        control.addClass("selection-button");
        control.eventHandlers = {};

        control.Events = {
            NewEventHandler: function (event, handler) {
                var hasExistingHandlers = control.eventHandlers[event] != undefined;
                if (!hasExistingHandlers) control.eventHandlers[event] = [];
                control.eventHandlers[event].push(handler);
            }
        };

        control.event = function (eventName, params) {
            if (control.eventHandlers == undefined) return;
            if (control.disabled) return;
            if (control.eventHandlers[eventName] != undefined && control.eventHandlers[eventName].length > 0) {
                control.eventHandlers[eventName].forEach(function (handler, i) {
                    if (params != null) {
                        handler(params);
                    } else {
                        handler();
                    }
                });
            }
        };

        var settings = $.extend({
            btntitle: "",
            icon: "",
            value: null,
            text: "",
            attachedControl: null,
            buttonGroup: null,
            bindings: {
                title: null,
                icon: null,
                value: null,
                text: null
            }
        }, options);

        if (settings.attachedControl != null) {
            control.attachedControl = settings.attachedControl;
            $(control.attachedControl).hide();
        }

        if (settings.bindings.title != null) {
            settings.bindings.title.subscribe(function () {
                control.btntitle(settings.bindings.title());
                control.updateTitle();
            });
        } else {
            control.btntitle = $(control).attr("btntitle") ? $(control).attr("btntitle") : settings.btntitle;
        }

        if (settings.bindings.icon != null) {
            control.icon = settings.bindings.icon();
            settings.bindings.icon.subscribe(function () {
                control.icon = settings.bindings.icon();
                control.updateIcon();
            });
        } else {
            control.icon = $(control).attr("icon") ? $(control).attr("icon") : settings.icon;
        }

        if (settings.bindings.value != null) {
            control.value = settings.bindings.value();
            settings.bindings.value.subscribe(function () {
                control.value = settings.bindings.value();
                control.updateText();
            });
        } else {
            control.value = $(control).attr("value") ? $(control).attr("value") : settings.value;
        }

        if (settings.bindings.text != null) {
            control.text = settings.bindings.text();
            settings.bindings.text.subscribe(function () {
                control.text = settings.bindings.text();
                control.updateText();
            });
        } else {
            control.text = $(control).attr("text") ? $(control).attr("text") : settings.text;
        }

        var generatedHTML = "";
        generatedHTML += "<div class='selection-button-outer'>";
        generatedHTML += "<div class='button-title'>$btntitle$</div>".replace("$btntitle$", control.btntitle);
        generatedHTML += "<div class='button-icon'><icon class='$icon$'></icon></div>".replace("$icon$", control.icon);
        generatedHTML += "<div class='button-text'>$text$</div>".replace("$text$", control.text);
        generatedHTML += "</div>";

        control.html(generatedHTML);

        control.updateTitle = function () {
            $(control).find(".button-title").text(control.btntitle);
        };
        control.updateIcon = function () {
            $(control).find(".button-icon").find("icon").attr("class", control.icon);
        };
        control.updateText = function () {
            $(control).find(".button-text").text(control.text);
        };

        ClickEventHandlerSubscription();

        if (settings.buttonGroup != null) {
            settings.buttonGroup.buttons.push(control);
        }

        function ClickEventHandlerSubscription() {
            $(control).off("click").on("click", function () {
                control.SetAsActive();
                control.updateGroupBoundValue();
                control.event("click", control);
            });
        }

        control.updateGroupBoundValue = function () {
            if (settings.buttonGroup.boundValueObject != null) {
                settings.buttonGroup.updateBoundValue(control.value);
            }
        };

        control.SetAsActive = function () {
            if (settings.buttonGroup != null) {
                settings.buttonGroup.buttons.forEach(function (e, i) {
                    $(e).removeClass("active");
                    $(e.attachedControl).hide();
                });
            }

            if (settings.attachedControl != null) {
                $(settings.attachedControl).show();
                $(settings.attachedControl).find("input").focus();
                $(settings.attachedControl).find("input").select();
            }

            $(control).addClass("active");
        }

        control.setInvalidInput = function () {
            $(control).find(".selection-button-outer").addClass("invalid-input");
        };

        control.setDisabled = function (state) {
            control.disabled = state;
            if (control.disabled) {
                $(control).addClass("disabled");
            } else {
                $(control).removeClass("disabled");
            }

        };

        return control;
    }
}(jQuery));