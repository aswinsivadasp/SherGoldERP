import React, { useState, useRef, useEffect, useContext } from "react";
import "../styles/SchemeRegistration.css";
import "../styles/SchemeReport.css";
import { FaRegWindowMinimize } from "react-icons/fa";
import { IoMdExpand } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import expand from "../assets/images/resize.png";
import playandpause from "../assets/images/Play and pause button.png";
import leftarrow from "../assets/images/Play button arrowhead left.png";
import rightarrow from "../assets/images/Play button arrowhead right.png";
import playandpauseRight from "../assets/images/Play and pause button right.png";
import binImg from "../assets/images/Bin.png";
import exit from "../assets/images/close.png";
import headeLogo from "../assets/images/shersoftnavLogo.png";
import saveImg from "../assets/images/SaveImage.png";
import printImg from "../assets/images/Printer.png";
import clearImg from "../assets/images/Document.png";
import findImg from "../assets/images/search.png";
import editImg from "../assets/images/Editing.png";
import deleteImg from "../assets/images/Delete.png";
import exitImg from "../assets/images/Exit1.png";
import excel from "../assets/images/Excel file.png";
import pdf from "../assets/images/Pdf.png";
//import ComboBox from "shersoft-combov1";
import ComboBox from "./ComboBox";
import minimize from "../assets/images/mini.png";
import maximize from "../assets/images/maximize.png";
import close from "../assets/images/close.png";

import axios from "axios";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { AuthContext } from "../context/AuthContext";
import { useDbContext } from "../context/DbContext";

