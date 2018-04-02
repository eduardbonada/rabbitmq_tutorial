/*
RABBITMQ Tutorial 3 : https://www.rabbitmq.com/tutorials/tutorial-three-javascript.html

Pub/Sub model. Emits a log to a 'fanout' exchange.

The message to log is entered through the command line
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
    var ex = 'logs';

    // get message from command line
    var msg = process.argv.slice(2).join(' ') || "Hello World!";

    // assert the exchange (of type 'fanout' to broadcast to all bound queues) exists and otherwise create it
    ch.assertExchange(ex, 'fanout', {durable: false});

    // publish the log to the exchange (without specifying a queue to send the message to)
    ch.publish(ex, '', new Buffer(msg));

    console.log("Sent '%s'", msg);

  });

  // close conection after a timeout
  setTimeout(function() { conn.close(); process.exit(0) }, 500);

}); 