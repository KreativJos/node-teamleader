/**
 * Created by kasper on 2016-03-08.
 */

var TeamLeader = require('../lib/teamleader');

var tl = new TeamLeader({
  group: process.env.API_GROUP,
  api_secret: process.env.API_KEY
});
//
// tl.post('getUsers', function (err, result) {
//   console.log('c', err, result);
// });
//
// tl.post('getUsers').then(function (result) {
//   console.log('p', result);
// });
//
// tl.getUsers().then(function (result) {
//   console.log('getUsers', result);
// });


//
// tl.getTickets({
//   type: 'waiting_for_client'
// }).then (function (result) {
//   console.log('getTickets', result);
// }).catch (function (err) {
//   console.log(err);
// });
//
//
// tl.addTicket({
//   client_email: 'test+t1@test.nl',
//   client_name: 'Test T1',
//   subject: 'Web Question',
//   send_autoreply: 0
// }).then(function (result) {
//   var ticketId = result;
//
//   tl.addTicketMessage({
//     ticket_id: ticketId,
//     message: 'test msg ' + new Date().getTime(),
//     send_email: 0
//   })
// });


//29494
//
tl.getCustomFieldInfo({
  custom_field_id: process.env.KANBAN_CF_ID
}).then (function (result) {
  console.log('getCustomFieldInfo', result);
}).catch (function (err) {
  console.log(err);
});


tl.getTasks({
  amount: 100,
  pageno: 0,
  selected_customfields: process.env.KANBAN_CF_ID
}).then (function (result) {
  console.log('getTasks', result);

}).catch (function (err) {
  console.log(err);
});


