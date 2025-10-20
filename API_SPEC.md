# LANChat API Specification

## Overview

The LANChat server provides both HTTP REST API endpoints and WebSocket events for real-time communication. All endpoints support CORS and are accessible from any origin.

**Base URL**: `http://localhost:3000` (or your server's IP address)
**WebSocket URL**: `ws://localhost:3000/socket.io/`

---

## HTTP REST API Endpoints

### 1. Server Statistics

**GET** `/api/stats`

Returns current server statistics and health information.

**Response:**

```json
{
  "connectedUsers": 1,
  "connectedAgents": 1,
  "totalMessages": 25,
  "uptime": 1234.567
}
```

**Fields:**

- `connectedUsers` (number): Count of currently connected human users
- `connectedAgents` (number): Count of currently connected AI agents
- `totalMessages` (number): Total number of messages in chat history
- `uptime` (number): Server uptime in seconds

---

### 2. Chat History

**GET** `/api/history`

Retrieves recent chat messages with optional filtering.

**Query Parameters:**

- `limit` (optional, number): Maximum number of messages to return (default: 50)

**Response:**

```json
{
  "messages": [
    {
      "id": "msg_123",
      "type": "chat",
      "username": "Alice",
      "content": "Hello everyone!",
      "metadata": {
        "timestamp": "2025-10-20T18:55:18.820Z",
        "loadedFromSession": false
      }
    },
    {
      "id": "msg_124",
      "type": "join",
      "username": "system",
      "content": "Bob (human) joined the chat",
      "metadata": {
        "timestamp": "2025-10-20T18:55:20.120Z",
        "joinedUser": "Bob",
        "userType": "human"
      }
    }
  ]
}
```

**Message Types:**

- `chat`: Regular user messages
- `agent_response`: AI agent responses to conversations
- `agent_data`: Structured data from agents (can be private or broadcast)
- `system`: System notifications
- `join`: User/agent joining the chat
- `leave`: User/agent leaving the chat

---

### 3. Network Information

**GET** `/api/network`

Returns network interface information for LAN connections.

**Response:**

```json
{
  "interfaces": [
    {
      "interface": "en0",
      "address": "192.168.1.187",
      "primary": true
    }
  ],
  "ports": {
    "socketio": 3000
  }
}
```

**Fields:**

- `interfaces`: Array of available network interfaces
  - `interface` (string): Network interface name (e.g., "en0", "eth0")
  - `address` (string): IP address for this interface
  - `primary` (boolean): Whether this is the primary interface
- `ports`: Available service ports
  - `socketio` (number): WebSocket server port

---

## WebSocket API Events

### Client → Server Events

#### Registration

**Event:** `register`
**Payload:**

```json
{
  "username": "Alice",
  "type": "human" // or "agent"
}
```

#### Send Message

**Event:** `message`
**Payload:**

```json
{
  "content": "Hello everyone!",
  "type": "chat"
}
```

#### Get Chat History (Filtered)

**Event:** `get_history`
**Payload:**

```json
{
  "limit": 100,
  "messageType": "chat", // optional filter
  "since": "2025-10-20T18:00:00.000Z" // optional timestamp filter
}
```

#### Get Connected Users

**Event:** `get_users`
**Payload:** `{}`

#### Agent Dialectic Query

**Event:** `dialectic`
**Payload:**

```json
{
  "user": "AgentName",
  "query": "What do you think about this topic?"
}
```

#### Toggle Observation Mode

**Event:** `toggle_observe`
**Payload:** `{}`

### Server → Client Events

#### Chat Message

**Event:** `message`
**Payload:** Same as Message type in REST API

#### Session ID

**Event:** `session_id`
**Payload:** `"groupchat-1760986506993"`

#### History Response

**Event:** `get_history` callback
**Payload:**

```json
{
  "history": [...], // Array of Message objects
  "total": 150
}
```

#### Users List Response

**Event:** `get_users` callback
**Payload:**

```json
{
  "users": [
    {
      "id": "socket_123",
      "username": "Alice",
      "type": "human",
      "observe_me": false
    }
  ],
  "agents": [
    {
      "id": "socket_456",
      "username": "SmartBot",
      "type": "agent",
      "capabilities": ["sentiment_analysis", "topic_extraction"]
    }
  ]
}
```

#### Dialectic Response

**Event:** `dialectic` callback
**Payload:** `"Agent response text here"`

---

## Message Metadata Fields

Messages can contain various metadata fields depending on their type:

### Common Fields

- `timestamp` (string): ISO 8601 timestamp
- `loadedFromSession` (boolean): Whether message was loaded from persistent storage

### Join/Leave Messages

- `joinedUser` (string): Username of user who joined/left
- `userType` (string): "human" or "agent"

### Agent Response Messages

- `responseType` (string): Type of response (e.g., "direct_mention", "topic_analysis")
- `confidence` (number): Agent's confidence level (0-1)
- `reasoning` (string): Agent's reasoning for the response

### Agent Data Messages

- `dataType` (string): Type of structured data
- `processedData` (object): The actual data payload
- `broadcast` (boolean): Whether data is public or private to agents

---

## Usage Examples

### Get Server Health

```bash
curl http://localhost:3000/api/stats
```

### Get Recent Messages

```bash
curl "http://localhost:3000/api/history?limit=10"
```

### Get Network Info for LAN Connections

```bash
curl http://localhost:3000/api/network
```

### Connect via WebSocket (JavaScript)

```javascript
const socket = io("http://localhost:3000");

socket.emit("register", {
  username: "MyUsername",
  type: "human",
});

socket.on("message", (message) => {
  console.log(`${message.username}: ${message.content}`);
});

socket.emit("message", {
  content: "Hello from my app!",
  type: "chat",
});
```

---

## Error Handling

All API endpoints return standard HTTP status codes:

- `200`: Success
- `404`: Endpoint not found
- `500`: Server error

WebSocket errors are handled through connection events:

- `connect_error`: Connection failed
- `disconnect`: Connection lost

---

## Rate Limiting & CORS

- **CORS**: Enabled for all origins (`*`)
- **Rate Limiting**: Currently none (LAN-focused design)
- **Authentication**: None (LAN-focused design)
- **WebSocket Timeouts**: 60-second ping timeout, 25-second ping interval
