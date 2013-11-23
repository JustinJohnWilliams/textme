//express is a light weight web framework similar to sinatra (ruby), and Nancy (.net)
//read more about express at: http://expressjs.com/
var express = require('express');
var http_request = require('request');

//underscore is a great little library that provides helpful functions for manipulating javascript
//objects. reard more about underscore at: http://underscorejs.org/
var _ = require('underscore');

//initialize express
var http = require('http');
var http_url = require('url');
var app = express();
var server = http.createServer(app);
var text = require('./lib/textMessage.js');

//load all of our custom libraries (be sure to go through these files too)
var config = require('./lib/config');

var customerMap = {};

//this is a node wrapper around redis, all the commands for
//redis are located here: http://redis.io/commands
//var redis = require("redis");

//setup a redis client based on if the environment is development or production
//var client = null;
//if(process.env.REDISTOGO_URL) { //heroku
 // client = require('redis-url').connect(process.env.REDISTOGO_URL); 
//} else if(config.env == "development") {
//  client = redis.createClient();
//}  else { //nodejitsu
//  client = redis.createClient(secret.redisPort, secret.redisMachine);
//  client.auth(secret.redisAuth, function (err) {
//     if (err) { throw err; }
//  });
//}

//setting some values for our express application
//ejs is a javascript rendering engine similar to erb (ruby) and aspx (.net)
//for more information on ejs, visit: http://embeddedjs.com/
app.set('view engine', 'ejs');
app.set('view options', { layout: false });

//all our public files (css, client side js files) are here
app.use('/public', express.static('public'));

//more express specific configurations
//best to visit the expressjs website for
//a thorough explanation
app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ secret: "lolhai" }));
app.use(app.router);

//catch all error handler
var error = function(res) {
  return function (err, response, body) {
    console.log("error: ", err);
    json(res, err);
  };
};

//helper method for writing out json payloads
var json = function(res, data) {
  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });

  if(typeof data === "string") res.write(data);

  else res.write(JSON.stringify(data));

  res.end();
};

//main page (notice that all these interactions have the 
//requiredAuthentication filter specified
//if the user isn't authenticated, he will be directed
//to /login,
//this http/get renders the template in /views/index.ejs (go there for more information)
app.get('/', function (req, res) {
  res.render('index');
}); 

app.post('/checkin', function (req, res ) {
  var customer = req.body;
  customerMap[customer.number] = customer;

  text.send(customer.number, "Your table is ready");

json(res, { });

});

app.post('/reply', function(req, res) {
  var numberInfo = req.body;
  var customer = customerMap[numberInfo.From];
  var waiterNumber = null;

  if(customer) {
    waiterNumber = customer.waiterNumber; 
    
    text.send(waiterNumber, numberInfo.Body);

  } else {
    var customer = _.findWhere(customerMap, { waiterNumber: numberInfo.From });
    if(customer) {
        text.send(customer.number, numberInfo.Body);
    }
  }

  

  json(res, {});
}); 

server.listen(process.env.PORT || config.port);
