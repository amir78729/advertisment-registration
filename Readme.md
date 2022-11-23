<div align="center">

# Advertisement Registration using Cloud Services

Cloud Computing Course Project

</div>


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

## Sequence Diagram


```mermaid
sequenceDiagram
    Client->>+ServerA: Request
    ServerA->>+MongoAtlas: Add Data to Database
    MongoAtlas-->>-ServerA: ACK
    ServerA->>+ArvanCloudS3: Upload Image to S3
    ArvanCloudS3-->>-ServerA: ACK
    ServerA->>+AmqpCloud: Send ID
    AmqpCloud-->>-ServerA: ACK
    ServerA-->>-Client: Response
```

## Instructions

### Installing Packages

Run the following command to install needed packages:

```shell
npm i
```

### Adding credential info to project

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
    s3: {
        secretKey: '...',
        accessKey: '...',
        endpointUrl: '...',
        region: '...',
        bucketName: '...',
        bucketContentUrlPrefix: '...',
    },
}

module.exports = credentials;
```

### Starting servers

Following command will start **server A** on port `3001` and **server B** on port `3002` and 
clients will be able to sent their request to server A.

```shell
node src  # running src/index.js
```

### APIs

#### ![](https://img.shields.io/badge/-GET-darkgreen?style=flat-circle) **Check Server A**

 ```
 localhost:3001/
 ```
 

response Example:

```json
{
    "result": "OK",
    "message": "Server A is UP!"
}
```

---

#### ![](https://img.shields.io/badge/-GET-darkgreen?style=flat-circle) **Get List of Advertisements**

 ```
 localhost:3001/ad
 ```

response Example:

```json
{
    "result": "OK",
    "data": [
        {
            "id": 1,
            "description": "a simple description",
            "email": "test@example.com",
            "state": "PENDING",
            "category": "UNKNOWN",
            "image": "..."
        },
        {
            "id": 2,
            "description": "a great red sport car!",
            "email": "example@example.com",
            "state": "APPROVED",
            "category": "sports car",
            "image": "..."
        },
    ]
}
```

---

#### ![](https://img.shields.io/badge/-GET-darkgreen?style=flat-circle) **Get a single Advertisements**

 ```
 localhost:3001/ad/:id
 ```

response Example:

```json
{
    "result": "OK",
    "data": {
        "id": 2,
        "description": "a great red sport car!",
        "email": "example@example.com",
        "state": "APPROVED",
        "category": "sports car",
        "image": "..."
    }
}
```

---

#### ![](https://img.shields.io/badge/-POST-darkblue?style=flat-circle) **Submiting an Advertisement**

 ```
 localhost:3001/ad
 ```

Body (Form Data):

| Field Name  | Type        |
|-------------|-------------|
| image       | File (.jpg) |
| email       | String      |
| description | String      |

response Example:

```json
{
    "result": "OK",
    "message": "آگهی شما با شناسه‌ی 3 ثبت گردید.",
    "data": {
        "id": 3,
        "description": "a simple description",
        "email": "test@example.com",
        "state": "PENDING",
        "image": "...",
        "category": "UNKNOWN"
    }
}
```

---

#### ![](https://img.shields.io/badge/-DELETE-darkred?style=flat-circle) **Removing an Advertisement**

 ```
 localhost:3001/ad/:id
 ```

response Example:

```json
{
    "result": "OK",
    "data": {
        "acknowledged": true,
        "deletedCount": 1
    }
}
```

---

####  ![](https://img.shields.io/badge/-DELETE-darkred?style=flat-circle) **Removing All Advertisement**

 ```
 localhost:3001/ad
 ```

response Example:

```json
{
    "result": "OK",
    "data": {
        "acknowledged": true,
        "deletedCount": 20
    }
}
```

