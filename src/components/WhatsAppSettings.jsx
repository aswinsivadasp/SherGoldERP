import React, { useState, useRef, useContext } from "react";
import "../styles/WhatsAppSettings.css";
import headeLogo from "../assets/images/shersoftnavLogo.png";
import close from "../assets/images/CreateCompanyImages/Wrong (1).webp";
import ComboBox from "./ComboBox";
import send from "../assets/images/CreateCompanyImages/send.webp";
import exit from "../assets/images/CreateCompanyImages/Cdbexit.webp";
import { AuthContext } from "../context/AuthContext";
import { useDbContext } from "../context/DbContext";
import axios from "axios";

function WhatsAppSettings({ onClose }) {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const { dbCode } = useDbContext();

  const { agentCode } = useContext(AuthContext);
  const [selectedRow, setSelectedRow] = useState(null);
  const selectref = useRef(null);
  const textareaRef = useRef(null);
  const [WhatsAppsettingsData, setWhatsAppsettingsData] = useState({
    EntryName: "",
    Message: "",
    api: "",
  });
  console.log("WhatsAppsettingsData=", WhatsAppsettingsData);

  const handleRowClick = (rowName) => {
    setSelectedRow(rowName);
  };

  const handleDragStart = (e, variable) => {
    e.dataTransfer.setData("text/plain", `\${${variable}}`);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const variable = e.dataTransfer.getData("text/plain");

    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const startPos = textarea.selectionStart;
      const endPos = textarea.selectionEnd;
      const text = textarea.value;

      textarea.value =
        text.substring(0, startPos) + variable + text.substring(endPos);
      textarea.selectionStart = textarea.selectionEnd =
        startPos + variable.length;

      textarea.focus();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSave = async () => {
    if (
      WhatsAppsettingsData.EntryName === "" ||
      WhatsAppsettingsData.Message === "" ||
      WhatsAppsettingsData.api === ""
    ) {
      alert("Enter Data Correctly");
      return;
    }

    try {
      const response = await axios.post(
        `${apiBaseUrl}/main/saveWhatsAppsettings/${dbCode}`,
        WhatsAppsettingsData
      );

      if (response.status === 200) {
        alert("Entry Saved");
      } else {
        // Handle other response statuses or errors
        console.error("Error submitting data:", response.data);
        alert("Error submitting data:");
      }
    } catch (error) {
      console.error("Error saving rateClass Values:", error.message);
    }
  };
  const fetchWhatsAppsettings = async (eName) => {
    try {
      const response = await axios.get(
        `${apiBaseUrl}/main/selectapidatas/${dbCode}/${eName}`
      );

      const smsData = response.data[0];
      console.log("smsData=", smsData);

      setWhatsAppsettingsData({
        ...WhatsAppsettingsData,
        EntryName: smsData.Voucher,
        Message: smsData.MessageBody,
        api: smsData.ApiLink,
      });
    } catch (error) {
      console.error("Error fetching WhatsAppsettings Values:", error.message);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === "Return") {
      fetchWhatsAppsettings(event.target.value);
    }
  };

  return (
    <div className="WhatsAppsettingsRoot">
      <div className="WhatsAppsettingsHead">
        <div className="WhatsAppsettingsHeadpart">
          <img src={headeLogo} alt="SS" />
          <label>WhatsApp Settings</label>
        </div>
        <div className="WhatsAppsettingsHeadControlls">
          <button
            className="WhatsAppsettingscontrollsbuttons smsXbutton"
            onClick={onClose}
          >
            <img src={close} alt="X" />
          </button>
        </div>
      </div>
      <div className="WhatsAppsettingsBody">
        <div className="WhatsAppsettingsrow">
          <label>Entry Name</label>
          <ComboBox
            options={[
              [1, "RECEIPT"],
              [2, "SALES"],
            ]}
            findedValue={
              Array.isArray(WhatsAppsettingsData.EntryName)
                ? WhatsAppsettingsData.EntryName[1]
                : WhatsAppsettingsData.EntryName
            }
            className="WhatsAppsettingsSelect"
            comboRef={selectref}
            onInputChange={(e) =>
              setWhatsAppsettingsData({
                ...WhatsAppsettingsData,
                EntryName: e,
              })
            }
            onKeyDown={handleKeyDown}
            onBlur={(e) => fetchWhatsAppsettings(e.target.value)}
          />
        </div>
        <div className="WhatsAppsettingscontent">
          <div className="WhatsAppsettingsMessage">
            <label>Message</label>
            <textarea
              className="WhatsAppsettingstextarea"
              ref={textareaRef}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              value={WhatsAppsettingsData.Message}
              onChange={(e) =>
                setWhatsAppsettingsData({
                  ...WhatsAppsettingsData,
                  Message: e.target.value,
                })
              }
            />
          </div>
          <div className="WhatsAppsettingsvariables">
            <div className="WhatsAppsettingsvariablessec1">
             




            </div>
           
          </div>
        </div>
        <div className="WhatsAppsettingsrow">
          <label htmlFor="api">Sender Number</label>
          <input
            className="smsapiLink"
            type="text"
            id="api"
            value={WhatsAppsettingsData.api}
            onChange={(e) =>
              setWhatsAppsettingsData({
                ...WhatsAppsettingsData,
                api: e.target.value,
              })
            }
          />
        </div>

        <div className="WhatsAppsettingsControlls">
          <div
            className="WhatsAppsettingsButtons"
            style={{ marginLeft: "16.5%" }}
          >
            <img src={send} alt="Send" />
            <label htmlFor="">Send</label>
          </div>
          <div className="WhatsAppsettingsButtons" onClick={onClose}>
            <img src={exit} alt="Exit" />
            <label htmlFor="">Exit</label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WhatsAppSettings;
