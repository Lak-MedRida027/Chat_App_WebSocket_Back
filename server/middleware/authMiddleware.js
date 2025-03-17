const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const userModel = require("../Models/userModel");

// @desc make sure that the user logged in
exports.protect = asyncHandler(async (req, res, next) => {
    //  1) check if token exist, if exist catch it
    let token;

    if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Beare")
    ) {
    token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        res.status(401);
        throw new Error("Not authorized, token is required");
    }

    //  2) verify token (no change happens, expired token)
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    //  3) check if user exists
    const currentUser = await userModel.findById(decoded.userId);

    if (!currentUser) {
        res.status(401);
        throw new Error("The user that belong to this token does no longer exist");
    }

    req.user = currentUser;
    next();
});