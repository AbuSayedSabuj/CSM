const nodeMailer = require("nodemailer");
//https://myaccount.google.com/lesssecureapps
var transporter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    // first go the link avobe and enable (remember you need to signed in in your gmail)
    user: "piash3700@gmail.com", //change here
    pass: "Sameoldpassword4*" //change here
  }
});
module.exports.sendEmail = (to, subject, html, callback) => {
  const mailOptions = {
    from: "sazzad.masum99@gmail.com", // sender address ami likhe rakhsilam. ekhane dile ei address theke jabe mail
    to,
    subject:'Your reset password is 00000',
    html
  };
  transporter.sendMail(mailOptions, function(err, info) {
    if (err) console.log(err);
    else {
      callback(info);
    }
  });
};
