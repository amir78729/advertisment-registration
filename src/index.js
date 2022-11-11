const serverA = require('./server/serverA');
const serverB = require('./server/serverB');
const fetch = require('node-fetch');

[serverA, serverB].map((server) => {
    server.core.listen(server.port, () => {
        console.log(`[${server.name}] listening on port ${server.port}`);
    });
});

fetch('http://localhost:3002').then(() => console.log(`[${serverB.name}/RabbitMQ] connecting to RabbitMQ...`));