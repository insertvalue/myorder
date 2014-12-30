/**
 * Created by hongdian on 2014/12/30.
 */
$(function () {
    //显示当日订餐的用户
    function showOrderByDay(options) {
        $.get("/today/ordered_user", {date:options.date}, function (data) {
            var names = [];
            $.each(data, function (i, e) {
                names.push(e.user_name);
            });
            $("#myModal").modal();
            $("#userCount").html("人数：" + data.length);
            $("#userNames").html("姓名：" + names.toString());
        });
    }

    $.get("/admin/statis/day", {}, function (data) {

        var yAxisTitles = ["订单数"];
        var yAxisNames = ["订单数"];
        var options = {"legendFlag": true, "dataLabelsFlag": false, "allowPointSelect": false};
        var chart = HdLib.chart.createStockChart("container", HdLib.chart.type.column, yAxisTitles, options, showOrderByDay);

        var seriesData = [];//轴数据
        for (var i = 0; i < data.length; i++) {
            var date = data[i].time + " 00:00:00";
            seriesData.push({x: new Date(date).getTime(), y: data[i].count, date: data[i].time});
        }
        var series = [
            new HdLib.chart.serieObj(0, yAxisNames[0], seriesData)
        ];

        var now = new Date();
        var endTime = $.format.date(now, "yyyy-mm-dd")
        now.setDate(now.getDate() - 7);
        var startTime = $.format.date(now, "yyyy-mm-dd")
        HdLib.chart.setStockChartData(chart, "最近七天订单趋势图", startTime + "~" + endTime, null, series);
    });
});