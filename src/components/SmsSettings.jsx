import React, { useState, useRef, useEffect, useContext } from "react";
import "../styles/SmsSettings.css";
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

function SmsSettings() {
  return <div className="SmsSettingsRoot">SmsSettings</div>;
}

export default SmsSettings;
