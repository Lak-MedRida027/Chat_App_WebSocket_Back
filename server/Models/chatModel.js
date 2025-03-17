const mongoose = require('mongoose')

const chatModel = new mongoose.Schema({
    chatName:{
        type: String,
        required: [true, "Chat name required"],
        unique: [true, "Chat name must be unique"],
        minlength: [3, "Too less Chat name"],
        maxlength: [32, "Too much Chat name"],
        trim: true
    },
    isGroupChat: {
        type: Boolean,
        default: false
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    latestMessage:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    },
    groupAdmin:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
    },
    {
        timestamps: true
})

const Chat = mongoose.model("Chat", chatModel);

module.exports = Chat;
