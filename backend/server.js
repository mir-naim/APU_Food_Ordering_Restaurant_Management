const app = require('./app')
const connectDatabase = require('./config/database')

const dotenv = require('dotenv');
const cloudinary = require('cloudinary');

//Handle Unncaught exceptions
process.on('uncaughtException', err=>{
    console.log(`Error: ${err.stack}`);
    console.log('Shutting down server due to uncaught exception');
    process.exit(1)
})



//Setting up config file
dotenv.config({path :'backend/config/config.env'})



// Connecting to database
connectDatabase();


//setting up cloudnary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const server = app.listen(process.env.PORT,() =>{
    console.log(`Server stated on PORT : ${process.env.PORT} in ${process.env.NODE_ENV} mode.`)

})

//Handle UnHandledPromise rejection
process.on('unhandledRejection', err => {
    console.log(`Error: ${err.stack}`);
    console.log('Shutting down the server due to Unhandled Promise rejection');
    server.close(() =>{
        process.exit(1)
    })

})