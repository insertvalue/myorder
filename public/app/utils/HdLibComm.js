/**
 * Created by hongdian on 2014/12/30.
 * 工具类
 */
var HdLib = window.HdLib = HdLib || {};
HdLib.Art = HdLib.Art || {};
HdLib.IFlood = HdLib.IFlood || {};
HdLib.IRWarn = HdLib.IRWarn || {};
HdLib.menu = HdLib.menu || {};
HdLib.chart = HdLib.chart || {};
HdLib.jqgrid = HdLib.jqgrid || {};
HdLib.time = HdLib.time || {};
(function () {
    /*
     *  功能：判断是否为空
     *  @param value ：参数值
     *  @return 返回true表示为空
     */
    HdLib.isNull = function (value) {
        if (value == undefined || value == "" || value == null) {
            return true;
        }
        if ($.trim(value) == "") {
            return true;
        }
        return false;
    };

    /**
     * 获取项目根路径
     * @returns {window.HdLibHdLib.getRootPath.projectName|window.HdLibHdLib.getRootPath.localhostPaht}
     */
    HdLib.getRootPath = function () {
        //获取当前网址，如： http://localhost:8080/projectName/login/login.jsp
        var curPath = window.document.location.href;
        //获取主机地址之后的目录，如： projectName/login/login.jsp
        var pathName = window.document.location.pathname;
        var pos = curPath.indexOf(pathName);
        //获取主机地址，如： http://localhost:8080
        var localhostPaht = curPath.substring(0, pos);
        //获取带"/"的项目名，如：/projectName
        var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
        return (localhostPaht + projectName);
    };

    /**
     * 项目根路径
     */
    HdLib.rootPath = HdLib.getRootPath();

    /*
     *  功能：判断是否为空
     *  @param value ：参数值
     *  @return 返回true表示不为空
     */
    HdLib.notNull = function (value) {
        if (value == undefined || value === "" || value == null) {
            //因为0 == ""为true，所以需要 用恒等于
            return false;
        }
        if ($.trim(value) == "") {
            return false;
        }
        return true;
    };

    /**
     * 根据文件路径直接引用js文件到jsp页面中
     * @param {type} jsUrl js文件路径
     * @param {type} callback 回调函数
     * @returns {undefined}
     */
    HdLib.loadScript = function (jsUrl, callback) {
        var oldId = $("body").find("script:last").attr("id");
        if (!this.isNull(oldId)) {
            var oldElementObj = document.getElementById(oldId);
            if (oldElementObj) {
                document.getElementsByTagName('body')[0].removeChild(oldElementObj);
            }
        }
        var script = document.createElement('script');
        script.id = jsUrl;
        script.type = 'text/javascript';
        script.src = jsUrl;
        document.getElementsByTagName('body')[0].appendChild(script);
        if (this.notNull(callback)) {
            if (script.readyState) { //IE
                script.onreadystatechange = function () {
                    if (script.readyState == "loaded" || script.readyState == "complete") {
                        script.onreadystatechange = null;
                        if (HdLib.notNull(callback)) {
                            callback();
                        }
                    }
                };
            } else { //Others(Firefox, Opera, Chrome, Safari 3+  )
                script.onload = function () {
                    if (HdLib.notNull(callback)) {
                        callback();
                    }
                };
            }
        }
    }

    /**
     * 面板伸缩按钮
     */
    HdLib.arrow = function () {
        $('#arrowImage').toggle(
            function () {
                //左边面板的宽度
                var mainLeftContentWidth = $('#mainLeftContent').width();
                var arrowContentWidth = $('#arrowContent').width();
                $('#mainLeftContent').css('left', -mainLeftContentWidth + 'px');
                $('#arrowContent').css('left', '0px');
                $('#mainRightContent').css('left', arrowContentWidth - 2 + 'px');
                //表格自适应伸缩按钮
                if ($("#centerInfo").length > 0 && $(".ui-jqgrid").length > 0) {
                    setGridHeightAndWidth();
                }
                $(this).addClass("arrowImageRight").removeClass("arrowImageLeft");
            },
            function () {
                //左边面板的宽度
                var mainLeftContentWidth = $('#mainLeftContent').width();
                //伸缩面板的宽度
                var arrowContentWidth = $('#arrowContent').width();
                $('#mainLeftContent').css('left', '0px');
                $('#arrowContent').css('left', (mainLeftContentWidth + 1) + 'px');
                $('#mainRightContent').css('left', (mainLeftContentWidth + arrowContentWidth - 1) + 'px');
                //表格自适应伸缩按钮
                if ($("#centerInfo").length > 0 && $(".ui-jqgrid").length > 0) {
                    setGridHeightAndWidth();
                }
                $(this).addClass("arrowImageLeft").removeClass("arrowImageRight");
            });
    };

    HdLib.dateGetCurrentDate = function () {
        var date = new Date();
        var year = date.getFullYear();
        var month = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1);
        var day = (date.getDate()) >= 10 ? (date.getDate()) : "0" + (date.getDate());
        var currentDate = year + "-" + month + "-" + day;
        return currentDate;
    };

    /**
     *
     * @param {type} month 0:1月，11:12月
     * @returns {Number|String} 返回月数+1
     */
    HdLib.dateFormatMonth = function (month) {
        return (month + 1) >= 10 ? (month + 1) : "0" + (month + 1);
    };

    HdLib.dateFormatDay = function (day) {
        return day >= 10 ? day : ("0" + day);
    };

    /**
     *
     * @param {type} year
     * @param {type} month 0:1月，11:12月
     * @returns {Number}
     */
    HdLib.getDaysInMonth = function (year, month) {
        month = parseInt(month) + 1;
        var temp = new Date(parseInt(year), month, 0);
        var day = temp.getDate();
        return day >= 10 ? day : ("0" + day);
    }

    //开始动态日期时间
    HdLib.startDynamicFmtDateTime = function () {
        WdatePicker({
            dateFmt: "yyyy-MM-dd HH:mm:ss",
            maxDate: '#F{$dp.$D(\'endDateTime\')||\'2099-10-01\'}'
        });
    };

    //结束动态日期时间
    HdLib.endDynamicFmtDateTime = function () {
        WdatePicker({
            dateFmt: "yyyy-MM-dd HH:mm:ss",
            minDate: '#F{$dp.$D(\'startDateTime\')}',
            maxDate: '2099-10-01'
        });
    };
})();

