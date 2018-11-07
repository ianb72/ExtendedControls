/*********************/
/*ExtendedControls.js*/
/*Version 0.25.30*/
/*********************/

//Files added prior to babel.
//These will get processed by babel.
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
/*AS Header*/
/*Retained for compatibility with AS Apps*/
(function ($) {
    $.fn.ASHeader = function (options) {
        var control = this;
        $(control).PageHeader(options);
        return control;
    };
}(jQuery));
/*AS Social Media */
/*Replaced by SocialMediaIcons control */
/** Retained for compatiability with existing AS Apps */
(function ($) {
    $.fn.ASSocialMedia = function (options) {
        var control = this;
        $(control).SocialMediaIcons(options);
        return control;
    };
}(jQuery));

/**Bool DD */
/**Add dd for boolean variable types*/
/**Requires knockout if ko bindings are used*/
/**Options */
/**koBoundObject : knockout object to bind value to (optional) */
/**trueText: The text to display in the dropdown if the value is true */
/**falseText: The text to display in the dropdown if the value is false */
/**OnValueChanged: A function to call when the value changes */
(function ($) {
    $.fn.boolDD = function (options) {
        var self = this;
        var settings = $.extend({
            koBoundObject: null,
            trueText: "Yes",
            falseText: "No",
            OnValueChanged: null
        }, options);

        if (settings.koBoundObject != null) {
            self.value = settings.koBoundObject();
        }

        var ddHTML = "";
        ddHTML += "<select class='boolDDSelect'>";
        ddHTML += "<option class='boolDDYes' value='true'>" + settings.trueText + "</option>";
        ddHTML += "<option class='boolDDNo' value='false'>" + settings.falseText + "</option>";
        ddHTML += "</select>";
        this.html(ddHTML);

        var ddSelect = $(this).find(".boolDDSelect")[0];
        ddSelect.value = this.value != undefined ? this.value : true;

        $(ddSelect).on("change", function () {
            self.val(ddSelect.value);
            self.value = ddSelect.value;
            if (settings.koBoundObject != null) {
                settings.koBoundObject(ddSelect.value);
            }
            if (settings.OnValueChanged != null) {
                settings.OnValueChanged(self.value);
            }
        });

        if (settings.koBoundObject != null) {
            settings.koBoundObject.subscribe(function () {
                ddSelect.value = settings.koBoundObject();
            });
        }

        return this;
    };
}(jQuery));
/**Busy box*/
/**Options */
/**text: The text to display below the busy icon */
/**title: The text to display as a title above the busy icon */
/**show: Display the busy box by default */
/**align: The alignment of the busy box in its parent */
/**boxstyle: The style of busybox to show */
/**(default - shows both title and text) */
/**(pleasewait - sets the title to Please Wait and adds an additional please wait css class) */
/**inverse: Invert the colours in the busybox according to the css styling */
/**spinner: The actual icon class to use as the spinner (defaults to 'fa-spinner') */
(function ($) {
    $.fn.busyBox = function (options) {
        var control = this;

        if (options === "hide") {
            control.hide();
            return this;
        }
        if (options === "show") {
            control.show();
            return this;
        }

        var settings = $.extend({
            text: "Busy Box - Text",
            title: "BUSY BOX - Title",
            show: true,
            align: "centre",
            boxstyle: "default",
            inverse: false,
            spinner: "fa-spinner"
        }, options);

        var busyBoxhtml = "<div class='busy-box'>";
        busyBoxhtml += "<div class='row busy-title'>";
        busyBoxhtml += "<p>" + settings.title + "</p>";
        busyBoxhtml += "</div>";
        busyBoxhtml += "<div class='row busy-icon'>";
        busyBoxhtml += "<i class='fa fa-2x fa-spin " + settings.spinner + "'></i> ";
        busyBoxhtml += "</div>";
        busyBoxhtml += "<div class='row  busy-text'>";
        busyBoxhtml += "<p>" + settings.text + "</p>";
        busyBoxhtml += "</div>";
        busyBoxhtml += "</div>";

        this.html(busyBoxhtml);

        var busyBoxNode = $(this).find(".busy-box");
        var busyText = $(this).find(".busy-text");
        var busyTitle = $(this).find(".busy-title");
        var busyIcon = $(this).find(".busy-icon");

        switch (settings.boxstyle) {
            case "pleasewait":
                $(busyTitle).text("Please Wait");
                $(busyBoxNode).addClass("please-wait");
                break;
        }

        if (settings.inverse) $(busyBoxNode).addClass("inverse");

        this.css({
            display: settings.show ? "block" : "none"
        });

        Object.defineProperty(control, 'text', {
            get: function () {
                return $(busyText).text();;
            },
            set: function (value) {
                $(busyText).text(value);
            }
        });

        Object.defineProperty(control, "title", {
            get: function () {
                return $(busyTitle).text();
            },
            set: function (value) {
                $(busyTitle).text(value);
            }
        });

        return this;
    };
}(jQuery));
/**Busy Splash */
/**Displays a blocking modal splash busy box */
/**Options */
/**disableInput: Prevent input on the parent page */
(function ($) {
    $.fn.busySplash = function (options) {
        var control = this;
        var settings = $.extend({
            disableInput: false,
            text: "Fetching data",
            title: "Please Wait"
        }, options);

        var modalDivHTML = "<div class='modal busy-splash-modal'></div>";
        $(control).append(modalDivHTML);

        var modal = $(control).find(".busy-splash-modal")[0];

        control.busyBox = $(modal).busyBox({
            show: false,
            text: settings.text,
            title: settings.title
        });

        control.show = function () {
            if (settings.disableInput) {
                $(modal).modal({
                    backdrop: "static",
                    keyboard: false
                });
            } else {
                $(modal).modal("show");
            }


        };

        control.hide = function () {
            $(modal).modal("hide");
        };



        return control;

    };
}(jQuery));
/**Captcha */
/**Provides a simple captcha */
/**Options */
/**actionOnContinue: Function to execute when the continue button is clicked */
/**actionOnClick: Function to execute when the image is clicked on in addtion to the default function */
$(document).ready(function () {
    $(".ec-captcha").each(function (i, e) {
        $(e).Captcha({});
    });
});

(function ($) {
    $.fn.Captcha = function (options) {
        var control = this;
        var settings = $.extend({
            actionOnContinue: null,
            actionOnClick: null,
            confirmIcon: "fa fa-arrow-right fa-2x",
            continueIcon: "fa fa-check fa-2x"
        }, options);

        var captchaHTML = "";
        captchaHTML += "<div class='captcha-container container no'>";
        captchaHTML += "<div class='row'>";
        captchaHTML += "<div class='captcha-button btn-confirm'>";
        captchaHTML += "<div class='btn-text'>I am not a robot</div>";
        captchaHTML += "<div class='captcha-icon $icon$'></div>".replace("$icon$", settings.confirmIcon);
        captchaHTML += "</div>";
        captchaHTML += "<div class='captcha-button btn-continue'>";
        captchaHTML += "<div class='btn-text'>Click here to continue</div>";
        captchaHTML += "<div class='captcha-icon $icon$'></div>".replace("$icon$", settings.continueIcon);
        captchaHTML += "</div>";
        captchaHTML += "</div>";
        captchaHTML += "</div>";
        control.append(captchaHTML);

        var btnContinue = $(control).find(".btn-continue");
        var btnConfirm = $(control).find(".btn-confirm");

        $(btnContinue).addClass("disabled");
        $(btnConfirm).on("click", function () {
            $(btnConfirm).addClass("disabled");
            $(btnContinue).removeClass("disabled");
            if (settings.actionOnClick != null) {
                settings.actionOnClick();
            }
        });

        $(btnContinue).on("click", function () {
            if (settings.actionOnContinue != null) {
                settings.actionOnContinue();
            }
        });

        return control;
    };
}(jQuery));
/**Captcha using captcha image api */
(function ($) {
    $.fn.CaptchaImage = function (options) {
        var control = this;
        control.sessionID = "";
        control.addClass("captcha-image-container");

        var settings = $.extend({
            captchaProviderURL: null,
            submitHandler: null
        }, options);

        var captchaImageURL = settings.captchaProviderURL + "GetImage";
        var captchaValueURL = settings.captchaProviderURL + "GetCaptchaResult";
        var captchaHTML = "<div class='captcha-image'>";
        captchaHTML += "<div class='row'><img class='captcha-img' /></div>";
        captchaHTML += "<div class='row'><h5>Please enter the the numbers shown above.</h5></div>";
        captchaHTML += "<div class='row incorrect-input'>The last entry did not match, please try again.</div>"
        captchaHTML += "<div class='row'>";
        captchaHTML += "<div class='col-sm-9'><h6>If you can't read the numbers click here to fetch a different set.</h6></div>";
        captchaHTML += "<div class='col-sm-2'><div class='btn btn-default btn-refresh'><icon class='fa fa-refresh fa-2x'></icon></div></div>";
        captchaHTML += "</div>";
        captchaHTML += "<div class='row'><input class='captcha-input' type='text'/></div>";
        captchaHTML += "<div class='row'><div class='btn btn-default btn-submit'>Submit</div></div>";
        captchaHTML += "</div>";
        control.append(captchaHTML);

        var captchaInput = $(control).find(".captcha-input");
        var submitButton = $(control).find(".btn-submit");
        var captchaimg = $(control).find(".captcha-img");
        var incorrect = $(control).find(".incorrect-input");
        var refreshButton = $(control).find(".btn-refresh");
        $(refreshButton).on("click", function () {
            control.getImageData();
            $(captchaInput).val("");
            $(captchaInput).focus();
        });

        $(submitButton).on("click", function () {
            control.checkInput();
        });

        control.checkInput = function () {
            var inputtext = $(captchaInput).val();
            var args = {};
            args["inputtext"] = inputtext;
            args["sessionID"] = control.sessionID;

            $.ajax({
                url: captchaValueURL,
                type: "get",
                data: args,
                success: function (result) {
                    console.log(result);
                    control.inputCheckCallbback(result);
                },
                error: function (error) {
                    console.warn("Error check captcha value");
                }

            });
        };

        control.inputCheckCallbback = function (result) {
            if (result === "True") {
                if (settings.submitHandler != null) {
                    settings.submitHandler();
                }
            } else {
                $(incorrect).addClass("shown");
                control.getImageData();
                $(captchaInput).val("");
                $(captchaInput).focus();
            }
        };

        control.getImageData = function () {
            $.ajax({
                url: captchaImageURL,
                type: "get",
                success: function (results) {
                    var parsedResults = JSON.parse(results);
                    $(captchaimg).attr("src", "data:image/png;base64," + parsedResults.imageData);
                    control.sessionID = parsedResults.SessionID;
                },
                error: function (error) {
                    console.log("Error getting image data");

                }
            });
        };
        control.getImageData();

        $(captchaInput).focus();

        return control;
    };
}(jQuery));
/**Clipboard Utils */
/**Provides a control that is used to pass data to and from the windows clipboard */
(function ($) {
    $.fn.ExtendedClipboard = function (options) {
        var self = this;

        var settings = $.extend({}, options);

        self.copyToClipboard = function (text) {
            var textarea = self[0];
            textarea.textContent = text;
            textarea.select();
            try {
                return document.execCommand("copy"); // Security exception may be thrown by some browsers.
            } catch (ex) {
                console.warn("Copy to clipboard failed.", ex);
                return false;
            }
        };

        return self;
    };
}(jQuery));
/**Collapsable Panel */
/**Init any elements with the panel-collapse class */
$(document).ready(function () {
    $(".panel-collapse").each(function () {
        $(this).collapsablePanel({});
    });
});

