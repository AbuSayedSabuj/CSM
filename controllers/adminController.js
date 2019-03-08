const express = require("express");
const fs = require("fs");
const router = express.Router();
const mongoose = require("mongoose");
const connect = require("../data/Connect");
const doctor = connect.doctor;
const admin = connect.admin;
const user = connect.user;
const appointment = connect.appointment;
const staff = connect.staff;
const leave = connect.leave;
const feedback = connect.feedback;
exports.addadmin = (req, res) => {
  res.render("admin/addAdmin", { admin: req.session.admin });
};
exports.insertadmin = (req, res) => {
  let { name, email, role, password } = req.body;
  if (role == 1) {
    vseat = true;
    vdoctor = true;
    vappointment = false;
    vuser = false;
    vstaff = false;
    vaccount = false;
  } else if (role == 2) {
    vseat = true;
    vdoctor = false;
    vappointment = false;
    vuser = false;
    vstaff = true;
    vaccount = true;
  } else {
    vseat = true;
    vdoctor = false;
    vappointment = true;
    vuser = true;
    vstaff = false;
    vaccount = false;
  }
  let Admin = new admin({
    name,
    email,
    password,
    role,
    seat: vseat,
    doctor: vdoctor,
    appointment: vappointment,
    user: vuser,
    staff: vstaff,
    admin: false
  });
  Admin.save().then(ad => {
    res.redirect("/admin/adminlist");
  });
};
exports.billing = (req, res) => {
  res.render("admin/billing", { admin: req.session.admin });
};
exports.printBill = (req, res) => {
  const {
    name,
    age,
    phone,
    email,
    address,
    bed,
    admission,
    discharge,
    total,
    discount,
    paid,
    due
  } = req.body;
  dt =
    new Date().getDate() +
    "/" +
    new Date().getMonth() +
    "/" +
    new Date().getFullYear();
  res.render("admin/printBill", {
    name,
    age,
    phone,
    email,
    address,
    bed,
    admission,
    discharge,
    total,
    discount,
    paid,
    due,
    dt
  });
};
exports.deleteadmin = (req, res) => {
  id = req.query.id;
  admin.findByIdAndDelete(id).then(ad => {
    res.redirect("/admin/adminlist");
  });
};
exports.adminlist = (req, res) => {
  admin.find().then(adminList => {
    adminList = adminList.filter(adm => adm.role != 0);
    res.render("admin/adminlist", { adminList, admin: req.session.admin });
  });
};
exports.viewstafflist = (req, res) => {
  staff.find().then(staffs => {
    m = "";
    if (req.query.m) {
      m = req.query.m;
    }
    res.render("admin/viewStaffList", { staffs, m, admin: req.session.admin });
  });
};
exports.newStaff = (req, res) => {
  res.render("admin/addStaff");
};
exports.leaveApplication = (req, res) => {
  leave
    .find()
    .then(Leave => {
      res.render("admin/viewLeave", { Leave, admin: req.session.admin });
    })
    .catch(e => console.log(e));
};
exports.viewFeedback = (req, res) => {
  feedback
    .find()
    .then(Feedback => {
      res.render("admin/viewFeedback", { Feedback, admin: req.session.admin });
    })
    .catch(e => console.log(e));
};
exports.applyLeave = (req, res) => {
  id = req.query.id;
  leave.findById(id).then(Leave => {
    Leave.aproved = true;
    Leave.save()
      .then(data => {
        res.redirect("/admin/viewleave");
      })
      .catch(e => {
        console.log(e);
      });
  });
};
exports.addStaff = (req, res) => {
  Staff = new staff({
    name: req.body.name,
    age: req.body.age,
    email: req.body.email,
    gender: req.body.gender,
    phone: req.body.phone,
    address: req.body.address,
    password: req.body.password,
    Join_date: req.body.Join_date,
    salary: req.body.salary,
    start_time: req.body.start_time,
    end_time: req.body.end_time,
    duty_days: req.body.days
  });
  Staff.save()
    .then(data => {
      id = data._id;
      let image = req.files.image;
      image.mv(`public/images/staff/${id}.jpg`, err => { });
      //res.json(data);
      res.redirect("/admin/viewstafflist?m=successfully added " + data.name);
    })
    .catch(err => {
      console.log(err);
    });
};
exports.changepassword = (req, res) => {
  admin.findById(req.session.admin._id).then(Admin => {
    pass = Admin.password;
    res.render("admin/changepassword", { err: "", pass });
  });
};
exports.appointmentlist = (req, res) => {
  appointment.find().then(list => {
    res.render("admin/viewappointment", { list, admin: req.session.admin });
  });
};
exports.updatepassword = (req, res) => {
  admin.findById(req.session.admin._id).then(Admin => {
    Admin.password = req.body.newpass;
    Admin.save().then(data => {
      req.session.admin = data;
      res.render("admin/changepassword", {
        err: "Password has been changed successfully",
        pass: data.password
      });
    });
  });
};

exports.users = (req, res) => {
  user.find().then(users => {
    m = "";
    if (req.query.m) {
      m = req.query.m;
    }
    res.render("admin/unaprovedUser", { users, m, admin: req.session.admin });
  });
};

exports.blockUser = (req, res) => {
  user.findById(req.query.id).then(User => {
    User.block = true;
    User.save().then(data => {
      res.redirect("/admin/users");
    });
  });
};
exports.unBlockUser = (req, res) => {
  user.findById(req.query.id).then(User => {
    User.block = false;
    User.save().then(data => {
      res.redirect("/admin/users");
    });
  });
};
