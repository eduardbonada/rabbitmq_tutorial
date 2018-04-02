/*
RABBITMQ Tutorial 3 : https://www.rabbitmq.com/tutorials/tutorial-three-javascript.html

Pub/Sub model. Receives a log from a queue.
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

    // declare the exchange that will be bound to the queue
    var ex = 'logs';

    // assert the exchange (of type 'fanout') exists and otherwise create it
    ch.assertExchange(ex, 'fanout', {durable: false});

    // assert the queue exists and otherwise create it
    ch.assertQueue('', // let the server name the queue
      {exclusive: true}, // delete the queue once the connection is closed (we just want RealTime logs, not old ones)
      function(err, q){

        // bind the queue to the exchange
        ch.bindQueue(q.queue, ex, '');

        // just wait for messages to be consumed
        console.log("Waiting for tasks in %s. To exit press CTRL+C", q);

        // get the log messages
        ch.consume(q.queue, function(msg) {
          console.log("Received task '%s'", msg.content.toString());
        }, {noAck: true});

    });
  });
});

