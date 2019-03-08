module.exports = app => {
  const doctorController = require("../controllers/doctor");
  app.get("/doctor/signin", doctorController.signin);
  app.get("/doctor/*", doctorController.authentication);
  app.post("/doctor/signin", doctorController.login);
  app.get("/doctor/home", doctorController.home);
  app.get("/doctor/myappointments", doctorController.myappointments);
  app.get("/doctor/updateschedule", doctorController.updateschedule);
  app.post("/doctor/updateschedule", doctorController.changeschedule);
  app.get("/doctor/changepassword", doctorController.changepassword);
  app.post("/doctor/changepassword", doctorController.updatepassword);
};
