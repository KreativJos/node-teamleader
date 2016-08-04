# Teamleader for Node.js

An client library for the [Teamleader API](http://apidocs.teamleader.be/).

Based on [tijsverkoyen - Teamleader API](https://github.com/tijsverkoyen/node-teamleader)

Added Promise support.
Added direct API calls.
Hide default request method.

```javascript
var Teamleader = require('teamleader-api');

var client = new Teamleader({
  group: '',
  api_secret: '',
});

client.post(
  'getContacts', 
  {
    amount: 100,
    pageno: 0
  },
  function(error, contacts, response){
    if (!error) {
      console.log(contacts);
    }
  }
);

client.getContacts({
    amount: 100,
    pageno: 0
  },
  function(error, contacts, response){
    if (!error) {
      console.log(contacts);
    }
  }
);

client.getContacts({
    amount: 100,
    pageno: 0
  }).then(function(contacts){
      console.log(contacts);
  }, function(error){
      console.log(error);
  }
);
```

## Installation

`npm install teamleader-api`

## Usage

You need to pass the page for the endpoint and the parameters. The endpoint can be found in the [documentation](http://apidocs.teamleader.be/)
and you can remove the url and the `/api/`, and `.php` part.

So if the endpoint is `https://www.teamleader.be/api/helloWorld.php` you should pass `helloWorld`.
