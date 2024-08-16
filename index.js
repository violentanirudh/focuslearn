const express = require('express')
const app = express()

app.get('/', (req, res) => {
    res.send('Home')
})

app.listen(3000, () => {
    console.log('Listening On : http://127.0.0.1:3000')
})