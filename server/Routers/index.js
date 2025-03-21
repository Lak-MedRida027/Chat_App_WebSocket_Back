const authRoute = require('./authRoute')
const userRoute = require('./userRoute')
const chatRoute = require('./chatRoute')
const messageRoute = require('./messageRoute')

const mountRoute = (app) =>{
    app.use('/api/auth', authRoute)
    app.use('/api/users', userRoute)
    app.use('/api/chats', chatRoute)
    app.use('/api/messages', messageRoute)
}


module.exports = mountRoute;