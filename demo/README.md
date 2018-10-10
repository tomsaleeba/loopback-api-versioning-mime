To run the demo:

  1. make sure the dependencies are installed
      ```bash
      cd demo/ # make sure you're in the demo directory
      yarn
      ```
  1. start the server
      ```bash
      node .
      ```
  1. in another terminal, make a request for the default (latest) version
      ```bash
      $ curl http://localhost:3000/api/coffeeshop
      [{"name":"Bel Cafe","city":"Vancouver","id":1},{"name":...
      ```
  1. now we'll specifically request the latest version
      ```bash
      $ curl -H 'x-version: 2' http://localhost:3000/api/coffeeshop
      [{"name":"Bel Cafe","city":"Vancouver","id":1},{"name":...
      ```
  1. we can also request an older version
      ```bash
      $ curl -H 'x-version: 1' http://localhost:3000/api/coffeeshop
      [{"name":"Bel Cafe","city":"Vancouver","id":1,"intercepted":"by v1 handler"},{"name":... # note the 'intercepted' field is added
      ```
  1. what about requesting a version that doesn't exist?
      ```bash
      $ curl -H 'x-version: 3' http://localhost:3000/api/coffeeshop
      {"status":406,"statusName":"Not acceptable","message":"There is no version '3' for this resource. Available versions are: [1,2,1.1]"}
      ```

During development it is easier if you link the library into the demo. You can do that by:

  1. make the library linkable
      ```bash
      # make sure you're in the root dir of this repo
      npm link
      ```
  1. move to the demo directory
      ```bash
      cd demo/
      ```
  1. link the demo to the library
      ```bash
      npm link loopback-api-versioning-mime
      ```
