module.exports = app => {
  const userController = require("../controllers/userController");
  app.get("/user/changepassword", userController.changepassword);
  app.post("/user/changepassword", userController.updatepassword);
  app.get("/user/myappointment", userController.myappointment);
  app.get("/forgot-password", (req, res) => {
    res.render("forgetPassword");
  });
  app.post("/forgot-password", userController.forgotpassword);
  app.post("/reset-password", userController.resetpassword);
  app.post("/final-reset", userController.reset);
};
