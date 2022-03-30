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
        {
            method:"GET",
            path:'/getschedule/{username}',
            handler:async (req,res)=>{
                const username=req.params.username;
                const results=await doctors.getDoctorSchedules(username);
                return results;
            }
        },
        {
            method:"PUT",
            path:"/makeschedule",
            handler:async (req,res)=>{
                const patientName=req.payload.patientName;
                const reason=req.payload.reason;
                const scheduleId=req.payload.scheduleId;
                const result=await doctors.makeSchedule(patientName,reason,scheduleId);
                return result;
            }
        },
        {
            method:"GET",
            path:"/patientschedules/{patientname}",
            handler:async (req,res)=>{
                const patientName=req.params.patientname;
                const results=await patients.getPatientSchedules(patientName);
                return results;
            }
        },
        {
            method:"GET",
            path:"/getappointments/{doctorname}",
            handler:async (req,res)=>{
                const doctorName=req.params.doctorname;
                const results=await doctors.getAppointments(doctorName);
                return results;

            }
        },
        {
            method:"PUT",
            path:"/cancelappointment",
            handler:async (req,res)=>{
                const scheduleId=req.payload.scheduleId;
                const result=await patients.cancelAppointment(scheduleId);
                return result;                
            }
        },
        {
            method:"DELETE",
            path:"/deleteschedule/{scheduleId}",
            handler:async (req,res)=>{
                const scheduleId=req.params.scheduleId;
                const result=await doctors.deleteSchedule(scheduleId);
                return result;
            }
        },
        {
            method:"PUT",
            path:"/updatepatient",
            handler:async (req,res)=>{
                const username=req.payload.username;
                const name=req.payload.name;
                const email=req.payload.email;
                const phoneno=req.payload.phoneno;
                const result=await patients.updateProfile(username,name,email,phoneno);
                return result;
            }
        },
        {
            method:"GET",
            path:"/patientdetails/{username}",
            handler:async (req,res)=>{
                const username=req.params.username;
                const results=await patients.patientDetails(username);
                return results;
            }
        }
    ])


    await server.start();
    console.log(`Server started at ${server.info.uri}`);
};
process.on("unhandledRejection", (err) => {
    console.log(err);
    process.exit(1);
  });
init();
