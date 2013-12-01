var mongo = require('mongojs');
var config = require('../config');
var db = mongo(config.mongo_url);
var ObjectId = mongo.ObjectId;

var trips = db.collection('trips');

var Trips = module.exports = {};

Trips.findAllMakes = function (callback) {
  trips.distinct('vehicle_make', function (err, makes) {
    callback(err, makes);
  });
};

Trips.findModelsByMake = function (make, callback) {
  trips.distinct('vehicle_model', { vehicle_make: make },
    function (err, models) {
      callback(err, models);
    });
};

Trips.findAveragesMakeModel = function (make, model, callback) {
  trips.group({
    key: {
      vehicle_make: 1,
      vehicle_model: 1
    },
    cond: {
      vehicle_make: make,
      vehicle_model: model
    },
    reduce: function (cur, result) {
      result.mpg_total += parseFloat(cur.miles_per_gallon);
      result.mpg_count++;
    },
    initial: {
      mpg_total: 0,
      mpg_count: 0,
    },
    finalize: function (result) {
      result.mpg_average = result.mpg_total / result.mpg_count;
    }
  }, function (err, avg) {
    avg = avg[0];
    trips.find({ vehicle_make: make, vehicle_model: model })
    .sort({ miles_per_gallon: -1 })
    .limit(1, function (second_err, doc) {
      doc = doc[0];
      if (second_err && !err) {
        err = second_err;
      }
      avg.optimum_speed = doc.average_speed;
      avg.optimum_rpm = doc.average_rpm;
      callback(err, avg);
    });
  });
};
