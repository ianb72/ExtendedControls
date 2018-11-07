/**Extended controls - Controller */

var textboxes;
var koVM;
var ECClipboard;

$(document).ready(function () {
    InitArrays();
    GenerateTextBoxes();
    AddClipboard();
});

function AddIEDatepicker() {
    var ua = window.navigator.userAgent;
    var msie = ua.toLowerCase().indexOf("trident");
    if (msie > 0) {
        $("input[type=date]").datepicker();
    }
}

function InitArrays() {
    textboxes = [];
}

function GenerateTextBoxes() {
    $(".ec-textbox").each(function () {
        var originalControl = this;
        var text = $(this).text();
        var labelText = $(this).attr("labeltext");
        var noLabel = $(this).attr("nolabel");
        var id = $(this).attr("id");
        var textBinding = $(this).attr("textBinding");
        var labelBinding = $(this).attr("labelBinding");
        var viewModel = $(this).attr("koViewModel");

        var newID = "ecTextBox" + textboxes.length;

        var newTextbox = $(this).textbox({
            tbText: text,
            labelText: labelText,
            noLabel: noLabel,
            id: id != null ? id : newID,
            textkoBinding: ParseBindingString(textBinding, viewModel),
            labelkoBinding: ParseBindingString(labelBinding, viewModel)
        });

        textboxes.push(newTextbox);
    });
}

function GetBindingContext(control) {
    var databindingAttr = $(control).attr("data-bind");
    if (databindingAttr != undefined) {
        var splitBindingsDef = databindingAttr.split(":");
        var bindingType = splitBindingsDef[0].trim();
        var boundValueName = splitBindingsDef[1].trim();
        var bindingContext = ko.contextFor(control);
        return bindingContext.$data[boundValueName];
    }
    return null;
}

function ParseBindingString(bindingString, boundViewModel) {
    var viewModel;
    var boundVariable;
    /**Provides functions for overall control of Extended Controls */

    var boundProperty;

    if (bindingString == null) return null;

    if (boundViewModel == null) {
        viewModel = bindingString.split(".")[0];
        boundVariable = bindingString.split(".")[1];
    } else {
        viewModel = boundViewModel;
        boundVariable = bindingString;
    }

    boundProperty = window[viewModel][boundVariable];
    return boundProperty;
}

function AddClipboard() {
    ECClipboard = $(".extended-clipboard").ExtendedClipboard();
}