/**Embelishments */
/**Glower */
var glowers;

$(document).ready(function () {
    InitGlowers(1000);
});

/**Sets a glowing border to any elements that have the 'glower' class */
function InitGlowers(glowInterval) {
    glowers = $(document).find(".glower");
    window.setInterval(function () {
        $.each(glowers, function (index, value) {
            if ($(value).hasClass("glowon")) {
                $(value).toggleClass("glow");
            }
        });
    }, glowInterval);
}