//artdialog封装
(function () {
    /**
     * 格式化时间
     * @param {type} value
     * @returns
     */
    HdLib.time.format = function (value) {
        var result;
        if (null == value) {
            result = '<font color="red">--</font>';
        } else {
            result = $.format.date(value, 'yyyy-MM-dd HH:mm:ss');
        }
        return result;
    }
    //获取当前年份
    HdLib.time.getCurrentYear = function () {
        var date = new Date();
        var year = date.getFullYear();
        return year;
    };
    //获取当前年月（yyyy-MM）
    HdLib.time.getCurrentYearMon = function () {
        var date = new Date();
        var year = date.getFullYear();
        var month = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1);
        var yearMon = year + "-" + month;
        return yearMon;
    };
    //获取当前年月日（yyyy-MM-dd）
    HdLib.time.getCurrentYearMonDay = function () {
        var date = new Date();
        var year = date.getFullYear();
        var month = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1);
        var day = (date.getDate()) >= 10 ? (date.getDate()) : "0" + (date.getDate());
        var yearMonDay = year + "-" + month + "-" + day;
        return yearMonDay;
    };
    //获取当前年月日小时（yyyy-MM-dd HH）
    HdLib.time.getCurrentYearMonDayHour = function () {
        var date = new Date();
        var year = date.getFullYear();
        var month = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1);
        var day = (date.getDate()) >= 10 ? (date.getDate()) : "0" + (date.getDate());
        var hour = (date.getHours()) >= 10 ? (date.getHours()) : "0" + (date.getHours());
        var yearMonDayHour = year + "-" + month + "-" + day + " " + hour;
        return yearMonDayHour;
    };
    //根据传入的字符串时间（yyyy-MM-dd HH:mm:ss）和步长，得到相隔dayStep天的时间（yyyy-MM-dd HH）
    HdLib.time.getDateHourByDayStep = function (hourDate, dayStep) {
        var dateTime = new Date(hourDate.replace(/-/g, "/"));
        dateTime.setDate(dateTime.getDate() + dayStep);
        var year = dateTime.getFullYear();
        var month = (dateTime.getMonth() + 1) >= 10 ? (dateTime.getMonth() + 1) : "0" + (dateTime.getMonth() + 1);
        var day = (dateTime.getDate()) >= 10 ? (dateTime.getDate()) : "0" + (dateTime.getDate());
        var hour = (dateTime.getHours()) >= 10 ? (dateTime.getHours()) : "0" + (dateTime.getHours());
        var yearMonDayHour = year + "-" + month + "-" + day + " " + hour;
        return yearMonDayHour;
    };
    //根据传入的字符串时间（yyyy-MM-dd HH:mm:ss）和步长，得到相隔dayStep天的时间（yyyy-MM-dd）
    HdLib.time.getDateByDayStep = function (date, dayStep) {
        var dateTime = new Date(date.replace(/-/g, "/"));
        dateTime.setDate(dateTime.getDate() + dayStep);
        var year = dateTime.getFullYear();
        var month = (dateTime.getMonth() + 1) >= 10 ? (dateTime.getMonth() + 1) : "0" + (dateTime.getMonth() + 1);
        var day = (dateTime.getDate()) >= 10 ? (dateTime.getDate()) : "0" + (dateTime.getDate());
        var yearMonDay = year + "-" + month + "-" + day;
        return yearMonDay;
    };
    //根据传入的字符串时间（yyyy-MM-dd HH:mm:ss）和年步长，得到相隔step年的时间（yyyy-MM-dd HH:mm:ss）
