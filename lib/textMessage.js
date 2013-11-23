var sid = "AC8efd9329a5668c71d39315c087b1b2a6";
var token = "9721b15d00a9fd92e41665b688bef84f";
var client = require('twilio')(sid, token);
var twilioNumber = "4697131274";

function send(to, body) {
	console.log("text message sent: ", to, body);

	client.sendSms({
      to: '+1' + to,
      from: "+1" + twilioNumber,
      body: body,
      }, function (err, responseData) {
      
    });
}

exports.send = send;