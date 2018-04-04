/*
RABBITMQ Tutorial 6 : https://www.rabbitmq.com/tutorials/tutorial-six-javascript.html

RPC model (Remote Procedure Call)

Creates a request to compute the fibonacci of a number.

Request sent to the RPC queue, and response expected in the callback queue.
*/

var amqp = require('amqplib/callback_api');

// read arguments
var args = process.argv.slice(2);
if (args.length == 0) {
  console.log("Usage: tut6_rpc_client.js <n>");
  process.exit(1);
}


// connect to RabbitMQ server
amqp.connect('amqp://localhost', function(err, conn) {

  if(err) throw err;

  console.log('Connection to RabbitMQ server established')

  // create a channel to interact with the server
  conn.createChannel(function(err, ch) {

    if(err) throw err;

    console.log('Channel created');

    // create the callback queue where the result will be sent
    ch.assertQueue('', // let the server name the queue
      {exclusive: true}, // delete the queue once the connection is closed (one callback queue per request of fib(n))
      function(err, q){

        // get the number from the arguments
        var n = parseInt(args[0]);

        // generate a unique number to set the correlation Id of the request
        var correlationId = generateUuid();

        console.log("Request with correlationId %s : fibonacci(%s)", correlationId, n);

        // wait for response in the callback queue
        ch.consume(q.queue, function(msg) {

          console.log("Results with correlationId %s", msg.properties.correlationId);          

          if (msg.properties.correlationId == correlationId) {
            
            console.log('  Fibonacci(%s) = %s', n, msg.content.toString());
            
            // close conection after a timeout
            setTimeout(function() { conn.close(); process.exit(0) }, 500);
          
          }
          else{
            console.log('  Recieved correlationId not matching request');
          }

        }, 
        {noAck: true} // tell the broker to NOT expect an acknowledge
      );

      // send request to conpute fibonacci of n
      ch.sendToQueue('tut6_rpc_requests',
        new Buffer(n.toString()),
        { 
          correlationId: correlationId, // set correlationId to later match result with request 
          replyTo: q.queue // set callback queue
        });
      });

  });
});

// generate a random id
function generateUuid() {
  return Math.random().toString() +
         Math.random().toString() +
         Math.random().toString();
}