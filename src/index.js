const serverA = require('./server/serverA');
const serverB = require('./server/serverB');

[serverA, serverB].map((server) => {
    server.configs.listen(server.port, () => {
        console.log(`[${server.name}] listening on port ${server.port}`);
    });
});
