import "../Components/Sidebar.css";
import { useContext } from "react";
import MyContext from "../Context/MyContext";

const Sidebar = () => {
  const { allThreads, setAllThreads } = useContext(MyContext);
  return (
    <section className="sidebar">
      <button>
        <img src="src/asset/chatgpt-icon.png" alt="gptLogo" className="logo" />
        <span>
          <i className="fa-solid fa-pen-to-square"></i>
        </span>
      </button>
      <ul className="history">
        <li>history</li>
        <li>history</li>
        <li>history</li>
      </ul>
      <div className="sign">
        <p>By Suman &hearts;</p>
      </div>
    </section>
  );
};

export default Sidebar;
