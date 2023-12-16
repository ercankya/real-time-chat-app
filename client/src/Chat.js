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
    <div className="chat-window">
      <div className="chat-content">
        <div className="chat-header">
          <div className="chat-title">
            <p>Real-Time-Chat</p>
          </div>
          <div className="chat-roomId">Room : {room}</div>
        </div>
        <div className="chat-body">
          <ScrollToBottom className="message-container">
            {messageList.map((messageContent) => {
              return (
                <div
                  className="message"
                  id={username === messageContent.author ? "you" : "other"}
                >
                  <div>
                    <div className="message-content">
                      <p>{messageContent.message}</p>
                    </div>
                    <div className="message-meta">
                      <p id="time">{messageContent.time}</p>
                      <p id="author">{messageContent.author}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </ScrollToBottom>
        </div>
        <div className="chat-footer">
          <input
            type="text"
            value={currentMessage}
            placeholder="Type a message..."
            onChange={(event) => setCurrentMessage(event.target.value)}
            onKeyPress={(event) => event.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>&#9658;</button>
        </div>
      </div>
      <div className="user-content">
        <UserList users={userList}/>
      </div>
    </div>
  );
}

export default Chat;
