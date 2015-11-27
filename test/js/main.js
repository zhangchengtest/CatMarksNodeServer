//检查登录:首先判断token是否存在，同时判断cookie 中的token_del_time是否到期
(function() {
  if ($.cookie('token') && $.cookie('user_id')) {
    $('#join_btn').hide();
    $('#login_btn').hide();
    $('#marks_add').addClass("active");
    $('#marks_pane').addClass("active");
    $('#login_pane').removeClass('active');
  } else {
    $('#out_btn').hide();
    $('#login_btn').addClass("active")
  }
})();
//登录
$("#login_form").validate({
  submitHandler: function() {
    $.ajax({
      cache: true,
      type: "POST",
      url: Global.uri + "/users/login",
      data: $("#login_form").serialize(),
      error: function(request) {
        console.error("login error!");
        console.log(request);
      },
      success: function(data) {
        alert(data.message);
        if (data.code == 1000) {
          $.cookie('token', data.token);
          $.cookie('user_id', data.data._id);
          $('#join_btn').hide();
          $('#login_btn').hide();
        }
      }
    })
  }
});
