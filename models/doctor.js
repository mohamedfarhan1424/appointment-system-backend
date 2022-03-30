const Connection=require('../dbconfig');
const {DataTypes}=require('sequelize');



const dbconnection=Connection.connect;

const doctors=dbconnection.define('doctors',{
    doctor_id:{
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
    education:{
        type:DataTypes.STRING
    },
    speciality:{
        type:DataTypes.STRING
    }
},{
    freezeTableName:true,
    timestamps:false
});


module.exports.createDoctor=async function(name,email,username,password,phoneno,education,speciality){
    doctors.sync();
    const [results,metaData]=await Connection.connect.query(`SELECT username FROM doctors WHERE username='${username}'`);
    if(results[0]?.username){
        return false;
    }
    else{
        await doctors.create({name,email,username,password,phoneno,education,speciality}).then((data)=>{
            console.log(data.toJSON());
        });
        return true;
    }
}

module.exports.loginCheck=async function(username,password){
    const [results,metaData]=await Connection.connect.query(`SELECT * FROM doctors WHERE username='${username}' AND password='${password}'`);
    if(results[0]?.username){
        return {login:true,name:results[0].name,email:results[0].email,username:results[0].username,phoneno:results[0].phoneno,education:results[0].education,speciality:results[0].speciality};
    }
    else{
        return {login:false}
    }
}


module.exports.addSchedule=async function(scheduleDate,scheduleTime,username,name,education,speciality){
    const [results,metaData]=await Connection.connect.query(`INSERT INTO schedules
    (
    doctor_name,
    doctor_username,
    education,
    speciality,
    schedule_date,
    schedule_time)
    VALUES
    ('${name}','${username}','${education}','${speciality}','${scheduleDate}','${scheduleTime}')
    `);
    return true;
}

module.exports.getDoctorSchedules=async function(username){
    const [results,metaData]=await Connection.connect.query(`SELECT * FROM schedules WHERE doctor_username='${username}'`);
    return results;
}

module.exports.makeSchedule=async function(patientName,reason,scheduleId){
    const [results,metaData]=await Connection.connect.query(`UPDATE schedules SET patient_booked='${patientName}', patient_reason='${reason}' WHERE schedule_id='${scheduleId}'`);
    return true;
}

module.exports.getAppointments=async function(doctorName){
    const [results,metaData]=await Connection.connect.query(`SELECT * FROM schedules WHERE doctor_username='${doctorName}' AND patient_booked is not null`);
    return results;
}

module.exports.deleteSchedule=async function(scheduleId){
    const [results,metaData]=await Connection.connect.query(`DELETE FROM schedules WHERE schedule_id='${scheduleId}'`);
    return true;
}