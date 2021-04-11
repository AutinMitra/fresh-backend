const mongoose = require('mongoose')

const UploadSchema = new mongoose.Schema({
  imagePath: {
    type: String,
    required: true,
  },
  lat: {
    type: Number,
    required: true,
  },
  lng: {
    type: Number,
    required: true,
  },
  label: {
    type: String,
    required: true
  },
  uuid: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Upload', UploadSchema)
