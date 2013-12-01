var csv = require('csv');
var mongo = require('mongojs');
var config = require('../config');
var db = mongo(config.mongo_url);
var ObjectId = mongo.ObjectId;

var trips = db.collection('trips');

csv()
.from.path(__dirname + '/DRIVE_DATA.csv')
.to.array(function (data) {
  data.forEach(function (row, index) {
    if (index === 0) return;
    var trip = {
      trip_id: parseInt(row[0]),
      vehicle_id: parseInt(row[1]),
      vehicle_make: row[2].toLowerCase(),
      vehicle_model: row[3].toLowerCase(),
      vehicle_year: parseInt(row[4]),
      miles_per_gallon: parseFloat(row[12]),
      average_speed: parseFloat(row[15]),
      average_rpm: parseFloat(row[17])
    };
    trips.save(trip, function (err) {
      console.log('saved', trip.trip_id);
    });
  });
});
