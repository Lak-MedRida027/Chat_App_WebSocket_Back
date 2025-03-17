const mongoose = require("mongoose");

const dbconnection = async() => {
    try{
        const con = await mongoose
        .connect(process.env.DB_URI) 

        console.log(`Connected to MongoDB: ${con.connection.host}`);
    }catch(error){
        console.error(`Error: ${error.message}`);
        process.exit();
    }

};

module.exports = dbconnection;