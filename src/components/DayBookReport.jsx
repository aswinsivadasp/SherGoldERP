import React, { useState, useRef, useEffect, useContext } from "react";
import "../styles/DayBookReport.css";
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

function DayBookReport({ onClose, dayBookRepData }) {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const { agentCode } = useContext(AuthContext);
  const { dbCode } = useDbContext();


  const agentCodeRef = useRef(agentCode);

  useEffect(() => {
    agentCodeRef.current = agentCode;
  }, [agentCode]);

  // ////console.log("reportData ",dayBookRepData );

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/main/daybookReport/${dbCode}`, {
          params: dayBookRepData,
        });
        setTableData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [apiBaseUrl, dayBookRepData]);

  const exportToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    const headers = [
      "Date",
      "Particulars",
      "Voucher",
      "Entry No",
      "Debit",
      "Credit",
      "Narration"
    ];

    csvContent += headers.join(",") + "\n";

    tableData.forEach((row) => {

      const values = [
        row.Date ,
        row.Particulars,
        row.Voucher,
        row.EntryNo,
        row.Debit,
        row.Credit,
        row.Narration
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
    link.setAttribute("download", "dayBook.csv");
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
    pdf.save("dayBook.pdf");

    tableContainer.style.width = originalWidth;
    tableContainer.style.height = originalHeight;
    tableContainer.style.overflow = originalOverflow;
  };

  return (
    <div className="dayBookReportroot">
      <div className="schemecontrolls">
        {/* ///////// */}
        <div className="schemereg_headerLogo_Div" style={{ marginLeft: "1%" }}>
          <div className="schemereg_headerLogo">
            <img src={headeLogo} alt="SherSoftLogo" />
          </div>
          <label className="schemeReg_pageHead">Day Book</label>
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
                <th className="schRepDataTableHeaddate">Date</th>

                <th className="schRepDataTableHeadaccno">Particulars</th>
                <th className="schRepDataTableHeadcustomer">Voucher</th>
                <th
                  className="schRepDataTableHeadentryno"
                  style={{ width: "5%" }}
                >
                  Entry No
                </th>
                <th className="schRepDataTableHeadtype">Debit</th>
                <th className="schRepDataTableHeadamount">Credit</th>

                <th className="schRepDataTableHeadnarration">Narration</th>
              </tr>
            </thead>
            <tbody className="schRepDataTableBodyStyle">
              {tableData.map((rowData, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`schRepDataTableBodyStyletr ${
                    rowData.Voucher === "Sub Total"
                      ? "redRow"
                      : rowData.Voucher === "Total"
                      ? "blueRow"
                      : ""
                  }`}
                >
                  <td
                    className="schRepDataTableDataBoxAccNo"
                    style={{ textAlign: "right" }}
                  >
                    {rowData.Date}
                  </td>

                  <td className="schRepDataTableDataBoxCustomer">
                    {rowData.Particulars}
                  </td>

                  <td className="schRepDataTableDataBoxEntryno">
                    {rowData.Voucher}
                  </td>

                  <td
                    className="schRepDataTableDataBoxType"
                    style={{ textAlign: "center" }}
                  >
                    {rowData.EntryNo}
                  </td>

                  <td
                    className="schRepDataTableDataBoxRate"
                    style={{ textAlign: "right" }}
                  >
                    {rowData.Debit}
                  </td>

                  <td
                    className="schRepDataTableDataBoxAmount"
                    style={{ textAlign: "right" }}
                  >
                    {rowData.Credit}
                  </td>
                  <td className="schRepDataTableDataBoxDate">
                    {rowData.Narration}
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

export default DayBookReport;
