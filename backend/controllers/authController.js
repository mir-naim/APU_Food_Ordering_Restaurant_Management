//Programmer Name: Mir Naimur Rahman, TP061075
//Program Name: Auth controller API
//Descrption: Creation of all API's implementing GET, POST, PUT, DELETE
//First written on: 01 October 2023
//Edited on:

const User = require("../models/user");

const ErrorHandler = require("../utlis/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const sendToken = require("../utlis/jwtToken");
const sendEmail = require("../utlis/sendEmail");

const crypto = require('crypto');
const cloudinary = require('cloudinary');

//Register a user => /api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {

  const result = await cloudinary.v2.uploader.upload(req.body.avatar,{

    folder :'avatars',
    width: 150,
    crop: "scale"
  })
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: result.public_id,
      url: result.secure_url,
    },
  });

  sendToken(user, 200, res);
});

//Login user => /api/v1/login

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  //checks if email and password is entered by user
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400));
  }

  //Finding user in database
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  //check if password is correct or not
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  sendToken(user, 200, res);
});

//Forgot Password => /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {

  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found  with this email", 404));
  }

  //Get reset token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  //create reset password url

  const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

  const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email,then ignore it`;

try{

    await sendEmail({
        email: user.email,
        subject:'APU Cafe Password Recovery',
        message
    })

    res.status(200).json({
        success: true,
        message: `Email sent to: ${user.email}`
    })

}catch(error){
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500))
}

});

//Reset Password => /api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {

    //Hash URL token 
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')


    const user = await User.findOne({

        resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now()}
    })

    if(!user){
        return next(new ErrorHandler('Password reset token is invalid or has been expired', 400))
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler ('Password does not match', 400))
    }

    //Setup new password
    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res)

})


//Get currently logged in user details => /api/v1/me

exports.getUserProfile = catchAsyncErrors(async (req, res, next)=> {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    })
})

//Update /Change password => /api/v1/password/update
exports.updatePassword = catchAsyncErrors(async (req, res, next)=> {

    const user = await User.findById(req.user.id).select('+password')

    //check previous user password
    const isMatched = await user.comparePassword(req.body.oldPassword)
    if(!isMatched){
        return next(new ErrorHandler('Old password is incorrect', 400));
    }
    user.password = req.body.password;

    await user.save();
    sendToken(user, 200, res)
})

//update user profile => /api/v1/me/update

exports.updateProfile = catchAsyncErrors(async (req, res, next) =>{

  const newUserData ={
    name: req.body.name,
    email: req.body.email
  }

  //update avatar 

  if(req.body.avatar !== ''){
    const user = await User.findById(req.user.id)

    const image_id = user.avatar.public_id;
    const res = await cloudinary.v2.uploader.destroy(image_id);

    const result = await cloudinary.v2.uploader.upload(req.body.avatar,{

      folder :'avatars',
      width: 150,
      crop: "scale"
    })

    newUserData.avatar ={
      public_id: result.public_id,
      url: result.secure_url
    }

  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {

    new: true,
    runValidators: true,
    useFindAndModify:false
  })

  res.status(200).json({
    success: true
  })


})

//logout user => /api/v1/logout

exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out",
  });
});

//Admin Routes

//Get All users => /api/v1/admin/users
exports.allUsers = catchAsyncErrors(async (req, res, next)=>{
  const users = await User.find();

  res.status(200).json({
    success: true,
    users
  })
})

//Get user Details  =>   /api/v1/admin/user/:id
exports.getUserDetails = catchAsyncErrors(async (req, res, next) =>{

  const user = await User.findById(req.params.id);

  if(!user){
    return next(new ErrorHandler(`User does not found with id: ${req.params.id}`))
  }

  res.status(200).json({
    success: true,
    user
  })

})

//update user profile => /api/v1/admin/user/:id

exports.updateUser = catchAsyncErrors(async (req, res, next) =>{

  const newUserData ={
    name: req.body.name,
    email: req.body.email,
    role: req.body.role
  }

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {

    new: true,
    runValidators: true,
    useFindAndModify:false
  })

  res.status(200).json({
    success: true
  })


})

//Delete user   =>   /api/v1/admin/user/:id
exports.deleteUser = catchAsyncErrors(async (req, res, next) =>{

  const user = await User.findById(req.params.id);

  if(!user){
    return next(new ErrorHandler(`User does not found with id: ${req.params.id}`))
  }

  //Remove avatar from cloudinary
  const image_id = user.avatar.public_id;
  await cloudinary.v2.uploader.destroy(image_id);

  await user.deleteOne();

  res.status(200).json({
    success: true
  })

})
