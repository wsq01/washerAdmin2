angular.module('app').controller('socketsCtrl', ['$http', '$scope','locals','NgTableParams', function($http, $scope,locals,NgTableParams){
  var userInfo=locals.getObject('userInfo'),
      sid=userInfo.sid,
      uid=window.localStorage.getItem('uid');
      // 获取
      $scope.getData=function(){
        $http({
            method: "post",
            url: "../../db/socket.php",
            data: {
                sid: sid,
                cmd: 'get'
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            transformRequest: function(data) {return $.param(data);}
        }).success(function(data) {
            console.log(data);
            $scope.socket = data.sockets;
            $scope.dataTable = new NgTableParams({
              page: 1,
              count: 15
            }, {
              counts:[15,20,30],
              dataset: $scope.socket
            })
        });
      }
    $scope.getData();
    // 添加****
    $scope.add = function() {
        $scope.add_sure = function() {
            // 调用添加地区信息接口
            $http({
                method: "post",
                url: "../../db/socket.php",
                data: {
                    sid: sid,
                    cmd: "add",
                    device:$scope.addItem.device,
                    index:$scope.addItem.index,
                    type:$scope.addItem.type,
                    socketname:$scope.addItem.socketname,
                    price:$scope.addItem.price,
                    floor:$scope.addItem.floor,
                    num:$scope.addItem.num
                },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function(data) {return $.param(data);}
            }).success(function(data) {
                console.log(data);
                $scope.getData();
            });
            $('#add').modal('hide');
        };
        //点击取消
        $scope.add_cancel=function () {
            $('#add').modal('hide')
        }
    };
    // 修改****
    $scope.change = function(item) {
        $scope.socketItem = item;
        var s_device = $scope.socketItem.device,
            s_price=$scope.socketItem.price,
            s_type=$scope.socketItem.type,
            s_index=$scope.socketItem.index,
            s_num=$scope.socketItem.num,
            s_socketname=$scope.socketItem.socketname;
        $scope.change_sure= function() {
            $http({
                method: "post",
                url: "../../db/socket.php",
                data: {
                    sid: sid,
                    cmd: "edit",
                    id: $scope.socketItem.id,
                    device: $scope.socketItem.device,
                    price:$scope.socketItem.price,
                    type:$scope.socketItem.type,
                    index:$scope.socketItem.index,
                    socketname:$scope.socketItem.socketname,
                    num:$scope.socketItem.num
                },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                transformRequest: function(data) {return $.param(data);}
            }).success(function (data) {
                $('#changeModal').modal('hide');
            });
        };
        $scope.change_cancel=function () {
            $scope.socketItem.device = s_device;
            $scope.socketItem.price=s_price;
            $scope.socketItem.type=s_type;
            $scope.socketItem.index=s_index;
            $scope.socketItem.num=s_num;
            $scope.socketItem.socketname=s_socketname;
            $('#changeModal').modal('hide')
        };
    };
    // 删除
    $scope.delete= function(item) {
        $scope.socketItem = item;
        $scope.delete_sure = function() {
            $http({
                method: "post",
                url: "../../db/socket.php",
                data: {
                    sid: sid,
                    cmd: "del",
                    id:$scope.socketItem.id
                },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                transformRequest: function(data) {return $.param(data);}
            }).success(function(data) {
                console.log(data);
                $scope.getData();
            });
            $('#deleteModal').modal('hide');
        };
        $scope.delete_cancel=function () {
            $('#deleteModal').modal('hide')
        };
        $('#close').click(function(){
            $('#deleteModal').modal('hide')
        })
    };
}]);
