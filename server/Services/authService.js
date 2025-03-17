const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const generateToken = require('../utils/createToken')

const userModel = require("../Models/userModel");


//  @desc SignUp
//  @route POSt /api/users
exports.signUp = asyncHandler(async(req, res, next) =>{
    const { name, email, password, image} = req.body

    if(!name || !email || !password){
        res.status(404)
        throw new Error("Please complete all the information")
    }

    const userExist = await userModel.findOne({ email})

    if(userExist){
        res.status(404)
        throw new Error("Already exist user!")
    }

    const user = await userModel.create({ name, email, password, image })

    if(user){
        res.status(201).json({ message: "User signed up successfully!", user, token: generateToken(user._id)})
    }else{
        res.status(404)
        throw new Error("Failed to create user!")
    }
});

//  @desc LogIn
//  @route POSt /api/users
exports.logIn = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body

    const user = await userModel.findOne({ email })

    if(!user && !(await bcrypt.compare(req.body.password, user.password))){
        res.status(404)
        throw new Error("Email or password are incorrect!")
    }else{
        res.status(200).json({ message: "User loged in successfully!", user, token: generateToken(user._id)})
    }
})