//    HdLib.time.getTimeByYearStep =  function(time, step) {
//        var dateTime = new Date(time.replace(/-/g, "/"));
//        dateTime.setDate(dateTime.getYear() + step);
//        var year = dateTime.getFullYear();
//        var month = (dateTime.getMonth() + 1) >= 10 ? (dateTime.getMonth() + 1) : "0" + (dateTime.getMonth() + 1);
//        var day = (dateTime.getDate()) >= 10 ? (dateTime.getDate()) : "0" + (dateTime.getDate());
//        var hour = (dateTime.getHours()) >= 10 ? (dateTime.getHours()) : "0" + (dateTime.getHours());
//        var minute = (dateTime.getMinutes()) >= 10 ? (dateTime.getMinutes()) : "0" + (dateTime.getMinutes());
//        var seconds = (dateTime.getSeconds()) >= 10 ? (dateTime.getSeconds()) : "0" + (dateTime.getSeconds());
//        var newTime = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + seconds;
//        return newTime;
//    };
    //根据传入的字符串时间（yyyy-MM-dd HH:mm:ss）和月步长，得到相隔step月的时间（yyyy-MM-dd HH:mm:ss）
//    HdLib.time.getTimeByMonthStep =  function(time, step) {
//        var dateTime = new Date(time.replace(/-/g, "/"));
//        dateTime.setDate(dateTime.getUTCMonth() + step);
//        var year = dateTime.getFullYear();
//        var month = (dateTime.getMonth() + 1) >= 10 ? (dateTime.getMonth() + 1) : "0" + (dateTime.getMonth() + 1);
//        var day = (dateTime.getDate()) >= 10 ? (dateTime.getDate()) : "0" + (dateTime.getDate());
//        var hour = (dateTime.getHours()) >= 10 ? (dateTime.getHours()) : "0" + (dateTime.getHours());
//        var minute = (dateTime.getMinutes()) >= 10 ? (dateTime.getMinutes()) : "0" + (dateTime.getMinutes());
//        var seconds = (dateTime.getSeconds()) >= 10 ? (dateTime.getSeconds()) : "0" + (dateTime.getSeconds());
//        var newTime = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + seconds;
//        return newTime;
//    };
    //根据传入的字符串时间（yyyy-MM-dd HH:mm:ss）和日步长，得到相隔step日的时间（yyyy-MM-dd HH:mm:ss）
    HdLib.time.getTimeByDayStep = function (time, step) {
        var dateTime = new Date(time.replace(/-/g, "/"));
        dateTime.setDate(dateTime.getDate() + step);
        var year = dateTime.getFullYear();
        var month = (dateTime.getMonth() + 1) >= 10 ? (dateTime.getMonth() + 1) : "0" + (dateTime.getMonth() + 1);
        var day = (dateTime.getDate()) >= 10 ? (dateTime.getDate()) : "0" + (dateTime.getDate());
        var hour = (dateTime.getHours()) >= 10 ? (dateTime.getHours()) : "0" + (dateTime.getHours());
        var minute = (dateTime.getMinutes()) >= 10 ? (dateTime.getMinutes()) : "0" + (dateTime.getMinutes());
        var seconds = (dateTime.getSeconds()) >= 10 ? (dateTime.getSeconds()) : "0" + (dateTime.getSeconds());
        var newTime = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + seconds;
        return newTime;
    };
    //根据传入的字符串时间（yyyy-MM-dd HH:mm:ss）和小时步长，得到相隔step小时的时间（yyyy-MM-dd HH:mm:ss）
    HdLib.time.getTimeByHourStep = function (time, step) {
        var dateTime = new Date(time.replace(/-/g, "/"));
        dateTime.setHours(dateTime.getHours() + step);
        var year = dateTime.getFullYear();
        var month = (dateTime.getMonth() + 1) >= 10 ? (dateTime.getMonth() + 1) : "0" + (dateTime.getMonth() + 1);
        var day = (dateTime.getDate()) >= 10 ? (dateTime.getDate()) : "0" + (dateTime.getDate());
        var hour = (dateTime.getHours()) >= 10 ? (dateTime.getHours()) : "0" + (dateTime.getHours());
        var minute = (dateTime.getMinutes()) >= 10 ? (dateTime.getMinutes()) : "0" + (dateTime.getMinutes());
        var seconds = (dateTime.getSeconds()) >= 10 ? (dateTime.getSeconds()) : "0" + (dateTime.getSeconds());
        var newTime = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + seconds;
        return newTime;
    };
    //计算两个日期相隔多少天
    HdLib.time.getDaysByDate = function (date1, date2) {
        var dateTime1 = new Date(date1.replace(/-/g, "/"));
        var dateTime2 = new Date(date2.replace(/-/g, "/"));
        return parseInt(Math.abs(dateTime1 - dateTime2) / 1000 / 60 / 60 / 24);
    };

    /**
     *获取最大天数
     */
    HdLib.time.getDaysInMonth = function (year, month) {
        month = parseInt(month, 10);
        var temp = new Date(year, month, 0);
        return temp.getDate();
    };
})();

