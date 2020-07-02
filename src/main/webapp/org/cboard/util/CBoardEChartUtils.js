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
                    console.log("name:"+name);
                    return name;
                };
            }else{
                rawOpt.legend.formatter=function (name) {
                    console.log("name else"+name);
                    var arr = new Array();
                    arr = name.split("-");
                    return arr[parseInt(tuningOpt.legendSec)-1];
                };
            }
            var expression = '';
            tuningOpt.legendExpression ? expression = tuningOpt.legendExpression : null;
            //图例自定义功能 2020-05-20
            if(expression != undefined && expression != null && tuningOpt.legendInit == true ){
                var arr = new Array();
                arr = expression.split(",");
                var serIndex = 0;
                serIndex = arr.length;
                var reg = /^[0-9]+.?[0-9]*$/;
                var i = 0;
                rawOpt.legend.formatter = function (name) {
                    return name;
                }
                rawOpt.legend.formatter = function (name) {
                    var seriesName = name;
                    var seArr = seriesName.split("-");
                    var realName = '';
                        for(i = 0;i<serIndex; i++ ){
                        var content = arr[i];
                        //if(reg.test(parseInt(content)) && parseInt(content) < name.split("-").length){
                        if(reg.test(parseInt(content)) && parseInt(content) < name.split("-").length){
                            realName = realName + seArr[parseInt(content)];
                        }else{
                            realName = realName + content;
                        }
                    }

                    return realName;
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
            }else if(tuningOpt.colorTheme == "theme3"){
                rawOpt.color = ['#5CBFFF','#DCABFA','#FEA8A4','#EFCF64','#FE8F95'];
            } else if (tuningOpt.colorTheme == "orange"){
                rawOpt.color = ['#FFFAF0','#FDF5E6','#FFEFD5','#FAF0E6','#FFE4C4','#F5DEB3','#FFE4B5','#FFDAB9','#FFA500'];
            }else if(tuningOpt.colorTheme == "dark"){
                rawOpt.color = ['#0d9afa','#0a72a9','#19c0c1','#f24652','#fead2b','#6759f9','#c43ef9','#16defc'];
            } else{
                rawOpt.color = angular.copy(echartsBasicOption.color);
            }

        }

        // trend 2020-05-18 cat init
        if(tuningOpt.trendShow == true && rawOpt.series[0].type == 'pie'){
            debugger;
            var length = rawOpt.series[0].data.length;
            if(length>3 && (tuningOpt.nestedMode == false || tuningOpt.nestedMode == undefined)){
                //var realRadius = new Array();
                //realRadius = rawOpt.series[0].radius;
                rawOpt.series[0].radius = ['35%','55%'];
                rawOpt.series[0].labelLine = {
                    normal:{
                        show:true,
                        length:5,
                        length2:5,
                        smooth:true
                    }
                };
                // rawOpt.series[0].label.normal.alignTo='edge';
                // rawOpt.series[0].label.normal.margin='25%';
            }
            rawOpt.series[0].label= {
                normal:{
                    show: true,
                    position: tuningOpt.trendPosition?tuningOpt.trendPosition:'center',
                    formatter: function (params) {
                        var arr = params.name.split("-");
                        var name = arr.length>1 ? arr[arr.length-1]:arr[0];
                        return name +"\n"+ params.percent + "%";
                    }
                },
            };
            var length = rawOpt.series.length;
            if(length > 1 && tuningOpt.nestedMode == true){
                rawOpt.series[1].label= {
                    normal:{
                        show: true,
                        position: 'inner',
                        formatter: function (params) {
                            var arr = params.name.split("-");
                            var name = arr.length>1 ? arr[arr.length-1]:arr[0];
                            return name;
                        }
                    },
                };
            }

            if(length>3 && (tuningOpt.nestedMode == false || tuningOpt.nestedMode == undefined)){
                rawOpt.series[0].label.normal.alignTo='none';
                //rawOpt.series[0].label.normal.margin=20;
                rawOpt.series[0].label.normal.distanceToLabelLine = 15;
            }

            //rawOpt.series[0].labelLine.label.normal.show = true;
            //tuningOpt.trendPosition ? rawOpt.series[0].label.position = tuningOpt.trendPosition : null;

        }

        //center label
        if(tuningOpt.emphasisShow == true){
            if(rawOpt.series[0].type == 'pie'){
                rawOpt.series[0].avoidLabelOverlap = false;
                rawOpt.series[0].label.emphasis = {
                    show:true,
                    textStyle:{
                        fontSize: tuningOpt.seriesFontSize&&tuningOpt.seriesNameShow?tuningOpt.seriesFontSize:'30',
                        fontWeight: 'bold',
                        fontFamily: tuningOpt.fontStyle&&tuningOpt.seriesNameShow?tuningOpt.fontStyle:'Arial'
                    },

                };
                var serExpression = '';
                tuningOpt.seriesNameExp ? serExpression = tuningOpt.seriesNameExp : null;
                if(serExpression != '' && tuningOpt.seriesNameShow==true){
                    var arr = new Array();
                    arr = serExpression.split(",");
                    var serIndex = 0;
                    serIndex = arr.length;
                    var reg = /^[0-9]+.?[0-9]*$/;
                    var i = 0;
                    rawOpt.series[0].label.emphasis.formatter = function (params) {
                        return params.name;
                    }
                    rawOpt.series[0].label.emphasis.formatter = function (params) {
                        //var seriesName = params.name;
                        var seArr = params.name.split("-");
                        var realName = '';
                        for(i = 0;i<serIndex; i++ ){
                            var content = arr[i];
                            if(reg.test(parseInt(content)) && parseInt(content) < params.name.split("-").length){
                                realName = realName + seArr[parseInt(content)];
                            }else{
                                realName = realName + content;
                            }
                        }
                        if(tuningOpt.valueTypes == "number"){
                            return realName + "\n" + parseFloat(params.value).toFixed(tuningOpt.decimalType?tuningOpt.decimalType:2);
                        }else if(tuningOpt.valueTypes == "percent"){
                            return realName + "\n" + params.percent.toFixed(tuningOpt.decimalType?tuningOpt.decimalType:2) + "%";
                        }else{
                            return realName
                        }
                    };
                }else{
                    rawOpt.series[0].label.formatter = function (params) {
                        return params + params.percent + "%";
                    };
                }
            }
            rawOpt.series[0].labelLine.show = false;
            rawOpt.series[0].itemStyle.normal.label.position = null;

        }
    }


    //line 2020-05-25 cat
    if(rawOpt.series[0].type == 'line'){
        tuningOpt.lineType == "line" ? rawOpt.series[0].smooth = false : rawOpt.series[0].smooth = true;


    }

    //bar 2020-06-05 cat
    if((rawOpt.series[0].type == 'line' || rawOpt.series[0].type == 'bar') && tuningOpt.barStyles == true){
        debugger;
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

    //bar splitArea 2020-06-23
     if((rawOpt.series[0].type == 'line' || rawOpt.series[0].type == 'bar') && tuningOpt.splitArea){
        if(tuningOpt.splitAreaOrient == "horizontal"){
            rawOpt.xAxis.splitArea={
                show : true,
                areaStyle:{
                    color : ['rgba(250,250,250,0.3)',tuningOpt.splitColor?tuningOpt.splitColor:'rgba(200,200,200,0.3)']
                }
            };
        }else if(tuningOpt.splitAreaOrient == "vertical"){
            rawOpt.yAxis.splitArea={
                show : true,
                areaStyle:{
                    color : ['rgba(250,250,250,0.3)',tuningOpt.splitColor?tuningOpt.splitColor:'rgba(200,200,200,0.3)']
                }
            };
        }else{
            rawOpt.yAxis.splitArea={
                show : false,
            };
            rawOpt.xAxis.splitArea={
                show : false,
            };
        }
    }

    if(rawOpt.series[0].type == 'pie' && tuningOpt.nestedMode === true){
        debugger;
            tuningOpt.innerIndex ? rawOpt.series[0].radius = ['50%','70%'] : null;
            //rawOpt.series[tuningOpt.innerIndex?(tuningOpt.innerIndex-1):0].radius = [tuningOpt.innerRadiusSecond];
            rawOpt.series[0].center =['50%','50%'];
            rawOpt.series[tuningOpt.innerIndex?(tuningOpt.innerIndex-1):0].center = rawOpt.series[0].center;

            if(tuningOpt.innerRadiusFirst == 0){
                rawOpt.series[tuningOpt.innerIndex?(tuningOpt.innerIndex-1):0].realType = 'pie';
                rawOpt.series[tuningOpt.innerIndex?(tuningOpt.innerIndex-1):0].radius = [0,tuningOpt.innerRadiusSecond];
            }else{
                rawOpt.series[tuningOpt.innerIndex?(tuningOpt.innerIndex-1):0].radius = [tuningOpt.innerRadiusFirst,tuningOpt.innerRadiusSecond];
            }

            //是否开启数据拆分模式 -- 仅限嵌套饼图
            if(tuningOpt.splitMode){
                var arr = new Array();
                arr = rawOpt.series[tuningOpt.innerIndex?(tuningOpt.innerIndex-1):0].data.slice(tuningOpt.splitRow?tuningOpt.splitRow:0,rawOpt.series[tuningOpt.innerIndex?(tuningOpt.innerIndex-1):0].data.length);
                rawOpt.series[tuningOpt.innerIndex?(tuningOpt.innerIndex-1):0].data = arr;
                var another = tuningOpt.innerIndex == rawOpt.series.length ? 0:1;
                rawOpt.series[another].data = rawOpt.series[another].data.slice(0,tuningOpt.splitRow?tuningOpt.splitRow:0);


            debugger;
            rawOpt.series[tuningOpt.innerIndex?(tuningOpt.innerIndex-1):0].label= {
                normal:{
                    show: true,
                    position: 'inner',
                    formatter: function(params){
                        var arr = new Array();
                        arr = params.name.split("-");
                        return params.name.split("-")[arr.length>1?1:0];
                    }
                },
            };
            rawOpt.series[another].label.normal.formatter=
                function(params){
                        var arr = new Array();
                        arr = params.name.split("-");
                        var name = arr.length>1 ? arr[1]:arr[0];
                        return name + params.percent+"%";
                    }
            }

    }

    //2020-06-28 底部标签
    if(rawOpt.series[0].type=="pie" && tuningOpt.bottomTitle != true ){
        debugger;
        rawOpt.title = '';
    }
};