/**Provides a panel that can be collapsed by clicking on a title bar */
/**Options */
/**paneltitle: The text to display in the panel */
/**collapsed: Start the panel in a collapsed state */
/**showhandler: Function to execute when the panel is expanded/shown */
/**hidehandler: Function to execute when the panel is collapsed/hidden */
/**HTML Attributes */
/**paneltitle */
/**showhandler */
/**hidehandler */
(function ($) {
    $.fn.collapsablePanel = function (options) {
        var control = this;

        $(control).wrap("<div class='cp-container'></div>");

        var attrPanelTitle = $(control).attr("paneltitle");
        var attrShowhandler = $(control).attr("showhandler");
        var attrHidehandler = $(control).attr("hidehandler");

        var settings = $.extend({
            paneltitle: null,
            collapsed: true,
            showhandler: "",
            hidehandler: ""
        }, options);

        if (attrShowhandler != null) {
            settings.showhandler = attrShowhandler;
        }

        if (attrHidehandler != null) settings.hidehandler = attrHidehandler;

        control.paneltitle = attrPanelTitle || settings.paneltitle || "New Panel";
        control.tooltipText = settings.collapsed ? "Click to expand" : "Click to hide";

        var newHTML = "<h2 class='cp-header' title='$toolTipText$' data-toggle='tooltip'>$paneltitle$</h2>".replace("$paneltitle$", control.paneltitle).replace("$toolTipText$", control.tooltipText);
        control.before(newHTML);

        var header = $(control).parent(".cp-container").find(".cp-header");
        var panel = $(control).prevObject;

        $(header).on("click", function () {
            $(control).toggle(300);
            settings.collapsed = !settings.collapsed;
            $(header).attr("title", settings.collapsed ? "Click to expand" : "Click to hide");

            if (settings.collapsed) {
                $(control).removeClass("expanded");
                $(control).addClass("collapsed");
            } else {
                $(control).removeClass("collapsed");
                $(control).addClass("expanded");
            }

            if (settings.collapsed && settings.hidehandler != "") settings.hidehandler;
            if (!settings.collapsed && settings.showhandler != "") settings.showhandler;
        });

        control.collapse = function (collapsed) {
            if (collapsed) {
                $(control.hide());
            } else {
                $(control).show();
            }

        };

        if (settings.collapsed) {
            $(control).hide();
        }

        return control;
    };
}(jQuery));
/*Data table*/
/**Note the pagination works on the client side */
/**Do not use for large data sets */
class TableUpdateDataParams {
    constructor(changedRows, newRows, deletedRows, allRows) {
        this.changedRows = changedRows;
        this.newRows = newRows;
        this.deletedRows = deletedRows;
        this.allRows = allRows;
    }
}

class EventParams {
    constructor(eventName, handler) {
        this.eventName = eventName;
        this.handler = handler;
    }
}