//jqgrid封装
(function () {
    /**
     * 显示grid空白行
     * @param {type} divId
     * @returns {undefined}
     */
    HdLib.gridEmptyRow = function () {
        //没有数据时提示
        var rowNum = $(this).jqGrid('getGridParam', 'records');
        if (rowNum < 1) {
            if ($("#norecords").html() == null) {
                $(this).parent().append("</pre><div id='norecords'>没有查询到数据！</div><pre>");
            }
            $("#norecords").show();
        } else {
            if ($("#norecords").html() != null) {
                $("#norecords").hide();
            }
        }
    };

    HdLib.gridEmptyRowById = function (divId) {
        //没有数据时提示
        var rowNum = $("#" + divId).jqGrid('getGridParam', 'records');
        if (rowNum < 1) {
            if ($("#norecords").html() == null) {
                $("#" + divId).parent().append("</pre><div id='norecords'>没有查询到数据！</div><pre>");
            }
            $("#norecords").show();
        } else {
            if ($("#norecords").html() != null) {
                $("#norecords").hide();
            }
        }
    };
    /**
     * jqGrid列子对象生成
     */
    HdLib.jqGridCm = function (name, index, width, align, sortable, hidden, formatter) {
        this.name = name;
        this.index = index;
        this.width = width;
        this.align = align;
        this.sortable = sortable;
        if (HdLib.notNull(hidden)) {
            this.hidden = hidden;
        }
        if (HdLib.notNull(formatter)) {
            this.formatter = formatter;
        }
    };

    /**
     * 获取当前窗口的有效可视宽度和高度偏移后grid的宽度和高度
     * @param {type} offsetW 将jqGrid窗口的宽度设置为ss.WinW-20，高度设置为ss.WinH-93
     * @param {type} offsetH  这里的20和93是真实宽高度的修正值，你可以自己去试一下找到最合适你的那个数值
     * @returns {WarnServSt.prototype.getPageSize.Anonym$14}
     */
    HdLib.jqgrid.getPageSize = function (offsetW, offsetH) {
        var winW, winH;//当前窗口的有效可视宽度和高度
        if (window.innerHeight) { //所有非IE浏览器
            winW = window.innerWidth;
            winH = $(window).height();
        } else if (document.documentElement && document.documentElement.clientHeight) { //IE 6 Strict Mode
            winW = document.documentElement.clientWidth;
            winH = document.documentElement.clientHeight;
        } else if (document.body) { //其他浏览器
            winW = document.body.clientWidth;
            winH = document.body.clientHeight;
        }
        return {
            WinW: (winW - offsetW), //真正反馈的宽度
            WinH: (winH - offsetH) //真正反馈的高度
        };
    };

    /**
     * 动态获取当前页显示的最大行数
     * @param {type} offsetW
     * @param {type} offsetH
     * @param {type} pageSizeObj
     * @returns {unresolved}
     */
    HdLib.jqgrid.getGridNum = function (offsetW, offsetH, pageSizeObj) {
        if (HdLib.isNull(pageSizeObj)) {
            pageSizeObj = HdLib.jqgrid.getPageSize(offsetW, offsetH);
        }
        var rowNum = ((pageSizeObj.WinH) / 32 + '').split('.')[0];
        if (rowNum < 1) {
            rowNum = 1;
        }
        return Number(rowNum);
    };

    /**
     * 调整jqGrid的窗口的大小和行数
     * @param {type} offsetW
     * @param {type} offsetH
     * @param {type} gridDivId
     * @returns {undefined}
     */
    HdLib.jqgrid.doGridResize = function (offsetW, offsetH, gridDivId) {
        var pageSizeObj = HdLib.jqgrid.getPageSize(offsetW, offsetH);
        var rowNum = HdLib.jqgrid.getGridNum(null, null, pageSizeObj);
        $('#' + gridDivId + '')
            .jqGrid('setGridWidth', pageSizeObj.WinW)
            .jqGrid('setGridHeight', pageSizeObj.WinH)
            .jqGrid('setGridParam', {rowNum: rowNum, page: 1})
            .jqGrid('setFrozenColumns').trigger("reloadGrid");
    };

    /**
     * 调整jqGrid的窗口的大小
     * @param {type} offsetW
     * @param {type} offsetH
     * @param {type} gridDivId
     * @returns {undefined}
     */
    HdLib.jqgrid.doGridResizeNoReload = function (offsetW, offsetH, gridDivId) {
        var pageSizeObj = HdLib.jqgrid.getPageSize(offsetW, offsetH);
        $('#' + gridDivId + '')
            .jqGrid('setGridWidth', pageSizeObj.WinW)
            .jqGrid('setGridHeight', pageSizeObj.WinH);
    };


    /**
     * 不改变行数设置jqGrid的窗口的大小
     * @param {type} offsetW
     * @param {type} offsetH
     * @param {type} gridDivId
     * @returns {undefined}
     */
    HdLib.jqgrid.doGridMaxRowSize = function (offsetW, offsetH, gridDivId) {
        var pageSizeObj = HdLib.jqgrid.getPageSize(offsetW, offsetH);
        $('#' + gridDivId + '')
            .jqGrid('setGridWidth', pageSizeObj.WinW)
            .jqGrid('setGridHeight', pageSizeObj.WinH)
            .jqGrid('setFrozenColumns').trigger("reloadGrid");
    };

    /**
     * 固定设置jqGrid的窗口的高度
     * @param {type} offsetW
     * @param {type} offsetH
     * @param {type} gridDivId
     * @param {type} height 固定高度
     * @returns {undefined}
     */
    HdLib.jqgrid.doGridFixSize = function (offsetW, offsetH, gridDivId, height) {
        var pageSizeObj = HdLib.jqgrid.getPageSize(offsetW, offsetH);
        $('#' + gridDivId + '')
            .jqGrid('setGridWidth', pageSizeObj.WinW)
            .jqGrid('setGridHeight', height)
            .jqGrid('setFrozenColumns').trigger("reloadGrid");
    };
    /**
     * 设置jqGrid的窗口的高度比例
     * @param {type} offsetW
     * @param {type} offsetH
     * @param {type} gridDivId
     * @param {type} scale 小数比例
     * @returns {undefined}
     */
    HdLib.jqgrid.doGridSclaeSize = function (offsetW, offsetH, gridDivId, scale) {
        var pageSizeObj = HdLib.jqgrid.getPageSize(offsetW, offsetH);
        $('#' + gridDivId + '')
            .jqGrid('setGridWidth', pageSizeObj.WinW)
            .jqGrid('setGridHeight', pageSizeObj.WinH * scale)
            .jqGrid('setFrozenColumns').trigger("reloadGrid");
    };
    /**
     * 设置jqGrid的窗口的高度比例
     * @param {type} offsetW
     * @param {type} offsetH
     * @param {type} gridDivId
     * @param {type} scale 小数比例
     * @returns {undefined}
     */
    HdLib.jqgrid.doGridSclaeSizeNoReload = function (offsetW, offsetH, gridDivId, scale) {
        var pageSizeObj = HdLib.jqgrid.getPageSize(offsetW, offsetH);
        $('#' + gridDivId + '')
            .jqGrid('setGridWidth', pageSizeObj.WinW)
            .jqGrid('setGridHeight', pageSizeObj.WinH * scale);
    };
})();

