# MocSocket - mock websocket connection with ease

I was looking for simple package to mock websocket server and generate clients. Something as easy as superTest. I've
created it myself.

## TLDR:

1. Supported servers
2. How to use
   2.1. Initialize
   2.2. Clients
3. Examples
   3.1. Generate client and connect
   3.2. Send messages
   3.3. Read client's messages
4. TODO

## 1. Supported servers:

- [ws](https://www.npmjs.com/package/ws). Tested on version 8+

## 2. How to use

### 2.1 Initialize

```typescript
// Create new ws server without port
const server = new Websocket.Server({
  noServer: true,
});

// Create new instance of MocSocket
const mock = new MocSocket(server);
```

### 2.2 Clients

There are 2 types of clients you can create.

Simple

```typescript
const client = mock.createSimpleClient()
client.connect()
```

Default

```typescript
const client = mock.createClient()
await client.connect()
```

Simple client will just connect to server using `.connect()` method where client will utilize events by itself

Default client returns promise to make sure that connection passed or failed.

Default client is routing all messages to local variable, providing easy access to received data

```typescript
const lastTenMessages = client.getLastMessages(10)
```

#### 2.2.1 Events

Each client support default ws client events like

```typescript
client.onMessage((message: WebSocket.RawData | string) => (console.log(JSON.stringify(message))))
client.onError((e: Error) => (console.log(e)))
client.onClose((code: number, message: Buffer) => (console.log(`Closed with code ${code} `, message)))
```

Event `onOpen()` is restricted in default client because instance uses it to properly handle connection. You can
still add another 1 with `on('open')`

Every event can be disabled with `client.disableEvent()` if you prefer not to use `.off()`

## 3. Examples

### 3.1 Generate client and connect

```typescript
const server = new Websocket.Server({
  noServer: true,
});
server.on('connection', (ws, req) => {
  console.log("User connected")
})

const mock = new MocSocket(server);
const client = mock.createClient()
await client.connect()
```

### 3.2 Send messages

```typescript
const server = new Websocket.Server({
  noServer: true,
});
server.on('connection', (ws, req) => {
  console.log("User connected")
  ws.on('message', (message: string) => {
    console.log("Got user's message")
  });
})

const mock = new MocSocket(server);
const client = mock.createClient()
await client.connect()
client.sendMessage('Test')
```

### 3.3 Read client's messages

```typescript
const server = new Websocket.Server({
  noServer: true,
});
server.on('connection', (ws, req) => {
  console.log("User connected")
  ws.on('message', (message: string) => {
    console.log("Got user's message")

    ws.send({ user: 2 })
  });
})

const mock = new MocSocket(server);
const client = mock.createClient()
await client.connect()
client.sendMessage('Test')

setTimeout(() => {
  // Wait for server to receive and send message
  const messages = client.getLastMessages()
}, 100)
```

### 3.3 Create client with bearer token

```typescript
const clientOptions = {
  headers: { Authorization: `Bearer: ${generateAccessToken()}` },
};

const server = new Websocket.Server({
  noServer: true,
});

const mock = new MocSocket(server);
const client = mock.createClient()
await client.connect(clientOptions)
```
