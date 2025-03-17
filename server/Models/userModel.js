const mongoose = require('mongoose')
const bcrypt = require("bcryptjs");

const userModel = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "User name required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password required"],
        minlength: [6, "Too short password"],
    },
    image:{
        type: String,
        default: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
    }
    },
    {
        timestamps: true
})

userModel.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    // Hashing user password
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

const User = mongoose.model("User", userModel);

module.exports = User;
