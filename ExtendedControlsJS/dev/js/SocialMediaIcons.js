/*Social Media */
(function ($) {
    $.fn.SocialMediaIcons = function (options) {
        var control = this;
        var newHTML = "";
        var settings = $.extend({
            liURL: "",
            fbURL: "",
            twURL: "",
            gpURL: ""
        }, options);

        newHTML += "";
        newHTML += "<a class='social-media-standalone hide-title' href='$liURL$'>".replace("$liURL$", settings.liURL);
        newHTML += "<span class='icon fa fa-linkedin'></span>";
        newHTML += "<span class='title'>linkedin</span>";
        newHTML += "</a>";
        newHTML += "<a class='social-media-standalone hide-title' href='$fbURL$'>".replace("$fbURL$", settings.fbURL);
        newHTML += "<span class='icon fa fa-facebook'></span>";
        newHTML += "<span class='title'>facebook</span>";
        newHTML += "</a>";
        newHTML += "<a class='social-media-standalone hide-title' href='$twURL$'>".replace("$twURL$", settings.twURL);
        newHTML += "<span class='icon fa fa-twitter'></span>";
        newHTML += "<span class='title'>twitter</span>";
        newHTML += "</a>";
        newHTML += "<a class='social-media-standalone hide-title' href='$gpURL$'>".replace("$gpURL$", settings.gpURL);
        newHTML += "<span class='icon fa fa-google-plus'></span>";
        newHTML += "<span class='title'>googleplus</span>";
        newHTML += "</a>";

        control.html(newHTML);

        return control;

    };
}(jQuery));