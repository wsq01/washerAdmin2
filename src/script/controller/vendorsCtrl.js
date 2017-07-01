angular.module('app').controller('vendorsCtrl', ['$http', '$scope', 'locals', 'NgTableParams', function($http, $scope, locals, NgTableParams) {
  var userInfo = locals.getObject('userInfo'),
    sid = userInfo.sid,
    uid = window.localStorage.getItem('uid');
    // 获取
  $scope.getData = function() {
    $http({
      method: "post",
      url: "../../db/user.php",
      data: {
        sid: sid,
        cmd: "vendor_list"
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      transformRequest: function(data) {
        return $.param(data);
      }
    }).success(function(data) {
      console.log(data);
      $scope.user = data.vendors;
      $scope.dataTable = new NgTableParams({
        page: 1,
        count: 15
      }, {
        counts:[15,20,30],
        dataset: $scope.user
      })
    });
  }
  $scope.getData();
  //修改****
  $scope.change = function(item) {
    $scope.userItem = item;
    var s_company = $scope.userItem.company,
      s_level = $scope.userItem.level,
      s_status = $scope.userItem.status;
    $scope.change_sure = function() {
      $http({
        method: "post",
        url: "../../db/user.php",
        data: {
          sid: sid,
          cmd: "edit_vendor",
          id: $scope.userItem.id,
          company: $scope.userItem.company,
          level: $scope.userItem.level,
          status: $scope.userItem.status
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        transformRequest: function(data) {
          return $.param(data);
        }
      }).success(function(data) {
        console.log(data);
        $scope.getData();
      });
      $('#changeModal').modal('hide');
    };
    $scope.change_cancel = function() {
      $('#changeModal').modal('hide');
    };
  };
  //添加****
  $scope.addVendor = function() {
    $scope.add_sure = function() {
      // 调用新增管理员用户
      $http({
        method: "post",
        url: "../../db/user.php",
        data: {
          sid: sid,
          cmd: "add_vendor",
          company: $scope.addItem.company
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        transformRequest: function(data) {
          return $.param(data);
        }
      }).success(function(data) {
        console.log(data);
        $scope.getData();
      });
    };
    //点击取消
    $scope.add_cancel = function() {
      $('#addVendor').modal('hide');
    }
  };
}]);
