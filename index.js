"use strict";

const Hapi = require("@hapi/hapi");
const jwt = require("@hapi/jwt");
const dotenv=require('dotenv');
dotenv.config();
const patients = require("./models/patient");
const doctors = require("./models/doctor");
const Connection=require('./dbconfig')
const jwtfunctions = require("./Jwt");



const init = async () => {
  const server = Hapi.Server({
    port:process.env.PORT||8080,
    routes: {
      cors: true,
    },
  });

  await server.register([
    {
      plugin: jwt,
    },
  ]);

  server.route([
    {
      method: "GET",
      path: "/",
      handler: (req, res) => {
        return "Home";
      },
    },
    {
      method: "POST",
      path: "/patientsignup",
      handler: async (req, res) => {
        const name = req.payload.name;
        const email = req.payload.email;
        const username = req.payload.username;
        const password = req.payload.password;
        const phoneno = req.payload.phoneno;
        const usercreated = await patients.createPatient(
          name,
          email,
          username,
          password,
          phoneno
        );
        if (usercreated) {
          const accessToken = jwt.token.generate(
            username,
            process.env.ACCESS_TOKEN_SECRET
          );
          return { usercreated: usercreated, accessToken: accessToken };
        }
        return { usercreated: usercreated };
      },
    },
    {
      method: "POST",
      path: "/doctorsignup",
      handler: async (req, res) => {
        const name = req.payload.dname;
        const email = req.payload.demail;
        const username = req.payload.dusername;
        const password = req.payload.dpassword;
        const phoneno = req.payload.dphoneno;
        const education = req.payload.deducation;
        const speciality = req.payload.dspeciality;
        const doctorcreated = await doctors.createDoctor(
          name,
          email,
          username,
          password,
          phoneno,
          education,
          speciality
        );
        if (doctorcreated) {
          const accessToken = jwt.token.generate(
            username,
            process.env.ACCESS_TOKEN_SECRET
          );
          return { doctorcreated: doctorcreated, accessToken: accessToken };
        }
        return { doctorcreated: doctorcreated };
      },
    },
    {
      method: "POST",
      path: "/patientlogin",
      handler: async (req, res) => {
        const username = req.payload.username;
        const password = req.payload.password;
        const login = await patients.loginCheck(username, password);
        if (login.login) {
          const accessToken = jwt.token.generate(
            username,
            process.env.ACCESS_TOKEN_SECRET
          );
          return { login: login, accessToken: accessToken };
        }
        return login;
      },
    },
    {
      method: "POST",
      path: "/doctorlogin",
      handler: async (req, res) => {
        const username = req.payload.dusername;
        const password = req.payload.dpassword;
        const login = await doctors.loginCheck(username, password);
        if (login.login) {
          const accessToken = jwt.token.generate(
            username,
            process.env.ACCESS_TOKEN_SECRET
          );
          return { login: login, accessToken: accessToken };
        }
        return login;
      },
    },
    {
      method: "GET",
      path: "/getallschedules",
      handler: async (req, res) => {
        const token = jwtfunctions.getToken(req);
        if (token == null) return res.response().code(403);
        const decodedToken = jwt.token.decode(token);
        const isValid = jwtfunctions.verifyToken(
          decodedToken,
          process.env.ACCESS_TOKEN_SECRET
        );
        if (isValid) {
          const results = await patients.getAllSchedules();
          return results;
        }
        return res.response().code(403);
      },
    },
    {
      method: "POST",
      path: "/addschedule",
      handler: async (req, res) => {
        const token = jwtfunctions.getToken(req);
        if (token == null) return res.response().code(403);
        const decodedToken = jwt.token.decode(token);
        const isValid = jwtfunctions.verifyToken(
          decodedToken,
          process.env.ACCESS_TOKEN_SECRET
        );
        if (isValid) {
          const scheduleDate = req.payload.scheduleDate;
          const scheduleTime = req.payload.scheduleTime;
          const username = req.payload.username;
          const name = req.payload.name;
          const education = req.payload.education;
          const speciality = req.payload.speciality;

          const result = await doctors.addSchedule(
            scheduleDate,
            scheduleTime,
            username,
            name,
            education,
            speciality
          );
          return result;
        }
        return res.response().code(403);
      },
    },
    {
      method: "GET",
      path: "/getschedule/{username}",
      handler: async (req, res) => {
        const token = jwtfunctions.getToken(req);
        if (token == null) return res.response().code(403);
        const decodedToken = jwt.token.decode(token);
        const isValid = jwtfunctions.verifyToken(
          decodedToken,
          process.env.ACCESS_TOKEN_SECRET
        );
        if (isValid) {
          const username = req.params.username;

          const results = await doctors.getDoctorSchedules(username);

          return results;
        }
        return res.response().code(403);
      },
    },
    {
      method: "PUT",
      path: "/makeschedule",
      handler: async (req, res) => {
        const token = jwtfunctions.getToken(req);
        if (token == null) return res.response().code(403);
        const decodedToken = jwt.token.decode(token);
        const isValid = jwtfunctions.verifyToken(
          decodedToken,
          process.env.ACCESS_TOKEN_SECRET
        );
        if (isValid) {
          const patientName = req.payload.patientName;
          const reason = req.payload.reason;
          const scheduleId = req.payload.scheduleId;

          const result = await doctors.makeSchedule(
            patientName,
            reason,
            scheduleId
          );
          return result;
        }
        return res.response().code(403);
      },
    },
    {
      method: "GET",
      path: "/patientschedules/{patientname}",
      handler: async (req, res) => {
        const token = jwtfunctions.getToken(req);
        if (token == null) return res.response().code(403);
        const decodedToken = jwt.token.decode(token);
        const isValid = jwtfunctions.verifyToken(
          decodedToken,
          process.env.ACCESS_TOKEN_SECRET
        );
        if (isValid) {
          const patientName = req.params.patientname;

          const results = await patients.getPatientSchedules(patientName);
          return results;
        }
        return res.response().code(403);
      },
    },
    {
      method: "GET",
      path: "/getappointments/{doctorname}",
      handler: async (req, res) => {
        const token = jwtfunctions.getToken(req);
        if (token == null) return res.response().code(403);
        const decodedToken = jwt.token.decode(token);
        const isValid = jwtfunctions.verifyToken(
          decodedToken,
          process.env.ACCESS_TOKEN_SECRET
        );
        if (isValid) {
          const doctorName = req.params.doctorname;

          const results = await doctors.getAppointments(doctorName);
          return results;
        }
        return res.response().code(403);
      },
    },
    {
      method: "PUT",
      path: "/cancelappointment",
      handler: async (req, res) => {
        const token = jwtfunctions.getToken(req);
        if (token == null) return res.response().code(403);
        const decodedToken = jwt.token.decode(token);
        const isValid = jwtfunctions.verifyToken(
          decodedToken,
          process.env.ACCESS_TOKEN_SECRET
        );
        if (isValid) {
          const scheduleId = req.payload.scheduleId;
          const result = await patients.cancelAppointment(scheduleId);
          return result;
        }
        return res.respone().code(403);
      },
    },
    {
      method: "DELETE",
      path: "/deleteschedule/{scheduleId}",
      handler: async (req, res) => {
        const token = jwtfunctions.getToken(req);
        if (token == null) return res.response().code(403);
        const decodedToken = jwt.token.decode(token);
        const isValid = jwtfunctions.verifyToken(
          decodedToken,
          process.env.ACCESS_TOKEN_SECRET
        );
        if (isValid) {
          const scheduleId = req.params.scheduleId;
          const result = await doctors.deleteSchedule(scheduleId);
          return result;
        }
        return res.response().code(403);
      },
    },
    {
      method: "PUT",
      path: "/updatepatient",
      handler: async (req, res) => {
        const token = jwtfunctions.getToken(req);
        if (token == null) return res.response().code(403);
        const decodedToken = jwt.token.decode(token);
        const isValid = jwtfunctions.verifyToken(
          decodedToken,
          process.env.ACCESS_TOKEN_SECRET
        );
        if (isValid) {
          const username = req.payload.username;
          const name = req.payload.name;
          const email = req.payload.email;
          const phoneno = req.payload.phoneno;
          const result = await patients.updateProfile(
            username,
            name,
            email,
            phoneno
          );
          return result;
        }
        return res.response().code(403);
      },
    },
    {
      method: "PUT",
      path: "/updatedoctor",
      handler: async (req, res) => {
        const token = jwtfunctions.getToken(req);
        if (token == null) return res.response().code(403);
        const decodedToken = jwt.token.decode(token);
        const isValid = jwtfunctions.verifyToken(
          decodedToken,
          process.env.ACCESS_TOKEN_SECRET
        );
        if (isValid) {
          const username = req.payload.username;
          const name = req.payload.name;
          const email = req.payload.email;
          const phoneno = req.payload.phoneno;
          const education = req.payload.education;
          const speciality = req.payload.speciality;
          const results = await doctors.updateProfile(
            username,
            name,
            email,
            phoneno,
            education,
            speciality
          );
          return results;
        }
        return res.response().code(403);
      },
    },
  ]);

  Connection.connect.authenticate().then(()=>{await server.start()});
  console.log(`Server started at ${server.info.uri}`);
};
process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});
//heroku logs -a appointment-system-back --tail
init();
