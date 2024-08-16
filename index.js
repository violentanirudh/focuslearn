const express = require('express')
const app = express()

// Routers

const ViewsRouter = require('./routes/views')

// Middlewares

app.set('view engine', 'ejs')
app.set('views', './views')

app.use(express.urlencoded({ extended: false }))
app.use('./public/', express.static('public'))

// Routes

app.use('/', ViewsRouter)

// Server

app.listen(3000, () => {
    console.log('Listening On : http://127.0.0.1:3000')
})