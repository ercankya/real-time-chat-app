// Chat.js

import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import UserList from "./UserList";

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [userList, setUserList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage.trim() === "") return;

    const messageData = {
      room,
      author: username,
      message: currentMessage,
      time: `${new Date(Date.now()).getHours()}:${new Date(
        Date.now()
      ).getMinutes()}`,
    };

    await socket.emit("send_message", messageData);
    setMessageList((list) => [...list, messageData]);
    setCurrentMessage("");
  };

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      setMessageList((list) => [...list, data]);
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [socket]);

  useEffect(() => {
    const handleUserList = (users) => {
      setUserList(users);
    };

    socket.on("user_list", handleUserList);

    return () => {
      socket.off("user_list", handleUserList);
    };
  }, [socket]);
  console.log("Kullanıcılar", userList);

  return (
    <div className="chat-container">
      <div className="chat-header">
        <p>Real-Time-Chat  {room}</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map(({ author, message, time }, index) => (
            <div
              key={index}
              className={`message ${username === author ? "you" : "other"}`}
            >
              <div className="message-content">
                <p>{message}</p>
              </div>
              <div className="message-meta">
                <p className="time">{time}</p>
                <p className="author">{author}</p>
              </div>
            </div>
          ))}
        </ScrollToBottom>
      </div>
            {/* Kullanıcı listesi burada */}
      <UserList users={userList} />
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Type a message..."
          onChange={(event) => setCurrentMessage(event.target.value)}
          onKeyPress={(event) => event.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
