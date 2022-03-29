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