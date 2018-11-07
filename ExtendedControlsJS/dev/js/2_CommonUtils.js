/**Common general Javascript utils */
/**Sort the provided data on col/property in the direction specified */
/**source - The data source to sort */
/**sortcol - The column/property to sort by */
/**sortdesc - boolean sort descending */
/**Returns a new array with the sorted data */
function sortData(source, sortcol, sortdesc) {
    var sortedData;
    sortedData = source.sort(function (a, b) {
        var toReturn;
        if (sortdesc) {
            toReturn = a[sortcol] < b[sortcol] ? 1 : -1;
        } else {
            toReturn = b[sortcol] < a[sortcol] ? 1 : -1
        }
        return toReturn;
    });
    return sortedData;
}



/**Non jQueryUI draggable */
/**Make an element draggable without using jQueryUI */
(function ($) {
    $.fn.drags = function (opt) {

        opt = $.extend({
            handle: "",
            cursor: "move"
        }, opt);

        if (opt.handle === "") {
            var $el = this;
        } else {
            var $el = this.find(opt.handle);
        }

        return $el.css("cursor", opt.cursor).on("mousedown", function (e) {
            if (opt.handle === "") {
                var $drag = $(this).addClass("draggable");
            } else {
                var $drag = $(this).addClass("active-handle").parent().addClass("draggable");
            }
            var z_idx = $drag.css("z-index"),
                drg_h = $drag.outerHeight(),
                drg_w = $drag.outerWidth(),
                pos_y = $drag.offset().top + drg_h - e.pageY,
                pos_x = $drag.offset().left + drg_w - e.pageX;
            $drag.css("z-index", 9999).parents().on("mousemove", function (e) {
                $(".draggable").offset({
                    top: e.pageY + pos_y - drg_h,
                    left: e.pageX + pos_x - drg_w
                }).on("mouseup", function () {
                    $(this).removeClass("draggable").css("z-index", z_idx);
                });
            });
            e.preventDefault(); // disable selection
        });

    }
})(jQuery);