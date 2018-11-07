$(document).ready(function () {
    var isIE = /*@cc_on!@*/ false || !!document.documentMode;

    //Anything using flex will not display properly in IE.
    if (isIE) {
        $(".grouped-buttons").addClass("ie-fix");
    }
});