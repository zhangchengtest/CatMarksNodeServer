var netMarks = angular.module('netMarks', []);
netMarks.filter('folderIdToTitle', function() {
  return function(input) {
    $.each(Global.folders, function(key, value) {
      if (value._id == input) {
        input = value.title;
      }
    });
    return input
  }
});
netMarks.controller('netMarksIndex', function($http, $scope) {
  $scope.getFolders = function() {
    //获取文件夹列表，不含根目录
    $.ajax({
      type: "get",
      url: Global.uri + "/folders",
      data: {
        user_id: $.cookie('user_id'),
        token: $.cookie('token'),
        folder_id: $.cookie('folder_id')
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
  };
  $scope.getAllMarks = function() {
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
  $scope.getAllTags = function() {
    //获取书签列表
    $.ajax({
      type: "get",
      url: Global.uri + "/tags",
      data: {
        user_id: $.cookie('user_id'),
        token: $.cookie('token')
      },
      async: false,
      error: function(request) {
        console.error("标签列表获取错误!");
        console.log(request);
      },
      success: function(data) {
        console.log("标签列表");
        console.log(data);
        var tags = "";
        $.each(data.data, function(key, value) {
          tags += value;
        });
        $scope.tags = tags.split("#");
        console.log("tags");
        console.log($scope.tags);
      }
    });
  };
  $scope.showMarksByTag = function(tag) {
    //获取tag书签列表
    $.ajax({
      type: "get",
      url: Global.uri + "/tags/marks/" + tag,
      data: {
        user_id: $.cookie('user_id'),
        token: $.cookie('token')
      },
      async: false,
      error: function(request) {
        console.error("query书签列表获取错误!");
        console.log(request);
      },
      success: function(data) {
        console.log("query书签列表");
        console.log(data);
        $scope.marks = data.data;
      }
    });
  };
  $scope.getFoldersAndMarks = function() {
    $scope.getFolders();
    $scope.getAllMarks();
    $scope.getAllTags();
  };
  if ($.cookie('user_id') && $.cookie('token')) {
    $scope.getFoldersAndMarks();
  };

  $scope.showMarks = function(id) {
    //event.stopPropagation();
    $scope.showFolder(id);
    var obj = event.target;
    $(obj).parents('.rootMenu').children('.subMenu').eq(0).toggle();
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
    var markId = $('#mark_id').val();
    if (id != markId) {
      //document.getElementById("mark_edit_form").reset();
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
    }

  };
  $scope.showFolder = function(id) {
    var folderId = $('#folder_id').val();
    if (id != folderId) {
      //document.getElementById("folder_edit_form").reset();
      $('#folder_edit').siblings().removeClass('active');
      $('#folder_edit_pane').siblings().removeClass('active');
      $('#folder_edit').addClass('active');
      $('#folder_edit_pane').addClass('active');
      $.ajax({
        type: "get",
        url: Global.uri + "/folders/" + id,
        data: {
          user_id: $.cookie('user_id'),
          token: $.cookie('token')
        },
        async: false,
        error: function(request) {
          console.error("文件夹详情获取错误!");
          console.log(request);
        },
        success: function(data) {
          console.log("文件夹详情");
          console.log(data);
          $scope.folder = data.data;
        }
      });
    }
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
          'user_id': $.cookie('user_id'),
          'folder_id': $.cookie('folder_id')
        }) + '&' + $("#folder_add_form").serialize(),
        error: function(request) {
          console.error("文件夹添加错误!");
          console.log(request);
        },
        success: function(data) {
          Global.alert(data.message);
          $scope.getFolders();
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
          Global.alert(data.message);
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
          Global.alert(data.message);
        }
      })
    }
  });
  //编辑文件夹
  $("#folder_edit_form").validate({
    submitHandler: function() {
      $.ajax({
        type: "PUT",
        url: Global.uri + "/folders/" + $('#folder_id').val(),
        async: false,
        data: $.param({
          'token': $.cookie('token'),
          'user_id': $.cookie('user_id'),
          'folder_id': $.cookie('folder_id')
        }) + '&' + $("#folder_edit_form").serialize(),
        error: function(request) {
          console.error("文件夹编辑错误!");
          console.log(request);
        },
        success: function(data) {
          Global.alert(data.message);
        }
      })
    }
  });
});
