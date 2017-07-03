angular.module('app').controller('ordersCtrl', ['$http', '$scope', 'locals', 'NgTableParams', function ($http, $scope, locals, NgTableParams) {
    var userInfo = locals.getObject('userInfo'),
        sid = userInfo.sid,
        uid = window.localStorage.getItem('uid');
    // 获取
    $scope.getData = function () {
        $http({
            method: "post",
            url: "../../db/order.php",
            data: {
                sid: sid,
                cmd: 'get_orders',
                customer: '0'
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            transformRequest: function (data) {
                return $.param(data);
            }
        }).success(function (data) {
            console.log(data);
            $scope.order = data.orders;
            $scope.isShowFilter = false;
            $scope.dataTable = new NgTableParams({
                page: 1,
                count: 15
            }, {
                counts: [15, 20, 30],
                dataset: $scope.order
            });
        });
    };
    $scope.getData();
    $scope.showFilters = function () {
        if ($scope.isShowFilter == false) {
            $scope.isShowFilter = true;
        } else {
            $scope.isShowFilter = false;
        }
    };
    // 添加****
    $scope.add = function () {
        $scope.add_sure = function () {
            $http({
                method: "post",
                url: "../../db/order.php",
                data: {
                    sid: sid,
                    cmd: "add_order",
                    socket: $scope.addItem.socket,
                    duration: $scope.addItem.duration,
                    amount: $scope.addItem.amount,
                    mode: $scope.addItem.mode,
                    addr: $scope.addItem.addr
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                transformRequest: function (data) {
                    return $.param(data);
                }
            }).success(function (data) {
                console.log(data);
                $scope.paginationsnum = [];
                $scope.getData();
            });
            $('#add').modal('hide');
        };
    };
    $scope.finish_order = function (item) {
        $scope.orderItem = item
        $http({
            method: 'post',
            url: '../../db/order.php',
            data: {
                sid: sid,
                cmd: 'finish_order',
                id: $scope.orderItem.id
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            transformRequest: function (data) {
                return $.param(data);
            }
        }).success(function (data) {
            console.log(data);
            $scope.getData();
        });
        $scope.confirm_pay = function (item) {
            $scope.orderItem = item;
            $http({
                method: 'post',
                url: '../../db/order.php',
                data: {
                    sid: sid,
                    cmd: 'confirm_pay',
                    id: $scope.orderItem.id
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                transformRequest: function (data) {
                    return $.param(data);
                }
            }).success(function (data) {
                console.log(data);
                $scope.getData();
            })
        }
    };
    $scope.dateTime = function () {
        $('.form_dateTime').datetimepicker({
            language: 'zh-CN',
            format: 'yyyy-mm-dd',
            autoclose: true,
            minView: 2,
            startView: 3,
            pickerPosition: "bottom-left"
        });
    };
    $scope.total_sure = function () {
        //按月统计
        console.log($scope.order);
        var rule = $('#t_rule').val();
        console.log(rule);
        var startTime = $('#t_start').val();
        startTime = startTime.split('-');
        console.log(startTime);
        var endTime = $('#t_end').val();
        endTime = endTime.split('-');
        $('#total').modal('hide');

        function unique(x) { //去重
            var res = [];
            var json = {};
            for (var i = 0; i < x.length; i++) {
                if (!json[x[i]]) {
                    res.push(x[i]);
                    json[x[i]] = 1;
                }
            }
            return res;
        }

        function totalX() {
            var x = [];
            for (var i = 0; i < $scope.order.length; i++) {
                var orderTime = $scope.order[i].starttime.split(' ')[0];
                orderTime = orderTime.split('-');
                console.log(orderTime);
                if (rule == '0' && orderTime[0] >= startTime[0] && orderTime[0] <= startTime[0]) {
                    x.push(orderTime[1]);
                } else if (rule == '1' && orderTime[0] >= startTime[0] && orderTime[0] <= startTime[0] && orderTime[1] >= startTime[1] && orderTime[1] <= endTime[1]) {
                    x.push(orderTime[2]);
                }
            }
            x = unique(x);
            x.sort();
            return x;
        }

        function totalY(x) {
            var amount = [];
            for (var i = 0; i < x.length; i++) {
                amount[i] = 0;
                for (var j = 0; j < $scope.order.length; j++) {
                    var orderTime = $scope.order[j].starttime.split(' ')[0];
                    orderTime = orderTime.split('-');
                    if (rule == '0' && $scope.order[j].status == '已完成') {
                        if (orderTime[1] == x[i]) {
                            amount[i] += parseInt($scope.order[j].amount);
                        }
                    } else if (rule == '1' && orderTime[0] >= startTime[0] && orderTime[0] <= startTime[0] && orderTime[1] >= startTime[1] && orderTime[1] <= endTime[1] && $scope.order[j].status == '已完成') {
                        if (orderTime[2] == x[i]) {
                            amount[i] += parseInt($scope.order[j].amount);
                        }
                    }
                }
            }
            return amount;
        }

        var X = totalX();
        var Y = totalY(X);
        console.log(X);
        console.log(Y);

        function turn_x(x) {
            for (var i = 0; i < x.length; i++) {
                if (rule == '0') {
                    x[i] += "月";
                } else if (rule == '1') {
                    x[i] += "日";
                }
            }
            return x;
        }


        var title = {
            text: ''
        };
        var subtitle = {
            text: ''
        };
        var xAxis = {
            categories: turn_x(X)
        };
        var yAxis = {
            title: {
                text: '金额（元）'
            }
        };
        var plotOptions = {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: true
            }
        };
        var series = [{
            name: '总计',
            data: Y
        }];
        var json = {};
        json.title = title;
        json.subtitle = subtitle;
        json.xAxis = xAxis;
        json.yAxis = yAxis;
        json.series = series;
        json.plotOptions = plotOptions;
        $('#container').highcharts(json);
    };
}]);
