var express = require("express");
var app = express();
var cors = require("cors");
var path = require("path");
var port = 80;
var Probe = require('pmx').probe();
var counter = 0;

var metric = Probe.metric({
    name: 'Counter',
    value: function () {
        return counter;
    }
});

setInterval(function () {
    counter++;
}, 100);

app.use(cors());

// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

app.use(require('express-status-monitor')());
app.use(express.static(path.join(__dirname, "../public")));
app.use("/styles", express.static(path.join(__dirname, "../public", "styles")));
app.use("/scripts", express.static(path.join(__dirname, "../public", "scripts")));
app.use("/images", express.static(path.join(__dirname, "../public", "images")));
app.use("/content", express.static(path.join(__dirname, "../public", "content")));
app.use("/dev", express.static(path.join(__dirname, "dev", "js")));

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "../public", "index.html"));
});

app.get("/testing", function (req, res) {
    res.sendFile(path.join(__dirname, "../public", "testing.html"));
});

app.get("/map", function (req, res) {
    res.sendFile(path.join(__dirname, "../public", "map.html"));
});

app.get("/map1", function (req, res) {
    res.sendFile(path.join(__dirname, "../public", "map.1.html"));
});

app.listen(port);