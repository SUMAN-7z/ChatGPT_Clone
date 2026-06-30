import { useContext, useEffect, useState } from "react";
import "../Components/Chat.css";
import { MyContext } from "../Context/MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

const Chat = () => {
  const { newChat, prevChats, reply } = useContext(MyContext);
  const [latestReply, setLatestReplay] = useState(null);
  useEffect(() => {
    if (reply === null) {
      setLatestReplay(null);
      return;
    }
    // ?. avoids an error if prevChats is undefined; ! checks if length is 0 or undefined.
    if (!prevChats?.length) return;
    //const reply = "Hello how are you today";
    // it convert it into array of words ["Hello", "how", "are", "you", "today"]
    const content = reply.split(" ");
    let currentWordIndex = 0;
    const TYPING_SPEED = 40;

    const interval = setInterval(() => {
      setLatestReplay(content.slice(0, currentWordIndex + 1).join(" "));
      currentWordIndex++;
      //clearInterval() is used to stop an interval that was started with setInterval().
      if (currentWordIndex >= content.length) clearInterval(interval);
    }, TYPING_SPEED);
  }, [prevChats, reply]);
  const username = localStorage.getItem("username");
  return (
    <>
      {newChat && <h1>Hello, {username}! What can I help you with today?</h1>}
      <div className="chats">
        {prevChats?.slice(0, -1).map((chat, idx) => (
          <div
            className={chat.role === "user" ? "userDiv" : "gptDiv"}
            key={idx}
          >
            {chat.role === "user" ? (
              <p className="userMessage">{chat.content}</p>
            ) : (
              <ReactMarkdown rehypePlugins={rehypeHighlight}>
                {chat.content}
              </ReactMarkdown>
            )}
          </div>
        ))}

        {prevChats.length > 0 && (
          <>
            {latestReply !== null ? (
              <div className="gptDiv" key={"typing"}>
                <ReactMarkdown rehypePlugins={rehypeHighlight}>
                  {latestReply}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="gptDiv" key={"non-typing"}>
                <ReactMarkdown rehypePlugins={rehypeHighlight}>
                  {prevChats[prevChats.length - 1].content}
                </ReactMarkdown>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Chat;
