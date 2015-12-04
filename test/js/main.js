//检查登录:首先判断token是否存在，同时判断cookie 中的token_del_time是否到期
(function() {
  if ($.cookie('token') && $.cookie('user_id')) {
    $('#join_btn').hide();
    $('#login_btn').hide();
    $('#folders_add').addClass("active");
    $('#folders_pane').addClass("active");
    $('#login_pane').removeClass('active');
    //$("11111").appendTo($('#user_btn'));
    $('#user_btn').html('<a data-toggle="tab" href="#user_edit_pane"><i class="fa fa-user"></i> '+$.cookie("username")+'</a>');
  } else {
    $('#marks_add').hide();
    $('#folders_add').hide();
    $('#out_btn').hide();
    $('#user_btn').hide();
    $('#login_btn').addClass("active")
  }
})();
//=================登陆模块===================//
//=================登陆模块===================//
//=================登陆模块===================//
/*
登陆之后，隐藏登陆面板，同时左侧文件夹和书签列表显示登陆用户的相关信息
*/
//登录
$("#login_form").validate({
  submitHandler: function() {
    $.ajax({
      cache: true,
      type: "POST",
      async: false,
      url: Global.uri + "/users/login",
      data: $("#login_form").serialize(),
      error: function(request) {
        console.error("login error!");
        console.log(request);
      },
      success: function(data) {
        Global.alert(data.message);
        if (data.code == 1000) {
          $.cookie('token', data.token);
          $.cookie('user_id', data.data._id);
          $.cookie('username', data.data.username);
          $.cookie('folder_id', data.data.root);
          location.reload();
        }
      }
    })
  }
});
//退出登录
$('#out_btn').click(function() {
  swal({
    title: "确定退出吗？",
    text: "",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#DD6B55",
    confirmButtonText: "退出",
    cancelButtonText: '取消',
    closeOnConfirm: false
  }, function() {
    $.removeCookie('user_id');
    $.removeCookie('token');
    $.removeCookie('folder_id');
    $.removeCookie('username')
    location.reload();
  });

});
//注册
$("#join_form").validate({
  submitHandler: function() {
    $.ajax({
      cache: true,
      type: "POST",
      async: false,
      url: Global.uri + "/users/join",
      data: $("#join_form").serialize(),
      error: function(request) {
        console.error("login error!");
        console.log(request);
      },
      success: function(data) {
        //Global.alert(data.message);
        if (data.code == 1000) {
          $.ajax({
            cache: true,
            type: "POST",
            async: false,
            url: Global.uri + "/users/login",
            data: $("#join_form").serialize(),
            error: function(request) {
              console.error("login error!");
              console.log(request);
            },
            success: function(data) {
              Global.alert(data.message);

              if (data.code == 1000) {
                $.cookie('token', data.token);
                $.cookie('user_id', data.data._id);
                $.cookie('folder_id', data.data.root);
                location.reload();
              }
            }
          })
        } else {
          Global.alert(data.message);
        }
      }
    })
  }
});
