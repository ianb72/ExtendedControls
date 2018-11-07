/*Header*/
(function ($) {
    $.fn.PageHeader = function (options) {
        var control = this;
        var newHTML = "";

        control.appTitle = "";
        control.pageTitle = "";
        control.noMediaIcons = false;

        var pageTitle = $(this).attr("pagetitle");
        var appTitle = $(this).attr("apptitle");
        var noMediaIcons = $(this).attr("nomediaicons");
        var homeURL = $(this).attr("homeurl");

        control.appTitle = appTitle;
        control.pageTitle = pageTitle;
        control.noMediaIcons = noMediaIcons;

        var settings = $.extend({}, options);

        newHTML += "<div class='row'>";
        newHTML += "<div class='header-row col-sm-12'>";
        newHTML += "<div class='row'>";
        newHTML += "<div class='logo-container col-sm-2'>";
        newHTML += "<div class='logo-main'></div>";
        newHTML += "</div>";
        newHTML += "<div class='title-container col-sm-8'>";
        newHTML += "<div class='header-content'>";
        newHTML += "<div class='header-app-title'></div>";
        newHTML += "<div class='header-page-title'></div>";
        newHTML += "</div>";
        newHTML += "</div>";
        newHTML += "<div class='social-media-container col-sm-2'>";
        newHTML += "<div class='header-content'>";
        newHTML += "<div class='social-media-element'></div>";
        newHTML += "</div>";
        newHTML += "</div>";
        newHTML += "</div>";
        newHTML += "</div>";
        newHTML += "</div>";
        control.html(newHTML);

        var pageTitleElement = $(control).find(".header-page-title");
        $(pageTitleElement).text(control.pageTitle);

        var appTitleElecment = $(control).find(".header-app-title");
        $(appTitleElecment).text(control.appTitle);

        var socialMediaContainer = $(control).find(".social-media-container");
        if (!control.noMediaIcons) {
            $(socialMediaContainer).ASSocialMedia();
        } else {
            $(socialMediaContainer).hide();
        }

        var imageElement = $(control).find(".logo-main");
        if (homeURL != undefined) {
            $(imageElement).addClass("has-link");
        }

        $(imageElement).on("click", function () {
            if (homeURL != undefined) {
                window.location.href = homeURL;
            }
        });

        return control;
    };
}(jQuery));