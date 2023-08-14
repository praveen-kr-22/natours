const reviewController = require('../controllers/reviewController');
const express = require('express');
const authController = require('../controllers/authController');
const Review = require('../models/reviewModel');

const router = express.Router({
  mergeParams: true,
});

router.use(authController.protect);

router
  .route('/')
  .get(reviewController.getAllReview)
  .post(
    authController.restrictTo('user'),
    reviewController.setTourUserId,
    reviewController.createReview
  );

router
  .route('/:id')
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview
  )
  .get(reviewController.getReview);

module.exports = router;
