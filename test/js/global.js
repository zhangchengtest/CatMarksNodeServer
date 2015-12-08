var Global = {
  uri: "http://localhost:3000",
  token: $.cookie("token"),
  user_id: $.cookie("user_id"),
  alert: function(content) {
    $.bootstrapGrowl(content);
  },
  layer: function(content) {
    layer.open({
      type: 1,
      title: false,
      closeBtn: 0,
      shadeClose: true,
      skin: 'yourclass',
      content: content
    });

  }
};
var $loading = $('#ajax_wait').hide();
$(document)
  .ajaxStart(function() {
    $loading.show();
  })
  .ajaxStop(function() {
    $loading.hide();
  });
