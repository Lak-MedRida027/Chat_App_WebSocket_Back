const asyncHandler = require("express-async-handler");

const userModel = require("../Models/userModel");
const chatModel = require("../Models/chatModel");

exports.createOrAccessChat = asyncHandler(async (req, res) =>{
    const { userId } = req.body

    if(!userId){
        res.status(400)
        throw new Error("Please provide userId!")
    }

    let chat = await chatModel.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } }},
            { users: { $elemMatch: { $eq: userId } }}
        ]
    })  .populate("users", "-password")
        .populate('latestMessage')


    // populate the sender field inside the latestMessage object
    chat = await userModel.populate(chat, {
        path: 'latestMessage.sender',   // Specifies the path to the field to populate
        select: 'name image email'
    })

    if(chat.length > 0){
        res.status(200).send(chat[0])
    }else{
        //if chat does not exist create it
        try{
            const user = await userModel.findById(userId)

            const createChat = await chatModel.create({
                chatName: `${req.user.name} and ${user.name}`,
                isGroupChat: false,
                users: [req.user._id, userId],
            })

            const newChat = await chatModel.find({ _id: createChat._id})
            .populate("users", "-password")

            res.status(201).send(newChat)
        }catch(err){
            res.status(400)
            throw new Error("Failed to create chat!")
        }
    }
})

exports.getAllChats = asyncHandler(async(req, res) =>{
    try{
        let chats = await chatModel.find({
            users: { $elemMatch: { $eq: req.user._id } }
        })
        .populate("users", "-password")
        .populate('latestMessage')
        .populate('groupAdmin', "-password")
        .sort({ updateAt: -1 })

        chats = await userModel.populate(chats, {
            path: 'latestMessage.sender',   
            select: 'name image email'
        })


        res.status(200).send(chats)
    }catch(error){
        res.status(400)
        throw new Error("Failed to get chats!")
    }
})

exports.createGroup = asyncHandler(async(req, res) =>{
    if(!req.body.name || !req.body.users){
        res.status(400)
        throw new Error("Please fill all feilds!")
    }

    let users = JSON.parse(req.body.users)

    if(users.length < 2){
        res.status(400)
        throw new Error("Group must have at least two users!")
    }

    users.push(req.user._id)

    try{
        const createGroup = await chatModel.create({
            chatName: req.body.name,
            isGroupChat: true,
            users: users,
            groupAdmin: req.user
        })

        const newGroup = await chatModel.findById(createGroup._id)
        .populate("users", "-password")
        .populate('groupAdmin', "-password")

        res.status(201).send(newGroup)
    }catch(error){
        res.status(400)
        throw new Error("Failed to create group!")
    }
})

exports.renameGroup = asyncHandler(async(req, res) =>{
    const { chatId, chatName } = req.body 

    const updatedGroup = await chatModel.findByIdAndUpdate(
        chatId,
        { 
            chatName
        },{
            new: true
        })
        .populate("users", "-password")
        .populate('groupAdmin', "-password")

    if(!updatedGroup){
        res.status(404)
        throw new Error("Group not found!")
    }else{
        res.status(200).send(updatedGroup)
    }
})

exports.AddToGroup = asyncHandler(async(req, res) =>{
    const { chatId, userId } = req.body 

    const existUser = await userModel.findById(userId)

    if(!existUser){
        res.status(404)
        throw new Error("UserId not exist!")
    }

    const newGroup = await chatModel.findByIdAndUpdate(
        chatId,
        { 
            $push: { users: userId }
        },{
            new: true
        })
        .populate("users", "-password")
        .populate('groupAdmin', "-password")

    if(!newGroup){
        res.status(404)
        throw new Error("Group not found!")
    }else{
        res.status(200).send(newGroup)
    }
})

exports.removeFromGroup = asyncHandler(async(req, res) =>{
    const { chatId, userId } = req.body 

    const existUser = await userModel.findById(userId)

    if(!existUser){
        res.status(404)
        throw new Error("UserId not exist!")
    }

    const newGroup = await chatModel.findByIdAndUpdate(
        chatId,
        { 
            $pull: { users: userId }
        },{
            new: true
        })
        .populate("users", "-password")
        .populate('groupAdmin', "-password")

    if(!newGroup){
        res.status(404)
        throw new Error("Group not found!")
    }else{
        res.status(200).send(newGroup)
    }
})