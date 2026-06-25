import "../Components/Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "../Context/MyContext";
import axios from "axios";
import { v1 as uuidv1 } from "uuid";

const Sidebar = () => {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setCurrThreadId,
    setPrevChats,
  } = useContext(MyContext);
  const getAllThreads = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/thread");
      const filteredData = res.data.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));
      setAllThreads(filteredData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, [currThreadId]);

  const createNewChat = () => {
    setNewChat(true);
    setReply(null);
    setPrompt("");
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  };
  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);
    try {
      const result = await axios.get(
        `http://localhost:8080/api/thread/${newThreadId}`,
      );
      const response = result.data.messages;
      setPrevChats(response);
      setNewChat(false);
      setReply(null);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <section className="sidebar">
      <button onClick={createNewChat}>
        <img src="src/asset/chatgpt-icon.png" alt="gptLogo" className="logo" />
        <span>
          <i className="fa-solid fa-pen-to-square"></i>
        </span>
      </button>
      <ul className="history">
        {allThreads?.map((thread, idx) => (
          <li key={idx} onClick={(e) => changeThread(thread.threadId)}>
            {thread.title}{" "}
          </li>
        ))}
      </ul>
      <div className="sign">
        <p>By Suman &hearts;</p>
      </div>
    </section>
  );
};

export default Sidebar;