//artdialog封装
(function () {
    //对话框icon
    HdLib.Art.icons = {
        error: "error",
        faceSad: "face-sad",
        faceSmile: "face-smile",
        loading: "loading",
        question: "question",
        succeed: "succeed",
        warning: "warning"
    };

    /**
     * 显示对话框
     * @param {type} title
     * @param {type} icon
     * @param {type} content
     * @param {type} funcOk
     * @param {type} funcClose
     * @returns {undefined}
     */
    HdLib.Art.artOK = function (title, icon, content, funcOk, funcClose) {
        if (HdLib.isNull(funcOk)) {
            funcOk = function () {
            };
        }
        art.dialog({
            title: title,
            icon: icon,
            content: '<span class="rt_dialog_content">' + content + '</span>',
            lock: true,
            ok: funcOk,
            close: funcClose
        });
    }
    HdLib.Art.artYesNo = function (title, icon, content, funcYes, funcNo, funcClose) {
        art.dialog({
            title: title,
            icon: icon,
            content: content,
            lock: true,
            button: [{
                name: '确定',
                callback: funcYes
            }, {
                name: '取消',
                callback: funcNo,
                focus: true
            }],
            close: funcClose
        })
    };

    HdLib.Art.artClose = function (dia) {
        if (null != dia) {
            dia.close();
            dia = null;
        }
    }

    //操作成功或失败提示信息
    HdLib.Art.showDialogMsg = function (msg) {
        if ("true" == msg) {
            art.dialog({
                title: '提示',
                icon: 'succeed',
                time: 1,
                content: '<span class="rt_dialog_content">操作成功!</span>',
                lock: true,
                ok: function () {
                }
            });
        } else {
            art.dialog({
                title: '提示',
                icon: 'error',
                time: 1,
                content: '<span class="rt_dialog_content">操作失败!</span>',
                lock: true,
                ok: function () {
                }
            });
        }
    };
})();

