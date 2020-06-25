/**
 * Created by zyong on 2016/7/25.
 */

var echartsBasicOption = {
    title: {},
    grid: {
        left: '50',
        right: '20',
        bottom: '15%',
        top: '15%',
        containLabel: false
    },
    tooltip: {
        trigger: 'axis'
    },
    toolbox: {
        feature: {
            //saveAsImage: {},
            dataView: {
                show: true,
                readOnly: true
            },
            magicType: {
                type: ['line', 'bar', 'stack', 'tiled']
            },
            dataZoom: {
                show: true
            },
            restore: {
                show: true
            }
        },
    },
    legend: {
        x: 'left',
        itemWidth: 15,
        itemHeight: 10
    },
    //color : ['#1a85F9', '#00FEFE', '#E1B600', '#FFC702', '#1a85F9', '#3bFE72', '#3bFE72', '#3bFE72', '#3bFE72']
};

var CBoardEChartRender = function (jqContainer, options, isDeepSpec) {
    this.container = jqContainer; // jquery object
    this.ecc = echarts.init(jqContainer.get(0), this.theme);
    this.isDeppSpec = isDeepSpec;

    this.basicOption = echartsBasicOption;
    this.options = options;
};

CBoardEChartRender.prototype.theme = "theme-fin1"; // 主题

CBoardEChartRender.prototype.chart = function (group, persist) {
    var self = this;
    var options = this.isDeppSpec == true ? self.options : $.extend(true, {}, self.basicOption, self.options);
    if (options.visualMap != undefined) {
        debugger;
        $(this.container).css({
            height: 500 + "px",
            width: '100%'
        });
    }
    //2020-05-15 cat 颜色
    //options.color = ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'];




    if (options.legend.data && options.legend.data.length > 35) {
        options.grid.top = '5%';
        options.legend.show =false;
    }
    if(persist){
        options.animation = false;
    }
    self.ecc.setOption(options);
    self.changeSize(self.ecc);
    self.container.resize(function (e) {
        self.ecc.resize();
        self.changeSize(self.ecc);
    }); // 图表大小自适应
    if (group) {
        self.ecc.group = group;
        echarts.connect(group);
    }
    if (persist) {
        setTimeout(function () {
            persist.data = self.ecc.getDataURL({
                type: 'jpeg',
                pixelRatio: 2,
                backgroundColor: '#fff'
            });
            persist.type = "jpg";
            persist.widgetType = "echarts";
        }, 1000);
    }
    return function (o) {
        o = $.extend(true, {}, self.basicOption, o);
        self.ecc.setOption(o, true);
    }
};

CBoardEChartRender.prototype.changeSize = function (instance) {
    debugger;
    var o = instance.getOption();
    if ((o.series[0] ? o.series[0].type : null) == 'pie') {
        var l = o.series.length;
        var b = instance.getWidth() / (l + 1 + l * 8)
        for (var i = 0; i < l; i++) {
            var seriesType = o.series[i] ? o.series[i].realType : null;
            //2020-05-19 cat roseType
            var roseType = o.series[i] ? o.series[i].roseType : null;
            if ((b * 8) < (instance.getHeight() * 0.75)) {
                if (seriesType == 'doughnut') {
                    debugger;
                    o.series[i].radius = [b * 3, b * 4];
                } else if (seriesType == 'coxcomb') {
                    //此处控制玫瑰图的半径，类似圆环图
                    o.series[i].radius = [b * 0.8, b * 4];
                } else {
                    /// o.series[i].radius = [0, b * 4]; 2020-06-25
                    o.series[i].radius ? o.series[i].radius : o.series[i].radius = ['0', '15%'];
                }

            } else {
                if (seriesType == 'doughnut') {
                    o.series[i].radius= ['50%', '75%'];
                } else if (seriesType == 'coxcomb' && roseType == 'radius') {
                    o.series[i].radius = ['15%', '75%'];
                } else {
                    o.series[i].radius ? o.series[i].radius : o.series[i].radius = ['0', '15%'];
                }
            }
        }
        instance.setOption(o);
    }

};

