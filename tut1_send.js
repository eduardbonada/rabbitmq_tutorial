/*
RABBITMQ Tutorial 1 : https://www.rabbitmq.com/tutorials/tutorial-one-javascript.html

Publishes a 'Hello World' message to queue

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

    // declare the queue where we want to send to
    var q = 'hello';

    // assert the queue exists and otherwise create it
    ch.assertQueue(q, {durable: false});

    // send the message to the queue
    ch.sendToQueue(q, new Buffer('Hello World!'));

    console.log("Sent 'Hello World!'");

  });

  // close conection after a timeout
  setTimeout(function() { conn.close(); process.exit(0) }, 500);

});