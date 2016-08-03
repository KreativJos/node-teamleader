'use strict';

// module dependencies
var request = require('request');
var extend = require('deep-extend');

var Q = require('q');

// Package version
var VERSION = require('../package.json').version;

var apiEndPoints = [
  'getUsers',
  'getDepartments',
  'getTags',
  'getSegments',

  'getTasks',

  'getTickets',
  'addTicket',
  'addTicketMessage',

  'getCustomFields',
  'getCustomFieldInfo',
  'addCustomFieldOption'
];

function Teamleader(options) {
  if (!(this instanceof Teamleader)) return new Teamleader(options);

  this.options = extend({
    group:      null,
    api_secret: null,
  }, options);

  if (this.options.group === null) {
    throw new Error('No group defined');
  }
  if (this.options.api_secret === null) {
    throw new Error('No api_secret defined');
  }

  this.VERSION = VERSION

  for (var k in apiEndPoints) {
    var apiEndPoint = apiEndPoints[k];
    this[apiEndPoint] = this.post.bind(this, apiEndPoint);
  }
}

Teamleader.prototype.__buildEndpoint = function(path) {
  return 'https://app.teamleader.eu/api/' + path + '.php';
}

Teamleader.prototype.__request = function(path, params, callback) {
  params = params || {};
  if (!callback && 'function' === typeof params) {
    callback = params;
    params = {};
  }

  var deferred = Q.defer();

  var options = {
    method: 'post',
    url:    this.__buildEndpoint(path)
  };

  var requestDefaults = request.defaults({
    'headers': {
      'User-Agent': 'node-teamleader/' + VERSION
    }
  });

  // add the default fields
  params.api_group = this.options.group;
  params.api_secret = this.options.api_secret;

  options['form'] = params;

  requestDefaults(options, function(error, response, data) {
    if (error) {
      deferred.reject(new Error(error));
      if (callback) {
        callback(error, data, response);
      }
    }
    else {
      try {
        data = JSON.parse(data);
      }
      catch (parseError) {
        var e = new Error('Status Code: ' + response.statusCode)
        deferred.reject(e);
        if (callback) {
          callback(
            e,
            data,
            response
          );
        }

      }
      if (typeof data.errors !== 'undefined') {
        deferred.reject(data.errors);
        if (callback) {
          callback(data.errors, data, response);
        }
      }
      else if (response.statusCode !== 200) {
        var e = new Error('Status Code: ' + response.statusCode)
        deferred.reject(e);
        if (callback) {
          callback(
            e,
            data,
            response
          );
        }
      }
      else {
        deferred.resolve(data);
        if (callback) {
          callback(null, data, response);
        }
      }
    }
  });
  return deferred.promise;
}

Teamleader.prototype.post = function(path, params, callback) {
  return this.__request(path, params, callback);
}

module.exports = Teamleader;
