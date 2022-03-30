const Connection=require('../dbconfig');
const {DataTypes}=require('sequelize');



const dbconnection=Connection.connect;

const patients=dbconnection.define('patients',{
    patient_id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    name:{
        type:DataTypes.STRING
    },
    email:{
        type:DataTypes.STRING
    },
    username:{
        type:DataTypes.STRING,
    },
    password:{
        type:DataTypes.STRING
    },
    phoneno:{
        type:DataTypes.STRING
    },
},{
    freezeTableName:true,
    timestamps:false
});

module.exports.createPatient=async function(name,email,username,password,phoneno){
    patients.sync();
    const [results,metaData]=await Connection.connect.query(`SELECT username from patients where username='${username}'`);
    console.log(results);
    if(results[0]?.username){
        return false;
    }
    else{
        await patients.create({name,email,username,password,phoneno}).then((data)=>{
            console.log(data.toJSON());
        });
        return true;
    }
}

module.exports.loginCheck=async function(username,password){
    const [results,metaData]=await Connection.connect.query(`SELECT * FROM patients WHERE username='${username}' AND password='${password}'`);
    if(results[0]?.username){
        return {login:true,name:results[0].name,email:results[0].email,username:results[0].username,phoneno:results[0].phoneno};
    }
    else{
        return {login:false}
    }
}

module.exports.getAllSchedules=async function(){
 
    const [results,metaData]=await Connection.connect.query(`SELECT * FROM schedules WHERE patient_booked is null`);
    return results;

    
}

module.exports.getPatientSchedules=async function(patientName){
    const [results,metaData]=await Connection.connect.query(`SELECT * FROM schedules WHERE patient_booked='${patientName}'`);
    return results;
}

module.exports.cancelAppointment=async function(scheduleId){
    const [results,metaData]=await Connection.connect.query(`UPDATE schedules SET patient_booked=null , patient_reason=null WHERE schedule_id='${scheduleId}'`)
    return true;
}

module.exports.updateProfile=async function(username,name,email,phoneno){
    const [results,metaData]=await Connection.connect.query(`UPDATE patients SET name='${name}' , email='${email}' , phoneno='${phoneno}' WHERE username='${username}'`);
    return true;
}

module.exports.patientDetails=async function(username){
    const [results,metaData]=await Connection.connect.query(`SELECT * FROM patients WHERE username='${username}'`);
    return results;
}