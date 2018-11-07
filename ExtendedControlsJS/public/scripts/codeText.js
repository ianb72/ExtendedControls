function GenerateCodeText() {
    $(".panel-collapse").each(function (i, e) {
        var panelnumber = parseInt($(this).attr("panelnumber"));
        var newCodeDef = new CodeDef($(e).html().trim(), "");
        vm.elementOriginalCode()[panelnumber] = newCodeDef;
    });

    ReadJSFile();
}

function CodeDef(html, javascript) {
    this.html = html;
    this.javascript = javascript;
}

function ReadJSFile() {
    var allText = "";
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", "scripts/extendedControlsPage.js", false);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                allText = rawFile.responseText;
            }
        }
    }
    rawFile.send(null);

    var controlText = allText.split("//Definition//");
    var sections = controlText[1].split("//Section//");

    sections.forEach(function (e, i) {
        var rex = /^[^\d]*(\d+)/;
        var sectionNumber = rex.exec(e);
        if (sectionNumber !== null) {
            vm.elementOriginalCode()[sectionNumber[1]].javascript = e;
        }
    });

}