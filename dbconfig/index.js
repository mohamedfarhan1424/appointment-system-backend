const Sequelize=require('sequelize');
const dontenv=require('dotenv');
dontenv.config();

const sequelize=new Sequelize(process.env.DB_NAME,process.env.DB_USER_NAME,process.env.DB_PASSWORD,{
    host:process.env.DB_HOST,
    port:process.env.DB_PORT,
    dialect:'mysql',
});



module.exports.connect=sequelize;

// module.exports.getUsers=async function(){
//     try{
//         await sequelize.authenticate();
//         return "Connected"
//     }catch(err){
//         console.log('Cannot Connect!');
//     }
// }