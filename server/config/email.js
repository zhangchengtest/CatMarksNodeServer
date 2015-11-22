var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'QQ',
  auth: {
    user: '#####@###.###',
    pass: '*******'
  }
});

var sendEmail = function(mailOptions, callback) {
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      callback(error);
    } else {
      callback(info);
    }
  });
}
module.exports = sendEmail;
