/**
 * Created by yfyuan on 2016/10/28.
 */
'use strict';
cBoard.service('chartPieService', function ($state, $window) {
    debugger;
    this.render = function (containerDom, option, scope, persist, drill, relations, chartConfig) {
        var render = new CBoardEChartRender(containerDom, option);
        render.addClick(chartConfig, relations, $state, $window);
        return render.chart(null, persist);
    };
    debugger;
    this.parseOption = function (data) {
        debugger;
        var chartConfig = data.chartConfig;
        var casted_keys = data.keys;
        var casted_values = data.series;
        var aggregate_data = data.data;
        var newValuesConfig = data.seriesConfig;

        var series = new Array();
        var string_keys = _.map(casted_keys, function (key) {
            return key.join('-');
        });
        var string_value = _.map(casted_values, function (value) {
            return value.join('-');
        });
        var b = 100 / (casted_values.length * 9 + 1);
        var titles = [];

        for (var i = 0; i < aggregate_data.length; i++) {
            var joined_values = casted_values[i].join('-');
            var realType = angular.copy(newValuesConfig[joined_values]).type;
            var s = {
                name: string_value[i],
                type: 'pie',
                realType: realType,
                center: [5 * b + i * 9 * b + '%', '50%'],
                data: [],
                //roseType: 'area',

                    /* 2020-05-22
                    series-pie.emphasis.label. formatter
                    * {a}：系列名。
                    * {b}：数据名。
                    * {c}：数据值。
                    * {d}：百分比。
                    * {@xxx}：数据中名为'xxx'的维度的值，如{@product}表示名为'product'` 的维度的值。
                    * {@[n]}：数据中维度n的值，如{@[3]}` 表示维度 3 的值，从 0 开始计数。
                    * */
                label: {
                    normal:{
                        show: false,
                        position: 'center',
                        formatter: '{b} \n{d}'
                    },
                },

                itemStyle: {
                    normal: {
                        label: {
                            show: false,
                            formatter: '{b}: {d}%'
                        }
                    },
                    // emphasis: {
                    //     shadowBlur: 10,
                    //     shadowOffsetX: 0,
                    //     shadowColor: 'rgba(0, 0, 0, 0.5)'
                    // },
                    labelLine: {
                        show: false
                    }
                },
                labelLine: {
                    show: false
                },
                //color : ['#1a85F9', '#00FEFE', '#E1B600', '#FFC702', '#1a85F9', '#3bFE72', '#3bFE72', '#3bFE72', '#3bFE72']

            };
            //coxcomb 玫瑰图
            if (realType == 'coxcomb') {

                s.roseType = 'area';
            }
            //控制饼图底部的标题
            titles.push({
                textAlign: 'center', textStyle: {
                    fontSize: 12,
                    fontWeight: 'normal'
                }, text: string_value[i], left: 5 * b + i * 9 * b + '%', top: '90%'
            });
            for (var j = 0; j < aggregate_data[i].length; j++) {
                s.data.push({
                    name: string_keys[j],
                    value: _.isUndefined(aggregate_data[i][j]) ? 0 : aggregate_data[i][j]
                });
            }
            series.push(s);

        }
        var echartOption = {
            title: titles,
            legend: {
                orient: 'vertical',
                x: 'left',
                data: string_keys
            },
            tooltip: {
                //2020-05-19 cat
                //折线（区域）图、柱状（条形）图、K线图 : a（系列名称），b（类目值），c（数值）, d（无）
                //散点图（气泡）图 : a（系列名称），b（数据名称），c（数值数组）, d（无）
                //地图 : a（系列名称），b（区域名称），c（合并数值）, d（无）
                //饼图、雷达图、仪表盘、漏斗图: a（系列名称），b（数据项名称），c（数值）, d（饼图：百分比 | 雷达图：指标名称）
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            toolbox: {
                show : true,
                orient: 'horizontal' ,
                showTitle: true
            },
            series: series,
            //roseType: 'radius',
            hoverAnimation: true,
            //color : ['#1a85F9', '#00FEFE', '#E1B600', '#FFC702', '#1a85F9', '#3bFE72', '#3bFE72', '#3bFE72', '#3bFE72']


        };

        updateEchartOptions(chartConfig.option, echartOption);

        return echartOption;
    };
});