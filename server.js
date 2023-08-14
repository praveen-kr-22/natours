process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION!🔥  Shutting down....');
  console.log(err.name, err.message);
  process.exit(1);
});

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');
const { getTour } = require('./controllers/tourController');

// console.log(app.get("env"));
// console.log(process.env);

//  (1) connect mongodb with express.
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
// console.log(DB);

mongoose
  .connect(DB, {
    // .connect(process.env.DATABASE_LOCAL, {    // connect local databse
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    // console.log(con);
    // console.log(con.connection);
    console.log('DB connection successful...');
  });

// const testTour = new Tour({
//   name: 'The Mountain Hike',
//   rating: 4.7,
//   price: 497,
// });

// testTour
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

const PORT = 8000 || process.env.PORT;

const server = app.listen(PORT, () => {
  console.log('Server is running on port 8000......');
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION!🔥  Shutting down....');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// console.log(x);
