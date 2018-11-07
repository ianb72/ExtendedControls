var tm = new TestModel();
var tm2 = new TestModel();

function TestModel() {
    this.TestVar = "Testing";
    this.Test2 = "Test 2";
    this.TestHTML = "<U>Underline</U>"
    this.ArrayTest = ["A", "B", "C"];
}

var ecBinder = new binder();

$(document).ready(function () {
    ecBinder.UpdateBindings();
});