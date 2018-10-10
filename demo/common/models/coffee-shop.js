'use strict'
const apiVersioning = require('loopback-api-versioning-mime')

module.exports = function (CoffeeShop) {
  const handlers = { // handler functions MUST be promises
    'find': {
      1: async function (req) { // can use async
        const shops = await CoffeeShop.find()
        const result = shops.map(e => {
          e.intercepted = 'by v1 handler'
          return e
        })
        return result
      },
      '1.1': function (req) { // ...or use promises
        return new Promise((resolve, reject) => {
          return resolve({ message: 'versions can be strings too' })
        })
      },
      2: {} // a non-function means "use the latest version". You can have multiple versions doing this if you want
    }
  }
  apiVersioning.bindVersionRouter(CoffeeShop, handlers)
}
