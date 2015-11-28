var netMarks = angular.module('netMarks', []);
netMarks.controller('netMarksIndex', function($http, $scope) {
  //退出登录
  $('#out_btn').click(function() {
    if (confirm("确定离开？")) {
      $.removeCookie('user_id');
      $.removeCookie('token');
      $scope.folders = null;
      $scope.marks = null;
    }
  });

  if ($.cookie('user_id') && $.cookie('token')) {
    //获取文件夹列表
    $.ajax({
      type: "get",
      url: Global.uri + "/folders",
      data: {
        user_id: $.cookie('user_id'),
        token: $.cookie('token')
      },
      async: false,
      error: function(request) {
        console.error("文件夹列表获取错误!");
        console.log(request);
      },
      success: function(data) {
        console.log("文件夹列表");
        console.log(data);
        $scope.folders = data.data;
      }
    });
    //获取书签列表
    $.ajax({
      type: "get",
      url: Global.uri + "/marks",
      data: {
        user_id: $.cookie('user_id'),
        token: $.cookie('token')
      },
      async: false,
      error: function(request) {
        console.error("书签列表获取错误!");
        console.log(request);
      },
      success: function(data) {
        console.log("书签列表");
        console.log(data);
        $scope.marks = data.data;

      }
    });
  };
  $scope.showMarks = function(id) {

    $.ajax({
      type: "get",
      url: Global.uri + "/folders/marks/" + id,
      data: {
        user_id: $.cookie('user_id'),
        token: $.cookie('token')
      },
      async: false,
      error: function(request) {
        console.error("指定书签列表获取错误!");
        console.log(request);
      },
      success: function(data) {
        console.log("书签列表");
        console.log(data);
        $scope.marks = data.data;

      }
    });
  };
  $scope.showMark = function(id) {
    $('#mark_edit').siblings().removeClass('active');
    $('#mark_edit_pane').siblings().removeClass('active');
    $('#mark_edit').addClass('active');
    $('#mark_edit_pane').addClass('active');
    $.ajax({
      type: "get",
      url: Global.uri + "/marks/" + id,
      data: {
        user_id: $.cookie('user_id'),
        token: $.cookie('token')
      },
      async: false,
      error: function(request) {
        console.error("书签详情获取错误!");
        console.log(request);
      },
      success: function(data) {
        console.log("书签详情");
        console.log(data);
        $scope.mark = data.data;

      }
    });
  };
  //添加文件夹
  $("#folder_add_form").validate({
    submitHandler: function() {
      $.ajax({
        cache: true,
        type: "POST",
        async: false,
        url: Global.uri + "/folders",
        data: $.param({
          'token': $.cookie('token'),
          'user_id': $.cookie('user_id')
        }) + '&' + $("#folder_add_form").serialize(),
        error: function(request) {
          console.error("文件夹添加错误!");
          console.log(request);
        },
        success: function(data) {
          alert(data.message);
          $.ajax({
            type: "get",
            url: Global.uri + "/folders",
            async: false,
            data: {
              user_id: $.cookie('user_id'),
              token: $.cookie('token')
            },

            error: function(request) {
              console.error("文件夹列表获取错误!");
              console.log(request);
            },
            success: function(data) {
              console.log("文件夹列表");
              console.log(data);
              $scope.folders = data.data;
            }
          });
        }
      })
    }
  });
  //添加书签
  $("#mark_add_form").validate({
    submitHandler: function() {
      $.ajax({
        type: "POST",
        url: Global.uri + "/marks",
        async: false,
        data: $.param({
          'token': $.cookie('token'),
          'user_id': $.cookie('user_id')
        }) + '&' + $("#mark_add_form").serialize(),
        error: function(request) {
          console.error("书签添加错误!");
          console.log(request);
        },
        success: function(data) {
          alert(data.message);
          //获取书签列表
          // $.ajax({
          //   type: "GET",
          //   url: Global.uri + "/marks",
          //   async: false,
          //   data: {
          //     user_id: $.cookie('user_id'),
          //     token: $.cookie('token')
          //   },
          //
          //   error: function(request) {
          //     console.error("书签列表获取错误!");
          //     console.log(request);
          //   },
          //   success: function(data) {
          //     console.log("书签列表");
          //     console.log(data);
          //     $scope.marks = data.data;
          //   }
          // });
        }
      })
    }
  });
  //编辑书签
  $("#mark_edit_form").validate({
    submitHandler: function() {
      $.ajax({
        type: "PUT",
        url: Global.uri + "/marks/" + $('#mark_id').val(),
        async: false,
        data: $.param({
          'token': $.cookie('token'),
          'user_id': $.cookie('user_id')
        }) + '&' + $("#mark_edit_form").serialize(),
        error: function(request) {
          console.error("书签编辑错误!");
          console.log(request);
        },
        success: function(data) {
          alert(data.message);
          //获取书签列表
          $.ajax({
            type: "GET",
            url: Global.uri + "/marks/" + $('#mark_id').val(),
            async: false,
            data: {
              user_id: $.cookie('user_id'),
              token: $.cookie('token')
            },

            error: function(request) {
              console.error("书签获取错误!");
              console.log(request);
            },
            success: function(data) {
              console.log("书签详情");
              console.log(data);
              $scope.mark = data.data;
            }
          });
        }
      })
    }
  });
});
