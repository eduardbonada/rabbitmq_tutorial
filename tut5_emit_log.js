/*
RABBITMQ Tutorial 5 : https://www.rabbitmq.com/tutorials/tutorial-five-javascript.html

Pub/Sub model. Emits a log to a 'direct' exchange.

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

    console.log('Channel created');

    // declare exchange
    var ex = 'topic_logs';

    // get key and log message from command line 
    var args = process.argv.slice(2);
    var key = (args.length > 0) ? args[0] : 'anonymous.info';
    var msg = args.slice(1).join(' ') || 'Hello World!';

    // assert the exchange (of type 'topic' to route to different queues and log receivers) exists and otherwise create it
    ch.assertExchange(ex, 'topic', {durable: false});

    // publish the log to the exchange (specifying the 'severity' queue where to send the log to)
    ch.publish(ex, key, new Buffer(msg));

    console.log("Sent log %s: '%s'", key, msg);

  });

  // close conection after a timeout
  setTimeout(function() { conn.close(); process.exit(0) }, 500);

}); 