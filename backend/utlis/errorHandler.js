//Programmer Name: Mir Naimur Rahman, TP061075
//Program Name:
//Descrption:
//First written on:
//Edited on:

//Error Handler Class
class ErrorHandler extends Error{
    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode

        Error.captureStackTrace(this, this.constructor)
    }
}


module.exports = ErrorHandler;