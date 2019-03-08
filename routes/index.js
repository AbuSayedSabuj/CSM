module.exports = app => {
  require("./doctorRoutes")(app);
  require("./adminRoutes")(app);
  require("./userRoutes")(app);
  require("./staffRoutes")(app);
};
