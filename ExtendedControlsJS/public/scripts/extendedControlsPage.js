var vm;
var inputModal;
var dataTable;
var busyBox;
var boolDDTest;
var formattedSelectTest;
var formattedTextTest;
var helpcontrolTest;
var inputPanelTest;
var listInputTest;
var modalInputTest;
var modalRequestorTest;
var textBoxTest;
var warningPanelTest;
var busySplashTest;
var modalHelp;
var modalPanel;

var elementHelpModal;

var button1;
var button2;
var button3;
var button4;
var button5;
var buttonTotalValue;
var buttonResiValue;
var buttonNonResitValue;
var selectionButtonGroup;

$(document).ready(function () {
    ko.applyBindings(new WebViewModel());

    GenerateCodeText();

    //Definition//
    //Section//
    //[0]//
    selectionButtonGroup = $("#buttonGroupActionSelection").buttonGroup({});

    button1 = $("#button1").selectionButton({
        buttonGroup: selectionButtonGroup
    });

    button2 = $("#button2").selectionButton({
        buttonGroup: selectionButtonGroup
    });

    button3 = $("#button3").selectionButton({
        buttonGroup: selectionButtonGroup
    });

    button4 = $("#button4").selectionButton({
        buttonGroup: selectionButtonGroup
    });

    button5 = $("#button5").selectionButton({
        buttonGroup: selectionButtonGroup
    });

    //Section//
    //[1]//
    busyBox = $("#bbTest").busyBox({
        show: true
    });

    //Section//
    //[2]//
    boolDDTest = $("#boolDDTest").boolDD({});

    //Section//
    //[3]//
    vm.testGetData(true, false);
    dataTable = $("#testDataTable").DataTable({
        tableData: vm.testTableData
    });

    dataTable.Events.NewEventHandler("save", TableSaveCallback);
    dataTable.Events.NewEventHandler("save", OtherSaveHandler);
    dataTable.Events.NewEventHandler("rowselected", NewRowSelected);

    //Section//
    //[4]//
    formattedSelectTest = $("#formattedSelectTest").formattedSelect({
        listValues: true
    });

    //Section//
    //[5]//
    //Formatted Input//
    //No Javascript required//

    //Section//
    //[6]//
    helpcontrolTest = $("#helpcontrolTest").helpControl({
        helpText: "Help control"
    });

    //Section//
    //[7]//
    inputPanelTest = $("#inputPanelTest").inputPanel({
        label: "Input Panel",
        hasHelp: true,
        helpText: "Help me"
    });

    //Section//
    //[8]//
    var listInputArray = [];
    listInputTest = $("#listInputTest").listInput({
        boundArray: listInputArray
    });

    //Section//
    //[9]//
    modalInputTest = $("#modalInputTest").ModalInput({
        button1Click: inputModalTestOk
    });

    $("#modalInputButton").on("click", function () {
        modalInputTest.showModal();
    });

    //Section//
    //[10]//
    modalRequestorTest = $("#modalRequestorTest").ModalRequestor({
        useIcon: true,
        iconClass: "fa-warning fa-3x",
        onButton1Click: requestorOkClick,
        onButton2Click: requestorCancelClick
    });

    $("#modalRequestorButton").on("click", function () {
        modalRequestorTest.show();
    });

    //Section//
    //[11]//
    textBoxTest = $("#textBoxTest").textbox({
        tbText: "Test",
        labelText: "Textbox label"
    });

    //Section//
    //[12]//
    $("#warningPanelError").WarningPanel({
        warningClass: "error",
        text: "Error"
    });

    $("#warningPanelWarning").WarningPanel({
        warningClass: "warning",
        text: "Warning"
    });

    $("#warningPanelInfo").WarningPanel({
        warningClass: "info",
        text: "Info"
    });

    //Section//
    //[13]//
    //Glower//


    //Section//
    //[14]//
    busySplashTest = $("body").busySplash({});
    $("#busyTestButton").on("click", function () {
        busySplashTest.show();
    });


    //Section//
    //[15]//
    modalHelp = $("#testHelpModal").ModalHelp({
        title: "Help Modal",
        name: "test",
        embedURL: "testing.html"
    });

    $("#helpModalButton").on("click", function () {
        modalHelp.show();
    });

    //Section//
    //[16]//
    $("#showHideButton").showHideButton();

    //Section//
    //[17]//

    //Section//
    //[18]//

    //Section//
    //[19]//
    // $("#imagecaptcha").CaptchaImage({
    //     captchaProviderURL: "http://ed-crn-01:9091/AS.ImageCaptchaGenerator/Captcha/"
    // });

    //Section//
    //[20]//
    modalPanel = $("#testModalPanel").ModalPanel({
        title: "Modal Panel",
        name: "modalPanelTest",
        panelHTML: "<div>Hello World</div>",
        button1Click: modalButton1,
        button2Click: modalButton2
    });

    function modalButton1() {
        //alert("Button1");
    }

    function modalButton2() {
        //alert("Button2");
    }

    $("#modalPanelButton").on("click", function () {
        modalPanel.show();
    });

    //Definition//
    $("#myModal").on("show.bs.modal", function () {
        $(this).find(".modal-body").css({
            "max-height": "100%"
        });
    });


    $(".btn-test").click(function () {
        $(".panel-collapse").toggle();
    });

    $(".panel-collapse").each(function (i, e) {
        $(e).append("<div class='row'><div class='btn btn-default btn-show-code red'>Show Code</div></div>");
    });

    $(".btn-show-code").on("click", function () {
        var panelCollapse = $(this).closest(".panel-collapse");
        var panelNumber = panelCollapse.attr("panelnumber");
        vm.CurrentControl(panelCollapse.attr("paneltitle"));
        vm.ElementHTML(vm.elementOriginalCode()[panelNumber].html);
        vm.ElementJavascript(vm.elementOriginalCode()[panelNumber].javascript);
    });

    elementHelpModal = $("#elementHelpModal").ModalHelp({});

    $(".btn-additional-help").on("click", function () {
        elementHelpModal.show();
        elementHelpModal.setTitle(vm.CurrentControl());

        var helpPageHTML = GetHelpHTML();
        if (helpPageHTML.result != 404) {
            elementHelpModal.setHTML(helpPageHTML.text);
            $("#helpHTML").text(vm.ElementHTML());
            $("#helpCode").text(vm.ElementJavascript());
        } else {
            elementHelpModal.setHTML("<h4>Help page not found</h4>");
        }
    });

    var panelsshown = false;
    $(".panel-collapse").hide();
    $(".btn-show-all").on("click", function () {
        panelsshown = !panelsshown;
        if (panelsshown) {
            $(".panel-collapse").show();
        } else {
            $(".panel-collapse").hide();
        }
    });
});

function GetPageResult(text, result) {
    this.text = text;
    this.result = result;
};

function GetHelpHTML() {
    var helpPage = "helppages/" + vm.CurrentControl().replace(" ", "") + ".html";
    var allText = "";
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", helpPage, false);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                allText = rawFile.responseText;
            }
        }
    }
    rawFile.send(null);
    return new GetPageResult(allText, rawFile.status);
}

function glowershow() {
    $("#glowerTest").addClass("glowon");
}

function glowerhide() {
    $("#glowerTest").removeClass("glowon");
}

function dtShow() {}

function requestorOkClick() {}

function requestorCancelClick() {}

function inputModalTestOk(value) {}

function NewRowSelected() {
    console.log("Row Selected");
}

function OtherSaveHandler(params) {
    console.log("Other Save Handler");
    console.log(params);
}


function TableSaveCallback(dataSaveParams) {
    dataSaveParams.newRows.forEach(function (e, i) {
        vm.testPostData(e.title, e.test);
    });

    dataSaveParams.deletedRows.forEach(function (e, i) {
        vm.testDataDelete(e.id);
    });

    dataSaveParams.changedRows.forEach(function (e, i) {
        vm.testPutData(e.id, e.title, e.test);
    });
}