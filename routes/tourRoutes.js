const express = require('express');
const {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  checkId,
  checkTour,
  aliasTopTours,
  getTourstats,
  getMonthlyPlan,
  uploadTourImages,
  resizeTourImages,
} = require('../controllers/tourController');

const authController = require('./../controllers/authController');
const reviewController = require('../controllers/reviewController');
const reviewRoute = require('../routes/reviewRoutes');

const router = express.Router();

// param middleware
router.param('id', (req, res, next, val) => {
  console.log(`Tour id is : ${val}`);
  next();
});

// nested router in express
router.use('/:tourId/reviews', reviewRoute);

router.param('id', checkId);

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

router.route('/tour-stats').get(getTourstats);
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    getMonthlyPlan
  );

router
  .route('/')
  .get(getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    createTour
  );

router
  .route('/:id')
  .get(getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    uploadTourImages,
    resizeTourImages,
    updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    deleteTour
  );

// simple nested routes
// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview
//   );

module.exports = router;
