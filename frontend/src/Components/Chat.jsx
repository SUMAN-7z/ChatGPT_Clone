import { useContext, useEffect } from "react";
import "../Components/Chat.css";
import { MyContext } from "../Context/MyContext";

const Chat = () => {
  const { newChat, setNewChat, prevChats, setPrevChats } =
    useContext(MyContext);
  return (
    <>
      {newChat && <h1>Start a new Chat</h1>}
      <div className="chats">
        {prevChats?.map((chat, idx) => (
          <div
            className={chat.role === "user" ? "userDiv" : "gptDiv"}
            key={idx}
          >
            {chat.role === "user" ? (
              <p className="userMessage">{chat.content}</p>
            ) : (
              <p className="gptMessage">{chat.content}</p>
            )}
          </div>
        ))}
      </div>

      
    </>
  );
};

export default Chat;
