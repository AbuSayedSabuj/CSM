const connect = require("../data/Connect");
const user = connect.user;
const doctor = connect.doctor;
const appointment = connect.appointment;
const admin = connect.admin;
const staff = connect.staff;
const mail = require("../config/mail");
userTypes = {
  admin,
  doctor,
  staff,
  patient: user
};
users = {
  admin: "admin",
  doctor: "doctor",
  staff: "staff",
  patient: "user"
};
exports.reset = (req, res) => {
  u = userTypes[req.session.usertype];
  u.findOne({ email: req.session.useremail })
    .then(U => {
      U.password = req.body.password;
      console.log(U);
      U.save()
        .then(data => {
          res.render(users[req.session.usertype] + "/signin", {
            message: "Password reset successfully"
          });
        })
        .catch(e => {
          console.log(e);
        });
    })
    .catch(e => {
      console.log(e);
    });
};
exports.resetpassword = (req, res) => {
  if (req.body.key != req.session.forgetKey) {
    res.render("resetpassword", { error: "Invalid key" });
  } else {
    res.render("finalreset");
  }
};
exports.forgotpassword = (req, res) => {
  u = userTypes[req.body.usertype];
  u.find({ email: req.body.email })
    .then(data => {
      if (data.length == 0) {
        res.render("forgetPassword", {
          error: "Invalid email for " + req.body.usertype
        });
      } else {
        randNumber = Math.floor(Math.random() * 10000);
        req.session.forgetKey = randNumber;
        req.session.usertype = req.body.usertype;
        req.session.useremail = req.body.email;
        //to, subject, html, callback
        mail.sendEmail(
          req.body.email,
          "Reset Password",
          `
          Enter the number ${randNumber} to reset the password
        `,
          data => {
            res.render("resetpassword");
          }
        );
      }
    })
    .catch(e => console.log(e));
};
exports.changepassword = (req, res) => {
  user.findById(req.session.user._id).then(User => {
    pass = User.password;
    res.render("user/changepassword", {
      err: "",
      pass,
      user: req.session.user
    });
  });
};
exports.updatepassword = (req, res) => {
  user.findById(req.session.user._id).then(User => {
    User.password = req.body.newpass;
    User.save().then(data => {
      req.session.user = data;
      res.render("user/changepassword", {
        err: "Password has been changed successfully",
        pass: data.password,
        user: req.session.user
      });
    });
  });
};
exports.myappointment = (req, res) => {
  const id = req.session.user._id;
  appointment.find().then(list => {
    list = list.filter(ap => {
      if (ap.user) return ap.user._id == id;
    });
    res.render("user/myappointment", { list, user: req.session.user });
  });
};
