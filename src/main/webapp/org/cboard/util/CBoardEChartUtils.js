/**
 * Created by peter on 2017/8/3.
 */
var updateEchartOptions = function(tuningOpt, rawOpt) {
    if (tuningOpt) {
        if (tuningOpt.dataZoom == true) {
            rawOpt.dataZoom = {
                show: true,
                start : 0,
                end: 100
            };
        }

        // legend
        rawOpt.grid === undefined ? rawOpt.grid = angular.copy(echartsBasicOption.grid) : null;
        if (tuningOpt.legendShow == false) {
            rawOpt.grid.top = '5%';
            rawOpt.legend.show =false;
        } else {
            rawOpt.legend === undefined ? rawOpt.legend = angular.copy(echartsBasicOption.legend) : null;
            //2020-05-13 catty null->empty
            tuningOpt.legendX ? rawOpt.legend.x = tuningOpt.legendX : null;
            tuningOpt.legendY ? rawOpt.legend.y = tuningOpt.legendY : null;
            tuningOpt.legendOrient ? rawOpt.legend.orient = tuningOpt.legendOrient : null;

            var seriesNameArr = rawOpt.series[0].data;
            //确认是否是true
            if(tuningOpt.legendSec == "default" || (tuningOpt.legendSec==null || tuningOpt.legendSec=="" || tuningOpt.legendSec=='undefined')) {
                rawOpt.legend.formatter = function (name) {
                    return name;
                };
            }else{
                rawOpt.legend.formatter=function (name) {
                    var arr = new Array();
                    arr = name.split("-");
                    return arr[parseInt(tuningOpt.legendSec)-1];
                };
            }
            var expression = '';
            tuningOpt.legendExpression ? expression = tuningOpt.legendExpression : null;
            //图例自定义功能 2020-05-20
            if(expression != undefined && expression != null && tuningOpt.legendInit == true){
                var arr = new Array();
                arr = tuningOpt.legendExpression.split(",");
                var serIndex = 0;
                serIndex = arr.length;
                arr = expression.split(",");
                rawOpt.legend.formatter = function (name) {
                    var seArr = new Array();
                    seArr = name.split("-");
                    var serName = '';
                    for(var i = 0; i<serIndex; i++){
                        var content = arr[i];
                        var pre = '';
                        var reg = /^[0-9]+.?[0-9]*$/;
                        if(reg.test(content) && parseInt(arr[i])<seArr.length){
                            pre = seArr[parseInt(arr[i])];
                        }else{
                            pre = arr[i];
                        }

                        serName = serName + pre;
                    }
                    return serName;
                };
            }
        }

        // grid
        if (tuningOpt.gridCustom == true) {
            tuningOpt.gridTop ? rawOpt.grid.top = tuningOpt.gridTop : null;
            tuningOpt.gridBottom ? rawOpt.grid.bottom = tuningOpt.gridBottom : null;
            tuningOpt.gridLeft ? rawOpt.grid.left = tuningOpt.gridLeft : null;
            tuningOpt.gridRight ? rawOpt.grid.right = tuningOpt.gridRight : null;
        }

        // color 2020-05-15 cat init
        if (tuningOpt.colorShow == true){
            if(tuningOpt.colorTheme == "theme1"){
                //#24a7ff,#5bbfe9,#63d7a3,#fec86b,#ff94dd,#96e5ff,#95edd5,#f88f87
                rawOpt.color = ['#24a7ff','#5bbfe9','#63d7a3','#fec86b','#ff94dd','#96e5ff','#95edd5','#f88f87'];
            }else if(tuningOpt.colorTheme == "theme2"){
                rawOpt.color = ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'];
            }else if (tuningOpt.colorTheme == "orange"){
                rawOpt.color = ['#FFFAF0','#FDF5E6','#FFEFD5','#FAF0E6','#FFE4C4','#F5DEB3','#FFE4B5','#FFDAB9','#FFA500'];
            }else if(tuningOpt.colorTheme == "dark"){
                rawOpt.color = ['#0d9afa','#0a72a9','#19c0c1','#f24652','#fead2b','#6759f9','#c43ef9','#16defc'];
            } else{
                rawOpt.color = angular.copy(echartsBasicOption.color);
            }

        }

        // trend 2020-05-18 cat init
        if(tuningOpt.trendShow == true){
                rawOpt.series[0].itemStyle.normal.label.show = true;
                tuningOpt.trendPosition ? rawOpt.series[0].itemStyle.normal.label.position = tuningOpt.trendPosition : null;
        }

        //emphasis
        if(tuningOpt.emphasisShow == true){
            if(rawOpt.series[0].type == 'pie'){
                rawOpt.series[0].avoidLabelOverlap = false;
                //rawOpt.series[0].center = ['50%', '50%'];
                // rawOpt.series[0].label.emphasis= {
                //     label:{
                //         show: true,
                //         formatter: '{b}\n{d}%',
                //         textStyle: {
                //             fontSize: '30',
                //             fontWeight: 'bold',
                //         },
                //         align: 'center',
                //         verticalAlign: 'middle'
                //
                //     }
                // }
                rawOpt.series[0].label.emphasis = {
                    show:true,
                    textStyle:{
                        fontSize: '30',
                        fontWeight: 'bold'
                    },
                    // rich:{
                    //     b:{
                    //         position:'center'
                    //     }
                    // }

                 };
                //rawOpt.series[0].label.position = "center";
                rawOpt.series[0].labelLine.show = false;
                rawOpt.series[0].itemStyle.normal.label.position = null;

            }
        }


        //line 2020-05-25 cat
        if(rawOpt.series[0].type == 'line'){
            debugger;
            tuningOpt.lineType == "line" ? rawOpt.series[0].smooth = false : rawOpt.series[0].smooth = true;


        }

        //bar 2020-06-05 cat
        if(tuningOpt.barStyle == true){
            //to-do 校验 barWidth barMinHeight barGap 是否纯数字
            //rawOpt.barMaxWidth = tuningOpt.barWidth ? tuningOpt.barWidth : 'auto';
            //rawOpt.barMinHeight = tuningOpt.barMinHeight ? tuningOpt.barMinHeight : 'auto';
            //rawOpt.barGap = tuningOpt.barGap ? tuningOpt.barGap : 'auto';

            var arr = new Array();
            arr = rawOpt.series;
            for(var i = 0;i<arr.length;i++){
                var type = arr[i].type;
                if(type == "bar"){
                    rawOpt.series[i].barMaxWidth = tuningOpt.barWidth ? tuningOpt.barWidth : null;
                    rawOpt.series[i].barMinHeight = tuningOpt.barMinHeight ? tuningOpt.barMinHeight : null;
                    rawOpt.series[i].barGap = tuningOpt.barGap ? tuningOpt.barGap : null;
                }
            }
        }


    }
};
