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