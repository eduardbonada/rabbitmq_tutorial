/*
RABBITMQ Tutorial 4 : https://www.rabbitmq.com/tutorials/tutorial-four-javascript.html

Pub/Sub model. Emits a log to an 'direct' exchange.

The message to log is entered through the command line together with the Log severity (info, error, warnnig)
*/

var amqp = require('amqplib/callback_api');

// connect to RabbitMQ server
amqp.connect('amqp://localhost', function(err, conn) {

  if(err) throw err;

  console.log('Connection to RabbitMQ server established')

  // create a channel to interact with the server
  conn.createChannel(function(err, ch) {

    if(err) throw err;

    console.log('Channel created')

    // declare exchange
    var ex = 'direct_logs';

    // get severity and log from command line
    var args = process.argv.slice(2);
    var severity = (args.length > 0) ? args[0] : 'info';
    var msg = process.argv.slice(2).join(' ') || "Hello World Log!";

    // assert the exchange (of type 'direct' to route to different queues and log receivers) exists and otherwise create it
    ch.assertExchange(ex, 'direct', {durable: false});

    // publish the log to the exchange (specifying the 'severity' queue where to send the log to)
    ch.publish(ex, severity, new Buffer(msg));

    console.log("Sent log %s: '%s'", severity, msg);

  });

  // close conection after a timeout
  setTimeout(function() { conn.close(); process.exit(0) }, 500);

}); 