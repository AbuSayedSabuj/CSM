const mongoose = require("mongoose");
mongoose.connect(
  "mongodb://localhost/ams",
  { useNewUrlParser: true }
);
const db = mongoose.connection;
const schema = mongoose.Schema;
const appointmentSchema = new schema({
  date: String,
  time: String,
  appliedTime: {
    type: Date,
    default: Date.now()
  },
  doctor: Object,
  description: String,
  user: Object,
  status: String,
  serial: Number
});
appointmentSchema.methods.getTime = function () {
  const dt = new Date(this.appliedTime);
  return (
    dt.getDate() +
    "/" +
    dt.getMonth() +
    "/" +
    dt.getFullYear() +
    ": " +
    dt.getHours() +
    "-" +
    dt.getMinutes()
  );
};
//admin only have email
const adminSchema = new schema({
  name: {
    default: "Super Admin",
    type: String
  },
  email: String,
  password: String,
  role: {
    default: 0,
    type: Number
  },
  staff: {
    type: Boolean,
    default: true
  },
  account: {
    type: Boolean,
    default: true
  },
  admin: {
    type: Boolean,
    default: true
  },
  seat: {
    type: Boolean,
    default: true
  },
  doctor: {
    type: Boolean,
    default: true
  },
  appointment: {
    type: Boolean,
    default: true
  },
  user: {
    type: Boolean,
    default: true
  }
});
const doctorSchema = new schema({
  name: String,
  age: Number,
  email: String,
  gender: String,
  phone: String,
  address: String,
  password: String,
  designation: String,
  department: String,
  Join_date: String,
  fee: Number,
  start_time: String,
  end_time: String,
  available: Boolean,
  visiting_days: [String],
  fee: Number
});
const staffSchema = new schema({
  name: String,
  age: Number,
  email: String,
  gender: String,
  phone: String,
  address: String,
  password: String,
  Join_date: String,
  salary: Number,
  start_time: String,
  end_time: String,
  available: {
    type: Boolean,
    default: true
  },
  duty_days: [String]
});
const userSchema = new schema({
  name: String,
  age: Number,
  email: String,
  password: String,
  gender: String,
  phone: String,
  address: String,
  date: String,
  block: {
    type: Boolean,
    default: false
  }
});

const leaveSchema = new schema({
  staff: Object,
  type: String,
  from: String,
  to: String,
  details: String,
  aproved: {
    type: Boolean,
    default: false
  }
});
const feedbackSchema = new schema({
  type: String,
  name: String,
  email: String,
  contact: String,
  details: String,
  seen: {
    type: Boolean,
    default: false
  }
});
const emergencySchema = new schema({
    name:String,
    age:Number,
    gender: String,
    phone:Number,
    address:String,
    department:String
});
const seatSchema = new schema({
  type: String,
  total: Number,
  available: Number
});
module.exports.feedback = mongoose.model("feedback", feedbackSchema);
module.exports.emergency = mongoose.model("emergency", emergencySchema);
module.exports.user = mongoose.model("user", userSchema);
module.exports.doctor = mongoose.model("doctor", doctorSchema);
module.exports.appointment = mongoose.model("appointment", appointmentSchema);
module.exports.admin = mongoose.model("admin", adminSchema);
module.exports.staff = mongoose.model("staff", staffSchema);
module.exports.leave = mongoose.model("leave", leaveSchema);
module.exports.seat = mongoose.model("seat", seatSchema);
db.on("error", err => {
  console.log("error");
});
db.once("open", () => {
  console.log("Successful");
});
