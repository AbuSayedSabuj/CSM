const connect = require("../data/Connect");
const staff = connect.staff;
const leave = connect.leave;
const emergency = connect.emergency;
exports.home = (req, res) => {
  res.render("staff/home", { staff: req.session.staff });
};
exports.newLeave = (req, res) => {
  res.render("staff/leaveApplication", { staff: req.session.staff });
};
exports.emergency = (req, res) =>{
  res.render("staff/Emergency",{staff:req.session.staff});
};
exports.myLeave = (req, res) => {
  leave
    .find({ staff: req.session.staff })
    .then(Leave => {
      res.render("staff/myLeave", { Leave, staff: req.session.staff });
    })
    .catch(e => console.log(e));
};
exports.submitLeave = (req, res) => {
  const Leave = new leave({
    staff: req.session.staff,
    type: req.body.type,
    from: req.body.start,
    to: req.body.end,
    details: req.body.details,
    aproved: false
  });
  Leave.save()
    .then(lv => {
      res.redirect('/staff/myleave')
    })
    .catch(e => console.log(e));
};
exports.signin = (req, res) => {
  staff.findOne(
    { email: req.body.email, password: req.body.password },
    (err, Staff) => {
      if (Staff) {
        req.session.staff = Staff;
        res.redirect("/staff/home");
      } else {
        res.render("staff/signin", {
          error: "Invalid email or password",
          email: req.body.email
        });
      }
    }
  );
};
exports.changepassword = (req, res) => {
  staff.findById(req.session.staff._id).then(Staff => {
    pass = Staff.password;
    res.render("staff/changepassword", {
      err: "",
      pass,
      staff: req.session.staff
    });
  });
};

exports.updatepassword = (req, res) => {
  staff.findById(req.session.staff._id).then(Staff => {
    Staff.password = req.body.newpass;
    Staff.save().then(data => {
      req.session.staff = data;
      res.render("staff/changepassword", {
        err: "Password has been changed successfully",
        pass: data.password,
        staff: req.session.staff
      });
    });
  });
};

