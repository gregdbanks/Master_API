const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Load Model
const Bootcamp = require('./models/Bootcamps');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Read JSON
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, `utf-8`)
);

// Import into DB
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    console.log('hey you are fully loaded bruh'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data from DB
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    console.log('Its gone, whew'.red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}