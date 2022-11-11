const amqp = require("amqplib/callback_api");
const credential = require("../../credentials");

const subscribeFromQueue = () => {
  const credential = require('../../credentials')
  
  
  const amqp = require('amqplib/callback_api');
  
  amqp.connect(credential.amqp.url, (error0, connection) => {
    if (error0) {
      throw error0;
    }
    connection.createChannel((error1, channel) => {
      if (error1) throw error1;
      const queue = credential.amqp.queueKey;
      channel.assertQueue(queue, { durable: false });
      
      console.log(`[ServerB/RabbitMQ] connected to RabbitMQ on queue "${queue}"`);
      channel.consume(queue, (msg) => {
        console.log("[ServerB/RabbitMQ] Received %s", msg.content.toString());
      }, {
        noAck: true
      });
    });
  });
}

module.exports = subscribeFromQueue;


