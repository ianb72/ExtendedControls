/**Clipboard Utils */
/**Provides a control that is used to pass data to and from the windows clipboard */
(function ($) {
    $.fn.ExtendedClipboard = function (options) {
        var self = this;

        var settings = $.extend({}, options);

        self.copyToClipboard = function (text) {
            var textarea = self[0];
            textarea.textContent = text;
            textarea.select();
            try {
                return document.execCommand("copy"); // Security exception may be thrown by some browsers.
            } catch (ex) {
                console.warn("Copy to clipboard failed.", ex);
                return false;
            }
        };

        return self;
    };
}(jQuery));