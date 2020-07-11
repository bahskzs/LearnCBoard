/**
 * Created by yfyuan on 2016/10/28.
 */
'use strict';
cBoard.service('chartTableService', function () {

    this.render = function (containerDom, option, scope, persist, drill) {
        if (option == null) {
            containerDom.html("<div class=\"alert alert-danger\" role=\"alert\">No Data!</div>");
            return;
        }
        var height;
        scope ? height = scope.myheight - 20 : null;
        return new CBoardTableRender(containerDom, option, drill).do(height, persist);
    };

    this.parseOption = function (data) {
        var tableOption = chartDataProcess(data.chartConfig, data.keys, data.series, data.data, data.seriesConfig);
        //to-do 修改前端传递的样式等内容
        //updateEchartOptions(data.chartConfig, tableOption);
        return tableOption;
    };
});