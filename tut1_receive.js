/*
RABBITMQ Tutorial 1 : https://www.rabbitmq.com/tutorials/tutorial-one-javascript.html

Consumes a 'Hello World' message to queue

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

    // declare the queue where we want to read from
    var q = 'hello';

    // assert the queue exists and otherwise create it (in case the consumer runs before the publisher)
    ch.assertQueue(q, {durable: false});

    // just wait for messages to be consumed
    console.log("Waiting for messages in %s. To exit press CTRL+C", q);
    
    // track a message that is consumed from the queue
    ch.consume(q, function(msg) {
      console.log("Received %s", msg.content.toString());
    }, {noAck: true});

  });

});