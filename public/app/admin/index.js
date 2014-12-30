/**
 * Created by hongdian on 2014/12/30.
 */
$(function () {
    $.get("/admin/statis/day",{},function(data){

        var yAxisTitles = ["订单数"];
        var yAxisNames = ["订单数"];
        var options = {"legendFlag": true, "dataLabelsFlag": false, "allowPointSelect": false};
        var chart = HdLib.chart.createStockChart("container", HdLib.chart.type.column, yAxisTitles, options, null);

        var seriesData = [];//轴数据
        for (var i = 0; i < data.length; i++) {
            var date = data[i].time + " 00:00:00";
            seriesData.push([new Date(date).getTime(), data[i].count]);
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