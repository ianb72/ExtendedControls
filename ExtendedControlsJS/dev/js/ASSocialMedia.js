/*AS Social Media */
/*Replaced by SocialMediaIcons control */
/** Retained for compatiability with existing AS Apps */
(function ($) {
    $.fn.ASSocialMedia = function (options) {
        var control = this;
        $(control).SocialMediaIcons(options);
        return control;
    };
}(jQuery));