//菜单封装
(function () {
    //菜单操作接口
    /**
     * 根据a href ID增加或者移除选中样式
     * @param {type} id a href ID如"zhjc_ylz";
     * @param {Boolean} flag, true增加，false移除
     * @returns {undefined}
     */
    HdLib.menu.menuShowCssById = function (id, flag) {
        if (flag) {
            //先移除当前选中的
            var menu2 = $(parent.frames["frame_menu"].document).find('.menu_2_item')
            $.each(menu2, function (index, ele) {
                $(ele).removeClass('menu_2_current');
            });
            //添加新选中样式
            $(parent.frames["frame_menu"].document).find('a[id="' + id + '"] .menu_2_item').addClass('menu_2_current');
        } else {
            $(parent.frames["frame_menu"].document).find('a[id="' + id + '"] .menu_2_item').removeClass('menu_2_current');
        }
    }

    /**
     * 根据菜单简称获取二级菜单
     * @param {type} shortName
     * @returns {undefined}
     */
    HdLib.menu.getMenusByShortName = function (shortName) {
        var menu_2_a = $(parent.frames["frame_menu"].document).find("#" + shortName + " a");
        return menu_2_a;
    }
    /**
     * 根据菜单简称获取二级菜单
     * @param {type} shortName
     * @returns {undefined}
     */
    HdLib.menu.getMenusByShortName = function (shortName) {
        var menu_2_a = $(parent.frames["frame_menu"].document).find("#" + shortName + " a");
        return menu_2_a;
    };


    /**
     *
     * @param {type} obj
     * @param {type} n3 三级标题序号
     * @returns {undefined}
     */
    HdLib.showMenu3Static_3 = function (obj, n3) {
        var Nav = obj.parentNode;
        //点击三级菜单
        var HName = Nav.parentNode.getElementsByTagName("h2");
        for (var i = 0; i < HName.length; i++) {
            HName[i].className = "";
        }
        obj.className = "h2current";
    };

    /**
     *
     * @param {type} obj
     * @param {type} n2 二级标题需要
     * @param {type} n3 三级标题序号
     * @returns {undefined}
     */
    HdLib.showMenu3Static_23 = function (obj, n2, n3) {
        var Nav = obj.parentNode;

        if (!Nav.id) {
            //点击三级菜单
            //3级菜单
            var HName = Nav.parentNode.getElementsByTagName("h2");
            for (var i = 0; i < HName.length; i++) {
                HName[i].className = "";
            }
            obj.className = "h2current";

            //2级菜单
            var HName = Nav.parentNode.getElementsByTagName("h1");
            for (var i = 0; i < HName.length; i++) {
                HName[i].firstChild.className = "";
                if (i == n2) {
                    HName[i].firstChild.className = "aCurrent";
                }
            }
        } else {
            //点击二级菜单
            var HName = Nav.getElementsByTagName("h1");
            for (var i = 0; i < HName.length; i++) {
                HName[i].firstChild.className = "";
            }
            obj.firstChild.className = "aCurrent";

            var HName = Nav.getElementsByTagName("h2");
            for (var i = 0; i < HName.length; i++) {
                HName[i].className = "";
            }
        }
    };
})();

