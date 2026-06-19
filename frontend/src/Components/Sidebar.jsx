import "../Components/Sidebar.css";
const Sidebar = () => {
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
