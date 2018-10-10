'use strict'

var async = require('async')
module.exports = function (app) {
  // data sources
  var db = app.dataSources.db
  // create all models
  async.parallel({
    coffeeShops: async.apply(createCoffeeShops)
  }, function (err, results) {
    if (err) throw err
    console.log('> models created sucessfully')
  })
  // create coffee shops
  function createCoffeeShops (cb) {
    db.automigrate('CoffeeShop', function (err) {
      if (err) return cb(err)
      var CoffeeShop = app.models.CoffeeShop
      CoffeeShop.create([{
        name: 'Bel Cafe',
        city: 'Vancouver'
      }, {
        name: 'Three Bees Coffee House',
        city: 'San Mateo'
      }, {
        name: 'Caffe Artigiano',
        city: 'Vancouver'
      }], cb)
    })
  }
}
