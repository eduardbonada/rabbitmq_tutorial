/*
RABBITMQ Tutorial 2 : https://www.rabbitmq.com/tutorials/tutorial-two-javascript.html

Consumes a task to the queue. The tasks are defined by a string with '.'. The more dots, the hardets the task. Each dot represents 1 second.

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
    var q = 'tut2_tasks';

    // assert the queue exists and otherwise create it
    ch.assertQueue(q, 
      {
        durable: true // tell rabbitmq to remind the queues even if it is turned off or it crashes
      });

    // only give one message at a time
    ch.prefetch(1);

    // just wait for messages to be consumed
    console.log("Waiting for tasks in %s. To exit press CTRL+C", q);

    // get the task to perform and odel its processign time
    ch.consume(q, function(msg) {

      // get the seconds that wil take to perform this task: 1 second per '.'
      var secs = msg.content.toString().split('.').length - 1;

      console.log("Received task '%s'", msg.content.toString());

      // model the processing time with a delayed timeout
      setTimeout(function() {

        console.log("- Done");

        ch.ack(msg); // send an acknowledge
      
      }, secs * 1000);
    
    }, 
    {
      noAck: false // tell the broker to expect an acknowledge from the worker
    });

  });

});