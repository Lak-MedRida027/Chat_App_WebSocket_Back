# Chat Application Backend

This repository contains the backend server for a real-time chat application. It is built with Node.js and Express.js, using MongoDB for the database and Socket.IO for handling WebSocket connections. The server manages user authentication, one-on-one chats, group chats, and real-time messaging.

## Features

*   **User Authentication**: Secure user registration and login using JSON Web Tokens (JWT).
*   **Real-time Messaging**: Instant message delivery using Socket.IO.
*   **One-on-One Chat**: Create or access private chats between two users.
*   **Group Chat**:
    *   Create group chats with multiple users.
    *   Add or remove users from the group.
    *   Rename group chats.
    *   Assign a group administrator.
*   **User Search**: Search for registered users by name or email.
*   **Message & Chat History**: Fetch all chats for a user and all messages within a specific chat.
*   **Typing Indicators**: Real-time feedback when a user is typing a message.

## Tech Stack

*   **Backend**: Node.js, Express.js
*   **Database**: MongoDB with Mongoose ODM
*   **Real-time Communication**: Socket.IO
*   **Authentication**: JSON Web Tokens (jsonwebtoken), bcryptjs
*   **Middleware**: express-async-handler, morgan
*   **Environment Variables**: dotenv
*   **Development**: nodemon

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   Node.js (v14 or higher)
*   npm
*   MongoDB (local instance or a cloud service like MongoDB Atlas)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/lak-medrida027/chat_app_websocket_back.git
    cd chat_app_websocket_back
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Create a `.env` file** in the root directory and add the following environment variables. Replace the placeholder values with your own configuration.

    ```env
    PORT=5000
    DB_URI=your_mongodb_connection_string
    JWT_SECRET_KEY=your_jwt_secret
    JWT_EXPIRE_TIME=30d
    ```

4.  **Start the server:**
    ```sh
    npm start
    ```
    The server will start on the port specified in your `.env` file (defaulting to 5000).

## API Endpoints

All endpoints are prefixed with `/api`. Routes marked with `(Protected)` require a valid JWT Bearer token in the `Authorization` header.

### Authentication (`/auth`)

| Method | Endpoint      | Description           |
| :----- | :------------ | :-------------------- |
| `POST` | `/signup`     | Registers a new user. |
| `POST` | `/login`      | Logs in an existing user and returns a token. |

### Users (`/users`)

| Method | Endpoint | Description                               |
|:-------|:---------|:------------------------------------------|
| `GET`  | `/`      | (Protected) Searches for users by name or email via a `search` query parameter. |
| `GET`  | `/all`   | (Protected) Gets all users except the current logged-in user. |

### Chats (`/chats`)

| Method | Endpoint            | Description                                        |
| :----- | :------------------ | :------------------------------------------------- |
| `POST` | `/`                 | (Protected) Creates or accesses a one-on-one chat with a user. |
| `GET`  | `/`                 | (Protected) Fetches all chats for the logged-in user. |
| `POST` | `/group`            | (Protected) Creates a new group chat.              |
| `PUT`  | `/renameGroup`      | (Protected) Renames an existing group chat.        |
| `PUT`  | `/addToGroup`       | (Protected) Adds a user to a group chat.           |
| `PUT`  | `/removeFromGroup`  | (Protected) Removes a user from a group chat.      |

### Messages (`/messages`)

| Method | Endpoint      | Description                               |
| :----- | :------------ | :---------------------------------------- |
| `POST` | `/`           | (Protected) Sends a message to a chat.    |
| `GET`  | `/:chatId`    | (Protected) Fetches all messages for a specific chat. |

## Socket.IO Events

The server uses Socket.IO to handle real-time communication.

### Client to Server Events

| Event           | Payload                  | Description                                            |
| :-------------- | :----------------------- | :----------------------------------------------------- |
| `setup`         | `userData` (Object)      | Emitted when a client connects to establish a user-specific room. |
| `join chat`     | `room` (String: chatId)  | Emitted to make a client join a specific chat room.    |
| `new message`   | `newMsgRecieved` (Object)| Emitted when a client sends a new message.             |
| `typing`        | `room` (String: chatId)  | Emitted when a client starts typing in a chat.         |
| `stop typing`   | `room` (String: chatId)  | Emitted when a client stops typing in a chat.          |
| `finish`        | `userData` (Object)      | Emitted when a user disconnects or logs out.           |

### Server to Client Events

| Event              | Payload                | Description                                                               |
| :----------------- | :--------------------- | :------------------------------------------------------------------------ |
| `connected`        | -                      | Emitted to the client to confirm successful socket connection.            |
| `message recieved` | `newMsgRecieved` (Object)| Broadcast to all users in a chat room when a new message is received. |
| `typing`           | -                      | Broadcast to other clients in a room that a user has started typing.      |
| `stop typing`      | -                      | Broadcast to other clients in a room that a user has stopped typing.      |

## Project Structure

```
chat_app_websocket_back/
├── package.json
└── server/
    ├── server.js          # Main server entry point & Socket.IO setup
    ├── config/
    │   └── db.js          # MongoDB connection
    ├── Models/
    │   ├── userModel.js
    │   ├── chatModel.js
    │   └── messageModel.js
    ├── Routers/
    │   ├── index.js       # Mounts all routes
    │   ├── authRoute.js
    │   ├── userRoute.js
    │   ├── chatRoute.js
    │   └── messageRoute.js
    ├── Services/
    │   ├── authService.js
    │   ├── userService.js
    │   ├── chatService.js
    │   └── messageService.js
    ├── middleware/
    │   └── authMiddleware.js # JWT authentication middleware
    └── utils/
        └── createToken.js    # JWT generation utility
