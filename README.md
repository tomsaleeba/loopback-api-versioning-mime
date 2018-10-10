> A helper for Loopback that enables API versioning via the HTTP x-version header

## Demo

See the `demo/` directory for a working demo of this helper in action. There is a [README](./demo/README.md) with more details.

## How to use this hook

 1. install the hook into your project
      ```bash
      yarn add loopback-api-versioning-mime
      ```
  1. add the middleware that parses the `x-version` header by creating this file
      ```javascript
      // server/middleware/versioning.js
      const apiVersioning = require('loopback-api-versioning-mime')
      module.exports = apiVersioning.buildMiddlewareFn
      ```
  1. then enable this middleware by editing `server/middleware.json`
      ```javascript
      "initial": {
        ...
        "./middleware/versioning": {} // add this line
      },
      ...
      ```
  1. for each model you want to version, you need to bind the versioning router and define the handler for old versions
      ```javascript
      const apiVersioning = require('loopback-api-versioning-mime')

      module.exports = function(CoffeeShop) {
        // ... existing code

        // Add your handlers
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

        // Bind the version router
        apiVersioning.bindVersionRouter(CoffeeShop, handlers)
      }
      ```

## Why create this hook?

RESTful API Versioning has a number of schools of thought, you can read some background at the following links:

 - https://www.troyhunt.com/your-api-versioning-is-wrong-which-is/
 - https://www.narwhl.com/content-negotiation/

Troy captures the different schools of thought concisely:

>...let me outline the three common schools of thought in terms of how they’re practically implemented:
>
> 1. URL: You simply whack the API version into the URL, for example: https://haveibeenpwned.com/api/v2/breachedaccount/foo
> 1. Custom request header: You use the same URL as before but add a header such as “api-version: 2”
> 1. Accept header: You modify the accept header to specify the version, for example “Accept: application/vnd.haveibeenpwned.v2+json”

I like option 3. Unfortunately not everything deals well with these modified MIMEs (even though they're RFC compliant) so in this case, option 2 is an easier way forward. This repo is my attempt to add support for API versioning whilst also keeping all the things that make Loopback awesome.

## What this hook does
This hook tries to leave as much as possible to Loopback and only step in when required. This means:

 1. you define version config on the models you want versioned
 1. requests for the latest version or no specified version (defaults to latest) use the auto-magic handler from Loopback
 1. requests for earlier versions must be handled by code you write

## TODO

 1. figure out how to test this thing. Probably by starting Loopback on a high port with a single model and in-memory DB, then firing HTTP requests
