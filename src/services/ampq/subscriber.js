const jackrabbit = require('jackrabbit');
const credential = require('src/credentials')

const rabbit = jackrabbit(credential.ampqUrl);
const exchange = rabbit.default();

const hello = exchange.queue({ name: 'example_queue', durable: true });
hello.consume(onMessage);

function onMessage(data, ack) {
  console.log('received:', data);
  ack("");
}