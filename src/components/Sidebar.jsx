// Sidebar.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";
import reg from "../assets/images/registration.png";
import rec from "../assets/images/receipt.png";
import redeem from "../assets/images/gift.png";
import backup from "../assets/images/backup.png";
import dash from "../assets/images/dashboard.png";
import exit from "../assets/images/exit.png";
import ss from "../assets/images/ssmobv.png";
import toggleClose from "../assets/images/xred.webp";
const Sidebar = ({ toggleSidebar, isSidebarOpen }) => {
  const navigate = useNavigate();

  return (
    <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
      <div className="sidebarHead">
        <img src={ss} alt="SS" onClick={toggleSidebar}/>

        <span onClick={toggleSidebar}> SherGold ERP</span>
        {/* <button className="close-btn" onClick={toggleSidebar}>
          <img src={toggleClose} alt="X" />
        </button> */}
      </div>
      <button
        className="sidebar-item"
        onClick={() => navigate("/registration")}
        disabled
      >
        <img src={reg} alt="Registration" />
        <span>Registration</span>
      </button>
      <button className="sidebar-item" onClick={() => navigate("/receipt")}>
        <img src={rec} alt="Cash Receipt" />
        <span>Cash Receipt</span>
      </button>
      <button className="sidebar-item" onClick={() => navigate("/redeem")}>
        <img src={redeem} alt="Redeem" />
        <span>Redeem</span>
      </button>
      <button className="sidebar-item">
        <img src={backup} alt="Backup" />
        <span>Backup</span>
      </button>
      <button className="sidebar-item" onClick={() => navigate("/report")}>
        <img src={dash} alt="Report" />
        <span>Report</span>
      </button>
      <button className="sidebar-item" onClick={() => navigate("/")}>
        <img src={exit} alt="Exit" />
        <span>Exit</span>
      </button>
    </div>
  );
};

export default Sidebar;
