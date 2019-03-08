const mongoose=require('mongoose')
mongoose.connect('mongodb://localhost/hubdb')
const db=mongoose.connection;
const schema=mongoose.Schema;
const doctorSchema=new schema({
    fullname:String,
    email:String,
    phone:String,
    password:String,
    degs:String,
    department:String,
    available:String,
    gender:String,
    visitingdays:[String],
    joindate:[String],
    starttime:String,
    endtime:String,
    end:String,
    address:String
})
module.exports.doctor=mongoose.model('doctor',doctorSchema);

db.on('error',(err)=>{
    console.log('error');
})
db.once('open',()=>{
    console.log('DB connected Successfully');
})