const express = require('express')
const api = require('./routes/api')
const initDB = require('./db/db')
const cors = require('cors')

const app = express()
initDB()

if (!process.env.PRODUCTION) app.use(cors())
app.use('/api', api)
app.use('/imageUploads', express.static('imageUploads'))

app.listen(8080)

// const filterList = ['Plastic Bag', 'Bottlecap', 'Bottle', 'Cup', 'Plate']
