var CBoardTableRender = function (jqContainer, options, drill) {
    this.container = jqContainer; // jquery object
    this.options = options;
    this.tall;
    this.drill = drill;
    var _this = this;
    $(this.container).resize(function (e) {
        _this.resize(e.target);
    });
};

CBoardTableRender.prototype.resize = function (container) {
    var wrapper = $(container).find('.table_wrapper');
    wrapper.css('width', 'auto');
    if (wrapper.width() < $(container).width()) {
        wrapper.css('width', '100%');
    }
    this.changeStyle();
};


CBoardTableRender.prototype.changeStyle = function(){
    var initConfig = this.options.chartConfig.option;
    var initBorder = initConfig.initBorder;
    var initFirstRow = initConfig.initFirstRow;
    var initFirstCell = initConfig.initFirstCell;
    var initPaging = initConfig.initFirstCell;
    var initZebra = initConfig.initFirstCell;
    var initRowCell = initConfig.initRowCell;
    var initMultipleRowCell = initConfig.initMultipleRowCell;
    var initCellSeries = initConfig.initCellSeries;

    var borderWidth = initBorder && initConfig.borderWidth ? initConfig.borderWidth : 0;
    var borderColor = initBorder && initConfig.borderColor ? initConfig.borderColor : 0;
    var borderStyle = initBorder && initConfig.borderStyle ? initConfig.borderStyle : 0;

    var rowFirstHeight = initFirstRow && initConfig.rowFirstHeight ? initConfig.rowFirstHeight : 0;
    var rowColor = initFirstRow && initConfig.rowColor ? initConfig.rowColor : 0;

    var cellFirstWidth = initFirstCell && initConfig.cellFirstWidth ? initConfig.cellFirstWidth : 0;
    var cellColor = initFirstCell && initConfig.cellColor ? initConfig.cellColor : 0;

    var pageNo = initPaging && initConfig.pageNo ? initConfig.pageNo : 0;

    var rowBgColor = initZebra && initConfig.rowBgColor ? initConfig.rowBgColor : 0;

    var rowHeight = initRowCell && initConfig.rowHeight ? initConfig.rowHeight : 0;
    var cellWidth = initRowCell && initConfig.cellWidth ? initConfig.cellWidth : 0;

    var rowHidden =  initRowCell ? initConfig.rowHidden : null;
    var colHidden =  initRowCell ? initConfig.colHidden : null;

    var rowMultipleHidden =  initMultipleRowCell ? initConfig.rowMultipleHidden : null;
    var colMultipleHidden =  initMultipleRowCell ? initConfig.colMultipleHidden : null;

    var header_keys = this.options.chartConfig.groups.length;
    var columns_keys = this.options.chartConfig.keys.length;

    //自定义列维度(列维对应值名别名)
    var cellExp = initCellSeries ? initConfig.cellExp : 0;


    //当前表格的行列
    var rowNumber = $(".fixedHeader tr:has(th)").size();
    var colNumber = $(".scrollContent tr:eq(0) th.row").size();



    //隐藏行
    if(rowHidden != null && rowHidden >=1 && header_keys == rowNumber && !initMultipleRowCell){

        if(rowHidden == 1){
            $(".fixedHeader").find("tr:first th:gt("+(columns_keys-1)+")").remove();
        }else{
            $(".fixedHeader").find("tr:eq("+parseInt(rowHidden-1)+")").remove();
        }
    }
    //隐藏多行
    if(rowMultipleHidden != null && rowMultipleHidden !="" && header_keys == rowNumber){
        var array = rowMultipleHidden.split(",");
        for(var j = 0; j< array.length ; j++){
            if(parseInt(array[j]) == 1){
                $(".fixedHeader").find("tr:eq(0) th:gt("+(columns_keys-1)+")").attr("del","1");
            }else{
                $(".fixedHeader").find("tr:eq("+parseInt(parseInt(array[j])-1)+")").attr("del","1");
            }
        }
         $("tr[del=1]").remove();
         $("th[del=1]").remove();
    }
    //隐藏列
    if(colHidden != null && colHidden>=1 && colNumber == columns_keys && !initMultipleRowCell){
        $(".fixedHeader tr:eq(0)").each(function(){
            $(this).children("th:eq("+parseInt(colHidden-1)+")").remove();

        });
        $(".scrollContent tr:not(:last-child)").each(function(){
            $(this).children("th:eq("+parseInt(colHidden-1)+")").remove();
        });

        if(initConfig.initBottomSumRow){
            var colspan = $(".scrollContent tr:last th").attr("colspan");
            $(".scrollContent tr:last th").attr("colspan", parseInt(colspan-1));
        }else{
            $(".scrollContent tr:last th:eq("+parseInt(colHidden-1)+")").remove();
        }
    }
    //隐藏多列
    if(colMultipleHidden != null && colMultipleHidden !="" && colNumber == columns_keys){

        var array = colMultipleHidden.split(",");
        for(var j = 0; j< array.length ; j++) {
            if(array[j] <= columns_keys){
            $(".fixedHeader tr:eq(0)").each(function () {
                $(this).children("th:eq(" + parseInt(parseInt(array[j]) - 1) + ")").attr("del", "1");

            });
            $(".scrollContent tr:not(:last-child)").each(function () {
                $(this).children("th:eq(" + parseInt(parseInt(array[j]) - 1) + ")").attr("del", "1");
            });

            if (!initConfig.initBottomSumRow) {
                $(".scrollContent tr:last th:eq(" + parseInt(parseInt(array[j]) - 1) + ")").attr("del", "1");
            }
            }
        }

        if (initConfig.initBottomSumRow) {
            var colspan = $(".scrollContent tr:last th").attr("colspan");
            var colNum = 0;
            for(var i = 0 ;i < array.length;i++){
                if(array[i]<=columns_keys){
                    colNum ++;
                }
            }
            $(".scrollContent tr:last th").attr("colspan", colspan-colNum);
        }
        $("tr[del=1]").remove();
        $("th[del=1]").remove();
    }


    if(borderWidth != 0){
        $("table.table_wrapper").css("border-width",borderWidth);
        $("td.data, th.row, th.header_key").css({
            "border-top-width": borderWidth,
            "border-left-width": borderWidth
        });
        $("th.row_null").css({
            "border-left-width": borderWidth
        });

    }
    if(borderColor != 0){
        $("table.table_wrapper").css("border-color",borderColor);
        $("td.data, th.row, th.header_key").css({
            "border-top-color": borderColor,
            "border-left-color": borderColor
        });
        $("th.row_null").css({
            "border-left-color": borderColor
        });
    }
    if(borderStyle != 0){
        $("table.table_wrapper").css("border-style",borderStyle);
        $("td.data, th.row, th.header_key").css({
            "border-top-style": borderStyle,
            "border-left-style": borderStyle
        });
        $("th.row_null").css({
            "border-left-style": borderStyle
        });

    }

    if(rowFirstHeight != 0){
        $("thead").find("th").css("height",rowFirstHeight);
    }
    if(rowColor != 0){
        $("thead").find("th").css("background-color",rowColor);
    }
    if(cellFirstWidth != 0){
        $("tbody").find("th").css("width",cellFirstWidth);
    }
    if(cellColor != 0){
        $("tbody").find("th").css("background-color",cellColor);
    }

    if(rowHeight != 0){
        $("tbody").find("td").css("height",rowHeight);
    }
    if(cellWidth != 0){
        $("tbody").find("td").css("width",cellWidth);
    }
    if(rowBgColor != 0){
        for(var i = 0; i< $("tbody.scrollContent tr").length ; i++){
            if(i % 2==0){
                $("tbody.scrollContent tr:eq("+i+") td").css("background-color",rowBgColor);
            }
        }
    }

    // to-do 页内行内公式自定义

    //列维重命名 要考虑是否有隐藏列的情况
    if(cellExp != 0 && cellExp.length >= 6 && colMultipleHidden != null){
        var expArr = cellExp.split(";");
        for(var i = 0 ; i < expArr.length ; i++){
            if(expArr[i].length>=6){
                var arr = expArr[i].split("|");
                var value = arr.length == 2 ? arr[1] : null;
                var rowContent = arr.length == 2 ? arr[0] : null;

                // 值非空且格式是RXCX的才进入判断
                if(value != null && rowContent.indexOf("R") == 0 && rowContent.indexOf("C") >= 2){

                    // 需要重命名的行和列号
                    var rowNum = rowContent.substr(1,rowContent.indexOf("C")-1)-1;
                    var cellNum = parseInt(rowContent.substr(parseInt(rowContent .indexOf("C"))+1,rowContent.length));
                    cellNum = (rowNum == 0 ? parseInt(columns_keys) : 0) + cellNum-1;

                    // 需要判断行维是否有被隐藏，有的话则要扣除
                    if(colMultipleHidden != null && colMultipleHidden !="" && colNumber == columns_keys && rowNum == 0){
                        var array = colMultipleHidden.split(",");
                        cellNum = cellNum - array.length;
                    }

                    $("thead.fixedHeader > tr:eq(" + parseInt(rowNum) + ") > th.header_key:eq(" + parseInt(cellNum) + ") div").text(value);
                }

            }
        }
    }
}

CBoardTableRender.prototype.do = function (tall, persist) {
    this.tall = tall;
    tall = _.isUndefined(tall) ? null : tall;
    var divHeight = tall ? tall - 110 : null;
    var _this = this;
    var render = function (o, drillConfig) {
        _this.options = o;
        _this.drill.config = drillConfig;
        _this.do(_this.tall);
    };
    var initConfig = this.options.chartConfig.option;
    var args = {
        tall: divHeight,
        chartConfig: this.options.chartConfig,
        data: this.options.data,
        container: this.container,
        drill: this.drill,
        title : initConfig.tableTitle ? initConfig.tableTitle : '测试',
        initConfig : initConfig,
        render: render
    };
    crossTable.table(args);
    $(this.container).css({
        height: tall ? "100%" : tall + "px"
    });


    this.resize(this.container);

    //根据样式修改
    if (persist) {
        persist.data = this.options.data;
        persist.type = "table"
    }
    this.changeStyle();
    return render;
};

