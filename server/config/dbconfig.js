const mongoose=require("mongoose")
const dbconnect=()=>{
    mongoose.connect(process.env.DBURL+"/modernmuse")
    .then(()=>{
        console.log("DB connected successfully")
    })
    .catch(err=>{
        console.error(err);
    })
}
module.exports=dbconnect