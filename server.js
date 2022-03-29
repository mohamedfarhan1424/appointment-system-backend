"use strict";


const Hapi=require('@hapi/hapi');
const Connection=require('./dbconfig');
const patients=require('./models/patient')
const doctors=require('./models/doctor')
const init=async ()=>{
    const server=Hapi.Server({
        host:'localhost',
        port:8080,
        routes: {
            cors:true
          },
    });

    server.route([
        {
            method:"GET",
            path:'/',
            handler:(req,res)=>{
                return "Home";
            }
        },
        {
            method:"POST",
            path:'/patientsignup',
            handler:async (req,res)=>{
                const name=req.payload.name;
            const email=req.payload.email;
            const username=req.payload.username;
            const password=req.payload.password;
            const phoneno=req.payload.phoneno;
            const usercreated=await patients.createPatient(name,email,username,password,phoneno);
            return {usercreated:usercreated};
            }
        },
        {
            method:"POST",
            path:'/doctorsignup',
            handler:async (req,res)=>{
                const name=req.payload.dname;
            const email=req.payload.demail;
            const username=req.payload.dusername;
            const password=req.payload.dpassword;
            const phoneno=req.payload.dphoneno;
            const education=req.payload.deducation;
            const speciality=req.payload.dspeciality;
            const doctorcreated=await doctors.createDoctor(name,email,username,password,phoneno,education,speciality);
            return {doctorcreated:doctorcreated};

            }
        },
        {
            method:"POST",
            path:"/patientlogin",
            handler:async (req,res)=>{
                const username=req.payload.username;
                const password=req.payload.password;
                const login=await patients.loginCheck(username,password);
                return login;
            }
        },
        {
            method:"POST",
            path:"/doctorlogin",
            handler:async (req,res)=>{
                const username=req.payload.dusername;
                const password=req.payload.dpassword;
                const login=await doctors.loginCheck(username,password);
                return login;
            }
        },
        {
            method:"GET",
            path:"/getallschedules",
            handler:async (req,res)=>{
                const results=await patients.getAllSchedules();
                return results;
            }
        },
        {
            method:"POST",
            path:'/addschedule',
            handler:async (req,res)=>{
                const scheduleDate=req.payload.scheduleDate;
                const scheduleTime=req.payload.scheduleTime;
                const username=req.payload.username;
                const name=req.payload.name;
                const education=req.payload.education;
                const speciality=req.payload.speciality;
                const result = await doctors.addSchedule(scheduleDate,scheduleTime,username,name,education,speciality)
                return result;
            }
        },
    ])


    await server.start();
    console.log(`Server started at ${server.info.uri}`);
};
process.on("unhandledRejection", (err) => {
    console.log(err);
    process.exit(1);
  });
init();
