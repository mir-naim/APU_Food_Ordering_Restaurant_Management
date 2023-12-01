//Programmer Name: Mir Naimur Rahman, TP061075
//Program Name:
//Descrption:
//First written on:
//Edited on:

const express = require('express');
const app = express();
const dotenv = require('dotenv');

const cookieParser = require('cookie-parser');
const bodyparser = require('body-parser');
const fileUpload = require('express-fileupload');



const errorMiddleware = require('./middlewares/errors')

//Setting up config file
dotenv.config({path :'backend/config/config.env'})

app.use(express.json());
app.use(bodyparser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(fileUpload());


// Import all routes
const products = require('./routes/product');
const auth = require('./routes/auth');
const payment = require('./routes/payment');
const order = require('./routes/order');


app.use('/api/v1', products)
app.use('/api/v1', auth)
app.use('/api/v1', payment)
app.use('/api/v1', order)


//Middleware to handle errors
app.use(errorMiddleware);


module.exports = app