/**Datatable control */
/**options */
/**tableData: The source data to display in the table */
/**sortEnabled: Enable the column headers to be used to sort the data */
/**enableEdit: Enable the edit button so that the data can be altered  */
/**deleteEnabled: Enable the delete button */
/**saveEnabled: Enable the save button */
/**showFilterInput: Show the filter input box */
/**matchCase: When the filter is enabled make the filter case sensitive */
/**usePagination: Enable pagination, otherwise show all the data in a single page */
/**autoHidePagination: If pagination is enabled, auto hide the pagination control if there is only one page of data */
/**pageSize: Set the number of rows to display per page */
/**defaultSaveHandler: Function to use when the save button is clicked */
/**hiddenFields: Array of fields/cols not to display in the table  */
(function ($) {
    $.fn.DataTable = function (options) {
        var control = this;
        var tableHTML = "";
        var deletedRows = [];
        var isRowSelected = false;

        var settings = $.extend({
            tableData: null,
            sortEnabled: true,
            enableEdit: true,
            deleteEnabled: true,
            addEnabled: true,
            saveEnabled: true,
            showFilterInput: true,
            matchCase: false,
            usePagination: true,
            autoHidePagination: false,
            pageSize: 5,
            defaultSaveHandler: null,
            hiddenFields: ""
        }, options);

        control.koBoundTableData = null;
        control.isKOBinding = false;
        control.handleKOSubscription = true;
        control.showHiddenValues = false;
        control.assignedAttributes = $(this).closest(".ec-data-table")[0].attributes;
        control.columns = [];
        control.columnCount = 0;
        control.sortBy = "";
        control.sortDesc = false;
        control.originalData = null;
        control.filterData = "";
        control.sortedData = [];
        control.sortEnabled = settings.sortEnabled;
        control.usePagination = settings.usePagination;
        control.pageSize = settings.pageSize;
        control.currentPage = 0;
        control.pageCount = 0;
        control.selectedDataIndex = 0;
        control.selectedRow = null;
        control.isEditing = false;

        control.eventHandlers = {};

        control.saveHandlers = [];
        control.rowSelectedHandlers = [];
        control.Events = {
            NewEventHandler: function (event, handler) {
                var hasExistingHandlers = control.eventHandlers[event] != undefined;
                if (!hasExistingHandlers) control.eventHandlers[event] = [];
                control.eventHandlers[event].push(handler);
            }
        };

        control.event = function (eventName, params) {
            if (control.eventHandlers[eventName] != undefined && control.eventHandlers[eventName].length > 0) {
                control.eventHandlers[eventName].forEach(function (handler, i) {
                    if (params != null) {
                        handler(params);
                    } else {
                        handler();
                    }
                });
            }
        };

        control.Data = {
            SetTableData: function (value) {
                control.tableData = value;
                control.updateTable();
                return "";
            },
            SortTableData: function (column, desc) {
                control.sortBy = column;
                control.sortDesc = desc;
                control.updateTable();
                return "";
            },
            SaveData: function () {
                var newRows = [];
                var changedRows = [];
                var allRows = [];

                control.tableData.forEach(function (row, i) {
                    var originalRow = {};
                    control.columns.forEach(function (col, i) {
                        if (col.indexOf("dt__") == -1) {
                            originalRow[col] = row[col];
                        }
                    });

                    if (row.dt__isNew) newRows.push(originalRow);
                    if (row.dt__hasChanged) changedRows.push(originalRow);

                    allRows.push(originalRow);
                });

                var saveDataResult = new TableUpdateDataParams(changedRows, newRows, deletedRows, allRows);
                control.event("save", saveDataResult);
                initTableData();
            }
        };

        if (typeof (settings.tableData) == "function") {
            if (settings.tableData.__ko_proto__ != undefined) {
                control.isKOBinding = true;
                control.koBoundTableData = settings.tableData;
                if (control.koBoundTableData != null && control.koBoundTableData != undefined) {
                    control.tableData = control.koBoundTableData();
                    initTableData();
                }
                control.koBoundTableData.subscribe(function () {
                    if (!control.handleKOSubscription) return;
                    control.tableData = control.koBoundTableData();
                    initTableData();
                    control.updateTable();
                });
            } else {
                control.tableData = settings.tableData();
            }
        } else {
            control.tableData = settings.tableData;
        }

        control.headerClickEventHandler = function () {
            if (!control.sortEnabled) return;
            var headers = $(control[0]).find("th");
            $(headers).off("click").on("click", function () {
                $(headers).removeClass("sorted");
                var tableElement = $(control).find(".ec-data-table-inner");

                if (control.sortBy == $(this).text()) {
                    control.sortDesc = !control.sortDesc;
                } else {
                    control.sortDesc = false;
                }
                control.sortBy = $(this).text();

                $(tableElement).html("");
                $(tableElement).html(control.generateTable());
                control.headerClickEventHandler();
                control.addRowAndDataHandlers();
            });
        };

        control.formatControl = function () {
            var inputControl = $(control).find(".ec-filter-input-container")[0];
            var tableControl = $(control).find(".ec-data-table-inner")[0];
            var paginationElement = $(control).find(".ec-datatable-pagination-container");
            var controlPanelElement = $(control).find(".ec-datatable-controlpanel");
            var parent = $(control).parent()[0];
            var parentWidth = parent.clientWidth;
            var parentLeft = parent.scrollLeft;
            var tableControlWidth = tableControl.clientWidth < parentWidth ? tableControl.clientWidth : parentWidth;

            if (control.pageCount <= 1 && settings.autoHidePagination) {
                $(paginationElement).addClass("hide");
            } else {
                $(paginationElement).removeClass("hide");
            }

            $(inputControl).width(tableControlWidth);

            if (control.usePagination) {
                var paginationElementWidth = $(paginationElement)[0].clientWidth;
                if (tableControlWidth < paginationElementWidth) {
                    var leftMargin = ((paginationElementWidth - tableControlWidth) / 2) + parentLeft;
                    $(tableControl).css("margin-left", leftMargin);
                    $(inputControl).width(tableControlWidth + leftMargin);
                } else {
                    var pagLeftMargin = ((tableControlWidth - paginationElementWidth) / 2) + parentLeft;
                    $(paginationElement).css("margin-left", pagLeftMargin);
                }
            }

            var allDataSpans = $(tableControl).find("span");
            if (allDataSpans.length > 0) {
                $(allDataSpans).each(function (e, i) {
                    var spanWidth = e.clientWidth;
                    var spanHeight = e.clientHeight;
                    var associtedInput = $(this).closest("td").find("input");
                    $(associtedInput).width(spanWidth);
                    $(associtedInput).height(spanHeight);
                });
            }

            if (!settings.enableEdit) $(control).find(".ec-btn-datatable-edit").addClass("hide");
            if (!settings.deleteEnabled) $(control).find(".ec-btn-datatable-remove").addClass("hide");
            if (!settings.addEnabled) $(control).find(".ec-btn-datatable-add").addClass("hide");
            if (!settings.saveEnabled) $(control).find(".ec-btn-datatable-save").addClass("hide");

            if (!settings.enableEdit && !settings.deleteEnabled && !settings.addEnabled && !settings.saveEnabled) $(control).find(".ec-datatable-controlpanel").addClass("hide");

            controlPanelElement.width(tableControlWidth - 2);
            $(controlPanelElement).css("margin-left", parentLeft);
            control.width(tableControlWidth);
            control.addRowAndDataHandlers();
        };

        control.addRowAndDataHandlers = function () {
            var tableControl = $(control).find(".ec-data-table-inner")[0];
            var rows = $(tableControl).find("tr");
            var dataElements = $(rows).find("td");

            $(dataElements).off("click").on("click", function () {
                isRowSelected = true;
                $(rows).removeClass("selected");
                var parentRow = $(this).closest("tr");
                parentRow.addClass("selected");
                control.selectedRow = parentRow;
                control.selectedDataIndex = $(this).closest("tr").attr("dataindex");
                control.event("rowselected");
            });
        };

        control.generateTable = function () {
            if (control.tableData != null && control.tableData != undefined) {
                control.originalData = control.tableData;
            } else {
                control.tableData = [];
                control.originalData = control.tableData;
            }

            control.columns = [];
            tableHTML = "";
            tableHTML += "<thead>";
            tableHTML += "<tr>";

            for (var name in control.originalData[0]) {
                if (name !== "__ko_mapping__") {
                    control.columns.push(name);
                }
            }

            if (control.sortBy == "" || control.sortBy == undefined && control.sortEnabled) {
                control.sortBy = control.columns[0];
            }

            if (control.sortEnabled && control.sortBy != "") {
                control.tableData = control.originalData;
                control.sortedData = control.tableData.sort(function (a, b) {
                    var toReturn;
                    if (control.sortDesc) {
                        toReturn = a[control.sortBy] < b[control.sortBy] ? 1 : -1;
                    } else {
                        toReturn = b[control.sortBy] < a[control.sortBy] ? 1 : -1;
                    }
                    return toReturn;
                });
            } else {
                control.sortedData = control.originalData;
            }

            control.columnCount = control.columns.length;

            if (control.filterData != null && control.filterData != "") {
                control.sortedData = control.sortedData.filter(function (data) {
                    var dataFound = false;
                    control.columns.forEach(function (col, i) {
                        if (col.indexOf("dt__") == -1) {
                            var tableData = data[col];
                            var tableDataValue = tableData != undefined ? tableData.toString() : "";
                            var filter = control.filterData;

                            if (!settings.matchCase) {
                                tableDataValue = tableDataValue.toLowerCase(tableData);
                                filter = filter.toLowerCase(filter);
                            }

                            if (tableDataValue.indexOf(filter) > -1) dataFound = true;
                        }
                    });
                    return dataFound;
                });

                control.formatControl();
            }

            control.pageCount = Math.ceil(control.sortedData.length / control.pageSize);

            if (control.usePagination) {

                var pageStartIndex = control.currentPage * control.pageSize;
                var pageEndIndex = pageStartIndex + control.pageSize;

                control.sortedData = control.sortedData.filter(function (data) {
                    var itemIndex = control.sortedData.indexOf(data);
                    return itemIndex >= pageStartIndex && itemIndex < pageEndIndex;
                });
            }

            control.columns.forEach(function (e, i) {
                var thClass = "";
                if (e == control.sortBy) {
                    thClass = "class='sorted ";
                    thClass += control.sortDesc ? " desc" : " asc";
                    thClass += "'";
                }
                var showField = (e.toString().indexOf("dt__") == -1 || control.showHiddenValues) && (settings.hiddenFields.indexOf(e) == -1);
                if (showField) {
                    tableHTML += "<th ";
                    tableHTML += thClass;
                    tableHTML += " >";
                    tableHTML += e;
                    if (control.sortEnabled) {
                        tableHTML += "<icon class='fa ";
                        if (control.sortBy == e) {
                            tableHTML += control.sortDesc ? "fa-arrow-up" : "fa-arrow-down";
                        }
                        tableHTML += "'></icon>";
                    }
                    tableHTML += "</th>";
                }
            });

            tableHTML += "</tr>";
            tableHTML += "</thead>";
            tableHTML += "<tbody>";
            control.sortedData.forEach(function (row, i) {
                //var dataIndex = (control.currentPage * settings.pageSize) + i;
                var dataIndex = row.dt__index;
                tableHTML += "<tr class'ec-datatable-row' dataindex=$index$>".replace("$index$", dataIndex);
                control.columns.forEach(function (col, i) {
                    var showField = (col.toString().indexOf("dt__") == -1 || control.showHiddenValues) && (settings.hiddenFields.indexOf(col) == -1);
                    if (showField) {
                        var dataValueType = typeof (row[col]);
                        var dataValue = dataValueType === "function" ? row[col]() : row[col];
                        tableHTML += "<td class='ec-datatable-data'>";
                        tableHTML += "<span class='ec-data-value'>$value$</span>".replace("$value$", dataValue);
                        tableHTML += "<input class='ec-data-input' ";
                        tableHTML += "value='$value$'".replace("$value$", dataValue);
                        tableHTML += " col=$col$".replace("$col$", col);
                        tableHTML += " />";
                        tableHTML += "</td>";
                    }
                });
            });

            tableHTML += "</tbody>";
            return tableHTML;
        };

        control.UpdateFilteredValues = function (inputValue) {
            control.filterData = inputValue;
            control.updateTable();
        };

        control.updateTable = function () {
            updateTable();
        };

        control.setDefaults = function () {
            control.sortBy = control.columns[0];
        };

        control.addFilterControl = function () {
            var filterInputHTML = "<div class='ec-filter-input-container'><label>Filter</label><input class='ec-filter-input' type='text' /></div>";
            var tableElement = $(control).find(".ec-data-table-inner");


            if (settings.showFilterInput) {
                $(tableElement).before(filterInputHTML);
            }

            var inputControl = $(control).find(".ec-filter-input")[0];
            if (settings.showFilterInput) {
                $(inputControl).on("keyup", function () {
                    control.UpdateFilteredValues($(this).val());
                });
            }
        };

        control.addPaginationControl = function () {
            if (control.usePagination) {
                var paginationHTML = "";
                paginationHTML += "<div class='ec-datatable-pagination-container'>";
                paginationHTML += "<div class='btn btn-default btn-pagination pg-first'><icon class='glyphicon glyphicon-fast-backward'></div>";
                paginationHTML += "<div class='btn btn-default btn-pagination pg-prev'><icon class='glyphicon glyphicon-backward'></div>";
                paginationHTML += "<div class='current-page page-number'>$currentPage$</div>".replace("$currentPage$", control.currentPage + 1);
                paginationHTML += "<div class='pg-text page-number'>of</div>";
                paginationHTML += "<div class='last-page page-number'>$pageCount$</div>".replace("$pageCount$", control.pageCount);
                paginationHTML += "<div class='btn btn-default btn-pagination pg-next'><icon class='glyphicon glyphicon-forward'></icon></div>";
                paginationHTML += "<div class='btn btn-default btn-pagination pg-last'><icon class='glyphicon glyphicon-fast-forward'></div>";
                paginationHTML += "</div>";
                control.append(paginationHTML);
            }

            var paginationElement = control.find(".ec-datatable-pagination-container");
            $(paginationElement).find(".btn-pagination").off("click").on("click", function () {
                var canGoNext = control.currentPage + 1 < control.pageCount;
                var canGoBack = control.currentPage > 0;
                if ($(this).hasClass("pg-first")) control.currentPage = 0;
                if ($(this).hasClass("pg-prev") && canGoBack) control.currentPage--;
                if ($(this).hasClass("pg-next") && canGoNext) control.currentPage++;
                if ($(this).hasClass("pg-last")) control.currentPage = (control.pageCount - 1);
                control.updateTable();
            });
        };

        control.addControlPanel = function () {
            var controlPanelHTML = "<div class='ec-datatable-controlpanel'>";
            controlPanelHTML += "<div class='ec-right-buttons'>";
            controlPanelHTML += "<div class='btn ec-btn-datatable-remove'><i class='fa fa-trash-o'></i></div>";
            controlPanelHTML += "<div class='btn ec-btn-datatable-add'>+</div>";
            controlPanelHTML += "</div>";
            controlPanelHTML += "<div class='ec-left-buttons'>";
            controlPanelHTML += "<div class='btn ec-btn-datatable-save'>Save</div>";
            controlPanelHTML += "<div class='btn ec-btn-datatable-edit'>Edit</div>";
            controlPanelHTML += "</div>";
            controlPanelHTML += "</div>";

            var tableElement = $(control).find(".ec-data-table-inner");
            $(tableElement).before(controlPanelHTML);

            var controlPanelElement = $(control).find(".ec-datatable-controlpanel");
            $(controlPanelElement).find(".ec-btn-datatable-add").on("click", function () {
                var newItem = {};
                control.columns.forEach(function (e, i) {
                    newItem[e] = "";
                });

                newItem.dt__isNew = true;
                newItem.dt__index = control.tableData.length;

                control.tableData.unshift(newItem); //Add new item base table data
                control.updateTable();

                var newRow = $(tableElement).find("tr")[1];
                $(newRow).addClass("new-row");
                AddInputKeyHandler(newRow, 0);
                control.formatControl();

                $(newRow).find("input")[0].focus();
            });

            $(controlPanelElement).find(".ec-btn-datatable-remove").on("click", function () {
                if (!isRowSelected) return;
                deletedRows.push(removeAdditionalParams(control.tableData[control.selectedDataIndex]));
                control.tableData.splice(control.selectedDataIndex, 1);
                initTableData();
                control.updateTable();
            });

            $(controlPanelElement).find(".ec-btn-datatable-save").on("click", function () {
                control.Data.SaveData();
            });

            $(controlPanelElement).find(".ec-btn-datatable-edit").on("click", function () {
                if (!isRowSelected) return;
                $(control.selectedRow).addClass("edit-row");
                AddInputKeyHandler(control.selectedRow, control.selectedDataIndex);
                control.tableData[control.selectedDataIndex].dt__hasChanged = true;
                $(control.selectedRow).find("input")[0].focus();
            });

            function AddInputKeyHandler(row, dataIndex) {
                $(row).find("input").off("keyup").on("keyup", function (e) {
                    var column = $(this).attr("col");
                    control.tableData[dataIndex][column] = $(this).val();
                });
            }
        };

        initControl();
        addEventHandlers();



        function addEventHandlers() {
            $(document).ready(function () {
                control.formatControl();
            });

            $(window).off("resize").on("resize", function () {
                control.formatControl();
            });

            var parent = $(control).parent()[0];
            $(parent).off("scroll").on("scroll", function () {
                control.formatControl();
            });
        }

        function initControl() {
            if (control.tableData != null && control.tableData != undefined) {
                var controlHTML = "<table class='ec-data-table-inner'></table>";
                var tableElement = $(control).find(".ec-data-table-inner");

                control.html(controlHTML);
                $(tableElement).append(control.generateTable());

                control.addFilterControl();
                control.addPaginationControl();
                control.addControlPanel();
                control.headerClickEventHandler();
            }
        }

        function updateTable() {
            var tableElement = $(control).find(".ec-data-table-inner");

            $(tableElement).html("");
            $(tableElement).html(control.generateTable());

            var currentPageElement = $(control).find(".current-page");
            $(currentPageElement).text(control.currentPage + 1);

            var lastPageElement = $(control).find(".last-page");
            $(lastPageElement).text(control.pageCount);

            control.headerClickEventHandler();
            control.formatControl();
        }

        function removeAdditionalParams(row) {
            var cleanedRow = {};
            control.columns.forEach(function (col, i) {
                if (col.indexOf("dt__") == -1) {
                    cleanedRow[col] = row[col];
                }
            });
            return cleanedRow;
        }

        function initTableData() {
            var amendededTableData = [];
            control.tableData.forEach(function (e, i) {
                e["dt__hasChanged"] = false;
                e["dt__isNew"] = false;
                e["dt__index"] = i;
                amendededTableData.push(e);
            });

            control.tableData = amendededTableData;
            if (control.isKOBinding) {
                control.handleKOSubscription = false;
                control.koBoundTableData(control.tableData);
                control.handleKOSubscription = true;
            }
        }

        return control;
    };
}(jQuery));
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
/**Embelishments */
/**Glower */
var glowers;

