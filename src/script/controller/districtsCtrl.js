angular.module('app').controller('districtsCtrl', ['$http', '$scope','locals','NgTableParams', function($http, $scope,locals,NgTableParams){
  var userInfo=locals.getObject('userInfo'),
      sid=userInfo.sid,
      uid=window.localStorage.getItem('uid');
      // 获取
      $scope.getData=function(){
        $http({
            method: "post",
            url: "../../db/district.php",
            data: {
                sid: sid,
                cmd: 'get'
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            transformRequest: function(data) {return $.param(data);}
        }).success(function(data) {
            console.log(data);
            $scope.district = data.districts;
            $scope.dataTable = new NgTableParams({
              page: 1,
              count: 15
            }, {
              counts: [15, 20, 30],
              dataset: $scope.district
            });
        });
      }
    $scope.getData();
    // 添加****
    $scope.add = function() {
        $scope.add_sure = function() {
            $http({
                method: "post",
                url: "../../db/district.php",
                data: {
                    sid: sid,
                    cmd: "add",
                    name:$scope.addItem.name
                },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function(data) {return $.param(data);}
            }).success(function(data) {
                console.log(data);
                $scope.getData();
            });
            $('#add').modal('hide');
        };
        $scope.add_cancel=function () {
            $('#add').modal('hide')
        }
    };
    // 修改****
    $scope.change = function(item) {
        $scope.districtItem = item;
        var s_name = $scope.districtItem.name;
        $scope.change_sure= function() {
            $http({
                method: "post",
                url: "../../db/district.php",
                data: {
                    sid: sid,
                    cmd: "edit",
                    id: $scope.districtItem.id,
                    name: $scope.districtItem.name
                },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                transformRequest: function(data) {return $.param(data);}
            }).success(function (data) {
                console.log(data);
            });
            $('#changeModal').modal('hide');
        };
        $scope.check_cancel=function () {
            $scope.districtItem.name = s_name;
            $('#changeModal').modal('hide');
        };
    };
    //删除
    $scope.delete= function(item) {
        $scope.districtItem = item;
        $scope.delete_sure = function() {
            $http({
                method: "post",
                url: "../../db/district.php",
                data: {
                    sid: sid,
                    cmd: "del",
                    id:$scope.districtItem.id
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
