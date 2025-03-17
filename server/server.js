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
app.listen(PORT, () =>{
    console.log(`Server running on ${PORT}`)
})