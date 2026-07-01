import "./App.css";
import Sidebar from "./Components/Sidebar.jsx";
import ChatWindow from "./Components/ChatWindow.jsx";
import { MyContext } from "./Context/MyContext.jsx";
import { useContext, useState } from "react";
import { v1 as uuidv1 } from "uuid";
import Signup from "./Components/Signup.jsx";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./Components/Login.jsx";
import LoginCheck from "./Context/RefreshHandler.jsx";
import RefreshHandler from "./Context/RefreshHandler.jsx";
function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [newChat, setNewChat] = useState(true);
  const [prevChats, setPrevChats] = useState([]);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [allThreads, setAllThreads] = useState([]);
  const [mode, setMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const providerValues = {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setCurrThreadId,
    newChat,
    setNewChat,
    prevChats,
    setPrevChats,
    allThreads,
    setAllThreads,
    mode,
    setMode,
    isLoggedIn,
    setIsLoggedIn,
  };


  
  return (
    <MyContext.Provider value={providerValues}>
      <RefreshHandler />
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRouteing
              isLoggedIn={isLoggedIn}
              element={
                <div className="app">
                  <Sidebar />
                  <ChatWindow />
                </div>
              }
            />
          }
        />
      </Routes>
    </MyContext.Provider>
  );
}

const PrivateRouteing = ({ isLoggedIn, element }) => {
  return isLoggedIn ? element : <Navigate to="/login" />;
};

export default App;
