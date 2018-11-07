function WebViewModel() {
    var self = this;
    vm = this;

    self.textboxTest = ko.observable("Test");
    self.testTableData = ko.observableArray();
    self.currentItemID = ko.observable();
    self.ElementHTML = ko.observable("Nothing selected");
    self.ElementJavascript = ko.observable("Nothing selected");
    self.CurrentControl = ko.observable();

    self.elementOriginalCode = ko.observableArray([]);

    self.testPutData = function (id, title, test) {
        var testData = new TestDataParams(title, test, 17);
        $.ajax({
            url: "http://ianbdevel.ddns.net:3000/posts/" + id,
            type: "put",
            data: testData,
            success: function (results) {
                console.log("Put : ");
                console.log(results);
            },
            error: function (error) {
                console.log("Put error");
                console.log(error);
            }
        });
    };

    self.testGetData = function (updateTable, localResults) {
        $.ajax({
            url: "http://ianbdevel.ddns.net:3000/posts",
            type: "get",
            success: function (results) {
                if (updateTable) {
                    self.testTableData(results);
                }
            },
            error: function (error) {
                console.log(error);
            }
        });
    };

    self.testPostData = function (title, test) {
        var testData = new TestDataParams(title, test);
        $.ajax({
            url: "http://ianbdevel.ddns.net:3000/posts",
            type: "post",
            dataType: "application/json",
            data: testData,
            success: function (results) {
                console.log("Post : ");
                console.log(results);
            },
            error: function (error) {
                console.log("Post : ");
            },
            created: function () {}
        });
    };

    self.testDataDelete = function (id) {
        $.ajax({
            url: "http://ianbdevel.ddns.net:3000/posts/" + id,
            type: "delete",
            success: function () {},
            error: function () {

            }
        });
    };
}

function TestDataParams(title, test, id) {
    this.id = id;
    this.title = title;
    this.test = test;
}