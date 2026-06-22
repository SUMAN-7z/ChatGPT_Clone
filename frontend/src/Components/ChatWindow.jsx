import "../Components/ChatWindow.css";
import Chat from "../Components/Chat.jsx";
import { MyContext } from "../Context/MyContext.jsx";
import { useContext, useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { ScaleLoader } from "react-spinners";

export default function ChatWindow() {
  const [loading, setLoading] = useState(false);
  const {
    reply,
    setReply,
    prompt,
    setPrompt,
    currThreadId,
    setCurrThreadId,
    prevChats,
    setPrevChats,
  } = useContext(MyContext);

  const getReply = async () => {
    setLoading(true);
    const data = {
      message: prompt,
      threadId: currThreadId,
    };
    try {
      const response = await axios.post("http://localhost:8080/api/chat", data);
      console.log(response.data.reply);
      setReply(response.data.reply);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };
  useEffect(() => {
    if (prompt && reply) {
      setPrevChats((prevChats) => [
        ...prevChats,
        { role: "user", content: prompt },
        { role: "assistant", content: reply },
      ]);
    }
    setPrompt("");
  }, [reply]);
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
        <ScaleLoader color="#fff" loading={loading}></ScaleLoader>
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
