/**
 * Created by Fine on 2017/2/11.
 */
'user strict';
var chartDataProcess = function(chartConfig,casted_keys, casted_values, aggregate_data,newValuesConfig) {
    var keysList = casted_keys,
        keyArr = [],
        emptyList = [],
        keyLength = chartConfig.keys.length,
        rowHeaderLength = keysList[0] ? keysList[0].length : 0;

    var rowRealLength = chartConfig.values[0].cols.length && chartConfig.groups.length>0 ?chartConfig.values[0].cols.length:0;

    var singleIndexName = '';
    if( rowRealLength == 1 && casted_values[0].length > rowRealLength){
        singleIndexName = casted_values[0][chartConfig.groups.length];
        for(var i = 0;i<casted_values.length; i++){
            var arr = [];
            arr = casted_values[i];
            arr.pop();
            casted_values[i] = arr;
        }
    }
    Array.matrix = function (numrows, numcols, initial) {
        var arr = [];
        for (var a = 0; a < numrows; ++a) {
            var columns = [];
            for (var s = 0; s < numcols; ++s) {
                columns[s] = initial;
            }
            arr[a] = columns;
        }
        return arr;
    };
    var table_data = Array.matrix(keysList.length, rowHeaderLength, 0);
    for (var h = 0; h < rowHeaderLength; h++) {
        for (var k = 0; k < keysList.length; k++) {
            table_data[k][h] = {
                property: 'column_key',
                data: keysList[k][h]
            };
        }
    }
    for (var i = 0; i < casted_values.length; i++) {
        var joined_values = casted_values[i].join('-');
        if(rowRealLength == 1 && casted_values[0].length > rowRealLength && chartConfig.groups.length >= 1){
            //只有一个指标的时候
            joined_values = joined_values +'-'+ singleIndexName;
        }
        var formatter = newValuesConfig[joined_values].formatter;
        for (var j = 0; j < casted_keys.length; j++) {
            if (!_.isUndefined(aggregate_data[i][j])) {
                var raw = aggregate_data[i][j];
                table_data[j][i + keyLength] = {
                    property: 'data',
                    data: formatter ? numbro(raw).format(formatter) : raw,
                    raw: raw
                };
            } else {
                table_data[j][i + keyLength] = {
                    property: 'data',
                    data: ''
                };
            }
        }
    }
    var column_header = Array.matrix(chartConfig.groups.length + 1, casted_values.length, 0);
    if(rowRealLength == 1 && column_header.length > chartConfig.groups.length){
        column_header.pop();
    }
    for (var n = 0; n < casted_values.length; n++) {
        for (var m = 0; m < casted_values[n].length; m++) {
            column_header[m][n] = {
                property: 'header_key',
                data: casted_values[n][m]
            };
        }
    }
    for (var y = 0; y < keyLength; y++) {
        keyArr.push({
            property: 'header_key',
            column_header_header: true,
            data: chartConfig.keys[y].alias ? chartConfig.keys[y].alias : chartConfig.keys[y].col
        });
        emptyList.push({
            property: 'header_empty',
            data: null
        });
    }
    var sumRowArr = [];
    for (var j = 0; j < column_header.length; j++) {
        /// 原模式为交叉表格式
        /// j == column_header.length - 1 ?
        ///     column_header[j] = keyArr. concat(column_header[j]) :
        ///     column_header[j] = emptyList.concat(column_header[j]);
        if(j==0){
            column_header[j] = keyArr. concat(column_header[j]);
        }
    }
    //判断是否需要增加底部合计行
    var sumRowFlag = chartConfig.option.initBottomSumRow != "undefined" && chartConfig.option.initBottomSumRow ? 1 : 0;
    if(sumRowFlag == 1){
        for(var i = 0; i < table_data.length; i++){
            for(var j = chartConfig.keys.length; j <  casted_values.length + chartConfig.keys.length; j++){
                var realValue = table_data[i][j];
                if(!sumRowArr[j-chartConfig.keys.length]){
                    sumRowArr[j-chartConfig.keys.length]={
                        property: 'data',
                        data: 0
                    };
                }
                 var oldValue = parseFloat(sumRowArr[j-chartConfig.keys.length].data);
                 sumRowArr[j-chartConfig.keys.length]={
                        property: 'data',
                        data: realValue.data == ''? oldValue : parseFloat(realValue.data) + oldValue
                  };


            }
        }
    }
    if(sumRowFlag == 1) {
        sumRowArr.unshift({
            property: 'sum_row',
            data: '合计'
        });
        var exps = chartConfig.option.initCell && chartConfig.option.cellExpression ? chartConfig.option.cellExpression.split(",") : null; //exps表达式集合 C2=C3+C1,C3=C2-C1
        if(chartConfig.option.initCell && exps.length){
            for(var i = 0; i < exps.length; i++ ){
                var exp = exps[i].split("=");
                // 存在表达式才进行换算
                if(exp.length>1){
                    var resArr = exp[0].trim().split("C");
                    //存在含C表达式才执行
                    if(resArr.length>1){
                        var res = exp[0].trim().split("C")[1];
                        if(res<sumRowArr.length) {
                        var result = exp[1].replace(/C/g,"sumRowArr[");
                        var realRes = result.replace(/([a-z]+[\[][0-9]+)/g,"$1].data");
                        sumRowArr[res].data = eval(realRes);
                        }
                    }

                }
            }

        }
        table_data.push(sumRowArr);
    }
    var chartData = {
        chartConfig: chartConfig,
        data: column_header.concat(table_data)
    };

    table_data = null;
    column_header = null;
    return chartData;
};
