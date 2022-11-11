const publishToQueue = async (msg) => {
  const credential = require('../../credentials')
  const amqp = require('amqplib');
  
  const connection = await amqp.connect(credential.amqp.url)
  const q = credential.amqp.queueKey;
  const channel = await connection.createChannel()
  await channel.assertQueue(q, { durable: false })
  await channel.sendToQueue(q, Buffer.from(msg))
  
  setTimeout(async () => {
    await connection.close()
  }, 500);
}

module.exports = publishToQueue;
