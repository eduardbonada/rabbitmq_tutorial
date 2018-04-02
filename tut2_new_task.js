/*
RABBITMQ Tutorial 2 : https://www.rabbitmq.com/tutorials/tutorial-two-javascript.html

Publishes a task to the queue. The tasks are defined by a string with '.'. The more dots, the hardets the task.

The message task is entered from the command line

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

    // get message from command line
    var msg = process.argv.slice(2).join(' ') || "Hello World!";

    // assert the queue exists and otherwise create it
    ch.assertQueue(q, 
      {
        durable: true // tell rabbitmq to remind the queues even if it is turned off or it crashes
      });

    // send the message to the queue
    ch.sendToQueue(q, new Buffer(msg),
      {
        persistent: true // make sure the message is kept even if the server is turned of  or it crashes
      });

    console.log("Sent '%s'", msg);

  });

  // close conection after a timeout
  setTimeout(function() { conn.close(); process.exit(0) }, 500);

});