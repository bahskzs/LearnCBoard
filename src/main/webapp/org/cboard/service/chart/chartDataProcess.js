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
    var rowRealLength = chartConfig.values[0].cols.length;
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
        if(rowRealLength == 1){
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
    for (var j = 0; j < column_header.length; j++) {
        /// 原模式为交叉表格式
        /// j == column_header.length - 1 ?
        ///     column_header[j] = keyArr. concat(column_header[j]) :
        ///     column_header[j] = emptyList.concat(column_header[j]);
        if(j==0){
            column_header[j] = keyArr. concat(column_header[j]);
        }
    }
    var chartData = {
        chartConfig: chartConfig,
        data: column_header.concat(table_data)
    };
    table_data = null;
    column_header = null;
    return chartData;
};