$(document).ready(function () {
    InitGlowers(1000);
});

/**Sets a glowing border to any elements that have the 'glower' class */
function InitGlowers(glowInterval) {
    glowers = $(document).find(".glower");
    window.setInterval(function () {
        $.each(glowers, function (index, value) {
            if ($(value).hasClass("glowon")) {
                $(value).toggleClass("glow");
            }
        });
    }, glowInterval);
}
/*Formatted Input*/
/**Provides an input bbox that will automatically format any input data into a specific format */
/**The underlying data will remain the same */
(function ($) {
    /**Formats the data as currency */
    /**Default format is GBP with the en-uk number format */
    $.fn.formattedCurrency = function (options) {
        var inputControl = this;
        var settings = $.extend({
            Formatter: formatter
        }, options);

        $(inputControl).formattedInput(settings);

        function formatter(inputText) {
            var currencyFormatter = new Intl.NumberFormat("en-uk", {
                style: "currency",
                currency: "GBP",
                minimumFractionDigits: 2
            });

            return currencyFormatter.format(inputText);
        }
    };

    /**Formats the data as a date DD/MM/YYYY */
    $.fn.formattedDate = function (options) {
        var inputControl = this;
        var settings = $.extend({
            Formatter: formatter
        }, options);

        $(inputControl).formattedInput(settings);

        function formatter(inputDate) {
            var newDateString = new moment(inputDate).format("DD/MM/YYYY");
            return newDateString;
        }
    };

    /**Provides the generic input formatter */
    /**Options*/
    /**Formatter: The function to use to format the data */
    $.fn.formattedInput = function (options) {
        var inputControl = this;
        inputControl.inputText = null;
        inputControl.inputData = null;

        inputControl.addClass("formatted-input-data");
        inputControl.wrap("<div class='formatted-input-container'></div>");

        var settings = $.extend({
            Formatter: null
        }, options);

        var newHTML = "";
        newHTML += "<div class='formatted-input-text'></div>";
        inputControl.after(newHTML);

        inputControl.inputText = inputControl.closest(".formatted-input-container").find(".formatted-input-text");
        inputControl.inputData = inputControl.closest(".formatted-input-container").find(".formatted-input-data");

        $(inputControl.inputText).on("click", function () {
            $(this).hide();
            $(inputControl.inputData).show();
            $(inputControl.inputData).focus();
        });

        $(inputControl.inputData).on("blur", function () {
            $(this).hide();
            $(inputControl.inputText).show();
            $(inputControl.inputText).text(settings.Formatter(inputControl.inputData.val()));
        });
        return inputControl;
    };

}(jQuery));
/** Formatted Select */
/** Provides a solution to the fact that in a <SELECT></SELECT> the items cannot be formatted */
/**options */
/**koBoundObject: A knockout object to bind the selected value to */
/**listValues: Include the value in the displayed list of items, just show the text by default */
/**additionalHTML: Additonal HTML to use to format the items in the list */
/**--Uses certain tags that will be replaced by the specified value */
/**$text$ -  The text attribute of the <OPTION></OPTION> */
/**$value$ - The value attribute of the <OPTION></OPTION> */
(function ($) {
    $.fn.formattedSelect = function (options) {
        var control = this;
        var selectOptions = $(control).find("option");
        var newList = document.createElement("div");
        var optionsVisible = false;
        var selectedItem;
        var selectionItems;
        var selectionItem;
        var formattedSelectTop;
        var fsID = control[0].id;

        control.selectedOptionText = "";
        control.selectedOptionValue = null;

        var settings = $.extend({
            koBoundObject: null,
            listValues: false,
            additionalHTML: "",
            isBoolean: false
        }, options);

        Init();
        GenerateHTML();
        GetComponents();
        AddHandlers();

        function Init() {
            var text = "";

            if (settings.koBoundObject != null) {
                control.selectedOptionValue = settings.koBoundObject();
                if (control.selectedOptionValue !== null && control.selectedOptionValue !== "") {
                    text = getSelectedOptionText(control.selectedOptionValue.toString())[0].text;
                    control.selectedOptionText = selectionTextHTML(text, control.selectedOptionValue);
                } else {
                    text = selectOptions[0].text;
                    control.selectedOptionValue = selectOptions[0].value;
                    control.selectedOptionText = selectionTextHTML(text, control.selectedOptionValue);
                }
            } else {
                text = selectOptions[0].text;
                control.selectedOptionValue = selectOptions[0].value;
                control.selectedOptionText = selectionTextHTML(text, control.selectedOptionValue);
            }
        }

        function GetComponents() {

            selectedItem = $(newList).find(".selected-item");
            selectionItems = $(newList).find(".selection-items");
            selectionItem = $(newList).find(".selection-item");
            formattedSelectTop = $(newList).find(".formatted-select");
        }

        function AddHandlers() {

            $(selectedItem).on("click", function () {
                $(selectionItems).toggle();
                setVisbile(!optionsVisible);
            });

            $(selectionItem).on("click", function () {
                var selectedValue = $(this).attr("value");
                var selectedText = getSelectedOptionText(selectedValue)[0].text;
                $(selectedItem).html(selectionTextHTML(selectedText, selectedValue));
                control.value = selectedValue;
                $(selectionItems).hide();
                setVisbile(false);

                var parsedValue = control.value;
                if (settings.isBoolean) {
                    parsedValue = control.value == "true";
                    if (control.value == "default") parsedValue = null;
                }

                if (settings.koBoundObject != null) {
                    settings.koBoundObject(parsedValue);
                } else {

                }
            });

            if (settings.koBoundObject != null) {
                settings.koBoundObject.subscribe(function () {
                    var selectedValue = settings.koBoundObject();

                    if (selectedValue == undefined) {
                        selectedValue = "default";
                    } else {
                        selectedValue = selectedValue.toString();
                    }

                    var selectedText = getSelectedOptionText(selectedValue)[0].text;
                    $(selectedItem).html(selectionTextHTML(selectedText, selectedValue));
                    control.value = selectedValue;
                });
            }
        }

        function GenerateHTML() {
            var newHTML = "<div class='formatted-select' id='" + fsID + "'>";
            newHTML += "<div class='selected-item collapsed'>" + control.selectedOptionText + "</div>";
            newHTML += "<div class='selection-items'>";
            newHTML += "<ul>";
            $.each(selectOptions, function (i, e) {
                newHTML += "<li>";
                newHTML += "<div class='selection-item'";
                newHTML += " value=" + e.value;
                newHTML += ">";
                newHTML += selectionTextHTML(e.text, e.value);
                newHTML += "</div>";
                newHTML += "</li>";
            });
            newHTML += "</ul>";
            newHTML += "</div>";
            newHTML += "</div>";
            newList.innerHTML = newHTML.trim();
        }

        function selectionTextHTML(text, value) {
            var selectionHTML = "";
            var textHTML = text;
            var valueHTML = value;

            if (settings.additionalHTML != "") {
                textHTML = settings.additionalHTML.replace("$text$", text).replace("$value$", value);
            }

            selectionHTML += "<span class='selection-item-text'>" + textHTML + "</span>";
            if (settings.listValues) {
                selectionHTML += "<span class='selection-item-value'>" + valueHTML + "</span>";
            }
            return selectionHTML;
        }

        function getSelectedOptionText(selectedOption) {
            return selectOptions.filter(function (i, op) {
                return op.value == selectedOption;
            });
        }

        function setVisbile(visibleState) {
            optionsVisible = visibleState;
            if (visibleState) {
                $(selectedItem).addClass("expanded");
                $(selectedItem).removeClass("collapsed");

                $(formattedSelectTop).addClass("expanded");
            } else {
                $(selectedItem).removeClass("expanded");
                $(selectedItem).addClass("collapsed");

                $(formattedSelectTop).removeClass("expanded");
            }
        }

        $(selectionItems).hide();
        this.replaceWith(newList);

        return control;
    };
}(jQuery));
/**GenerateControls.js */
/*Auto generate controls based on class*/
$(document).ready(function () {
    $(".ec-header").PageHeader();
    $(".formatted-currency").formattedCurrency();
    $(".formatted-date").formattedDate();
});
/*Help control*/
/**Adds an inline help ribbon to the control */
/**options: helpText: The text to display in the help ribbon */
(function ($) {
    $.fn.helpControl = function (options) {
        var control = this;
        var settings = $.extend({
            helpText: ""
        }, options);

        var helpControlHTML = "";
        helpControlHTML += "<div class='help-control'>";
        helpControlHTML += "<div class='help-icon-container pull-left'><icon class='fa fa-question-circle'></icon></div>";
        helpControlHTML += "<div class='help-panel hide'>";
        helpControlHTML += "<span>$helpText$</span>".replace("$helpText$", settings.helpText);
        helpControlHTML += "</div>";
        helpControlHTML += "</div>";
        var helpPanelHTML = "";
        control.append(helpControlHTML);

        var helpIconContainer = $(control).find(".help-icon-container")[0];
        $(helpIconContainer).attr("title", "Show/Hide Help");
        $(helpIconContainer).attr("data-toggle", "tooltip");
        var parentHeight = parseFloat($(this).css("height").replace("px", ""));
        $(helpIconContainer).css("top", "-" + (parentHeight) + "px");
        $(helpIconContainer).tooltip();

        $(helpIconContainer).off("click").on("click", function () {
            var helpPanel = $(this.parentElement).find(".help-panel");
            if (helpPanel == undefined) return;
            if (helpPanel.hasClass("hide")) {
                $(helpPanel).removeClass("hide").addClass("show");
            } else {
                $(helpPanel).removeClass("show").addClass("hide");
            }
        });

        return control;
    };
}(jQuery));
/*Input panel*/
/**Provides an input panel with a label and an input box */
/**options */
/**label: The text to display in the label */
/**koBinding: The knockout object to bind the input value to */
/**hasHelp: Add a help ribbon to the control */
/**helpText: If has help is true, the text to display in the help ribbon */
/**inputType: The HTML input type */
/**isDate: Is the input a date, will provide additional parsing if true */
/**defaultValue: The default value to display in the input box */
/**useFormatedDD: Use the formatted select to format the dropdown if the type is dropdown */
/**hasValidationMessage: If the control has a validator assigned, specify a message to show when input is invalid */
/**validationMessage: The message to display on invalid input */
(function ($) {
    $.fn.inputPanel = function (options) {
        var control = this;
        $(control).addClass("input-panel");
        var hasDD = false;
        var settings = $.extend({
            label: "",
            koBinding: null,
            hasHelp: false,
            helpText: "",
            inputType: "text",
            isDate: false,
            defaultValue: null,
            useFormattedDD: false,
            hasValidationMessage: false,
            validationMessage: "Invalid input"
        }, (options));

        //Check if data-bind attribute set
        var databindingAttr = control.attr("data-bind");
        if (databindingAttr != undefined && settings.koBinding == null) {
            var splitBindingsDef = databindingAttr.split(":");
            var bindingType = splitBindingsDef[0].trim();
            var boundValueName = splitBindingsDef[1].trim();
            var bindingContext = ko.contextFor(control[0]);

            settings.koBinding = bindingContext.$data[boundValueName];
        }

        //var newHTML = "<div class='input-panel'>";
        var newHTML = "";
        newHTML += "<div class='input-group'>";
        newHTML += "<span class='input-group-addon'>$label$</span>".replace("$label$", settings.label);
        switch (settings.inputType) {
            case "text":
            case "date":
                newHTML += "<input class='form-control input-field' type='$inputType$' />".replace("$inputType$", settings.inputType);
                break;
            case "textarea":
                newHTML += "<textarea class='form-control input-field' rows='6' type='text'></textarea>".replace("$inputType$", settings.inputType);
                break;
            case "yesno":
                newHTML += "<select class='input-field dd-yesno' id='$ddID$'>".replace("$ddID$", $(control)[0].id + "DD");
                newHTML += "<option value=true>Yes</option>";
                newHTML += "<option value=false>No</option>";
                newHTML += "</select>";
                hasDD = true;
                break;
        }
        //newHTML += "</div>";
        control.html(newHTML);

        if (settings.hasHelp) control.helpControl({
            helpText: settings.helpText
        });

        if (hasDD && settings.useFormattedDD) {
            var selectOption = $(control).find("select")[0];
            var inputPanel = $(control).find(".input-panel")[0];

            $(inputPanel).addClass("has-formatted-dd");

            $(selectOption).formattedSelect({
                isBoolean: true,
                koBoundObject: settings.koBinding
            });
        }

        if (settings.hasValidationMessage) {
            control.validationMessage = control.WarningPanel({
                text: settings.validationMessage,
                warningClass: "error"
            });
            var validationMessageControl = $(control).find(".warning-panel");
            $(validationMessageControl).addClass("validation-message");
            validationMessageControl.hide();
        }

        var inputField = $(control).find(".input-field")[0];
        if (settings.koBinding != undefined) {
            var ignoreChange = false;
            $(inputField).off("change").on("change", function () {
                ignoreChange = true;
                settings.koBinding(this.value);
                ignoreChange = false;
            });

            settings.koBinding.subscribe(function () {
                if (ignoreChange) return;
                $(inputField).val(settings.koBinding());
            });
        }

        if (settings.defaultValue != null) {
            settings.koBinding(settings.defaultValue);
        }

        if (settings.hasHelp) {

        }

        switch (settings.inputType) {
            case "date":
                $(inputField).datepicker({
                    dateFormat: "dd/mm/yy"
                });
                break;
            case "text":
                //Add date picker to text field, this is for browsers that add their own date picker for date fields.
                if (settings.isDate) {
                    $(inputField).datepicker({
                        dateFormat: "dd/mm/yy"
                    });
                }
                break;
        }

        var formattedSelectControl = $(control).find(".formatted-select");
        if (formattedSelectControl.length > 0) {
            $(formattedSelectControl).addClass("is-input-panel");
        }
        return control;
    };
}(jQuery));
/** List Input */
(function ($) {
    $.fn.listInput = function (options) {
        var baseControl = this;
        var settings = $.extend({
            name: "",
            helpText: "Please enter a value then click add",
            boundArray: null,
            isKO: false,
            inputPanelLabel: "Input",
            addButtonText: "Add",
            removeButtonText: "Remove",
            listItemLabel: "New Item",
            useIndexer: true,
            maxEntries: -1,
            clearInput: false,
            autoAdd: true
        }, options);

        var controlHTML = "";
        var mainControlID = $(baseControl).attr("id");
        controlHTML += "<div class='boundlist-inner'>";
        controlHTML += "<div class='boundlist-input'></div>";
        controlHTML += "<div class='boundlist-items'></div>";
        controlHTML += "</div>";

        $(baseControl).html(controlHTML);
        var innerControl = $(baseControl).find(".boundlist-inner");
        var inputControl = $(baseControl).find(".boundlist-input");
        var inputPanel = $(inputControl).inputPanel({
            hasHelp: true,
            helpText: settings.helpText,
            label: settings.inputPanelLabel,
        });
        var inputGroup = $(inputPanel).find(".input-group");
        var addButtonHTML = "<div class='btn btn-default btn-list btn-list-add'>$text$</div>".replace("$text$", settings.addButtonText);
        $(inputGroup).append(addButtonHTML);

        var listItems = $(innerControl).find(".boundlist-items");

        var limitWarningMessage = $(inputControl).WarningPanel({
            text: "The maximum number of entries has been reached (" + settings.maxEntries + ")",
            warningClass: "error",
            additionalClass: "list-limit-error"
        });
        var limitWarning = $(limitWarningMessage).find(".list-limit-error");
        $(limitWarning).hide();

        UpdateList();

        function UpdateList() {
            $(listItems).html("");
            if (settings.boundArray != null) {
                var boundArray = settings.isKO ? settings.boundArray() : settings.boundArray;
                boundArray.forEach(function (e, i) {
                    var listItemID = mainControlID + "_listItem" + (parseInt(i) + 1);
                    var newTextboxContainerHTML = "<div class='boundlist-item-textbox' id='$itemID$'></div>".replace("$itemID$", listItemID);
                    var newRemoveBtnHTML = "<div class='btn btn-default btn-list btn-list-remove'>$text$</div>".replace("$text$", settings.removeButtonText);
                    $(listItems).append(newTextboxContainerHTML);

                    var textboxLabelText = settings.listItemLabel;
                    if (settings.useIndexer) textboxLabelText += "&nbsp;" + (parseInt(i) + 1);
                    $("#" + listItemID).textbox({
                        labelText: textboxLabelText,
                        tbText: e
                    });

                    var textBoxItem = $("#" + listItemID).find(".textbox");
                    $(textBoxItem).append(newRemoveBtnHTML);
                });

                var removeButtons = $(".textbox .btn-list");
                $(removeButtons).off("click").on("click", function () {
                    var limitWarningMessage = $(this).closest(".boundlist-inner").find(".list-limit-error");
                    $(limitWarningMessage).hide();
                    var itemIndex = parseInt($(this).closest(".boundlist-item-textbox").attr("id").replace("boundList_listItem", "")) - 1;
                    settings.boundArray.splice(itemIndex, 1);
                    UpdateList();
                });
            }
        }

        function AddNewEntry(inputData, sender) {
            var entryCount = settings.isKO ? settings.boundArray().length : settings.boundArray.length;
            var limitWarningMessage = $(sender).closest(".boundlist-input").find(".list-limit-error");
            var inputControl = $(sender).closest(".boundlist-input").find("input");

            if (settings.maxEntries > 0 && entryCount == settings.maxEntries) {
                $(limitWarningMessage).show();
            } else {
                settings.boundArray.push(inputData);
                UpdateList();
                if (settings.clearInput) $(inputControl).val("");
                $(inputControl).focus();
            }
        }

        this.refreshList = function () {
            UpdateList();
        };

        var addButton = $(inputGroup).find(".btn-list");
        $(addButton).off("click").on("click", function () {
            var inputField = $(this).closest(".boundlist-input").find(".input-field");
            AddNewEntry($(inputField).val(), this);
        });

        var inputFieldControl = $(inputControl).find("input");

        $(inputFieldControl).off("keydown").on("keydown", function (e) {
            if (!settings.autoAdd) return;
            var inputData = $(inputFieldControl).val();
            if ((e.which == 13 || e.which == 9) && inputData != "") {
                AddNewEntry(inputData, this);
            }
        });

        if (settings.isKO) {
            settings.boundArray.subscribe(function () {
                UpdateList();
            });
        }

        return this;
    };
}(jQuery));
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
/*Help modal panel*/
/**Provides a non blocking modal control which is primarily used for a help page */
/**Can take either the provided text as text/html or can embed a page */
/**options */
/**title: The text to display in the title bar of the control */
/**helptext: The text/html to display. */
/**name: The id parameter to assign to the control, this is useful if you want to have multiple controls */
/**embedURL: The url of the page to embed in the control. */
(function ($) {
    $.fn.ModalHelp = function (options) {
        var control = this;
        var settings = $.extend({
            title: "",
            helptext: "",
            name: "helpModal",
            embedURL: ""
        }, options);

        var useEmbeded = settings.embedURL != undefined && settings.embedURL != "";

        var modalHTML = "";
        modalHTML += "<div class='ec-help-modal hidden' id='helpModal_$name$' tabindex='-1'>".replace("$name$", settings.name);
        modalHTML += "<div class='modal-dialog' role='document'>";
        modalHTML += "<div class='modal-content'>";
        modalHTML += "<div class='modal-header'>";
        modalHTML += "<button type='button' class='close' title='Close'><span aria-hidden='true'>&times;</span></button>";
        modalHTML += "<icon class='fa fa-question fa'></icon>"
        modalHTML += "<h4 class='modal-title' id='myModalLabel'>$title$</h4>".replace("$title$", settings.title);
        modalHTML += "</div>";
        modalHTML += "<div class='modal-body'>";
        if (!useEmbeded) modalHTML += "<div  class='help-text'><h4>$helptext$</h4></div>".replace("$helptext$", settings.helptext);
        modalHTML += "</div>";
        modalHTML += "</div>";
        modalHTML += "</div>";
        modalHTML += "</div>";
        $(control).append(modalHTML);

        var modalMain = $(control).find("#helpModal_" + settings.name);
        var modalContent = $(modalMain).find(".modal-content");
        var modalBody = $(modalMain).find(".modal-body");
        var modalDialog = $(modalMain).find(".modal-dialog");
        var modalTitle = $(modalMain).find(".modal-title");
        var closeButton = $(modalMain).find(".close");
        var embededIFrame;

        if (useEmbeded) {
            var embedHTML = "<iframe src='$embedURL$' />".replace("$embedURL$", settings.embedURL);
            $(modalBody).append(embedHTML);
            $(modalMain).addClass("embeded-page");
            embededIFrame = $(modalBody).find("iframe");
        }

        //$(modalMain).hide(0);
        $(modalContent).resizable();
        $(modalDialog).draggable();

        var mouseDown = false;
        var resizeHandle = $(modalMain).find(".ui-resizable-handle");
        $(resizeHandle).on("mousedown", function () {
            mouseDown = true;
        });

        $(resizeHandle).on("mouseup", function () {
            mouseDown = false;
        });

        $(resizeHandle).on("mousemove", function () {
            if (mouseDown) {
                var contentHeight = $(modalContent).height();
                var newHeight = (contentHeight - 32);
                $(modalBody).css("height", newHeight);
            }
        });

        control.show = function () {
            $(modalMain).removeClass("hidden");
            $(modalMain).addClass("shown");
        };

        control.hide = function () {
            $(modalMain).removeClass("shown");
            $(modalMain).addClass("hidden");
        };

        control.loadPage = function (url) {
            $(embededIFrame).attr("src", url);
        };

        control.setHTML = function (html) {
            $(modalBody).empty();
            $(modalBody).prepend(html);
        };

        control.setTitle = function (title) {
            $(modalTitle).text(title);
        };

        $(closeButton).on("click", function () {
            control.hide();
        });

        return control;
    }
}(jQuery));
/**Modal Input */
/**Provides a blocking modal with an input box */
/**options*/
/**modalText: The text to display in the title bar of the control */
/**button1Click: The function to execute when button1 is clicked, takes the returnValue as a parameter  */
/**button2Click: The function to execute when button2 is clicked, takes the returnValue as a parameter  */
/**password: Is this a password input? */
/**values */
/**returnValue: The current value in the input box */
(function ($) {
    $.fn.ModalInput = function (options) {
        var control = this;
        var settings = $.extend({
            modalText: "Title",
            password: false,
            button1Click: null,
            button2Click: null
        }, options);

        control.returnValue = "";
        control.modalText = settings.modalText;

        var inputtype = settings.password ? "password" : "text";

        /**Main html generation */
        var controlHTML = "";
        controlHTML += "<div class='ec-input-modal modal'>";
        controlHTML += "<div class='ec-modal-text'>$modalText$</div>".replace("$modalText$", control.modalText);
        controlHTML += "<div class='input-container'>";
        controlHTML += "<input class='ec-input-modal-input' type='$inputtype$' />".replace("$inputtype$", inputtype);
        controlHTML += "</div>";
        controlHTML += "<div class='ec-input-buttons'>";
        controlHTML += "<div class='btn btn-default btn1'>Ok</div>";
        controlHTML += "<div class='btn btn-default btn2'>Cancel</div>";
        controlHTML += "</div>";
        controlHTML += "</div>";
        control.html(controlHTML);

        var mainModal = $(control).find(".ec-input-modal");

        /**Public facing methods */
        control.showModal = function () {
            var modalTextElement = $(control).find(".ec-modal-text")[0];
            $(modalTextElement).text(control.modalText);
            $(mainModal).modal("show");
        };

        control.hideModal = function () {
            $(mainModal).modal("hide");
        };

        /**Local event handlers */
        var button1 = $(control).find(".btn1")[0];
        var button2 = $(control).find(".btn2")[0];

        $(button1).on("click", function () {
            var inputControl = control.find("input[type=text]");
            control.returnValue = inputControl.val();
            control.hideModal();
            if (settings.button1Click != null) settings.button1Click(control.returnValue);
        });

        $(button2).on("click", function () {
            control.hideModal();
            if (settings.button2Click != null) settings.button2Click(control.returnValue);
        });

        return control;

    };
}(jQuery));
/*Help modal panel*/
/**Provides a non blocking modal control which is primarily used for a help page */
/**Can take either the provided text as text/html or can embed a page */
/**options */
/**title: The text to display in the title bar of the control */
/**panelHTML: The text/html to display. */
/**name: The id parameter to assign to the control, this is useful if you want to have multiple controls */
/**embedURL: The url of the page to embed in the control. */
(function ($) {
    $.fn.ModalPanel = function (options) {
        var control = this;
        var settings = $.extend({
            title: "",
            panelHTML: "",
            name: "modalPanel",
            embedURL: "",
            button1Text: "Ok",
            button2Text: "Cancel",
            button1Click: null,
            button2Click: null,
            fixedsize: false,
            fixedpos: false,
            width: 300,
            height: 300
        }, options);

        var useEmbeded = settings.embedURL != undefined && settings.embedURL != "";

        var modalHTML = "";
        modalHTML += "<div class='ec-modal-panel hidden' id='modalPanel_$name$' tabindex='-1'>".replace("$name$", settings.name);
        modalHTML += "<div class='modal-dialog' role='document'>";
        modalHTML += "<div class='modal-content'>";
        modalHTML += "<div class='modal-header'>";
        modalHTML += "<button type='button' class='close' title='Close'><span aria-hidden='true'>&times;</span></button>";
        modalHTML += "<icon class='fa fa-question fa'></icon>"
        modalHTML += "<h4 class='modal-title' id='myModalLabel'>$title$</h4>".replace("$title$", settings.title);
        modalHTML += "</div>";
        modalHTML += "<div class='modal-body'>";
        if (!useEmbeded) modalHTML += "<div  class='modal-text'><h4>$panelHTML$</h4></div>".replace("$panelHTML$", settings.panelHTML);
        modalHTML += "<div class='modal-footer'>";
        modalHTML += "<div class='ec-input-buttons'>";
        modalHTML += "<div class='btn modal-btn modal-btn-1'>$button1Text$</div>".replace("$button1Text$", settings.button1Text);
        modalHTML += "<div class='btn modal-btn modal-btn-2'>$button2Text$</div>".replace("$button2Text$", settings.button2Text);
        modalHTML += "</div>";
        modalHTML += "</div>";
        modalHTML += "</div>";
        modalHTML += "</div>";
        modalHTML += "</div>";
        modalHTML += "</div>";
        $(control).append(modalHTML);

        var modalMain = $(control).find("#modalPanel_" + settings.name);
        var modalContent = $(modalMain).find(".modal-content");
        var modalBody = $(modalMain).find(".modal-body");
        var modalText = $(modalMain).find(".modal-text");
        var modalDialog = $(modalMain).find(".modal-dialog");
        var modalTitle = $(modalMain).find(".modal-title");
        var button1 = $(modalMain).find(".modal-btn-1");
        var button2 = $(modalMain).find(".modal-btn-2");
        var closeButton = $(modalMain).find(".close");
        var embededIFrame;

        if (useEmbeded) {
            var embedHTML = "<iframe src='$embedURL$' />".replace("$embedURL$", settings.embedURL);
            $(modalBody).append(embedHTML);
            $(modalMain).addClass("embeded-page");
            embededIFrame = $(modalBody).find("iframe");
        }

        control.resizemodal = function () {
            var contentHeight = $(modalContent).height();
            var contentWidth = $(modalContent).width();
            var bodyHeight = (contentHeight - 32);
            var textHeight = (contentHeight - 120);

            $(modalBody).css("height", bodyHeight);

            $(modalDialog).width(contentWidth);
            $(modalDialog).height(contentHeight);
            $(modalText).height(textHeight);
        }

        //$(modalMain).hide(0);
        if (!settings.fixedsize) {
            $(modalContent).resizable();
        } else {
            $(modalContent).width(settings.width);
            $(modalContent).height(settings.height);
            control.resizemodal();
        }

        if (!settings.fixedpos) {
            $(modalDialog).draggable();
        }

        var mouseDown = false;
        var resizeHandle = $(modalMain).find(".ui-resizable-handle");
        $(resizeHandle).on("mousedown", function () {
            mouseDown = true;
        });

        $(resizeHandle).on("mouseup", function () {
            mouseDown = false;
        });

        $(resizeHandle).on("mousemove", function () {
            if (mouseDown) {
                control.resizemodal();
            }
        });

        control.show = function () {
            $(modalMain).removeClass("hidden");
            $(modalMain).addClass("shown");
        };

        control.hide = function () {
            $(modalMain).removeClass("shown");
            $(modalMain).addClass("hidden");
        };

        control.loadPage = function (url) {
            $(embededIFrame).attr("src", url);
        };

        control.setHTML = function (html) {
            $(modalBody).empty();
            $(modalBody).prepend(html);
        };

        control.setTitle = function (title) {
            $(modalTitle).text(title);
        };

        $(button1).on("click", function () {
            control.hide();
            if (settings.button1Click != null) {
                settings.button1Click();
            }
        });

        $(button2).on("click", function () {
            control.hide();
            if (settings.button2Click != null) {
                settings.button2Click();
            }
        });


        $(closeButton).on("click", function () {
            control.hide();
        });


        return control;
    }
}(jQuery));
/** Modal Requestor */
/**Provides a generic requestor modal with an icon, a message and buttons */
/**options */
/**title: The text to display in the title bar of the modal */
/**name: The HTML ID of the modal */
/**button1Text: The text to display on button1 (leftmost button) */
/**button2Text: The text to display on button2 (rightmost button) */
/**modalType: The type of modal to display */
/**-- twobutton : Show two buttons on the modal */
/**-- alert: Show an alert with only one button, */
/**addtionalCSSClass: An extra CSS class to add to the modal */
/**useIcon: Show an icon on the left hand side of the modal */
/**iconClass: Specify the CSS class of the icon to show in the modal */
/**buttonAlignment: Set the alignment of the button group (left/right/center) */
/**onButton1Click: Function to execute when button 1 is clicked */
/**onButton2Click: Function to execute when button 2 is clicked */
(function ($) {
    $.fn.ModalRequestor = function (options) {
        var control = this;

        var settings = $.extend({
            title: "Modal",
            name: "modalRequestor",
            modalBodyText: "Requestor modal",
            button1Text: "Ok",
            button2Text: "Cancel",
            modalType: "twobutton",
            additionalCSSClass: "",
            useIcon: false,
            iconClass: "fa-info-circle fa-3x",
            buttonAlignment: "right",
            onButton1Click: null,
            onButton2Click: null
        }, options);

        var modalHTML = "";
        modalHTML += "<div class='modal modal-requestor-container $additionalCSSClass$' id=$modalID$>".replace("$additionalCSSClass$", settings.addtionalCSSClass).replace("$modalID$", settings.name);
        modalHTML += "<div class='modal-title'>$title$</div>".replace("$title$", settings.title);
        modalHTML += "<div class='modal-body'></div>";
        modalHTML += "<div class='modal-buttons'></div>";
        modalHTML += "</div>";
        $(control).append(modalHTML);

        var modalControl = $(control).find("#" + settings.name);

        /*Body*/
        var modalBody = $(modalControl).find(".modal-body");
        var modalBodyHTML = "";
        modalBodyHTML += "<div class='modal-icon-container'><i class='fa'></i></div>";
        modalBodyHTML += "<div class='modal-body-text'>$modalBodyText$</div>".replace("$modalBodyText$", settings.modalBodyText);
        $(modalBody).append(modalBodyHTML);

        if (settings.useIcon) {
            $(modalBody).find(".modal-icon-container").addClass("col-sm-3");
            $(modalBody).find(".modal-icon-container > i").addClass(settings.iconClass);
            $(modalBody).find(".modal-body-text").addClass("col-sm-9");
            $(modalBody).addClass("has-icon");
        }

        /*Buttons*/
        var modalButtonsArea = $(modalControl).find(".modal-buttons");
        var modalButtonsHTML = "";
        modalButtonsHTML += "<div class='modal-buttons-container'>";
        modalButtonsHTML += "<div class='btn btn-default modal-btn modal-btn-1'>$button1Text$</div>".replace("$button1Text$", settings.button1Text);
        modalButtonsHTML += "<div class='btn btn-default modal-btn modal-btn-2'>$button2Text$</div>".replace("$button2Text$", settings.button2Text);
        modalButtonsHTML += "</div>";
        $(modalButtonsArea).append(modalButtonsHTML);
        $(modalButtonsArea).addClass(settings.buttonAlignment);

        switch (settings.modalType) {
            case "alert":
                $(modalButtonsArea).find(".modal-btn-2").addClass("hide");
                break;
        }

        $(modalButtonsArea).find(".modal-btn-1").off("click").on("click", function () {
            $(modalControl).modal("hide");
            if (settings.onButton1Click != null) {
                settings.onButton1Click();
            }
        });

        $(modalButtonsArea).find(".modal-btn-2").off("click").on("click", function () {
            $(modalControl).modal("hide");
            if (settings.onButton2Click != null) {
                settings.onButton2Click();
            }
        });

        control.show = function () {
            $(modalControl).modal("show");
        };



        return control;
    };
}(jQuery));
/*Header*/
(function ($) {
    $.fn.PageHeader = function (options) {
        var control = this;
        var newHTML = "";

        control.appTitle = "";
        control.pageTitle = "";
        control.noMediaIcons = false;

        var pageTitle = $(this).attr("pagetitle");
        var appTitle = $(this).attr("apptitle");
        var noMediaIcons = $(this).attr("nomediaicons");
        var homeURL = $(this).attr("homeurl");

        control.appTitle = appTitle;
        control.pageTitle = pageTitle;
        control.noMediaIcons = noMediaIcons;

        var settings = $.extend({}, options);

        newHTML += "<div class='row'>";
        newHTML += "<div class='header-row col-sm-12'>";
        newHTML += "<div class='row'>";
        newHTML += "<div class='logo-container col-sm-2'>";
        newHTML += "<div class='logo-main'></div>";
        newHTML += "</div>";
        newHTML += "<div class='title-container col-sm-8'>";
        newHTML += "<div class='header-content'>";
        newHTML += "<div class='header-app-title'></div>";
        newHTML += "<div class='header-page-title'></div>";
        newHTML += "</div>";
        newHTML += "</div>";
        newHTML += "<div class='social-media-container col-sm-2'>";
        newHTML += "<div class='header-content'>";
        newHTML += "<div class='social-media-element'></div>";
        newHTML += "</div>";
        newHTML += "</div>";
        newHTML += "</div>";
        newHTML += "</div>";
        newHTML += "</div>";
        control.html(newHTML);

        var pageTitleElement = $(control).find(".header-page-title");
        $(pageTitleElement).text(control.pageTitle);

        var appTitleElecment = $(control).find(".header-app-title");
        $(appTitleElecment).text(control.appTitle);

        var socialMediaContainer = $(control).find(".social-media-container");
        if (!control.noMediaIcons) {
            $(socialMediaContainer).ASSocialMedia();
        } else {
            $(socialMediaContainer).hide();
        }

        var imageElement = $(control).find(".logo-main");
        if (homeURL != undefined) {
            $(imageElement).addClass("has-link");
        }

        $(imageElement).on("click", function () {
            if (homeURL != undefined) {
                window.location.href = homeURL;
            }
        });

        return control;
    };
}(jQuery));
/**Panelled Buttons */
(function ($) {
    $.fn.buttonGroup = function (options) {
        var control = this;
        control.addClass("button-group");
        control.disabled = false;

        var settings = $.extend({
            isBool: false,
            bindings: {
                viewModel: null,
                value: null
            }
        }, options);

        control.viewModel = $(control).attr("viewModel") ? $(control).attr("viewModel") : settings.bindings.viewModel;
        control.boundValue = $(control).attr("boundValue") ? $(control).attr("boundValue") : settings.bindings.value;
        control.isBool = $(control).attr("isBool") ? $(control).attr("isBool") : settings.isBool;

        if (control.viewModel !== null && control.boundValue !== null) {
            control.boundValueObject = window[control.viewModel][control.boundValue];
        } else {
            control.boundValueObject = null;
        }

        control.updateBoundValue = function (newValue) {
            var objectType = typeof (control.boundValueObject());
            if (control.isBool || objectType == "boolean") {
                control.boundValueObject(newValue.toLowerCase() == "true");
            }
        };

        control.buttons = [];
        control.setActiveButton = function (index) {
            var button = control.buttons[index];
            button.SetAsActive();
        };

        return control;
    };

    $.fn.selectionButton = function (options) {
        var control = this;
        control.addClass("selection-button");
        control.eventHandlers = {};

        control.Events = {
            NewEventHandler: function (event, handler) {
                var hasExistingHandlers = control.eventHandlers[event] != undefined;
                if (!hasExistingHandlers) control.eventHandlers[event] = [];
                control.eventHandlers[event].push(handler);
            }
        };

        control.event = function (eventName, params) {
            if (control.eventHandlers == undefined) return;
            if (control.disabled) return;
            if (control.eventHandlers[eventName] != undefined && control.eventHandlers[eventName].length > 0) {
                control.eventHandlers[eventName].forEach(function (handler, i) {
                    if (params != null) {
                        handler(params);
                    } else {
                        handler();
                    }
                });
            }
        };

        var settings = $.extend({
            btntitle: "",
            icon: "",
            value: null,
            text: "",
            attachedControl: null,
            buttonGroup: null,
            bindings: {
                title: null,
                icon: null,
                value: null,
                text: null
            }
        }, options);

        if (settings.attachedControl != null) {
            control.attachedControl = settings.attachedControl;
            $(control.attachedControl).hide();
        }

        if (settings.bindings.title != null) {
            settings.bindings.title.subscribe(function () {
                control.btntitle(settings.bindings.title());
                control.updateTitle();
            });
        } else {
            control.btntitle = $(control).attr("btntitle") ? $(control).attr("btntitle") : settings.btntitle;
        }

        if (settings.bindings.icon != null) {
            control.icon = settings.bindings.icon();
            settings.bindings.icon.subscribe(function () {
                control.icon = settings.bindings.icon();
                control.updateIcon();
            });
        } else {
            control.icon = $(control).attr("icon") ? $(control).attr("icon") : settings.icon;
        }

        if (settings.bindings.value != null) {
            control.value = settings.bindings.value();
            settings.bindings.value.subscribe(function () {
                control.value = settings.bindings.value();
                control.updateText();
            });
        } else {
            control.value = $(control).attr("value") ? $(control).attr("value") : settings.value;
        }

        if (settings.bindings.text != null) {
            control.text = settings.bindings.text();
            settings.bindings.text.subscribe(function () {
                control.text = settings.bindings.text();
                control.updateText();
            });
        } else {
            control.text = $(control).attr("text") ? $(control).attr("text") : settings.text;
        }

        var generatedHTML = "";
        generatedHTML += "<div class='selection-button-outer'>";
        generatedHTML += "<div class='button-title'>$btntitle$</div>".replace("$btntitle$", control.btntitle);
        generatedHTML += "<div class='button-icon'><icon class='$icon$'></icon></div>".replace("$icon$", control.icon);
        generatedHTML += "<div class='button-text'>$text$</div>".replace("$text$", control.text);
        generatedHTML += "</div>";

        control.html(generatedHTML);

        control.updateTitle = function () {
            $(control).find(".button-title").text(control.btntitle);
        };
        control.updateIcon = function () {
            $(control).find(".button-icon").find("icon").attr("class", control.icon);
        };
        control.updateText = function () {
            $(control).find(".button-text").text(control.text);
        };

        ClickEventHandlerSubscription();

        if (settings.buttonGroup != null) {
            settings.buttonGroup.buttons.push(control);
        }

        function ClickEventHandlerSubscription() {
            $(control).off("click").on("click", function () {
                control.SetAsActive();
                control.updateGroupBoundValue();
                control.event("click", control);
            });
        }

        control.updateGroupBoundValue = function () {
            if (settings.buttonGroup.boundValueObject != null) {
                settings.buttonGroup.updateBoundValue(control.value);
            }
        };

        control.SetAsActive = function () {
            if (settings.buttonGroup != null) {
                settings.buttonGroup.buttons.forEach(function (e, i) {
                    $(e).removeClass("active");
                    $(e.attachedControl).hide();
                });
            }

            if (settings.attachedControl != null) {
                $(settings.attachedControl).show();
                $(settings.attachedControl).find("input").focus();
                $(settings.attachedControl).find("input").select();
            }

            $(control).addClass("active");
        }

        control.setInvalidInput = function () {
            $(control).find(".selection-button-outer").addClass("invalid-input");
        };

        control.setDisabled = function (state) {
            control.disabled = state;
            if (control.disabled) {
                $(control).addClass("disabled");
            } else {
                $(control).removeClass("disabled");
            }

        };

        return control;
    }
}(jQuery));
/**Button to show/hide any element */
(function ($) {
    $.fn.showHideButton = function (options) {
        var control = this;
        var attrTarget = $(control).attr("target");
        var attrTargetVisible = $(control).attr("targetVisible");

        var options = $.extend({
            target: null,
            targetVisible: false,
            text: "",
        }, options);

        control.target = attrTarget || options.target;
        control.targetVisiblle = attrTargetVisible || options.targetVisible;
        control.text = $(control).text() || options.text;

        var buttonHTML = "";
        buttonHTML += "<div class='btn btn-default btn-show-hide'>";
        buttonHTML += control.text;
        buttonHTML += "</div>";
        control.html(buttonHTML);

        if (!control.targetVisible && control.target != null) {
            $("#" + control.target).hide();
        }

        var button = $(control).find(".btn-show-hide");
        $(button).on("click", function () {
            control.targetVisible = !control.targetVisible;
            if (control.targetVisible) {
                $("#" + control.target).show(500);
            } else {
                $("#" + control.target).hide(500);
            }
        });

        return control;
    }
}(jQuery));
/*Social Media */
(function ($) {
    $.fn.SocialMediaIcons = function (options) {
        var control = this;
        var newHTML = "";
        var settings = $.extend({
            liURL: "",
            fbURL: "",
            twURL: "",
            gpURL: ""
        }, options);

        newHTML += "";
        newHTML += "<a class='social-media-standalone hide-title' href='$liURL$'>".replace("$liURL$", settings.liURL);
        newHTML += "<span class='icon fa fa-linkedin'></span>";
        newHTML += "<span class='title'>linkedin</span>";
        newHTML += "</a>";
        newHTML += "<a class='social-media-standalone hide-title' href='$fbURL$'>".replace("$fbURL$", settings.fbURL);
        newHTML += "<span class='icon fa fa-facebook'></span>";
        newHTML += "<span class='title'>facebook</span>";
        newHTML += "</a>";
        newHTML += "<a class='social-media-standalone hide-title' href='$twURL$'>".replace("$twURL$", settings.twURL);
        newHTML += "<span class='icon fa fa-twitter'></span>";
        newHTML += "<span class='title'>twitter</span>";
        newHTML += "</a>";
        newHTML += "<a class='social-media-standalone hide-title' href='$gpURL$'>".replace("$gpURL$", settings.gpURL);
        newHTML += "<span class='icon fa fa-google-plus'></span>";
        newHTML += "<span class='title'>googleplus</span>";
        newHTML += "</a>";

        control.html(newHTML);

        return control;

    };
}(jQuery));
/*Textbox*/
(function ($) {
    $.fn.textbox = function (options) {
        var control = this;
        var settings = $.extend({
            labelText: "",
            tbText: "",
            textkoBinding: null,
            labelkoBinding: null,
            noLabel: false,
            id: ""
        }, options);

        function labelText(newValue) {
            settings.labelText = newValue;
        }

        if (settings.labelkoBinding != null) {
            settings.labelText = settings.labelkoBinding();
        }

        if (settings.textkoBinding != null) {
            settings.tbText = settings.textkoBinding();
        }

        var newHTML = "";
        newHTML += "<div class='textbox' id='$id$'>".replace("$id$", settings.id);
        newHTML += "<div class='textbox-label'><label>$labelText$</label></div>".replace("$labelText$", settings.labelText);
        newHTML += "<label class='textbox-text'><label>$tbText$</label></v>".replace("$tbText$", settings.tbText);
        newHTML += "</div>";
        control.html(newHTML);

        var mainControl = $(control[0]).find(".textbox");
        var labelControl = $(mainControl).find(".textbox-label")[0];
        var textControl = $(mainControl).find(".textbox-text")[0];

        control.setText = function (textvalue) {
            var textControl = $(mainControl).find(".textbox-text")[0];
            $(textControl).text(textvalue);
        };

        if (settings.noLabel) {
            $(mainControl).addClass("no-label");
        }

        if (settings.labelkoBinding != null) {
            settings.labelkoBinding.subscribe(function () {
                $(labelControl).find("label").text(settings.labelkoBinding().toString());
            });
        }

        if (settings.textkoBinding != null) {
            settings.textkoBinding.subscribe(function () {
                $(textControl).find("label").text(settings.textkoBinding().toString());
            });
        }
        return control;
    };
}(jQuery));
/*Validator*/
var validatedControls = [];
var groupValidators = [];
var groupIndex = 0;

