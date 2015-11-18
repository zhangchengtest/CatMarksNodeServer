var config = {
  db: {
    uri: "mongodb://localhost",
    port: "27017"
  },
  responseResult: {
    status200: {
      code:2000,
      status: 200,
      message: "success!"
    },
    status201: {
      code:2001,
      status: 200,
      message: "content is already exists !"
    },
    status400: {
      code:4000,
      status: 400,
      message: "falied!"
    },
    status400: {
      code:4004,
      status: 404,
      message: "content is not exists !"
    },
    status500: {
      code:5000,
      status: 500,
      message: "server error!"
    }
  }
}
module.exports = config;
