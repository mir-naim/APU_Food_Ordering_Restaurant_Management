//Programmer Name: Mir Naimur Rahman, TP061075
//Program Name:
//Descrption:
//First written on:
//Edited on:


const ErrorHandler = require('../utlis/errorHandler');

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;

    if(process.env.NODE_ENV === 'DEVELOPMENT'){
        res.status(err.statusCode).json({
            success:false,
            error:err,
            errMessage: err.message,
            stack: err.stack
        })
    }

    if(process.env.NODE_ENV === 'PRODUCTION'){

        let error ={...err}
        error.message = err.message

        //Wrong Mongoose Object ID Error
        if(err.name === 'CastError'){
            const message = `Resource not found. Invalid: ${err.path}`
            error = new ErrorHandler(message, 400)
        }

        //Handling Mongoose Validation Error
        if(err.name === 'ValidationError'){
            const message = Object.values(err.errors).map(value => value.message);
            error = new ErrorHandler(message, 400)
        }

        //handling  Mongoose duplicate key errors
        if(err.code === 11000){
            const message = `Duplicate ${Object.keys(err.keyValue)} entered`
            error = new ErrorHandler(message, 400)
        }

        //Handling wrong JWT error
        if(err.name === 'JsonwebTokenError'){
            const message = 'JSON web token is invalid. Try again !!'
            error = new ErrorHandler(message, 400)
        }

        //Handling Expired JWT error
        if(err.name === 'TokenExpiredError'){
            const message = 'JSON web token is expired. Try again !!'
            error = new ErrorHandler(message, 400)
        }

        res.status(error.statusCode).json({
            success: false,
            message : err.message || 'Internal Sever Error'
        })
    }

    
}