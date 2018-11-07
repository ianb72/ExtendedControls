/**Binder */
function binder() {
    var currentBindings = [];

    function UpdateBindings() {
        //Find model directives.
        $("[ec-bind-model]").each(function (i, e) {
            var modelname = $(e).attr("ec-bind-model");
            //Find bound value directives for model.
            //Find text binding directives.
            $(e).find("[ec-bind-text]").each(function (i, e) {
                var isForeach = $(this).closest("[ec-bind-foreach]").length > 0;
                if (isForeach) return;
                var propname = $(e).attr("ec-bind-text");
                var proptype = typeof (window[modelname][propname]);
                var bindingID = "text_" + modelname + "_" + propname;

                $(e).text(window[modelname][propname]);

                if (currentBindings.indexOf(bindingID) == -1) {
                    watch(window[modelname], propname, function () {
                        $(e).text(window[modelname][propname]);
                    });
                    currentBindings.push(bindingID);
                }

            });
            //Find html binding directives.
            $(e).find("[ec-bind-html]").each(function (i, e) {
                var isForeach = $(this).closest("[ec-bind-foreach]").length > 0;
                if (isForeach) return;
                var propname = $(e).attr("ec-bind-html");
                var bindingID = "html_" + modelname + "_" + propname;
                $(e).html(window[modelname][propname]);

                if (currentBindings.indexOf(bindingID) == -1) {
                    watch(window[modelname], propname, function () {
                        $(e).html(window[modelname][propname]);
                    });
                    currentBindings.push(bindingID);
                }

            });
            //Find input value binding directives.
            //Bi-directional.
            $(e).find("[ec-bind-value]").each(function (i, e) {
                var isForeach = $(this).closest("[ec-bind-foreach]").length > 0;
                if (isForeach) return;
                var propname = $(e).attr("ec-bind-value");
                var bindingID = "value_" + modelname + "_" + propname;
                $(e).val(window[modelname][propname]);

                if (currentBindings.indexOf(bindingID) == -1) {
                    watch(window[modelname], propname, function () {
                        $(e).val(window[modelname][propname]);
                    });

                    $(e).off("change").on("change", function () {
                        window[modelname][propname] = $(e).val();
                    });
                }
            });
            //Find foreach bindings
            $(e).find("[ec-bind-foreach]").each(function (i, e) {
                var bindingID = "foreach_" + modelname + "_" + propname;
                var propname = $(e).attr("ec-bind-foreach");
                var boundCollection = window[modelname][propname];
                var children = $(this).children();

                console.log(children);

                if (currentBindings.indexOf(bindingID) == -1) {
                    watch(window[modelname], propname, function () {
                        UpdateBoundChildren();
                    });
                }

                AddChildBindings();

                function AddChildBindings() {

                };

                function UpdateBoundChildren() {
                    boundCollection.forEach(function (e, i) {
                        console.log(e);
                    });
                };

            });

        });
    };

    return {
        UpdateBindings: UpdateBindings,
        CurrentBindings: currentBindings
    }
}