//Programmer Name: Mir Naimur Rahman, TP061075
//Program Name: Mongodb connection
//Descrption: Connect with mongodb database
//First written on: 01 October 2023
//Edited on:

const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_LOCAL_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(con => {
      console.log(
        `Mongodb Database connected with Host: ${con.connection.host}`)
    });
};

module.exports = connectDatabase;
