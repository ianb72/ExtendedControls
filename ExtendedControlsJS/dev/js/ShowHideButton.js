/**Button to show/hide any element */
(function ($) {
    $.fn.showHideButton = function (options) {
        var control = this;
        var attrTarget = $(control).attr("target");
        var attrTargetVisible = $(control).attr("targetVisible");

        var options = $.extend({
            target: null,
            targetVisible: false,
            text: "",
        }, options);

        control.target = attrTarget || options.target;
        control.targetVisiblle = attrTargetVisible || options.targetVisible;
        control.text = $(control).text() || options.text;

        var buttonHTML = "";
        buttonHTML += "<div class='btn btn-default btn-show-hide'>";
        buttonHTML += control.text;
        buttonHTML += "</div>";
        control.html(buttonHTML);

        if (!control.targetVisible && control.target != null) {
            $("#" + control.target).hide();
        }

        var button = $(control).find(".btn-show-hide");
        $(button).on("click", function () {
            control.targetVisible = !control.targetVisible;
            if (control.targetVisible) {
                $("#" + control.target).show(500);
            } else {
                $("#" + control.target).hide(500);
            }
        });

        return control;
    }
}(jQuery));