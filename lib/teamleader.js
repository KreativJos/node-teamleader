'use strict';

// module dependencies
var request = require('request');
var extend = require('deep-extend');

var Q = require('q');

// Package version
var VERSION = require('../package.json').version;


//Check documentation at http://apidocs.teamleader.be/ for parameters etc.
var apiEndPoints = [
  // http://apidocs.teamleader.be/general.php
  'getUsers',
  'getDepartments',
  'getTags',
  'getSegments',

  // http://apidocs.teamleader.be/crm.php
  'addContact',
  'updateContact',
  'deleteContact',
  'linkContactToCompany',
  'getContacts',
  'getContact',
  'getContactsByCompany',
  'getContactCompanyRelations',
  'addCompany',
  'updateCompany',
  'deleteCompany',
  'getCompanies',
  'getCompany',
  'getBusinessTypes',

  // http://apidocs.teamleader.be/opportunities.php
  'addDeal',
  'updateDeal',
  'updateDealItems',
  'sendSaleToClient',
  'getDeals',
  'getDealsByContactOrCompany',
  'getDealsByProject',
  'getDeal',
  'getDealPhaseChanges',
  'getAllDealPhaseChanges',
  'getDealPhases',
  'getDealSources',

  // http://apidocs.teamleader.be/invoices.php
  'addInvoice',
  'addCreditnote',
  'setInvoicePaymentStatus',
  'bookDraftInvoice',
  'updateInvoice',
  'updateInvoiceComments',
  'deleteInvoice',
  'getInvoices',
  'getCreditnotes',
  'getInvoicesByProject',
  'getCreditnotesByProject',
  'getInvoicesByDeal',
  'getInvoice',
  'getCreditnote',
  'getTimetrackingForInvoice',
  'getInvoiceByNr',
  'getCreditnoteByNr',
  'getInvoiceByOGM',
  'downloadInvoicePDF',
  'downloadCreditnotePDF',
  'sendInvoice',
  'getInvoiceReminderTemplates',
  'getInvoiceReminderTemplateContent',
  'getInvoiceCloudURL',
  'getBookkeepingAccounts',

  // http://apidocs.teamleader.be/subscriptions.php
  'addSubscription',
  'updateSubscription',
  'deleteSubscription',
  'getSubscriptions',
  'getSubscription',
  'getInvoicesBySubscription',
  'getRelatedSubscriptionsByInvoice',
  'getSubscriptionsByDeal',
  'getSubscriptionsByContactOrCompany',

  // http://apidocs.teamleader.be/products.php
  'addProduct',
  'updateProduct',
  'deleteProduct',
  'getProducts',
  'getProduct',


  // http://apidocs.teamleader.be/tickets.php
  'addTicket',
  'updateTicket',
  'addTicketMessage',
  'getTickets',
  'getTicket',
  'getTicketMessages',
  'getTicketMessage',
  'getTicketCloudURL',

  // http://apidocs.teamleader.be/timetracking.php
  // task has type in teamleader "todo"
  'addTimetracking',
  'updateTimetracking',
  'addTask',
  'updateTask',
  'deleteTask',
  'getTimetrackingEntry',
  'getTimetracking',
  'getTimetrackingForTask',
  'getTasks',
  'getTask',

  'getTaskTypes',
  'getPrepaidInfo',
  'getCostPerKm',
  'setHourlyPricing',

  // http://apidocs.teamleader.be/calls.php
  'addCallback',
  'getCalls',
  'getCall',

  // http://apidocs.teamleader.be/meetings.php
  'addMeeting',
  'updateMeeting',
  'addContactToMeeting',
  'removeContactFromMeeting',
  'getMeetings',
  'getMeeting',

  // http://apidocs.teamleader.be/planning.php
  'getPlannedTasks',
  'getDaysOff',
  'getDaysOffByUser',

  // http://apidocs.teamleader.be/projects.php
  'getProjects',
  'getProjectsByClient',
  'getProject',
  'addProject',
  'updateProject',
  'getMilestonesByProject',
  'getMilestone',
  'addMilestone',
  'deleteMilestone',
  'getTasksByMilestone',
  'getRelatedPartiesByProject',
  'addRelatedPartyToProject',
  'getUsersOnProject',

  // http://apidocs.teamleader.be/external_costs.php
  'addExternalCost',

  // http://apidocs.teamleader.be/notes.php
  'addNote',
  'getNotes',

  // http://apidocs.teamleader.be/files.php
  'getFiles',
  'getFileInfo',
  'downloadFile',
  'uploadFile',
  'deleteFile',

  // http://apidocs.teamleader.be/users.php
  // 'getUsers', // duplicate from general
  'getUserAccess',
  'getTeams',
  'getTeam',

  // http://apidocs.teamleader.be/customfields.php
  'getCustomFields',
  'getCustomFieldInfo',
  'addCustomFieldOption'
];

function Teamleader(options) {
  if (!(this instanceof Teamleader)) return new Teamleader(options);

  this.options = extend({
    group:      null,
    api_secret: null
  }, options);

  if (this.options.group === null) {
    throw new Error('No group defined');
  }
  if (this.options.api_secret === null) {
    throw new Error('No api_secret defined');
  }

  this.VERSION = VERSION;

  for (var k in apiEndPoints) {
    var apiEndPoint = apiEndPoints[k];
    this[apiEndPoint] = this.post.bind(this, apiEndPoint);
  }
}

Teamleader.prototype.__buildEndpoint = function(path) {
  return 'https://app.teamleader.eu/api/' + path + '.php';
};

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
        var eParseError = new Error('Status Code: ' + response.statusCode);
        deferred.reject(e);
        if (callback) {
          callback(
            eParseError,
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
        var eStatusCodeNot200 = new Error('Status Code: ' + response.statusCode);
        deferred.reject(eStatusCodeNot200);
        if (callback) {
          callback(
            eStatusCodeNot200,
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
};

Teamleader.prototype.post = function(path, params, callback) {
  return this.__request(path, params, callback);
};

module.exports = Teamleader;
