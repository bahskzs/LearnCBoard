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

    var borderWidth = initBorder && initConfig.borderWidth ? initConfig.borderWidth : 0;
    var borderColor = initBorder && initConfig.borderColor ? initConfig.borderColor : 0;
    var borderStyle = initBorder && initConfig.borderStyle ? initConfig.borderStyle : 0;

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

