import "./App.css";
import Sidebar from "./Components/Sidebar.jsx";
import ChatWindow from "./Components/ChatWindow.jsx";
import { MyContext } from "./Context/MyContext.jsx";

function App() {
  const providerValues = {};

  return (
    <div className="app">
      <MyContext.Provider value={providerValues}>
        <Sidebar />
        <ChatWindow />
      </MyContext.Provider>
    </div>
  );
}

export default App;
