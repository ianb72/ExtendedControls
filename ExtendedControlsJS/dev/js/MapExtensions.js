/**Map extensions */
/**Adds additional functionality to html map component */
/**Attach to <map> control */
(function ($) {
    $.fn.ExtendedMap = function (options) {
        var settings = $.extend({
            areaclick: null,
            /**Addtional function to call when an area is clicked on */
            onrendered: null,
            onresize: null,
            /**Function to call when the scg elements have been rendered */
            hidetitles: true,
            /**Hide the title box in the area details overlay */
            defaultzoom: 1,
            controlpanelOffset: 70
        }, options);

        var extendedMap = this;
        var extendedMapID = $(extendedMap).attr("id");
        var mapControl = $(extendedMap).find("map");
        var mapImage = $(extendedMap).find("img");
        var mapContainer = $(extendedMap).closest(".map-container");
        var imageWidth = mapImage[0].width;
        var imageHeight = mapImage[0].height;

        var areaInfoOverlay;
        var svgControl;
        var mapControlPanel;
        var currentZoom = settings.defaultzoom;
        var shapeControls;
        var controlpanelOffset = settings.controlpanelOffset;

        extendedMap.initMap = function () {
            var controlPanelHTML = "<div class='map-control-panel'>"
            controlPanelHTML += "<div class='ctrl-btn ctrl-in'><span>+</span></div>"
            controlPanelHTML += "<div class='ctrl-btn ctrl-out'><span>-</span></div>"
            controlPanelHTML += "<div class='current-zoom-text'>$currentzoom$</div>".replace("$currentzoom$", currentZoom);
            controlPanelHTML += "</div>";
            $(extendedMap).prepend(controlPanelHTML);

            mapControlPanel = $(extendedMap).find(".map-control-panel");
            var svgHTML = "<svg class='map-svg' id='$id$'>$polygons$</svg>".replace("$id$", extendedMapID + "_svg");
            var areas = $(mapControl).find("area");
            var polygonsHTML = "";
            var shapeCount = 0;
            $(areas).each(function (i, e) {
                var areaShape = $(e).attr("shape");
                var basecoords = $(e).attr("coords");
                //var coords = extendedMap.zoomedPolyPoints(basecoords, currentZoom);
                var coords = basecoords;
                var shapeHTML = "";
                var shapeTitle = $(e).attr("title");
                var shapeHREF = $(e).attr("href");
                var areaParams = $(e).attr("params");
                $(e).attr("id", extendedMapID + "_area_shape" + shapeCount);

                switch (areaShape) {
                    case "poly":
                        shapeHTML = '<polygon id="$id$" class="shape" areashape="$areashape$" points="$points$" href="$href$" params=$params$><title>$title$</title></polygon>';
                        shapeHTML = shapeHTML.replace("$points$", coords);
                        break;
                    case "rect":
                        var splitCoords = coords.split(",");
                        var x = parseFloat(splitCoords[0]);
                        var y = parseFloat(splitCoords[1]);
                        var x2 = parseFloat(splitCoords[2]);
                        var y2 = parseFloat(splitCoords[3]);
                        var w = x2 - x;
                        var h = y2 - y;
                        var shapeHTML = '<rect id="$id$" class="shape" areashape="$areashape$" x="$x$" y="$y$" width="$w$" height="$h$" href="$href$" params=$params$><title>$title$</title></rect>'
                            .replace("$x$", x)
                            .replace("$y$", y)
                            .replace("$w$", w)
                            .replace("$h$", h);
                        break;

                    case "circle":
                        var splitCoords = coords.split(",");
                        var x = parseFloat(splitCoords[0]);
                        var y = parseFloat(splitCoords[1]);
                        var r = parseFloat(splitCoords[2]);
                        var shapeHTML = '<circle id="$id$" class="shape" areashape="$areashape$" cx="$x$" cy="$y$" r="$r$" href="$href$" params=$params$><title>$title$</title></circle>'
                            .replace("$x$", x)
                            .replace("$y$", y)
                            .replace("$r$", r)
                        break;
                }
                shapeHTML = shapeHTML.replace("$title$", shapeTitle)
                    .replace("$href$", shapeHREF)
                    .replace("$areashape$", areaShape)
                    .replace("$params$", " '" + areaParams + "'")
                    .replace("$id$", extendedMapID + "_svg_shape" + shapeCount);

                polygonsHTML += shapeHTML;
                shapeCount++;
            });

            svgHTML = svgHTML.replace("$polygons$", polygonsHTML);
            $(extendedMap).append(svgHTML);
            svgControl = $(extendedMap).find("svg");
            shapeControls = $(svgControl).find(".shape");

            $(extendedMap).append("<div class='area-info-overlay'></div>");
            areaInfoOverlay = $(extendedMap).find(".area-info-overlay");

            $(shapeControls).each(function (i, e) {
                var infoTextHTML = "<div class='area-info-panel' id='$id$' style='margin-left: $left$; margin-top: $top$' params=$params$>";
                infoTextHTML += $(e).find("title").text();
                infoTextHTML += "</div>";

                var left;
                var top;
                var shapetype = $(e).attr("areashape");
                var shapeParams = $(e).attr("params");
                var shapeID = $(e).attr("id");

                switch (shapetype) {
                    case "rect":
                        left = $(e).attr("x");
                        top = $(e).attr("y");
                        break;
                    case "poly":
                        var points = $(e).attr("points");
                        var polyProps = GetPolyProps(points);
                        left = polyProps.x;
                        top = polyProps.y;
                        break;
                    case "circle":
                        break;

                }
                infoTextHTML = infoTextHTML.replace("$left$", left + "px")
                    .replace("$top$", top + "px")
                    .replace("$id$", shapeID + "_info_panel")
                    .replace("$params$", shapeParams);

                $(areaInfoOverlay).append(infoTextHTML);
            });

            if (settings.hidetitles) {
                $(areaInfoOverlay).addClass("hidden");
            }

            $(shapeControls).on("click", function () {
                if (settings.areaclick !== null) {
                    settings.areaclick(this);
                } else {
                    var href = $(this).attr("href");
                    if (href !== "undefined") {
                        window.location.href = href;
                    }
                }
            });

            //var allMapElements = $(".map-container").find(".map-svg, img, .area-info-overlay");

            $(mapControlPanel).find(".ctrl-in").on("click", function () {
                currentZoom += 0.05;
                extendedMap.resizeImage();
                extendedMap.resizeSVG();
                extendedMap.resizePanels();
                SetZoomText();
            });

            $(mapControlPanel).find(".ctrl-out").on("click", function () {
                currentZoom -= 0.05;
                extendedMap.resizeImage();
                extendedMap.resizeSVG();
                extendedMap.resizePanels();
                SetZoomText();
            });


        };


        extendedMap.resizeImage = function () {
            var allMapElements = $(".map-container").find("img");
            $(allMapElements).css("zoom", currentZoom);
            $(allMapElements).css({
                '-moz-transform': 'scale(' + currentZoom + ')',
                '-moz-transform-origin': 'left top',
                'position': 'absolute',
                'top': '-5',
                'left': '1',
            });
        };

        extendedMap.resizeSVG = function () {
            $(shapeControls).each(function (i, e) {
                var shapetype = $(e).attr("areashape");
                var shapeID = $(e).attr("id");
                var areaID = shapeID.replace("_svg_shape", "_area_shape");
                var originalArea = $("#" + areaID);
                var originalAreaCoords = $(originalArea).attr("coords");
                var infoPanel = $("#" + shapeID + "_info_panel");

                switch (shapetype) {
                    case "rect":
                        {
                            var splitCoords = originalAreaCoords.split(",");
                            var currentWidth = (parseFloat(splitCoords[2]) - parseFloat(splitCoords[0]));
                            var currentHeight = (parseFloat(splitCoords[3]) - parseFloat(splitCoords[1]));
                            var newX = parseFloat(splitCoords[0]) * currentZoom;
                            var newY = parseFloat(splitCoords[1]) * currentZoom;
                            var newWidth = currentWidth * currentZoom;
                            var newHeight = currentHeight * currentZoom;

                            $(e).attr("x", newX);
                            $(e).attr("y", newY);
                            $(e).attr("width", newWidth);
                            $(e).attr("height", newHeight);

                            $(infoPanel).css("margin-left", newX + "px");
                            $(infoPanel).css("margin-top", newY + "px");
                        }
                        break;
                    case "poly":
                        {
                            var newCoords = extendedMap.zoomedPolyPoints(originalAreaCoords, currentZoom);
                            $(e).attr("points", newCoords);

                            var points = $(e).attr("points");
                            var polyProps = GetPolyProps(points);
                            var left = polyProps.x;
                            var top = polyProps.y;

                            $(infoPanel).css("margin-left", left + "px");
                            $(infoPanel).css("margin-top", top + "px");
                            break;
                        }
                    case "circle":
                        break;

                }
            });
        };

        extendedMap.zoomedPolyPoints = function (points, zoom) {
            var splitPoints = points.split(",");
            var toReturn = "";
            for (var i = 0; i < splitPoints.length; i++) {
                var newX = parseFloat(splitPoints[i]) * zoom;
                var newY = parseFloat(splitPoints[i + 1]) * zoom;


                toReturn += newX.toString() + "," + newY.toString();
                if (i != (splitPoints.length - 2)) toReturn += ",";
                i++;
            }
            return toReturn;
        };

        extendedMap.resizePanels = function () {
            $(extendedMap).width(imageWidth * currentZoom);
            $(extendedMap).height(imageHeight * currentZoom);

            $(svgControl).width(imageWidth * currentZoom);
            $(svgControl).height(imageHeight * currentZoom);

            $(areaInfoOverlay).width(imageWidth * currentZoom);
            $(areaInfoOverlay).height(imageHeight * currentZoom);


        };

        function SetZoomText() {
            var zoomtext = currentZoom.toFixed(2);
            $(mapControlPanel).find(".current-zoom-text").text(zoomtext);
        };

        extendedMap.zoomToFit = function () {
            mapContainer = $(extendedMap).closest(".map-container");

            var parentWidth = $(mapContainer).width();
            var parentHeight = $(mapContainer).height();
            var parentLeft = $(mapContainer).css("margin-left");
            var parentTop = $(mapContainer).css("margin-top");

            var widthFactor = parentWidth / imageWidth;
            var heightFactor = parentHeight / imageHeight;
            var offsetValue = widthFactor < heightFactor ? widthFactor : heightFactor;

            currentZoom = offsetValue;
            SetZoomText();

            var allMapElements = $(".map-container").find("img,svg");
            $(allMapElements).css("zoom", currentZoom);
            extendedMap.resizeSVG();
            extendedMap.resizePanels();

            var svgLeftOffset = parseFloat(parentLeft.replace("px", "")) * currentZoom;
            $(mapImage).css("margin-left", parentLeft);
            $(svgControl).css("margin-left", parentLeft);

            console.log(extendedMap);
            console.log(svgControl);
            console.log(svgLeftOffset);

            if (settings.onresize !== null) settings.onresize(parentWidth, parentHeight);
        };


        extendedMap.updateControlPanelPos = function (newOffset) {
            var updatedOffset = newOffset === 0 ? controlpanelOffset : newOffset;
            $(mapControlPanel).css("margin-top", updatedOffset + "px");
        };

        $(window).on("resize", function () {
            extendedMap.zoomToFit();
        });

        $(window).on("scroll", function () {
            extendedMap.updateControlPanelPos(this.pageYOffset);
        });


        extendedMap.resizeImage();
        extendedMap.initMap();
        extendedMap.resizePanels();
        extendedMap.updateControlPanelPos(0);

        SetZoomText();

        if (settings.onrendered !== null) {
            settings.onrendered();
        }

        return extendedMap;
    };
}(jQuery));

function GetPolyProps(points) {
    var splitPoints = points.split(",");
    var minX = 999999;
    var minY = 999999;
    var maxX = 0;
    var maxY = 0;

    for (var i = 0; i < splitPoints.length; i++) {
        var x = parseFloat(splitPoints[i]);
        var y = parseFloat(splitPoints[i + 1]);

        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        i++;
    }

    var polyProps = new PolyProps(minX, minY, maxX - minX, maxY - minY);
    return polyProps;
}

function ResizePolyPoints(points, zoom) {

}

function PolyProps(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}