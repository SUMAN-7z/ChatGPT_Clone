import "../Components/ChatWindow.css";
import Chat from "../Components/Chat.jsx";
import { MyContext } from "../Context/MyContext.jsx";
import { useContext, useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { ScaleLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { successHandler } from "../Error_Success/Es.jsx";

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
    setNewChat,
    mode,
    setMode,
    setIsLoggedIn
  } = useContext(MyContext);

  const [isOpen, setIsOpen] = useState(false);
  const getReply = async () => {
    setLoading(true);
    setNewChat(false);
    const data = {
      message: prompt,
      threadId: currThreadId,
    };
    const token = localStorage.getItem("token");
    const headers = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.post(
        "http://localhost:8080/api/chat",
        data,
        headers,
      );
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

  const dropdownClick = () => {
    setIsOpen(!isOpen);
  };

  const Mode = () => {
    setMode(!mode);
  };
  useEffect(() => {}, [mode]);

  const Navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    successHandler("Loggedout Successfully");
    setIsLoggedIn(false);
    setTimeout(() => {
      Navigate("/login");
    }, 1000);
  };
  return (
    <>
      <div className={`chatWindow ${mode ? "day" : "night"}`}>
        <div className="navbar">
          <span>
            ChatGPT <i className="fa-solid fa-angle-down"></i>
          </span>

          <div className="userIconDiv" onClick={dropdownClick}>
            <span className="userIcon">
              <i className="fa-solid fa-user"></i>
            </span>
          </div>
        </div>
        {isOpen && (
          <div className="dropDown">
            <div className="dropDownItem">
              <i className="fa-solid fa-gear"></i>Settings
            </div>
            <div className="dropDownItem">
              <i className="fa-solid fa-file-arrow-up"></i>Upgrade Plan
            </div>
            <div className="dropDownItem" onClick={handleLogout}>
              <i className="fa-solid fa-right-from-bracket"></i>
              LogOut
            </div>
            <div onClick={Mode} className="dropDownItem">
              <i className="fa-solid fa-sun"></i>Mode
            </div>
          </div>
        )}
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
      <ToastContainer />
    </>
  );
}