function ReceiptListReport({ onClose, reportData }) {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const { agentCode } = useContext(AuthContext);
  const { dbCode } = useDbContext();


  const agentCodeRef = useRef(agentCode);

  useEffect(() => {
    agentCodeRef.current = agentCode;
  }, [agentCode]);

  // ////console.log("reportData ", reportData);
  const tableContainerRef = useRef(null);

  const addRow = () => {
    // ////console.log("add row called");
    setTableData([...tableData, {}]);
  };

  const [tableData, setTableData] = useState([]);

  // const handleScroll = () => {
  //   const tableContainer = tableContainerRef.current;
  //   if (
  //     tableContainer.scrollTop + tableContainer.clientHeight >=
  //     tableContainer.scrollHeight - 1
  //   ) {
  //     // User has scrolled to the bottom, add new rows
  //     addRow();
  //   }
  // };
  // -----------------------------------------------------------------------
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.post(
  //         `${apiBaseUrl}/main/schReceiptList`,
  //         reportData
  //       );
  //       setTableData(response.data);
  //       //  ////console.log(response.data);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchData();
  // }, [apiBaseUrl, reportData]);

  // --------------------------------------------------------------------

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/main/schReceiptList/${dbCode}`, {
          params: reportData,
        });
        setTableData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [apiBaseUrl, reportData]);

  // ////console.log("tableData=", tableData);

  // const exportToExcel = () => {
  //   const fileName = 'scheme_report.xlsx';
  //   const worksheet = XLSX.utils.table_to_sheet(tableContainerRef.current.querySelector('table'));
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, 'Scheme Report');
  //   XLSX.writeFile(workbook, fileName);
  // };

  const exportToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    const headers = [
      "AccNo",
      "Customer",
      "Entryno",
      "Type",
      "Rate",
      "Amount",
      "Date",
      "Weight",
      "Agent",
      "Narration",
    ];

    csvContent += headers.join(",") + "\n";

    tableData.forEach((row) => {
      const entryNo = `${row.Srp_entryno}-${row.agent.substring(0, 3)}`;

      const values = [
        row.accno ? `\t${row.accno}` : "",
        row.Cust,
        entryNo,
        row.Type,
        row.SrInfo_rate,
        row.Srp_amount,
        row.SrInfo_date,
        row.Srp_gm,
        row.agent,
        row.Srp_narration,
      ];

      const escapedValues = values.map((value) => {
        if (value === null || value === undefined) {
          return '""'; // Return empty string for null/undefined values
        } else {
          return `"${value.toString().replace(/"/g, '""')}"`; // Escape quotes in values
        }
      });
      csvContent += escapedValues.join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "ReceiptList.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  
  // const exportToPDF = async () => {
  //   const input = tableContainerRef.current;
  //   const pdf = new jsPDF();
  //   const canvas = await html2canvas(input);
  //   const imgData = canvas.toDataURL('image/png');
  //   const imgWidth = 210; // A4 width in mm
  //   const imgHeight = (canvas.height * imgWidth) / canvas.width;
  //   pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
  //   pdf.save("scheme_report.pdf");
  // };

  const exportToFullPDF = async () => {
    const tableContainer = tableContainerRef.current;
    const originalWidth = tableContainer.style.width;
    const originalHeight = tableContainer.style.height;
    const originalOverflow = tableContainer.style.overflow;

    tableContainer.style.width = `${tableContainer.scrollWidth}px`;
    tableContainer.style.height = `${tableContainer.scrollHeight}px`;
    tableContainer.style.overflow = "visible";

    const canvas = await html2canvas(tableContainer);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save("ReceiptList.pdf");

    tableContainer.style.width = originalWidth;
    tableContainer.style.height = originalHeight;
    tableContainer.style.overflow = originalOverflow;
  };
  return (
    // <div className="regmodal-overlay">
    <div className={`regmodal schemereportmodal`} style={{ zIndex: "1000" }}>
      <div className="schemecontrolls">
        {/* ///////// */}
        <div className="schemereg_headerLogo_Div">
          <div className="schemereg_headerLogo">
            <img src={headeLogo} alt="SherSoftLogo" />
          </div>
          <label className="schemeReg_pageHead">Receipt List</label>
        </div>
        <div className="report_dialogHeadControlls">
          {/* <button className="controllsbuttons">
            <img src={minimize} alt="min" />
          </button>
          <button className="controllsbuttons">
            <img src={maximize} alt="exp" />
          </button> */}
          <button className="controllsbuttons xbutton" onClick={onClose}>
            <img src={close} alt="X" />
          </button>
        </div>
      </div>

      {/*............................ Navbar.............................................. */}
      <div className="schemeReg_navbar reportnav">
        <button
          style={{ border: "none", backgroundColor: "transparent" }}
          className="schemeNav_items"
        >
          <div className="schemeReg_buttonImage">
            <img src={printImg} alt="PrintImg" />
          </div>
          Print
        </button>
        <button
          style={{ border: "none", backgroundColor: "transparent" }}
          className="schemeNav_items"
          onClick={exportToCSV}
          // onClick={exportToExcel}
        >
          <div className="schemeReg_buttonImage">
            <img src={excel} alt="clearImg" />
          </div>
          To Excel
        </button>

        <button
          style={{ border: "none", backgroundColor: "transparent" }}
          className={`schemeNav_items }`}
          onClick={exportToFullPDF}
        >
          <div className="schemeReg_buttonImage">
            <img src={pdf} alt="editImg" />
          </div>
          To PDF
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
      <div className="schemeRepTablebody">
        <div
          className="schRepDataTable"
          // onScroll={handleScroll}
          ref={tableContainerRef}
        >
          <table>
            <thead className="schRepDataTableHead">
              <tr>
                <th className="schRepDataTableHeadaccno">AccNo</th>
                <th className="schRepDataTableHeadcustomer">Customer</th>

                <th className="schRepDataTableHeadentryno">Entryno</th>
                <th className="schRepDataTableHeadtype">Type</th>
                <th className="schRepDataTableHeadrate">Rate</th>
                <th className="schRepDataTableHeadamount">Amount</th>
                <th className="schRepDataTableHeaddate">Date</th>

                <th className="schRepDataTableHeadweight">Weight</th>

                <th className="schRepDataTableHeadagent">Agent</th>
                <th className="schRepDataTableHeadnarration">Narration</th>
              </tr>
            </thead>
            <tbody className="schRepDataTableBodyStyle">
              {tableData.map((rowData, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`schRepDataTableBodyStyletr ${
                    rowData.Type === "Sub Total"
                      ? "redRow"
                      : rowData.Type === "Total"
                      ? "blueRow"
                      : ""
                  }`}
                >
                  <td
                    className="schRepDataTableDataBoxAccNo"
                    style={{ textAlign: "right" }}
                  >
                    {rowData.accno}
                  </td>

                  <td className="schRepDataTableDataBoxCustomer">
                    {rowData.Cust}
                  </td>

                  <td
                    className="schRepDataTableDataBoxEntryno"
                    style={{ textAlign: "center" }}
                  >
                    {rowData.Srp_entryno}-{rowData.agent.substring(0, 3)}
                  </td>

                  <td className="schRepDataTableDataBoxType">{rowData.Type}</td>

                  <td
                    className="schRepDataTableDataBoxRate"
                    style={{ textAlign: "right" }}
                  >
                    {rowData.SrInfo_rate}
                  </td>

                  <td
                    className="schRepDataTableDataBoxAmount"
                    style={{ textAlign: "right" }}
                  >
                    {rowData.Srp_amount}
                  </td>
                  <td className="schRepDataTableDataBoxDate">
                    {rowData.SrInfo_date}
                  </td>

                  <td
                    className="schRepDataTableDataBoxWeight"
                    style={{ textAlign: "right" }}
                  >
                    {rowData.Srp_gm}
                  </td>

                  <td className="schRepDataTableDataBoxAgent">
                    {rowData.agent}
                  </td>

                  <td className="schRepDataTableDataBoxNarration">
                    {rowData.Srp_narration}
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

export default ReceiptListReport;
