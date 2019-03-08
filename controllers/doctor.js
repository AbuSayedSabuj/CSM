const { doctor, admin, appointment } = require("../data/Connect");
exports.authentication = (req, res, next) => {
  if (req.session.doctor) {
    next();
  } else {
    res.redirect("/");
  }
};
exports.signin = (req, res) => {
  res.render("doctor/signin", { error: "", email: "" });
};
exports.login = (req, res) => {
  doctor.findOne(
    { email: req.body.email, password: req.body.password },
    (err, Doctor) => {
      if (Doctor) {
        req.session.doctor = Doctor;
        res.redirect("/doctor/home");
      } else {
        res.render("doctor/signin", {
          error: "Invalid email or password",
          email: req.body.email
        });
      }
    }
  );
};
exports.home = (req, res) => {
  res.render("doctor/home",{doctor:req.session.doctor});
};
exports.myappointments = (req, res) => {
  appointment
    .find()
    .then(appointments => {
      //console.log(req.session.doctor._id);
      // res.json(appointments);
      appointments = appointments.filter(Appointment => {
        if (Appointment.doctor)
          return Appointment.doctor._id == req.session.doctor._id;
      });
      for (i = 0; i < appointments.length; i++) {
        appointments[i].appliedtime = appointments[i].getTime();
      }
      res.render("doctor/myappointment", {
        doctor: req.session.doctor,
        //sobkhane doctor ta pathate hobe joto jaygay render
        list: appointments
      });
    })
    .catch(e => {
      console.log(e);
    });
};
exports.updateschedule = (req, res) => {
  res.render("doctor/updateschedule", { doctor: req.session.doctor, msg: "" });
};
exports.changepassword = (req, res) => {
  doctor.findById(req.session.doctor._id).then(Doctor => {
    pass = Doctor.password;
    res.render("doctor/changepassword", {
      err: "",
      pass,
      doctor: req.session.doctor
    });
  });
};
exports.updatepassword = (req, res) => {
  doctor.findById(req.session.doctor._id).then(Doctor => {
    Doctor.password = req.body.newpass;
    Doctor.save().then(data => {
      req.session.doctor = data;
      res.render("doctor/changepassword", {
        err: "Password has been changed successfully",
        pass: data.password,
        doctor: req.session.doctor
      });
    });
  });
};
exports.changeschedule = (req, res) => {
  doctor
    .findById(req.session.doctor._id)
    .then(Doctor => {
      Doctor.start_time = req.body.start_time;
      Doctor.end_time = req.body.end_time;
      Doctor.save()
        .then(data => {
          req.session.doctor = data;
          res.render("doctor/updateschedule", {
            doctor: req.session.doctor,
            msg: "Schedule updated"
          });
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    });
};
