angular.module('app').controller('buildingsCtrl', ['$http', '$scope','locals','NgTableParams', function($http, $scope,locals,NgTableParams){
  var userInfo=locals.getObject('userInfo');
  var sid=userInfo.sid,
      uid=window.localStorage.getItem('uid');
    //获取
    $scope.getData=function(){
      $http({
          method: "post",
          url: "../../db/building.php",
          data: {
              sid: sid,
              cmd: 'get'
          },
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          transformRequest: function(data) {return $.param(data);}
      }).success(function(data) {
          $scope.building = data.buildings;
          $scope.dataTable=new NgTableParams({
            page:1,
            count:15
          },{
            counts:[15,20,30],
            dataset:$scope.building
          });
      });
    };
    $scope.getData();
    // 添加****
    $scope.add = function() {
        $scope.add_sure = function() {
            $http({
                method: "post",
                url: "../../db/building.php",
                data: {
                    sid: sid,
                    cmd: "add",
                    name:$scope.addItem.name,
                    school:$scope.addItem.school
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
        $scope.buildingItem = item;
        var s_name = $scope.buildingItem.name,
            s_school=$scope.buildingItem.school;
        $scope.change_sure= function() {
            $http({
                method: "post",
                url: "../../db/building.php",
                data: {
                    sid: sid,
                    cmd: "edit",
                    id: $scope.buildingItem.id,
                    name: $scope.buildingItem.name,
                    school:$scope.buildingItem.school
                },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                transformRequest: function(data) {return $.param(data);}
            }).success(function (data) {
            });
            $('#changeModal').modal('hide')
        };
        $scope.change_cancel=function () {
            $scope.buildingItem.name = s_name;
            $scope.buildingItem.school=s_school;
            $('#changeModal').modal('hide');
        };
    };
    // 删除****
    $scope.delete= function(item) {
        $scope.buildingItem = item;
        $scope.delete_sure = function() {
            $http({
                method: "post",
                url: "../../db/building.php",
                data: {
                    sid: sid,
                    cmd: "del",
                    id:$scope.buildingItem
                },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                transformRequest: function(data) {return $.param(data);}
            }).success(function(data) {
                $scope.getData();
            });
            $('#deleteModal').modal('hide');
        };
        $scope.delete_cancel=function () {
            $('#deleteModal').modal('hide');
        };
        $('#close').click(function(){
            $('#deleteModal').modal('hide');
        })
    };
}]);
