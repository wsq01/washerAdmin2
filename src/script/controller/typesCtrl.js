angular.module('app').controller('typesCtrl', ['$http', '$scope','locals','NgTableParams', function($http, $scope,locals,NgTableParams){
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
                cmd: 'get_type'
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            transformRequest: function(data) {return $.param(data);}
        }).success(function(data) {
            console.log(data);
            $scope.type = data.types;
            $scope.isShowFilter=false;
            $scope.dataTable = new NgTableParams({
              page: 1,
              count: 15
            }, {
              counts:[15,20,30],
              dataset: $scope.type
            })
        });
      };
    $scope.getData();
    $scope.showFilters=function () {
        if($scope.isShowFilter==false){
            $scope.isShowFilter=true;
        }else{
            $scope.isShowFilter=false;
        }
    };
    // 添加****
    $scope.add = function() {
        $scope.add_sure = function() {
            $http({
                method: "post",
                url: "../../db/socket.php",
                data: {
                    sid: sid,
                    cmd: "add_type",
                    defaultname:$scope.addItem.name,
                    defaultprice:$scope.addItem.price,
                    type:$scope.addItem.type,
                    remark:$scope.addItem.remark
                },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function(data) {return $.param(data);}
            }).success(function(data) {
                $scope.getData();
                $('#add').modal('hide');
            });
        };
    };
    // 修改*****
    $scope.change = function(item) {
        $scope.typeItem = item;
        var s_name = $scope.typeItem.defaultsocketname,
            s_price=$scope.typeItem.defaultprice,
            s_type=$scope.typeItem.type,
            s_remark=$scope.typeItem.remark;
        $scope.change_sure= function() {
            $http({
                method: "post",
                url: "../../db/socket.php",
                data: {
                    sid: sid,
                    cmd: "edit_type",
                    id: $scope.typeItem.id,
                    defaultsocketname: $scope.typeItem.defaultsocketname,
                    defaultprice:$scope.typeItem.defaultprice,
                    type:$scope.typeItem.type,
                    remark:$scope.typeItem.remark
                },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                transformRequest: function(data) {return $.param(data);}
            }).success(function (data) {
                console.log(data);
            });
            $('#changeModal').modal('hide');
        };
        $scope.change_cancel=function () {
            $scope.typeItem.name = s_name;
            $scope.typeItem.defaultprice=s_price;
            $scope.typeItem.type=s_type;
            $scope.typeItem.remark=s_remark;
            $('#changeModal').modal('hide')
        };
    };
    // 删除
    $scope.delete= function(item) {
      $scope.typeItem=item;
        $scope.delete_sure = function() {
            $http({
                method: "post",
                url: "../../db/socket.php",
                data: {
                    sid: sid,
                    cmd: "del_type",
                    id:$scope.typeItem.id
                },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                transformRequest: function(data) {return $.param(data);}
            }).success(function(data) {
                console.log(data);
                $scoe.getData();
                $('#deleteModal').modal('hide');
            });
        };
    };
}]);
