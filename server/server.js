const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')

const dbconnection = require('./config/db')
const mountRoute = require('./Routers')

dotenv.config()

const app = express()

app.use(morgan('dev'))
app.use(express.json())
dbconnection()

//* Mount Routers
mountRoute(app);

const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () =>{
    console.log(`Server running on ${PORT}`)
})

const io = require('socket.io')(server,{
    pingTimeout: 60000,
    cors: {
        origin: 'http://localhost:3000',
    }
})

io.on('connection', (socket) =>{
    //* handeling joining the chat
    socket.on('setup', (userData) =>{
        if(userData){
            socket.join(userData._id)
            console.log(`${userData.name} has joined the chat!`)
            socket.emit('connected')
        }
    })

    //* handeling joining a room
    socket.on('join chat', (room) =>{
        socket.join(room)
        console.log(`User has joined to room: ${room}`)
        console.log(`Socket ${socket.id} joined room ${room}`)
        // Don't emit 'connected' again as it's already emitted in setup
    })

    //* handeling sending new message
    socket.on('new message', (newMsgRecieved) =>{
        let chat = newMsgRecieved.chat
        console.log('New message received:', newMsgRecieved)

        if(!chat.users) return console.log('Error no users exist!')
        
        // Emit to the chat room (for all users in the chat)
        socket.to(chat._id).emit('message recieved', newMsgRecieved)
        
        // Also emit to individual user rooms for notifications
        chat.users.forEach((user) =>{
            if(user._id == newMsgRecieved.sender._id) return;
            socket.in(user._id).emit('message recieved', newMsgRecieved)
        })

    })

    socket.on('typing', (room) => socket.in(room).emit('typing'))
    socket.on('stop typing', (room) => socket.in(room).emit('stop typing'))

    //* handeling finishing the session
    socket.on('finish', (userData) =>{
        if(userData){
            console.log("User DISCONNECTED")
            socket.leave(userData._id)
        }
    })
})

