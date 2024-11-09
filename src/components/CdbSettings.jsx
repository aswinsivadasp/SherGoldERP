import React, { useState, useRef, useEffect, useContext } from "react";
import "../styles/CdbSettings.css";
import headeLogo from "../assets/images/shersoftnavLogo.png";

import close from "../assets/images/CreateCompanyImages/Wrong (1).webp";
import save from "../assets/images/CreateCompanyImages/Diskette.webp";
import find from "../assets/images/CreateCompanyImages/Magnifying glass.webp";
import edit from "../assets/images/CreateCompanyImages/Editing (1).webp";
import del from "../assets/images/CreateCompanyImages/Bin.webp";
import exit from "../assets/images/CreateCompanyImages/Exit (1).webp";
import clear from "../assets/images/CreateCompanyImages/image 24.webp";

import toggleClose from "../assets/images/xred.webp";
import ComboBox from "./ComboBox";
import axios from "axios";
import EmailVerification from "./EmailVerification";
import crtCmp from "../assets/images/CreateCompanyImages/CreateCmp.webp";

function CdbSettings({ onClose }) {
  const [verifyEmailModal, setVerifyEmailModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [compData, setCompData] = useState({
    email: "",
  });

  const openEmail = (email) => {
    const generatedOtp = Math.floor(100000 + Math.random() * 900000);
    setOtp(generatedOtp);
    setVerifyEmailModal(true);
  };

  const [location, setLocation] = useState("");
  const validateEmail = (email) => {
    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSave = async () => {
    if(compData.email === "") {
      alert("Enter Company Code")
      return
    }
    openEmail();
  };
  const handleSaveCustomercode = async (verified) => {
    if (!verified) {
      return;
    }
    else{
      localStorage.setItem("customerCode", compData.email);
    }
  };

  return (
    <div className="cdbSettingsRoot">
      <button
        className=" cdbsettingscontrollsbuttons cdbstngsbutton"
        onClick={onClose}
        style={{ right: "1%" }}
      >
        <img src={close} alt="X" />
      </button>
      <div className="cdbsettingsBody">
        <div className="dbsettingsnavbar">
          <div className="dbsettingsnavbarBtn" style={{ marginLeft: "1%" }} onClick={handleSave}>
            <img src={crtCmp} alt="Crt" /> Save
          </div>
        </div>
        <div className="cdbsettingsrow">
          <label htmlFor="">Customer Code</label>
          <input
            type="email"
            value={compData.email}
            onChange={(e) =>
              setCompData({ ...compData, email: e.target.value })
            }
            // onKeyDown={(e) => handleKeyDown(e, gstNoRef)}
          />{" "}
        </div>
      </div>
      {verifyEmailModal && (
        <EmailVerification
          onClose={() => {
            setVerifyEmailModal(false);
          }}
          data={compData}
          generatedOtp={otp}
          onVerified={(e) => {
             handleSaveCustomercode(e);
          }}
        />
      )}
    </div>
  );
}

export default CdbSettings;
