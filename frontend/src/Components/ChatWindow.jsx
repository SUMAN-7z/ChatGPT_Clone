import "../Components/ChatWindow.css";
import Chat from "../Components/Chat.jsx";
import { MyContext } from "../Context/MyContext.jsx";
import { useContext } from "react";
import { useEffect } from "react";
import axios from "axios";

export default function ChatWindow() {
  const { reply, setReply, prompt, setPrompt, currThreadId, setCurrThreadId } =
    useContext(MyContext);

  const getReply = async () => {
    const data = {
      message: prompt,
      threadId: currThreadId,
    };
    try {
      const response = await axios.post("http://localhost:8080/api/chat", data);
      setReply(response.data.reply);
      setPrompt("");
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <>
      <div className="chatWindow">
        <div className="navbar">
          <span>
            ChatGPT <i className="fa-solid fa-angle-down"></i>
          </span>

          <div className="userIconDiv">
            <span className="userIcon">
              <i className="fa-solid fa-user"></i>
            </span>
          </div>
        </div>
        <Chat></Chat>
        <div className="chatInput">
          <div className="inputBox">
            <input
              type="text"
              placeholder="Ask anything"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => (e.key === "Enter" ? getReply() : "")}
            />
            <div id="submit" onClick={getReply}>
              <i className="fa-solid fa-paper-plane"></i>
            </div>
          </div>
          <p className="info">
            ChatGPT can make mistakes. Check important info.
          </p>
        </div>
      </div>
    </>
  );
}
