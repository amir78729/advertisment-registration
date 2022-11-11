const subscribeFromQueue = async () => {
  const credential = require('../../credentials')
  const amqp = require('amqplib');
  
  const connection = await amqp.connect(credential.amqp.url);
  const q = credential.amqp.queueKey;
  const channel = await connection.createChannel()
  await channel.assertQueue(q, { durable: false })
  channel.prefetch(1);
  
  let response;
  await channel.consume(q, (msg) => {
    response = msg.content.toString();
    console.log(response)
    channel.ack(msg)
  })
  return response;
}

module.exports = subscribeFromQueue;
