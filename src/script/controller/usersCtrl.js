angular.module('app').controller('usersCtrl', ['$http', '$scope', 'locals', 'NgTableParams', function ($http, $scope, locals, NgTableParams) {
    var userInfo = locals.getObject('userInfo');
    var sid = userInfo.sid,
        uid = window.localStorage.getItem('uid');
    // 获取
    $scope.getData = function () {
        $http({
            method: "post",
            url: "../../db/user.php",
            data: {
                sid: sid,
                cmd: "get_list"
            },
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            transformRequest: function (data) {
                return $.param(data);
            }
        }).success(function (data) {
            console.log(data);
            $scope.user = data.users;
            $scope.isShowFilter = false;
            $scope.dataTable = new NgTableParams({
                page: 1,
                count: 15
            }, {
                counts: [15, 20, 30],
                dataset: $scope.user
            })
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
    //修改****
    $scope.change = function (item) {
        $scope.userItem = item;
        var s_mobile = $scope.userItem.mobile,
            s_name = $scope.userItem.username;
        $scope.change_sure = function () {
            $http({
                method: "post",
                url: "http://washer.mychaochao.cn/db/user.php",
                data: {
                    sid: sid,
                    cmd: "edit",
                    id: $scope.userItem.id,
                    mobile: $scope.userItem.mobile,
                    name: $scope.userItem.username
                },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function (data) {
                    return $.param(data);
                }
            }).success(function (data) {
                console.log(data);
                $('#changeModal').modal('hide');
            });
        };
        $scope.change_cancel = function () {
            $scope.userItem.mobile = s_mobile;
            $scope.userItem.name = s_name;
            $('#changeModal').modal('hide')
        };
    };
    //删除
    // $scope.delete = function(index){
    //     $scope.userItem = $scope.users[index];
    //     $scope.delete_sure = function(){
    //         $http({
    //             method:'post',
    //             url:'http://washer.mychaochao.cn/db/user.php',
    //             data:{
    //                 sid:sid,
    //                 cmd:'del',
    //                 id:$scope.users[index].id
    //             },
    //             headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    //             transformRequest: function (data) {return $.param(data);}
    //         }).success(function(data){
    //           console.log(data);
    //             var big= Math.floor(($scope.user.length-1)/18);
    //             var flag = ($scope.user.length-1) - big*18;
    //             if(flag==0){
    //                 if(agination_index == ($scope.paginationsnum.length-1)){
    //                     agination_index--;
    //                 }
    //                 $scope.paginationsnum.length--;
    //             }
    //             getPagination(agination_index);
    //             $('#deleteModal').modal('hide');
    //         })
    //     };
    //     $scope.delete_cancel=function () {
    //         $('#deleteModal').modal('hide');
    //     };
    //     $('#close').click(function(){
    //         $('#deleteModal').modal('hide');
    //     })
    // };
}]);
