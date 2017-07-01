angular.module('app').controller('devicesCtrl', ['$http', '$scope', 'locals', 'NgTableParams', function($http, $scope, locals, NgTableParams) {
  var userInfo = locals.getObject('userInfo'),
    sid = userInfo.sid,
    uid = window.localStorage.getItem('uid');
    // 获取
  $scope.getData = function() {
    $http({
      method: "post",
      url: "../../db/socket.php",
      data: {
        sid: sid,
        cmd: 'get_device'
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      transformRequest: function(data) {
        return $.param(data);
      }
    }).success(function(data) {
      console.log(data);
      $scope.device = data.devices;
      $scope.dataTable = new NgTableParams({
        page: 1,
        count: 15
      }, {
        counts: [15, 20, 30],
        dataset: $scope.device
      });
    });
  }
  $scope.getData();
  // 添加****
  $scope.add = function() {
    $scope.add_sure = function() {
      $http({
        method: "post",
        url: "../../db/socket.php",
        data: {
          sid: sid,
          cmd: "add_device",
          name: $scope.addItem.name,
          mac: $scope.addItem.mac,
          did: $scope.addItem.did,
          vendor: $scope.addItem.vendor,
          lat: $scope.addItem.lat,
          lon: $scope.addItem.lon,
          floor: $scope.addItem.floor
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
      $('#add').modal('hide');
    };
    $scope.add_cancel = function() {
      $('#add').modal('hide')
    }
  };
  // 修改****
  $scope.change = function(item) {
    $scope.deviceItem = item;
    var s_name = $scope.deviceItem.name,
      s_mac = $scope.deviceItem.mac,
      s_did = $scope.deviceItem.did,
      s_lat = $scope.deviceItem.lat,
      s_lon = $scope.deviceItem.lon,
      s_floor = $scope.deviceItem.floor,
      s_vendor = $scope.deviceItem.vendor;
    $scope.change_sure = function() {
      $http({
        method: "post",
        url: "../../db/socket.php",
        data: {
          sid: sid,
          cmd: "edit_device",
          id: $scope.deviceItem.id,
          name: $scope.deviceItem.name,
          mac: $scope.deviceItem.mac,
          did: $scope.deviceItem.did,
          vendor: $scope.deviceItem.vendor,
          lat: $scope.deviceItem.lat,
          lon: $scope.deviceItem.lon,
          floor: $scope.deviceItem.floor
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        transformRequest: function(data) {
          return $.param(data);
        }
      }).success(function(data) {
        console.log(data);
      });
      $('#changeModal').modal('hide')
    };
    $scope.change_cancel = function() {
      $scope.deviceItem.name = s_name;
      $scope.deviceItem.mac = s_mac;
      $scope.deviceItem.did = s_did;
      $scope.deviceItem.vendorid = s_vendor;
      $scope.deviceItem.lat = s_lat;
      $scope.deviceItem.lon = s_lon;
      $scope.deviceItem.floor = s_floor;
      $('#changeModal').modal('hide')
    };
  };
  // 删除
  $scope.delete = function(item) {
    $scope.deviceItem = item;
    $scope.delete_sure = function() {
      $http({
        method: "post",
        url: "../../db/socket.php",
        data: {
          sid: sid,
          cmd: "del_device",
          id: $scope.deviceItem.id
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
      $('#deleteModal').modal('hide');
    };
    $scope.delete_cancel = function() {
      $('#deleteModal').modal('hide')
    };
    $('#close').click(function() {
      $('#deleteModal').modal('hide')
    })
  };
}]);