//chart封装
(function () {
    /**
     * 图表类型
     */
    HdLib.chart.type = {
        area: "area",
        column: "column",
        spline: 'spline',
        line: 'line'
    };

    /**
     * 图标y数据对象
     * @param {type} yAxis
     * @param {type} name
     * @param {type} data
     * @returns {undefined}
     */
    HdLib.chart.serieObj = function (yAxis, name, data, type, color) {
        this.name = name;
        this.yAxis = yAxis;
        this.data = data;
        this.color = color;
        if (HdLib.notNull(type)) {
            this.type = type;
        } else {
            this.type = '';
        }
    };

    /**
     * 图标y数据对象
     * @param {type} yAxis
     * @param {type} name
     * @param {type} data
     * @returns {undefined}
     */
    HdLib.chart.serieObject = function (yAxis, id, name, data, type) {
        this.id = id;
        this.name = name;
        this.yAxis = yAxis;
        this.data = data;
        if (HdLib.notNull(type)) {
            this.type = type;
        } else {
            this.type = '';
        }
    };

    /**
     * 设置图表数据
     * @param {type} chart
     * @param {type} tilte
     * @param {type} subTitle
     * @param {type} categories
     * @param {type} serieTypesArr
     * @param {type} serieDatasArr
     * @returns {undefined}
     */
    HdLib.chart.setChartData = function (chart, tilte, subTitle, categories, series) {
        var colors = Highcharts.getOptions().colors;
        chart.setTitle({'text': tilte}, {'text': subTitle});
        chart.xAxis[0].setCategories(categories, false);
        var seriesLen = chart.series.length;
        for (var i = 0; i < seriesLen; i++) {
            chart.series[0].remove(false);
        }
//        $.each(chart.series, function(index, ele) {
//            ele.remove(false);
//        });
        $.each(series, function (index, ele) {
            chart.addSeries({
                name: ele.name,
                yAxis: ele.yAxis,
                type: ele.type,
                marker: {
                    symbol: 'circle'//diamond
                },
                data: ele.data,
                color: colors[index] || 'white'
            }, false);
        });
        chart.redraw();
    };

    /**
     * 设置highStock图表数据
     * @param {type} chart
     * @param {type} tilte
     * @param {type} subTitle
     * @param {type} categories
     * @param {type} serieTypesArr
     * @param {type} serieDatasArr
     * @returns {undefined}
     */
    HdLib.chart.setStockChartData = function (chart, tilte, subTitle, categories, series) {
        var colors = Highcharts.getOptions().colors;
        chart.setTitle({'text': tilte}, {'text': subTitle});
//        chart.xAxis[0].setCategories(categories, false);
        var seriesLen = chart.series.length;
        for (var i = 0; i < seriesLen; i++) {
            chart.series[0].remove(false);
        }
//        $.each(chart.series, function(index, ele) {
//            ele.remove(false);
//        });
        $.each(series, function (index, ele) {
            chart.addSeries({
                name: ele.name,
                yAxis: ele.yAxis,
                type: ele.type,
                marker: {
                    lineColor: ele.color,
                    lineWidth: 2,
                    symbol: 'circle'//diamond
                },
                data: ele.data,
                color: ele.color
            }, false);
        });
        chart.redraw();
    };

    /**
     * 创建图表
     * @param {type} chartId
     * @param {type} chartType
     * @param {type} yAxisTitles
     * @param {type} legendFlag//隐藏图例说明
     * @param {type} dataLabelsFlag
     * @returns {HdLib.chart.createChart.chart|Window.HdLibHdLib.chart.createChart.chart|window.HdLibHdLib.chart.createChart.chart}
     */
    HdLib.chart.createChart = function (chartId, chartType, yAxisTitles, legendFlag, dataLabelsFlag, callback) {
        legendFlag = false;
        if (HdLib.isNull(legendFlag)) {
            legendFlag = true;
        }
        if (HdLib.isNull(dataLabelsFlag)) {
            dataLabelsFlag = true;
        }
        var yAxis = [], oppositeFlag = false;
        for (var i in yAxisTitles) {
            if (i == 1) {
                oppositeFlag = true
            }
            yAxis.push({
                title: {text: yAxisTitles[i]},
                lineWidth: 1,
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                    }
                },
                opposite: oppositeFlag
            });
        }
        var me = this;
        var chart = $("#" + chartId).highcharts({
            chart: {type: chartType},
            credits: {enabled: false}, //不显示版权
            title: {text: '', style: {color: '#0F62AF', fontWeight: 'bold', fontSize: '15px'}},
            subtitle: {text: ''},
            legend: {enabled: legendFlag}, //隐藏图例说明，{align: "right"}:右边显示
            xAxis: {categories: [], labels: {rotation: -45, y: 20}},
            yAxis: yAxis,
            plotOptions: {
                series: {
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function () {
                                if (HdLib.notNull(callback)) {
                                    var options = {};
                                    options.totalEndTime = this.totalEndTime;
                                    options.dataTime = this.dataTime;
                                    callback(options);
                                }
                            }
                        }
                    },
                    dataLabels: {
                        enabled: dataLabelsFlag
                    }
                }
            },
            tooltip: {
//                formatter: function() {
//                    var point = this.point,
//                            s = this.x + this.series.name + ':<b>' + this.y + '</b><br/>';
//                    s += '点击查看' + this.x + '详情。';
//                    return s;
//                },
                shared: true,
                crosshairs: true
            },
            exporting: {enabled: false}
        }).highcharts();

        return chart;
    };

    /**
     * 创建highstock图表
     * @param {type} chartId
     * @param {type} chartType
     * @param {type} yAxisTitles
     * @param {type} options
     * @returns {HdLib.chart.createChart.chart|Window.HdLibHdLib.chart.createChart.chart|window.HdLibHdLib.chart.createChart.chart}
     */
    HdLib.chart.createStockChart = function (chartId, chartType, yAxisTitles, options, callback) {
        Highcharts.setOptions({
            global: {useUTC: false},
            lang: {
                months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                weekdays: ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
            }
        });
        if (HdLib.isNull(options.legendFlag)) {
            options.legendFlag = true;
        }
        if (HdLib.isNull(options.dataLabelsFlag)) {
            options.legendFlag = true;
        }
        var yAxis = [], oppositeFlag = false, reversed = false;
        for (var i in yAxisTitles) {
            if (i >= 1) {
                oppositeFlag = true;
            }
            if (i == 2) {
                reversed = true;
            }
            yAxis.push({
                title: {text: yAxisTitles[i]},
                lineWidth: 1,
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                    }
                },
                opposite: oppositeFlag,
                reversed: reversed
            });
        }
        var me = this;
        var chart = $("#" + chartId).highcharts('StockChart', {
            chart: {type: chartType},
            rangeSelector: {
                buttons: [{
                    type: 'day',
                    count: 3,
                    text: '3d'
                }, {
                    type: 'week',
                    count: 1,
                    text: '1w'
                }, {
                    type: 'month',
                    count: 1,
                    text: '1m'
                }, {
                    type: 'month',
                    count: 6,
                    text: '6m'
                }, {
                    type: 'year',
                    count: 1,
                    text: '1y'
                }, {
                    type: 'all',
                    text: 'All'
                }],
                selected: 1
            },
            credits: {enabled: false}, //不显示版权         title: {text: title, style: {color: '#0F62AF', fontWeight: 'bold', fontSize: '15px'}},
            navigator: {
                xAxis: {
//                categories: categories,
                    type: 'datetime', //定义x轴上日期的显示格式
                    dateTimeLabelFormats: {
                        second: '%Y-%m-%d<br/>%H:%M:%S',
                        minute: '%Y-%m-%d<br/>%H:%M',
                        hour: '%H:%M',
                        day: '%m-%d',
                        week: '%Y-%m-%d',
                        month: '%Y-%m',
                        year: '%Y'
                    }
                }
            },
            xAxis: {
//            categories: categories,
                gridLineDashStyle: 'Dash',
                gridLineWidth: 1,
                lineWidth: 1,
                lineColor: '#000000',
                type: 'datetime', //定义x轴上日期的显示格式
                dateTimeLabelFormats: {
                    second: '%Y-%m-%d<br/>%H:%M:%S',
                    minute: '%Y-%m-%d<br/>%H:%M',
                    hour: '%H:%M',
                    day: '%m-%d',
                    week: '%Y-%m-%d',
                    month: '%Y-%m',
                    year: '%Y'
                }
            },
            yAxis: yAxis,
            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: false
                    },
                    turboThreshold: 10000
                },
                column: {
                    point: {
                        events: {
                            click: function () {
                                if (HdLib.notNull(callback)) {
                                    var options = {
                                        date: this.date
                                    };
                                    callback(options);
                                }
                            }
                        }
                    },
                    dataLabels: {
                        enabled: false
                    },
                    cursor: 'pointer'
                }
            },
            tooltip: {
                xDateFormat: '%Y-%m-%d'
            },
            legend: {
                floating: true,
                enabled: true,
                shadow: true,
                layout: 'horizontal',
                align: 'right',
                verticalAlign: 'top',
                borderWidth: 0
            },
            exporting: {enabled: false}
        }).highcharts();

        return chart;
    };
})();

