/*AS Header*/
/*Retained for compatibility with AS Apps*/
(function ($) {
    $.fn.ASHeader = function (options) {
        var control = this;
        $(control).PageHeader(options);
        return control;
    };
}(jQuery));