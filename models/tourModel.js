const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
// const User = require('./userModel');
// console.log(validator);

// (2) MODELS and SCHEMA

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tour name is missing'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal than 40 characters'], // this is validator.
      minlength: [10, 'A tour name must have more or equal than 10 characters'],
      // validate: [validator.isAlpha, 'Tour name must only contain characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'Tour durations is missing'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'Tour groupSize is missing'],
    },
    difficulty: {
      type: String,
      required: [true, 'Tour difficulty is missing'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy,medium,difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Tour Price is missing'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this only points to current doc on NEW document creation. this validator is not working on update query.
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'Tour summary is missing'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      // required: [true, "Tour's  cover image is missing"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false, //means not show to user
    },
    secretTour: {
      type: Boolean,
      default: false,
      select: false,
    },
    startDates: [Date],
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        days: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    // reviews: [
    //   {
    //     type: mongoose.Schema.ObjectId,
    //     ref: 'Review',
    //   },
    // ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

// tourSchema.index({ price: 1  });
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });

// virtual is a property that is not stored in MongoDB.
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

// (1) DOCUMENT MIDDLEWARE : it runs before .save() and .create() and not in .insertMany()
// (1.1) pre middleware
tourSchema.pre('save', function (next) {
  // console.log(this); // this keyword refer to currently proccess document.
  this.slug = slugify(this.name, { lower: true });
  next(); // for calling next middleware in stack.
});

// Embadding a data
// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);

//   next();
// });

// tourSchema.pre('save', function (next) {
//   console.log('will save document....');
//   next();
// });

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChagedAt',
  });
  next();
});

// (1.2) post middleware

// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

// (2) QUERY MIDDLEWARE
tourSchema.pre(/^find/, function (next) {
  // tourSchema.pre('find', function (next) {
  // console.log(this);
  this.find({ secretTour: { $ne: true } });
  next();
});

// tourSchema.pre('findOne', function (next) {
//   // console.log(this);
//   this.find({ secretTour: { $ne: true } });
//   next();
// });

// tourSchema.post(/^find/, function (doc, next) {
//   // console.log(doc);
//   next();
// });

// (3) AGGREGATION MIDDLEWARE

tourSchema.pre('aggregate', function (next) {
  // console.log(this.pipeline());
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);
// console.log(Tour);

module.exports = Tour;
