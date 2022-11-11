<div align="center">

# Advertisement Registration using Cloud Services

</div>

---

## Architecture

```mermaid
graph TD;
    Clinet-->ServerA;
    ServerA-->Clinet;
    MongoAtlas-->ServerB;
    Imagga-->ServerB;
    ServerB-->Imagga;
    ServerB-->MailGun;
    ServerA-->S3;
    ServerA-->RabbitMQ;
    ServerA-->MongoAtlas;
    RabbitMQ-->ServerB;
    S3-->ServerB;
```


## Developer Notes

Create a `src/credentials.js` with this content:

```javascript
const credentials = {
  mongodb: {
    url: '...',
  },
  mailgun: {
    domain: '...',
    apiKey: '...',
  },
  imagga: {
    authorization: '...',
  },
  amqp: {
    url: '...',
    queueKey: '...',
  },
}

module.exports = credentials;
```
