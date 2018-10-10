const app = require('./server/server')

console.log(app.models.CoffeeShop.create)

// http://apidocs.loopback.io/loopback/#persistedmodel-create
app.models.CoffeeShop.create({ name: 'Bean Bar', city: 'Adelaide' }, (err, models) => {
  if (err) {
    console.error('failed to create model', err)
    return
  }
  console.log('created model', models)
  app.start()
  // then `curl http://localhost:3000/api/CoffeeShops` to see 4 shops
})

