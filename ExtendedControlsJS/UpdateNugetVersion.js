var fs = require("fs");
var parseString = require("xml2js").parseString;
var xml2js = require("xml2js");

var nuspecPath = "./release/AS.ExtendedControlsJS.nuspec";
var nuspecVersion;
var nuspecData;
var libraryVersion;

module.exports.CheckAndUpdate = function () {
    GetNuspecVersion();
};

function GetNuspecVersion() {
    fs.readFile(nuspecPath, "utf-8", function (err, data) {
        if (err) console.log(err);
        parseString(data, function (err, result) {
            if (err) console.log(err);
            nuspecData = result;
            nuspecVersion = nuspecData.package.metadata[0].version[0];
            GetLatestFileVersion();
        });
    });
}

function GetLatestFileVersion() {
    fs.readFile("./properties/FullVersion.txt", "utf-8", function (err, data) {
        libraryVersion = data;
        UpdateNuspecXML();
    });
}

function UpdateNuspecXML() {
    nuspecData.package.metadata[0].version[0] = libraryVersion;
    var builder = new xml2js.Builder();
    var newXML = builder.buildObject(nuspecData);
    fs.writeFile(nuspecPath, newXML, function (err, data) {
        if (err) console.log(err);
    });
}