const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Tour = require('./../../models/tourModel');
const User = require('./../../models/userModel');
const Review = require('./../../models/reviewModel');

dotenv.config({ path: './../../config.env' });
// console.log(process.env.NODE_ENV);
// console.log(process.env.DATABASE);

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    // useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection from dev-data successful'));

// READ JSON FILE

const tours = JSON.parse(
  fs.readFileSync(
    '/Users/praveen/Desktop/WEB DEV/Back End/4-natours/dev-data/data/tours.json',
    'utf-8'
  )
);
const users = JSON.parse(
  fs.readFileSync(
    '/Users/praveen/Desktop/WEB DEV/Back End/4-natours/dev-data/data/users.json',
    'utf-8'
  )
);
const reviews = JSON.parse(
  fs.readFileSync(
    '/Users/praveen/Desktop/WEB DEV/Back End/4-natours/dev-data/data/reviews.json',
    'utf-8'
  )
);

// IMPORT DATA INTO DATABASE

const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DATABASE

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] == '--import') {
  importData();
} else if (process.argv[2] == '--delete') {
  deleteData();
}

// console.log(process.argv);
