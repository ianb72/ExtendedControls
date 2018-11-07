var map;

$(document).ready(function () {
    map = $("#maptest").ExtendedMap({
        areaclick: MapAreaClick,
        onrendered: MapRendered,
        hidetitles: false
    });
});

function MapRendered() {
    $(".area-info-panel").each(function (i, e) {});

}

function MapAreaClick(sender) {
    var params = JSON.parse($(sender).attr("params"));
    var units = params.units;
    var title = $(sender).find("title").text();

    console.log(units);
    console.log(title);
    if (params.url != undefined) {
        window.location.href = params.url;
    }

}