//{"sourceField":[],"relations":[{},{}]}
CBoardEChartRender.prototype.addClick = function (chartConfig, relations, $state, $window) {
    if(!chartConfig || !relations){
        return;
    }
    var self = this;
    self.ecc.on('click', function (param){
        var sourceField = relations.sourceField;
        var links = relations.relations;
        //[{"targetId":relation.targetId, params:[{"targetField":targetField,"value":param.name},{}]}]
        var relations_old = JSON.parse($("#relations").val());
        var relations_new = [];
        _.each(relations_old, function (relation_old) { //删除已存在的
            var exists = false;
            _.each(links, function(relation){
                if(relation_old.targetId = relation.targetId){
                    exists = true;
                    return;
                }
            })
            if(!exists){
                relations_new.push(relation_old);
            }
        });

        var groups = _.map(chartConfig.groups, function(group, index){
            return {"index":index, "name":group.col};
        });
        var keys = _.map(chartConfig.keys, function(key, index){
           return {"index":index, "name":key.col};
        });

        var paramValues = [];

        switch (chartConfig.chart_type) {
            case 'line':
            case 'contrast':
            case 'scatter':
            case 'pie':
                _.each(sourceField, function (field) {
                    if ($.inArray(field, _.map(groups, function (group) {
                            return group.name
                        })) != -1
                        || $.inArray(field, _.map(keys, function (key) {
                            return key.name
                        })) != -1
                    ) {
                        _.each(groups, function (group) {
                            if (group.name == field) {
                                paramValues.push(param.seriesName.split("-")[group.index]);
                            }
                        });
                        _.each(keys, function (key) {
                            if (key.name == field) {
                                paramValues.push(param.name.split("-")[key.index]);
                            }
                        });
                    } else {
                        paramValues.push("noMatch");
                    }
                });
                break;

            case 'funnel':
                _.each(sourceField, function(field){
                    if($.inArray(field, _.map(keys, function(key){return key.name;}))!=-1 ){
                        _.each(keys,function(key){
                            if(key.name == field){
                                paramValues.push(param.seriesName.split("-")[key.index]);
                            }
                        });
                    }else{
                        paramValues.push("noMatch");
                    }
                });
                break;

            case 'sankey':
                if (param.dataType == 'edge') {
                    _.each(sourceField, function (field) {
                        if ($.inArray(field, _.map(keys, function (key) {
                                return key.name;
                            })) != -1
                            || $.inArray(field, _.map(groups, function (group) {
                                return group.name;
                            })) != -1) {
                            _.each(keys, function (key) {
                                if (key.name == field) {
                                    paramValues.push(param.data.source.split("-")[key.index]);
                                }
                            });
                            _.each(groups, function (group) {
                                if (group.name == field) {
                                    paramValues.push(param.data.target.split("-")[group.index]);
                                }
                            });
                        } else {
                            paramValues.push("noMatch");
                        }
                    });
                }
                break;

            case 'radar':
                if(chartConfig.asRow){//雷达行维
                    _.each(sourceField, function(field){
                        if($.inArray(field, _.map(keys, function(key){return key.name;}))!=-1){
                            _.each(keys,function(key){
                                if(key.name == field){
                                    paramValues.push(param.name.split("-")[key.index]);
                                }
                            });
                        }else{
                            paramValues.push("noMatch");
                        }
                    });
                }else{
                    _.each(sourceField, function(field){
                        if($.inArray(field, _.map(groups, function(group){return group.name;}))!=-1){
                            _.each(groups,function(group){
                                if(group.name == field){
                                    paramValues.push(param.name.split("-")[group.index]);
                                }
                            });
                        }else{
                            paramValues.push("noMatch");
                        }
                    });
                }
                break;

            case 'wordCloud':
                _.each(sourceField, function(field){
                    if($.inArray(field, _.map(keys, function(key){return key.name;}))!=-1){
                        _.each(keys,function(key){
                            if(key.name == field){
                                paramValues.push(param.name.split("-")[key.index]);
                            }
                        });
                    }else{
                        paramValues.push("noMatch");
                    }
                });
                break;

            case 'treeMap':
                _.each(sourceField, function(field){
                    if($.inArray(field, _.map(keys, function(key){return key.name.toUpperCase();}))!=-1){
                        _.each(keys,function(key){
                            if(key.name.toUpperCase() == field && param.treePathInfo[key.index+1]){
                                paramValues.push(param.treePathInfo[key.index+1].name);
                            }
                        });
                    }else{
                        paramValues.push("noMatch");
                    }
                });
                break;

            default:
                break;
        }

        _.each(links, function(relation){
            var record = {};
            record.targetId = relation.targetId;
            record.params = [];
            for(var i=0;i<relation.targetField.length;i++){
                var e = {};
                e.targetField = relation.targetField[i];
                e.value = paramValues[i];
                record.params.push(e);
            }
            record.params = _.filter(record.params, function(e){
                return e.value != "noMatch";
            });
            relations_new.push(record);
        });

        $("#relations").val(JSON.stringify(relations_new));
        //触发关联图表刷新
        _.each(_.filter(links,function(e){return e.type=="widget"}), function(relation){
            var button = document.getElementsByName("reload_"+relation.targetId);
            if(button && button.length > 0){
                button[button.length-1].click();
            }
        });

        //触发弹出看板
        _.each(_.filter(links,function(e){return e.type=="board"}), function(relation){
            var url = $state.href('mine.view', {id: relation.targetId});
            var param = JSON.stringify(_.find(relations_new, function(e){return e.targetId == relation.targetId}));
            $window.open(encodeURI(url+"?"+param), '_blank');
        });
    });
};