/**
 * test
 * @param {type} lon
 * @param {type} lat
 * @returns {LonLatObj}
 */
function LonLatObj(lon, lat) {
    this.lon = lon;
    this.lat = lat;
}
/**
 * test
 * @param {type} x
 * @param {type} y
 * @returns {PointObj}
 */
function PointObj(x, y) {
    this.x = x;
    this.y = y;
}

//开始日期
function startDate() {
    WdatePicker({
        dateFmt: "yyyy-MM-dd",
        maxDate: '#F{$dp.$D(\'endDate\')||\'2099-10-01\'}'
    });
}
//结束日期
function endDate() {
    WdatePicker({
        dateFmt: "yyyy-MM-dd",
        minDate: '#F{$dp.$D(\'startDate\')}',
        maxDate: '2099-10-01'
    });
}
function startDynamicFmtDateTime() {
    WdatePicker({
        dateFmt: "yyyy-MM-dd HH:mm:ss",
        maxDate: '#F{$dp.$D(\'endTime\')||\'2099-10-01\'}'
    });
}

//结束动态日期时间
function endDynamicFmtDateTime() {
    WdatePicker({
        dateFmt: "yyyy-MM-dd HH:mm:ss",
        minDate: '#F{$dp.$D(\'startTime\')}',
        maxDate: '2099-10-01'
    });
}
