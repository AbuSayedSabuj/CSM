const express = require("express");
const fs = require("fs");
const router = express.Router();
const mongoose = require("mongoose");
const connect = require("../data/Connect");
const doctor = connect.doctor;
const admin = connect.admin;
const staff = connect.staff;
const user = connect.user;
const seat = connect.seat;
const feedback = connect.feedback;
doctorList = callback => {
  fs.readFile("./data/doctorList.txt", "utf-8", (err, data) => {
    if (!err) {
      callback(data);
    } else {
      console.log(err);
    }
  });
};
router.get("/getUserList", (req, res) => {
  admin.find().then(ulist => {
    res.json(ulist);
  });
});
router.get("/admin/editseat", (req, res) => {
  const { type, av } = req.query;
  //2 min ami amar code dekhi oky
  //sorry ami b
  seat.findOne({ type }).then(st => {
    st.available = av;
    st.save().then(data => {
      res.redirect("/admin/seatinfo");
    });
  });
});
router.get("/admin/seatinfo", (req, res) => {
  seat.find().then(slist => {
    if (slist.length == 0) {
      seatList = [
        {
          type: "Ward",
          total: 20,
          available: 15
        },
        {
          type: "Normal",
          total: 30,
          available: 20
        },
        {
          type: "Deluxe",
          total: 10,
          available: 8
        }
      ];
      seatList.forEach(st => {
        Seat = new seat(st);
        Seat.save().then(data => { });
      });
      res.redirect("/admin/seatinfo");
    } else {
      res.render("admin/seatInfo.hbs", {
        w: slist[0],
        n: slist[1],
        d: slist[2],
        admin: req.session.admin
      });
    }
  });
});
router.post("/feedback", (req, res) => {
  const { type, name, email, contact, details } = req.body;
  const Feedback = new feedback({
    type,
    name,
    email,
    contact,
    details
  });
  Feedback.save()
    .then(fb => {
      res.redirect("/");
    })
    .catch(e => console.log(e));
});
router.get("/getStaffList", (req, res) => {
  staff.find().then(ulist => {
    res.json(ulist);
  });
});
router.get("/admin", (req, res) => {
  res.render("admin/home", { admin: req.session.admin });
});
router.get("/admin/viewappointment", (req, res) => {
  fs.readFile("./data/appointmentlist.txt", "utf-8", (err, data) => {
    appointmentList = JSON.parse(data);
    res.render("admin/viewappointment", {
      list: appointmentList,
      admin: req.session.admin
    });
  });
});
router.get("/admin/unaprovedusers", (req, res) => {
  fs.readFile("./data/userList.txt", "utf-8", (err, data) => {
    res.render("admin/unaprovedUser", {
      users: JSON.parse(data),
      admin: req.session.admin
    });
  });
});
router.get("/admin/adddoctor", (req, res) => {
  res.render("admin/addDoctor");
});

router.post("/admin/adddoctor", (req, res) => {
  doc = new doctor({
    name: req.body.name,
    age: req.body.age,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
    designation: req.body.des,
    department: req.body.department,
    available: true,
    gender: req.body.gender,
    visiting_days: req.body.days,
    join_date: req.body.joindate,
    start_time: req.body.start_time,
    end_time: req.body.end_time,
    address: req.body.address,
    fee: req.body.fee
  });
  doc
    .save()
    .then(data => {
      id = data._id;
      let image = req.files.image;
      image.mv(`public/images/doctor/${id}.jpg`, err => { });
      res.redirect("/admin/viewdoctorlist");
    })
    .catch(err => {
      console.log(err);
    });
});
router.get("/admin/viewdoctorlist", (req, res) => {
  doctor.find({}, (err, doctorList) => {
    res.render("admin/viewDoctorList", {
      doctors: doctorList,
      admin: req.session.admin
    });
  });
});

/*router.post('/adddoctor',(req,res)=>{
  doctorList(function(data){
    let doctor=req.body;
      if(data.length==0){
          doctor.id=1;
          var doctorList=[doctor];
         
      }
      else{
          var  doctorList=JSON.parse(data);
          doctor.id=doctorList.length+1;
          doctorList.push(doctor)
      }
      let image=req.files.image;
      image.mv(`./public/images/doctor/${doctor.id}.jpg`,(err)=>{
        fs.writeFile('./data/doctorList.txt',JSON.stringify(doctorList),(err)=>{
            if(!err)
            {
                res.send('doctor has been added');
            }
            else
            {
                res.send(err)
            }
         })
        
        });

      
      
  });
    
})*/

patientList = callback => {
  fs.readFile("./data/patientList.txt", "utf-8", (err, data) => {
    if (!err) {
      callback(data);
    } else {
      console.log(err);
    }
  });
};
router.get("/admin", (req, res) => {
  res.send("I am from admin ");
});
router.get("/viewpatientlist", (req, res) => {
  patientList(function (patientList) {
    res.render("admin/viewPatientList", { patient: JSON.parse(patientList) });
  });
});

router.get("/admin/addpatient", (req, res) => {
  fs.readFile("./data/seatList.txt", "utf-8", (err, data) => {
    seatList = JSON.parse(data);
    availableSeats = seatList.filter(function (seat) {
      if (seat.seat_available == "true") {
        return true;
      }
    });
    res.render("admin/addPatient", { seats: availableSeats });
  });
});
router.get("/admin/deletedoctor", (req, res) => {
  id = req.query.id;
  doctor.deleteOne({ _id: id }, err => {
    res.redirect("/admin/viewdoctorlist");
  });
});
router.get("/admin/deletestaff", (req, res) => {
  id = req.query.id;
  staff.deleteOne({ _id: id }, err => {
    res.redirect("/admin/viewstafflist");
  });
});
router.get("/admin/editdoctor", (req, res) => {
  id = req.query.id;
  doctor.findById(id, (err, Doctor) => {
    res.render("admin/editDoctor", {
      doctor: Doctor,
      admin: req.session.admin
    });
  });
});
router.post("/admin/editdoctor", (req, res) => {
  id = req.body.id;
  doctor.findById(id, (err, Doctor) => {
    Doctor.address = req.body.address;
    Doctor.fee = req.body.fee;
    Doctor.designation = req.body.designation;
    Doctor.phone = req.body.phone;
    Doctor.save()
      .then(err => {
        res.redirect("/admin/viewdoctorlist");
      })
      .catch();
  });
});
router.post("/addpatient", (req, res) => {
  patientList(function (data) {
    let patient = req.body;
    if (data.length == 0) {
      patient.id = 1;
      var patientList = [patient];
    } else {
      var patientList = JSON.parse(data);
      patient.id = patientList.length + 1;
      patientList.push(patient);
    }
    let image = req.files.image;
    image.mv(`./public/images/patient/${patient.id}.jpg`, err => {
      fs.writeFile(
        "./data/patientList.txt",
        JSON.stringify(patientList),
        err => {
          if (!err) {
            res.send("patient has been added");
          } else {
            res.send(err);
          }
        }
      );
    });
  });
});
module.exports = router;
