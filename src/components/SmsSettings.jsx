import React, { useState, useRef, useContext } from "react";
import "../styles/SmsSettings.css";
import headeLogo from "../assets/images/shersoftnavLogo.png";
import close from "../assets/images/CreateCompanyImages/Wrong (1).webp";
import ComboBox from "./ComboBox";
import crtCmp from "../assets/images/CreateCompanyImages/CreateCmp.webp";
import exit from "../assets/images/CreateCompanyImages/Cdbexit.webp";
import { AuthContext } from "../context/AuthContext";
import { useDbContext } from "../context/DbContext";
import axios from "axios";

function SmsSettings({ onClose }) {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const { dbCode } = useDbContext();

  const { agentCode } = useContext(AuthContext);
  const [selectedRow, setSelectedRow] = useState(null);
  const selectref = useRef(null);
  const textareaRef = useRef(null);
  const [smssettingsData, setsmssettingsData] = useState({
    EntryName: "",
    Template: "",
    api: "",
  });
  console.log("smssettingsData=", smssettingsData);

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
      smssettingsData.EntryName === "" ||
      smssettingsData.Template === "" ||
      smssettingsData.api === ""
    ) {
      alert("Enter Data Correctly");
      return;
    }

    try {
      const response = await axios.post(
        `${apiBaseUrl}/main/savesmssettings/${dbCode}`,
        smssettingsData
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
  const fetchsmssettings = async (eName) => {
    try {
      const response = await axios.get(
        `${apiBaseUrl}/main/selectapidatas/${dbCode}/${eName}`
      );

      const smsData = response.data[0];
      console.log("smsData=", smsData);

      setsmssettingsData({
        ...smssettingsData,
        EntryName: smsData.Voucher,
        Template: smsData.MessageBody,
        api: smsData.ApiLink,
      });
    } catch (error) {
      console.error("Error fetching smssettings Values:", error.message);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === "Return") {
      fetchsmssettings(event.target.value);
    }
  };

  return (
    <div className="SmsSettingsRoot">
      <div className="smsSettingsHead">
        <div className="smsSettingsHeadpart">
          <img src={headeLogo} alt="SS" />
          <label>SMS Settings</label>
        </div>
        <div className="smsSettingsHeadControlls">
          <button
            className="smsSettingscontrollsbuttons smsXbutton"
            onClick={onClose}
          >
            <img src={close} alt="X" />
          </button>
        </div>
      </div>
      <div className="smssettingsBody">
        <div className="smssettingsrow">
          <label>Entry Name</label>
          <ComboBox
            options={[
              [1, "RECEIPT"],
              [2, "SALES"],
            ]}
            findedValue={
              Array.isArray(smssettingsData.EntryName)
                ? smssettingsData.EntryName[1]
                : smssettingsData.EntryName
            }
            className="smssettingsSelect"
            comboRef={selectref}
            onInputChange={(e) =>
              setsmssettingsData({
                ...smssettingsData,
                EntryName: e,
              })
            }
            onKeyDown={handleKeyDown}
            onBlur={(e) => fetchsmssettings(e.target.value)}
          />
        </div>
        <div className="smssettingscontent">
          <div className="smssettingstemplate">
            <label>Content as in Template</label>
            <textarea
              className="smssettingstextarea"
              ref={textareaRef}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              value={smssettingsData.Template}
              onChange={(e) =>
                setsmssettingsData({
                  ...smssettingsData,
                  Template: e.target.value,
                })
              }
            />
          </div>
          <div className="smssettingsvariables">
            <div className="smssettingsvariablessec1">
              {[
                "accountNo",
                "customerName",
                "total",
                "grandTotal",
                "gm",
                "netwt",
                "mobileNo",
              ].map((variable) => (
                <div
                  key={variable}
                  className={`smssettingsvarRow ${
                    selectedRow === variable ? "selected" : ""
                  }`}
                  onClick={() => handleRowClick(variable)}
                  draggable
                  onDragStart={(e) => handleDragStart(e, variable)}
                >
                  {`$\{${variable}\}`}
                </div>
              ))}
            </div>
            {/* <div className="smssettingsvariablessec2">
              <div className="smssettingspararow"><label ></label></div>
              <div className="smssettingspararow"></div>
              <div className="smssettingspararow"></div>
              <div className="smssettingspararow"></div>
              <div className="smssettingspararow"></div>
            </div> */}
          </div>
        </div>
        <div className="smssettingsrow">
          <label htmlFor="api">API Link</label>
          <input
            className="smsapiLink"
            type="text"
            id="api"
            value={smssettingsData.api}
            onChange={(e) =>
              setsmssettingsData({
                ...smssettingsData,
                api: e.target.value,
              })
            }
          />
        </div>

        <div className="smssettingsControlls">
          <div
            className="smssettingsButtons"
            style={{ marginLeft: "16.5%" }}
            onClick={handleSave}
          >
            <img src={crtCmp} alt="Save" />
            <label htmlFor="">Save</label>
          </div>
          <div className="smssettingsButtons" onClick={onClose}>
            <img src={exit} alt="Exit" />
            <label htmlFor="">Exit</label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SmsSettings;
