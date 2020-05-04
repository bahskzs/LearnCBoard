# LearnCBoard

0基础小白学习CBoard,参照CSDN上大佬的教程以及自己捣鼓,学习下修改CBoard的一些简单功能等等内容

[TOC]

### 0. 基础配置

#### 0.1 修改数据源
#### 0.2 本地/远程部署
#### 0.3 去掉百度地图的提示

### 1. 追加菜单

### 2. ifame内嵌

### 3. dashboard样式修改 【去掉工具组件】

### 4. 修改图表样式

#### 4.1 基础配置文件
file : \src\main\webapp\org\cboard\controller\dashboard\dashboardViewCtrl.js
bi.html页面上的chart对应右上角按钮基本在此页面实现
loadWidget(reload) --> ng-click="reload(widget)"
$scope.export --> ng-click="export(widget)"
$scope.render1 --> ng-click="render1()"

#### 4.2 饼图