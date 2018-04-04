/*
RABBITMQ Tutorial 6 : https://www.rabbitmq.com/tutorials/tutorial-six-javascript.html

RPC model (Remote Procedure Call)

Consumes a task from the queue and returns a fibonacci queue to the callback queue.
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

    // declare the queue where we want to consume from
    var q = 'tut6_rpc_requests';

    // assert the rpc queue exists and otherwise create it
    ch.assertQueue(q, 
      {
        durable: true // tell rabbitmq to remind the queues even if it is turned off or it crashes
      });

    // only give one message at a time
    ch.prefetch(1);

    // just wait for messages to be consumed
    console.log("Waiting for RPC requests in %s. To exit press CTRL+C", q);

    // get the request to perform and compute fibonacci numbers
    ch.consume(q, function(msg) {

      // read number to compute fibonacci
      var n = parseInt(msg.content.toString());

      console.log("Received request to compute fibonacci(%s)", n);

      // compute fiboncci of n
      var f = fibonacci(n);

      console.log("Fibonacci(%s) = ", n, f);

      // send result to callback queue
      ch.sendToQueue(msg.properties.replyTo,
        new Buffer(f.toString()),
        {
          correlationId: msg.properties.correlationId // matcj the correlationId with the request
        });

      // send an acknowledge to the RPC queue
      ch.ack(msg); 

    }, 
    {
      noAck: false // tell the broker to expect an acknowledge from the worker
    });

  });

});

// compute fibonacci number
function fibonacci(n) {
  if (n == 0 || n == 1)
    return n;
  else
    return fibonacci(n - 1) + fibonacci(n - 2);
}