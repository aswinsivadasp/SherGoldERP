import React, { useRef, useEffect, useState } from "react";
import "../styles/SchemeRegistration.css";
import "../styles/RateSettings.css";
import { FaRegWindowMinimize } from "react-icons/fa";
import { IoMdExpand } from "react-icons/io";
import { IoMdClose } from "react-icons/io";

import expand from "../assets/images/resize.png";
import exit from "../assets/images/close.png";
import ssLogo from "../assets/images/sslogo.png";
import minimize from "../assets/images/mini.png";
import maximize from "../assets/images/maximize.png";
import close from "../assets/images/close.png";

import headeLogo from "../assets/images/shersoftnavLogo.png";
import saveImg from "../assets/images/SaveImage.png";
import printImg from "../assets/images/Printer.png";
import clearImg from "../assets/images/Document.png";
import findImg from "../assets/images/search.png";
import editImg from "../assets/images/Editing.png";
import deleteImg from "../assets/images/Delete.png";
import exitImg from "../assets/images/Exit1.png";
import playandpause from "../assets/images/Play and pause button.png";
import leftarrow from "../assets/images/Play button arrowhead left.png";
import rightarrow from "../assets/images/Play button arrowhead right.png";
import playandpauseRight from "../assets/images/Play and pause button right.png";
import binImg from "../assets/images/Bin.png";
import axios from "axios";
import ComboBox from "./ComboBox";
import { Hidden } from "@mui/material";
import { useDbContext } from "../context/DbContext";

function RateSettings({ onClose }) {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const { dbCode } = useDbContext();
  ////console.log("rateSettings=",dbCode);
  

  const tableContainerRef = useRef(null);
  const [tableData, setTableData] = useState([]);

 

  useEffect(() => {
    const fetchrateClass = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/main/selectall/${dbCode}`);
        const rateClass = response.data.map((item) => ({
          ...item,
          newRate: "",
        }));
        setTableData(rateClass);
      } catch (error) {
        console.error("Error fetching rateClass Values:", error.message);
      }
    };

    fetchrateClass();


    
  }, [apiBaseUrl]);

  // ////console.log("rateclassdata", tableData);
  const fetchrateClass = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/main/selectall/${dbCode}`);
      const rateClass = response.data.map((item) => ({
        ...item,
        newRate: "",

      }));
      setTableData(rateClass);
    } catch (error) {
      console.error("Error fetching rateClass Values:", error.message);
    }
  };

  const handleInputChange = (index, value) => {
    const updatedTableData = [...tableData];
    updatedTableData[index].newRate = value;
    setTableData(updatedTableData);
  };

  const handleSave = async () => {
    try {
      const response = await axios.post(
        `${apiBaseUrl}/main/savecurrentRates/${dbCode}`,
        tableData
      );
      // ////console.log("Save response:", response.data);

      // Handle success message or other actions

      if (response.status === 200) {
        alert("Rate Updated");
      } else {
        // Handle other response statuses or errors
        console.error("Error submitting data:", response.data);
        alert("Error submitting data:");
      }
    } catch (error) {
      console.error("Error saving rateClass Values:", error.message);
    }
  };

  const handleKeyDownTable = (event, rowIndex, columnIndex) => {
    if (event.key === "Enter" || event.key === "Return") {
      event.preventDefault();

      const tableContainer = tableContainerRef.current;
      const rows = tableContainer.querySelectorAll(
        ".ratesettingsDataTableBodyStyletr"
      );

      // Determine the next row index
      const nextRowIndex = rowIndex < rows.length - 1 ? rowIndex + 1 : 0;

      // Find the input field in the next row, same column
      const nextInput =
        rows[nextRowIndex]?.cells[columnIndex]?.querySelector("input");

      if (nextInput) {
        nextInput.focus();
      }
    }
  };


   //////////current date///////////

  const getCurrentDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const [currentDate, setCurrentDate] = useState({
  
    date: getCurrentDate(),

  });

  return (
    <div className="regmodal ratesettingsmodal">
      <div className="report_dialogHead ratesettingsHead">
        <div className="report_dialogHeadpart">
          <img src={ssLogo} alt="SS" />
          <label>Rate Settings</label>
        </div>
        <div className="report_dialogHeadControlls">
          <button className="controllsbuttons xbutton" onClick={onClose}>
            <img src={close} alt="X" />
          </button>
        </div>
      </div>
      {/*............................ Navbar.............................................. */}
      <div className="schemeReg_navbar rateSettingsNavbar">
        <button
          style={{
            border: "none",
            backgroundColor: "transparent",
            marginLeft: "2%",
          }}
          className={`schemeNav_items }`}
          // ref={savebtnRef}
          // onClick={handleSubmit}

          //  disabled={saveDisabled}
          onClick={handleSave}
        >
          <div className="schemeReg_buttonImage">
            <img src={saveImg} alt="SaveImg" />
          </div>
          Save
        </button>

        <button
          style={{ border: "none", backgroundColor: "transparent" }}
          className="schemeNav_items"
          onClick={onClose}
        >
          <div className="schemeReg_buttonImage">
            <img src={exitImg} alt="exitImg" />
          </div>
          Exit
        </button>
      </div>
      {/*............................ NavbarEnd.............................................. */}

      <div className="ratesettingsBody">
        <div className="ratesettingsdaterow">
          <label htmlFor="">Date</label>
          <input type="date"
           value={currentDate.date}
           onChange={(e) =>
            setCurrentDate({
              ...currentDate,
              date: e.target.value,
            })
          }
           />
        </div>
        <div className="ratesettingsTablerow"   ref={tableContainerRef}>
          <table className="ratesettingsTable">
            <thead className="schRatesettingsTableHead">
              <tr>
                <th className="TableHeadrateclass">Rate Class</th>
                <th style={{ display: "none" }}>id</th>
                <th className="TableHeadrate">Current Rate</th>

                <th className="TableHeadrate">New Rate</th>
              </tr>
            </thead>
            <tbody className="ratesettingstableBody">
              {tableData.map((rowData, rowIndex) => (
                <tr key={rowIndex} className="ratesettingsDataTableBodyStyletr" >
                  <td className="DataTableDataBoxrateclass">
                    {rowData.rateClass}
                  </td>
                  <td
                    className="DataTableDataBoxrateclass"
                    style={{ display: "none" }}
                  >
                    {rowData.id}
                  </td>
                  <td
                    className="DataTableDataBoxrate"
                    style={{ textAlign: "right" }}
                  >
                    {rowData.currentRate}
                  </td>

                  <td
                    className="DataTableDataBoxrate"
                    style={{ textAlign: "right" }}
                  >
                    <input
                      style={{ border: "none", width: "100%", height: "100%" }}
                      onChange={(e) =>
                        handleInputChange(rowIndex, e.target.value)
                      }
                      onKeyDown={(e) =>
                        handleKeyDownTable(e, rowIndex, 3)
                      }                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default RateSettings;
