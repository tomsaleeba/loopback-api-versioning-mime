'use strict'

// TODO add configurable switch for logging
const logging = true

module.exports = {
  bindVersionRouter: function bindVersionRouter (model, handlers) {
    const modelRemoteMethodsToBind = ['find']
    /*
     * Methods I think we need to get the user to define handlers for:
     * (list from https://loopback.io/doc/en/lb3/Exposing-models-over-REST.html)
     *  - create
     *  - replaceOrCreate
     *  - patchOrCreate
     *  - findById
     *  - find
     *  - findOne
     *  - replaceById
     *  - prototype.patchAttributes
     *  - createChangeStream
     *  - updateAll
     *  - replaceById
     *
     * Basically anything that receives or responds with a model.
     *
     * We might be able to help out and handle the methods that operate on collections by performing
     * the loop and calling the singular handler. E.g: we hande find() by doing a loop and calling the fineOne() handler.
     */
    modelRemoteMethodsToBind.forEach(remoteMethod => {
      model.beforeRemote(remoteMethod, function (context, user, next) {
        let version = context.req.version
        if (!version) {
          log(`No x-version header defined for request to ${model.name}.${remoteMethod}, defaulting to latest version`)
          return next()
        } else {
          log(`x-version header for request to ${model.name}.${remoteMethod} is '${version}'`)
        }
        const handler = handlers[remoteMethod][version] // TODO add checking at each step for nice error reporting
        if (!handler) {
          const allVersions = Object.keys(handlers[remoteMethod]).join(',')
          context.res.status(406).json({
            status: 406,
            statusName: 'Not acceptable',
            message: `There is no version '${version}' for this resource. Available versions are: [${allVersions}]`
          })
          return
        }
        const canUseLatestHandler = typeof (handler) !== 'function'
        if (canUseLatestHandler) {
          return next()
        }
        // TODO do we need the let the handler pass status, headers AND body back?
        handler(context.req).then(responseBody => {
          context.res.status(200).json(responseBody)
        }).catch(err => {
          console.error(`Failed while executing '${version}' handler for request to ${model.name}.${remoteMethod}`, err)
          context.res.status(500).json({
            status: 500,
            statusName: 'Internal server error'
          })
        })
      })
    })
  },
  buildMiddlewareFn: function buildInterceptVersionHeaderMiddleware () {
    return function versioning (req, res, next) {
      const version = req.headers['x-version']
      req.version = version
      return next()
    }
  }
}

function log (message) {
  if (!logging) {
    return
  }
  console.log(message)
}
