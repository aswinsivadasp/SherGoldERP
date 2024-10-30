import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/OpenCompany.css";
import { FaRegWindowMinimize } from "react-icons/fa";
import { IoMdExpand } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import minimize from "../assets/images/minimize.png";
import expand from "../assets/images/resize.png";
import exit from "../assets/images/CreateCompanyImages/Cdbexit.webp";
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
// import ComboBox from "shersoft-combov1";
import ComboBox from "./ComboBox";
import updatedComboBox from "./ComboBox";
import toggleClose from "../assets/images/xred.webp";
import close1 from "../assets/images/close.png";
import close from "../assets/images/CreateCompanyImages/Wrong (1).webp";
import ssLogo from "../assets/images/sslogo.png";
import opnCmp from "../assets/images/CreateCompanyImages/openCmp.webp";

import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthContext";
import { ClipLoader } from "react-spinners";
import "jspdf-autotable";

function OpenCompany({ onClose, customerCode }) {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const tableContainerRef = useRef(null);
  const [tableData, setTableData] = useState([]);
  const [cmpData, setCmpData] = useState({
    Cdata: "",
  });
  const [highlightedRow, setHighlightedRow] = useState(-1);
  const [selectedRowData, setSelectedRowData] = useState(null);
  ////console.log("selectedRowData1==", selectedRowData);
  const tableRef = useRef(null);
  const selectcmpref = useRef(null);
  const spinnerProps = {
    color: "#026CC3",
    height: 12,
    width: 5,
    radius: 1,
    margin: 3,
    size: 30,
    speedMultiplier: 0.8, // Slightly slower animation
    css: {
      opacity: "0.8", // Slightly transparent
    },
  };

  const [companyCode, setCompanyCode] = useState([]);

  // ////console.log(companyCode);

  useEffect(() => {
    const fetchCmpname = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/getAllCompanies`);

        // Assuming response.data is an array with objects and each object has a LedName property
        const cData = response.data;

        // Transforming the array into the desired format
        // const supplName = cName.map((item) => item.LedName);

        const transformedData = cData.map((item) => [
          item.CustomerCode,
          item.name,
        ]);
        setCompanyCode(transformedData);

        // setsupplierName(supplName);
      } catch (error) {
        console.error("Error fetching company datas:", error.message);
      }
    };

    fetchCmpname();
  }, [apiBaseUrl]);

  const fetchDatabaseNames = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${apiBaseUrl}/getalldatabases/${
          Array.isArray(cmpData.Cdata) ? cmpData.Cdata[0] : ""
        }`
      );
      setTableData(response.data);
      if (response.data.length > 0) {
        setHighlightedRow(0);
        // Don't automatically set selectedRowData here
      }
    } catch (error) {
      console.error("Error fetching database names:", error);
    } finally {
      setIsLoading(false);
    }
  };


  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      if (document.activeElement === selectcmpref.current) {
        // If ComboBox is focused, focus the table
        tableRef.current?.focus();
      } else if (tableData.length > 0 && highlightedRow >= 0) {
        // Only select if we have data and a valid highlighted row
        onRowSelect(highlightedRow);
      }
    } else if (event.key === "ArrowDown") {
      event.preventDefault(); // Prevent page scrolling
      setHighlightedRow((prev) => Math.min(prev + 1, tableData.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault(); // Prevent page scrolling
      setHighlightedRow((prev) => Math.max(prev - 1, 0));
    }
  };

  const handleRowClick = (rowIndex) => {
    setHighlightedRow(rowIndex);
  };
 
  const onRowSelect = (rowIndex) => {
    // Pass the rowIndex parameter to ensure we're selecting the correct row
    if (rowIndex >= 0 && rowIndex < tableData.length) {
      const selectedRow = tableData[rowIndex];
      setSelectedRowData(selectedRow);
      ////console.log("Selected Row Data:", selectedRow);
      navigate("/login", { state: { selectedRowData: selectedRow } });
      // Here you can add any additional logic needed when a row is selected
    }
  };

  useEffect(() => {
    ////console.log("Updated Selected Row Data:", selectedRowData);
  }, [selectedRowData]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [tableData, highlightedRow]); 



  return (
    <div className="openCompanyRoot">
      <div className="opencompanyhead ">
        <div className="opencompanyHeadpart">
          <img src={ssLogo} alt="SS" />
          <label>Open Company</label>
        </div>
        <div className="opencompanyHeadControlls">
         
          <button
            className="controllsbuttons xbutton opcontrollbutton"
            onClick={onClose}
          >
            <img src={close} alt="X" />
          </button>
        </div>
      </div>
      <div className="opencmpnavbar">
        <div className="opencmpnavbarBtn" onClick={ ()=> onRowSelect(highlightedRow)}>
          <img src={opnCmp} alt="Opn" /> Open Company
        </div>

        <div className="opencmpnavbarBtn" style={{ gap: "25%" }}     onClick={onClose}>
          <img src={exit} alt="Ext" /> Exit
        </div>
      </div>
      <div className="opencmpselectrow">
        <label htmlFor="">Select Company</label>
        <ComboBox
          comboRef={selectcmpref}
          options={companyCode}
          findedValue={
            Array.isArray(cmpData.Cdata) ? cmpData.Cdata[1] : cmpData.Cdata
          }
          className="selectcmpCombo"
          onInputChange={(e) =>
            setCmpData({
              ...cmpData,
              Cdata: e,
            })
          }
          onBlur={() => fetchDatabaseNames()}
        />
      </div>

      <div className="companylistTableDiv">
        {isLoading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              width: "100%",
            }}
          >
            <ClipLoader {...spinnerProps} />
          </div>
        ) : (
          <div
            className="companylistTable"
            // onScroll={handleScroll}
            ref={tableContainerRef}
          >
            <table ref={tableRef} tabIndex="0">
              <thead className="companylistTableHead">
                <tr>
                  <th className="companylistTableHeadslno">SlNo</th>

                  <th className="companylistTableHeadcode">Code</th>
                  <th className="companylistTableHeadname">Name</th>

                  <th className="companylistTableHeadyear">Year</th>
                </tr>
              </thead>
              <tbody className="companylistTableBodyStyle">
                {tableData.map((rowData, rowIndex) => (
                  <tr
                    key={rowIndex}
                    onClick={() => handleRowClick(rowIndex)}
                    onDoubleClick={() => onRowSelect(rowIndex)}
                    className={`companylistTableBodyStyletr ${highlightedRow === rowIndex ? "highlighted" : ""}`}
                  >
                    <td
                      className={`companylistTableDataBoxSlno ${
                        highlightedRow === rowIndex ? "highlighted" : ""
                      }`}
                      style={{ textAlign: "center" }}
                    >
                      {rowIndex + 1}
                    </td>

                    <td className="companylistTableDataBoxcode">
                      {rowData.Code}
                    </td>
                    <td className="companylistTableDataBoxname">
                      {rowData.name}
                    </td>

                    <td
                      className="companylistTableDataBoxyear"
                      style={{ textAlign: "center" }}
                    >
                      {rowData.year}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default OpenCompany;
