/*
RABBITMQ Tutorial 5 : https://www.rabbitmq.com/tutorials/tutorial-five-javascript.html

Pub/Sub model. 
Sets up a topic exchange.
Receives a log from a queue.
*/

var amqp = require('amqplib/callback_api');

// process the arguments to know which log 'severity' should this reciever get 
var args = process.argv.slice(2);

if (args.length == 0) {
  console.log("Usage: tut5_recieve:logs.js <facility>.<severity>");
  process.exit(1);
}

// connect to RabbitMQ server
amqp.connect('amqp://localhost', function(err, conn) {

  if(err) throw err;

  console.log('Connection to RabbitMQ server established')

  // create a channel to interact with the server
  conn.createChannel(function(err, ch) {

    if(err) throw err;

    console.log('Channel created')

    // declare the exchange that will be bound to the queue
    var ex = 'topic_logs';

    // assert the exchange (of type 'topic' to route to different queues and log receivers) exists and otherwise create it
    ch.assertExchange(ex, 'topic', {durable: false});

    // assert the queue exists and otherwise create it
    ch.assertQueue('', // let the server name the queue
      {exclusive: true}, // delete the queue once the connection is closed (we just want RealTime logs, not old ones)
      function(err, q){

        // bind the queue to the exchange and the routing keys in arguments
        args.forEach(function(key) {
          ch.bindQueue(q.queue, ex, key);
        });

        // just wait for messages to be consumed
        console.log("Waiting for logs. To exit press CTRL+C");

        // get the log messages
        ch.consume(q.queue, function(msg) {
          console.log("%s: '%s'", msg.fields.routingKey, msg.content.toString());
        }, {noAck: true});

    });
  });
});