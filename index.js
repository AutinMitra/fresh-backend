const express = require('express')
const api = require('./routes/api')
const initDB = require('./db/db')

const app = express()
initDB()

// app.use(require('body-parser'))
app.use('/api', api)

app.listen(8080)

