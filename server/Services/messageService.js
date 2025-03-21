const asyncHandler = require("express-async-handler");
const messageModel = require("../Models/messageModel");
const userModel = require("../Models/userModel");
const chatModel = require("../Models/chatModel");


exports.sendMessage = asyncHandler(async(req, res) =>{
    const { content, chatId} = req.body

    if(!content || !chatId){
        res.status(400)
        throw new Error("Please provide content and chatId!")
    }

    try {
        let newMessage = await messageModel.create({
            content,
            sender: req.user._id,
            chat: chatId
        })
    
        newMessage = await newMessage.populate("sender", "name image")
        newMessage = await newMessage.populate("chat")
        newMessage = await userModel.populate(newMessage,{
            path: 'chat.users',
            select: 'name image email'
        })
    
        await chatModel.findByIdAndUpdate(chatId, {
            latestMessage: newMessage
        })
    
        res.status(201).json(newMessage)
    } catch (error){
        res.status(400)
        throw new Error("Failed to send message!")
    }
})

exports.getAllMessages = asyncHandler(async(req, res) =>{
    try {
        const messages = await messageModel.find({ chat: req.params.chatId })
            .populate('sender', "name image email")
            .populate('chat')
        
        
        res.status(200).json(messages)
    } catch (error){
        res.status(400)
        throw new Error("Failed to get messages!")
    }
})