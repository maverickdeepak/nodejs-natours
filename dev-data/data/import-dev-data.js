const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/toursModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('🟢 DB connection successful!'));

//   read the json file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

// import tour data to database

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('tours successfully loaded to database');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

// delete all data from database
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('tours deleted from database');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
