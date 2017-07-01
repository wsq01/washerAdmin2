angular.module('app').controller('floorsCtrl', ['$http', '$scope','locals','NgTableParams', function($http, $scope,locals,NgTableParams){
  var userInfo=locals.getObject('userInfo'),
      sid=userInfo.sid,
      uid=window.localStorage.getItem('uid');
    // 获取信息
    $scope.getData=function(){
      $http({
          method: "post",
          url: "../../db/floor.php",
          data: {
              sid: sid,
              cmd: 'get'
          },
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          transformRequest: function(data) {return $.param(data);}
      }).success(function(data) {
          console.log(data);
          $scope.floor = data.floors;
          $scope.dataTable=new NgTableParams({
            page:1,
            count:15
          },{
            counts:[15,20,30],
            dataset:$scope.floor
          });
      });
    }
    $scope.getData();
    // 添加****
    $scope.add = function() {
        $scope.add_sure = function() {
            $http({
                method: "post",
                url: "../../db/floor.php",
                data: {
                    sid: sid,
                    cmd: "add",
                    name:$scope.addItem.name,
                    bid:$scope.addItem.bid
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
            $('#add').modal('hide');
        }
    };
    // 修改*****
    $scope.change = function(item) {
      $scope.floorItem=item;
      console.log($scope.floorItem);
      var s_name = $scope.floorItem.name,
          s_bid=$scope.floorItem.building;
      $scope.change_sure= function() {
          $http({
              method: "post",
              url: "../../db/floor.php",
              data: {
                  sid: sid,
                  cmd: "edit",
                  id: $scope.floorItem.id,
                  name: $scope.floorItem.name,
                  bid:$scope.floorItem.building
              },
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              transformRequest: function(data) {return $.param(data);}
          }).success(function (data) {
              console.log(data);
          });
          $('#changeModal').modal('hide');
      };
      $scope.change_cancel=function () {
          $scope.floorItem.name = s_name;
          $scope.floorItem.building=s_bid;
          $('#changeModal').modal('hide');
      };
    };
    // 删除
    $scope.delete= function(item) {
      $scope.floorItem=item;
      $scope.delete_sure = function() {
          $http({
              method: "post",
              url: "../../db/floor.php",
              data: {
                  sid: sid,
                  cmd: "del",
                  id:$scope.floorItem.id
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
          $('#deleteModal').modal('hide');
      };
      $('#close').click(function(){
          $('#deleteModal').modal('hide');
      })
    };
}]);
