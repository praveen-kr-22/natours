const { json } = require('express');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const app = express();

// >>>>>> (1)Global  MIDDLEWARE <<<<<<<<<<<<
app.use(cors());
// 1) Set security HTTP header
app.use(helmet());

// 2) Development logging
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('prod'));
}

// 3) Limit requests from same API
const limiter = rateLimit({
  max: 10000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, Please try in an hour !',
});

app.use('/api', limiter);

// 4) Body parser , reading data from the body into req.body
app.use(express.json({ limit: '300kb' })); // middleware, it modify the request data

// 5) Data senitization against NoSQL query injection

app.use(mongoSanitize());

// 6) Data senitization against XSS
app.use(xss());

// 7) Prevent parameter polutions
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// 8) serving static file
app.use(express.static('./public')); //for accesing static file

//  ------ Create our own Middleware -----

// app.use((req, res, next) => {
//   console.log("Hello from the middleware");
//   next();
// });

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

//  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> (2) ROUTES <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
/*
app.get("/", (req, res) => {
  // ------------- send string to the server
  //   res.status(200).send("Hello from server...");

  // -------------- send json to the server
  res.status(200).json({ message: "Hello from server...", app: "Natours" });
});

app.post("/", (req, res) => {
  res.send("You can post to this URL........");
});
*/

//  --------------- TOUR ROUTES ------------
/*
//  _____________ use get request for read data from api _________
app.get("/api/v1/tours", getAllTours);

// ____________ routes which can accepts a variable ________

app.get("/api/v1/tours/:id", getTour);

// _______________ use post request for add/create new data into api _______

app.post("/api/v1/tours", createTour);

// _______________ use PATCH request for modify the api data _______

app.patch("/api/v1/tours/:id", updateTour);

// _______________ use DELETE request for delete the api data _______

app.delete("/api/v1/tours/:id", deleteTour);

*/

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Cann't find ${req.originalUrl} on this server!`,
  // });
  // const err = new Error(`Cann't find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;
  // next(err);

  next(new AppError(`Cann't find ${req.originalUrl} on this server!`, 404));
});

//  Error Handling Middleware.
app.use(globalErrorHandler);

module.exports = app;
