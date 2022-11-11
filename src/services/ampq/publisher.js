const publishToQueue = async (msg) => {
  const credential = require('../../credentials')
  const amqp = require('amqplib');
  
  console.log(`[ServerA/RabbitMQ] connecting to RabbitMQ...`);
  const connection = await amqp.connect(credential.amqp.url)
  const q = credential.amqp.queueKey;
  
  console.log(`[ServerA/RabbitMQ] connected to RabbitMQ on queue "${q}"`);
  const channel = await connection.createChannel()
  await channel.assertQueue(q, { durable: false })
  await channel.sendToQueue(q, Buffer.from(msg))
  console.log(`[ServerA/RabbitMQ] message "${msg}" was sent to queue "${q}"`);
  
  setTimeout(async () => {
    await connection.close()
  }, 500);
}

module.exports = publishToQueue;
