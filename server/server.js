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
            socket.emit('connected')
    })

    //* handeling sending new message
    socket.on('new message', (newMsgRecieved) =>{
        let chat = newMsgRecieved.chat

        if(!chat.users) return console.log('Error no users exist!')
        
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

