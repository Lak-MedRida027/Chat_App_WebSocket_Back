const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const userModel = require("../Models/userModel");

exports.searchOfUsers = asyncHandler(async(req, res) =>{
    // Search Feature
    const keyword = req.query.search;

    const query = keyword ? {
        $or: [
            { name: { $regex: keyword, $options: "i" } },
            { email: { $regex: keyword, $options: "i" } }
        ]
    } : {};

    const users = await userModel.find(query).find({ _id: { $ne: req.user._id} })
    res.status(200).json(users)
})

exports.getAllUsers = asyncHandler(async(req, res) =>{
    const users = await userModel.find({ _id: { $ne: req.user._id} })
    res.status(200).json(users)
})