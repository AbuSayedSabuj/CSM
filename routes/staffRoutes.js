module.exports = app => {
  const staffController = require("../controllers/staff");
  app.post("/staff/signin", staffController.signin);
  app.get("/staff/changepassword", staffController.changepassword);
  app.post("/staff/changepassword", staffController.updatepassword);
  app.get("/staff/home", staffController.home);
  app.get("/staff/leave", staffController.newLeave);
  app.post("/staff/leave", staffController.submitLeave);
  app.get("/staff/myleave", staffController.myLeave);
};
