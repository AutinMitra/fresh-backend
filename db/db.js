const mongoose = require('mongoose')

const URI = 'mongodb://localhost:27017/uploads'

async function initDB() {
  try {
    await mongoose.connect(URI, {
      useNewUrlParser: true,
    });
    console.log("Mongoose connected! :)")
  } catch(err) {
    console.log(`error occured: ${err}`);
    throw err;
  }
}

module.exports = initDB;