function allInputsValid(inputsToValidate) {
    var toReturn = true;
    if (inputsToValidate == null) {
        inputsToValidate = validatedControls;
    }
    inputsToValidate.forEach(function (element) {
        if (element.CheckValid() == false) toReturn = false;
    });
    return toReturn;
}

(function ($) {
    function GenericValidator(control, validationFunction, highlightValid) {

        var inputControl = control.find("input");
        var validationMessage = control.find(".validation-message");

        if (inputControl.length == 0) inputControl = control.find("textarea");
        if (inputControl.length == 0) inputControl = control; //Presume if input not found then control IS an input
        var inputValue = $(inputControl).val();

        control.validInput = validationFunction(inputValue);
        $(validationMessage).hide();

        if (!control.allowBlank && inputValue == "") {
            inputControl.addClass("invalid-input").removeClass("valid-input");
            $(validationMessage).show();
            return false;
        }

        if (!control.validInput && inputValue != "") {
            inputControl.addClass("invalid-input").removeClass("valid-input");
            $(validationMessage).show();
        } else if (inputValue != "") {
            inputControl.removeClass("invalid-input");
            $(validationMessage).hide();
            if (highlightValid) {
                inputControl.addClass("valid-input");
            }

        } else {
            inputControl.removeClass("invalid-input").removeClass("valid-input");
            $(validationMessage).hide();
        }

        return control.validInput;
    }

    $.fn.groupValidator = function (options) {
        var control = this;
        var settings = $.extend({
            boundKOValidationResult: null
        }, options);

        groupValidators[groupIndex] = control;
        groupValidators[groupIndex].attachedControls = [];

        control.groupIndex = groupIndex;
        control.isValid = true;

        control.UpdateValidation = function () {
            if (control.attachedControls.length > 0) {
                control.isValid = true;
                control.attachedControls.forEach(function (e, i) {
                    if (e.CheckValid() == false) control.isValid = false;
                });
                if (settings.boundKOValidationResult != null) settings.boundKOValidationResult(control.isValid);
            }
        };

        groupIndex++;
        return control;
    };

    $.fn.inputValidator = function (options) {
        var control = this;
        control.wrap("<div class='validated-input'></div>");
        control.outerControl = control.closest(".validated-input");
        control.validationMessageControl = null;

        var inputControl = control.find("input");
        if (inputControl.length == 0) inputControl = control.find("textarea");
        if (inputControl.length == 0) inputControl = control; //Presume if input not found then control IS an input

        var settings = $.extend({
            validationFunction: null,
            validationMessage: "Invalid Input",
            useValidationMessage: false,
            realTimeValidation: false,
            highlightValid: true,
            boundKOValue: null,
            boundKOValidationResult: null,
            groupValidator: null,
            allowBlank: true
        }, options);

        control.append("<div class='validation-message-container'></div>");
        control.allowBlank = settings.allowBlank;

        if (settings.realTimeValidation) {
            $(inputControl).on("keyup", function () {
                control.CheckValid();
                if (settings.groupValidator != null) {
                    settings.groupValidator.UpdateValidation();
                }
            });
        }

        if (settings.useValidationMessage) {
            var validationMessageContainer = $(this).find(".validation-message-container");
            $(validationMessageContainer).WarningPanel({
                text: settings.validationMessage,
                warningClass: "error",
                additionalClass: "validation-message"
            });
        }

        control.CheckValid = function () {
            var validationResult = GenericValidator(control, settings.validationFunction, settings.highlightValid);
            if (settings.boundKOValue != null) {
                settings.boundKOValue($(control).val());
            }
            if (settings.boundKOValidationResult != null) {
                settings.boundKOValidationResult(validationResult);
            }
            if (control.validationMessageControl != null) {
                $(control.validationMessageControl).hide();
                if (!validationResult) $(control.validationMessageControl).show();
            }

            return validationResult;
        };

        validatedControls.push(control);

        if (settings.groupValidator != null) {
            settings.groupValidator.attachedControls.push(control);
        }

        return control;
    };

    $.fn.numericValidator = function (options) {
        var numericControl = this;
        numericControl.validInput = false;

        var settings = $.extend({
            validationMessage: "Input is not a number",
            useValidationMessage: false,
            highlightValid: false,
            realTimeValidation: false,
            boundKOValue: null,
            boundKOValidationResult: null,
            groupValidator: null,
            allowBlank: true
        }, options);

        var genericValidator = $(numericControl).inputValidator({
            validationMessage: settings.validationMessage,
            useValidationMessage: settings.useValidationMessage,
            highlightValid: settings.highlightValid,
            realTimeValidation: settings.realTimeValidation,
            validationFunction: validator,
            boundKOValue: settings.boundKOValue,
            boundKOValidationResult: settings.boundKOValidationResult,
            groupValidator: settings.groupValidator,
            allowBlank: settings.allowBlank
        });

        numericControl.validInput = function () {
            genericValidator.CheckValid();
        };
        numericControl.CheckValid = function () {
            return genericValidator.CheckValid();
        };

        function validator(value) {
            var numRegex = new RegExp("^[0-9]*$");
            return numRegex.test(value);
        }

        return numericControl;
    };

    $.fn.alphaValidator = function (options) {
        var alphaControl = this;
        alphaControl.validInput = false;

        var settings = $.extend({
            validationMessage: "Please enter only numbers or letters",
            useValidationMessage: false,
            highlightValid: false,
            realTimeValidation: false,
            boundKOValue: null,
            boundKOValidationResult: null,
            groupValidator: null,
            allowBlank: true
        }, options);

        var genericValidator = $(alphaControl).inputValidator({
            validationMessage: settings.validationMessage,
            useValidationMessage: settings.useValidationMessage,
            highlightValid: settings.highlightValid,
            realTimeValidation: settings.realTimeValidation,
            validationFunction: validator,
            boundKOValue: settings.boundKOValue,
            boundKOValidationResult: settings.boundKOValidationResult,
            groupValidator: settings.groupValidator,
            allowBlank: settings.allowBlank
        });

        alphaControl.validInput = function () {
            genericValidator.CheckValid();
        };
        alphaControl.CheckValid = function () {
            return genericValidator.CheckValid();
        };

        function validator(value) {
            var numRegex = new RegExp("^[a-zA-Z0-9_]*$");
            return numRegex.test(value);
        }

        return alphaControl;
    };

}(jQuery));
/*Value display*/
(function ($) {
    $.fn.valueDisplay = function (options) {
        var self = this;
        this.addClass("icon-panel");

        var settings = $.extend({
            labelText: "",
            iconClass: "",
            valueBinding: null,
            visibleBinding: null
        }, options);


        var newHTML = "";
        newHTML += "<div class='icon-container false fa-stack'>";


        newHTML += "</div>";
        newHTML = newHTML.replace("$labelText$", settings.labelText);
        newHTML = newHTML.replace("$iconClass$", settings.iconClass);

        this.html(newHTML);
        return self;
    };
}(jQuery));
/**Warning Panel */
(function ($) {
    $.fn.WarningPanel = function (options) {
        var control = this;
        var settings = $.extend({
            text: "Warning Panel",
            warningClass: "",
            additionalClass: ""
        }, options);

        var WarningPanelHTML = "";
        WarningPanelHTML += "<div class='warning-panel'>";
        WarningPanelHTML += "<div class='warning-text'>$text$</div>".replace("$text$", settings.text);
        WarningPanelHTML += "</div>";
        $(control).append(WarningPanelHTML);

        var warningControl = $(control).find(".warning-panel")[0];
        $(warningControl).addClass(settings.warningClass);
        $(warningControl).addClass(settings.additionalClass);

        return control;
    };
}(jQuery));
$(document).ready(function () {
    var isIE = /*@cc_on!@*/ false || !!document.documentMode;

    //Anything using flex will not display properly in IE.
    if (isIE) {
        $(".grouped-buttons").addClass("ie-fix");
    }
});
//Files added after babel.
//If any of these use ES6+ functions.
//They will not work in IE.