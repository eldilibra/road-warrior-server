var express = require('express');
var db = require('../db');

var app = module.exports = express();

app.get('/makes', function (req, res) {
  db.trips.findAllMakes(function (err, makes) {
    if (err) throw err;
    res.json(makes);
  });
});

app.get('/models/:make', function (req, res) {
  var make = req.params.make;
  db.trips.findModelsByMake(make, function (err, models) {
    if (err) throw err;
    res.json(models);
  });
});

app.get('/averages/:make/:model', function (req, res) {
  var make = req.params.make;
  var model = req.params.model;
  db.trips.findAveragesMakeModel(make, model, function (err, avgs) {
    if (err) throw err;
    res.json(avgs);
  });
});
