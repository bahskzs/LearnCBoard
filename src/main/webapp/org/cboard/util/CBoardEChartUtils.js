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
            debugger;
            tuningOpt.legendX ? rawOpt.legend.x = tuningOpt.legendX : null;
            tuningOpt.legendY ? rawOpt.legend.y = tuningOpt.legendY : null;
            tuningOpt.legendOrient ? rawOpt.legend.orient = tuningOpt.legendOrient : null;
        }

        // grid
        if (tuningOpt.gridCustom == true) {
            tuningOpt.gridTop ? rawOpt.grid.top = tuningOpt.gridTop : null;
            tuningOpt.gridBottom ? rawOpt.grid.bottom = tuningOpt.gridBottom : null;
            tuningOpt.gridLeft ? rawOpt.grid.left = tuningOpt.gridLeft : null;
            tuningOpt.gridRight ? rawOpt.grid.right = tuningOpt.gridRight : null;
        }

        // color 2020-05-15 cat init
        rawOpt.color === undefined ? rawOpt.color = angular.copy(echartsBasicOption.color) : null;
        if (tuningOpt.colorShow == false) {
            color = [];
        }else{
            debugger;

            if(tuningOpt.colorTheme == "theme1"){
                rawOpt.color = ['#1a85f9', '#00fefe', '#E1B600', '#ffc702', '#1a85F9', '#3bFE72','#69A2F1','#EFD66E','#D57580','#86C6C8'];
            }else if(tuningOpt.colorTheme == "theme2"){
                rawOpt.color = ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'];
            }else if (tuningOpt.colorTheme == "orange"){
                rawOpt.color = ['#FFFAF0', '#FDF5E6', '#F5DEB3', '#FFE4B5', '#FFA500', '#FFEFD5', '#FF8C00', '#FFE4C4', '#FF8C00', '#FAF0E6', '#FFDAB9'];
            } else{
                rawOpt.color = angular.copy(echartsBasicOption.color);
            }

        }
    }
};
