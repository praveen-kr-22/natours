const stripe = require('stripe')(process.env.STRIPE_SECTRET_KEY);
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
// const image = require('../dev-data/img/praveen.jpg');
exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked tour

  const tour = await Tour.findById(req.params.tourID);
  // 2) Create CheackOut session

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/`,
    cancel_url: `${req.protocol}://${req.get('host')}/tours`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourID,
    mode: 'payment',
    line_items: [
      {
        price_data: {
          product_data: { name: `${tour.name} Tour` },
          //   description: tour.summary,
          //   images: [
          //     `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJVWMeyCu5_rDcFqtGZRRCoZ283xEEhIFZ8O96W9NzTQ&s`,
          //   ],
          unit_amount: tour.price,
          currency: 'usd',
        },
        quantity: 1,
      },
    ],
  });

  // 3) Create session as response
  res.status(200).json({
    status: 'success',
    session,
  });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  const { tour, user, price } = req.query;
  if (!tour && !user && !price) {
    return next();
  }
  await Booking.create({ tour, user, price });

  next();
});
