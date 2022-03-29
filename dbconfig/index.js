const Sequelize=require('sequelize');
const dontenv=require('dotenv');
dontenv.config();

const sequelize=new Sequelize(process.env.DB_NAME,process.env.DB_USER_NAME,process.env.DB_PASSWORD,{
    host:process.env.DB_HOST,
    port:process.env.DB_PORT,
    dialect:'mysql',
});

// const sequelize=new Sequelize('sql6480066','sql6480066','Hxai4ttrur',{
//     host:'sql6.freesqldatabase.com',
//     port:3306,
//     dialect:'mysql',
// });
module.exports.connect=sequelize;
// module.exports.getUsers=async function(){
//     try{
//         await sequelize.authenticate();
//         return "Connected"
//     }catch(err){
//         console.log('Cannot Connect!');
//     }
// }