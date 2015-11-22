var config = {
  db: {
    uri: "mongodb://localhost",
    port: "27017"
  },
  serverRes:{
    status5000:{
      code: 5000,
      status: 200,
      message: "成功!"
    },
    status5001:{
      code: 5001,
      status: 500,
      message: "服务器繁忙!"
    }
  },
  usersRes: {
    status1000: {
      code: 2000,
      status: 200,
      message: "成功!"
    },
    status1001: {
      code: 1001,
      status: 200,
      message: "用户名只允许数字和字母的组合!"
    },
    status1002: {
      code: 1002,
      status: 200,
      message: "用户名长度应该介于5-10之间!"
    },
    status1004: {
      code: 1004,
      status: 200,
      message: "密码长度应介于6-15之间!"
    },
    status1005: {
      code: 1005,
      status: 200,
      message: "该用户名已被注册!"
    },
    status1006: {
      code: 1006,
      status: 200,
      message: "该邮箱地址已被注册!"
    },
    status1007: {
      code: 1007,
      status: 200,
      message: "密码错误!"
    },
    status1008: {
      code: 1008,
      status: 404,
      message: "账号不存在!",
      suggestion:{
        join:"/users/join"
      }
    },
    status1009: {
      code: 1009,
      status: 200,
      message: "账号或密码错误!"
    },
    status1010: {
      code: 1010,
      status: 200,
      message: "提交的内容存在格式错误!"
    },
    status1011: {
      code: 1011,
      status: 500,
      message: "登录失败!"
    },
    status1012: {
      code: 1012,
      status: 500,
      message: "注册失败!"
    },
    status1013: {
      code:1013 ,
      status: 500,
      message: "最近登录时间更新失败!"
    }
  },
  tokenRes: {
    status2000: {
      code: 2000,
      status: 200,
      message: "成功!"
    },
    status2001: {
      code: 2001,
      status: 200,
      message: "token已过期!"
    },
    status2002: {
      code: 2002,
      status: 200,
      message: "token不存在!"
    },
    status2003: {
      code: 2003,
      status: 200,
      message: "token无效!"
    },
    status2004: {
      code: 2004,
      status: 500,
      message: "token移除失败!"
    },
    status2005: {
      code: 2005,
      status: 500,
      message: "token添加失败!"
    },
    status2006: {
      code: 2006,
      status: 200,
      message: "token移除成功!"
    }
  }
}
module.exports = config;
