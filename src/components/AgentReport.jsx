import React, { useState, useRef, useEffect, useContext } from "react";
import "../styles/SchemeRegistration.css";
// import "../styles/schemeReport.css";
import "../styles/AgentReport.css";

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
import { ClipLoader } from "react-spinners";
import "jspdf-autotable";
import { useDbContext } from "../context/DbContext";


function AgentReport({ onClose, agentReportData }) {
  //  ////console.log("agentReportData",agentReportData);

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const [isLoading, setIsLoading] = useState(true);
  const { agentCode } = useContext(AuthContext);
  const { dbCode } = useDbContext();
  ////console.log("agrdbcode",dbCode);
  


  const agentCodeRef = useRef(agentCode);

  useEffect(() => {
    agentCodeRef.current = agentCode;
  }, [agentCode]);

  // ////console.log("agentReportData ",agentReportData );
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
        setIsLoading(true);
        const response = await axios.post(
          `${apiBaseUrl}/main/agentCommisssion_Report/${dbCode}`,
          agentReportData
        );
        setTableData(response.data);
        // ////console.log(response.data);
      } catch (error) {
        console.error("Error fetching agent data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [apiBaseUrl, agentReportData]);

  //  ////console.log("tableData=", tableData);

  // const exportToExcel = () => {
  //   const fileName = 'agent_report.xlsx';
  //   const worksheet = XLSX.utils.table_to_sheet(tableContainerRef.current.querySelector('table'));
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, 'agent Report');
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
      "Days",
      "int%",
      "Interest",
      "Weight",
      "Redeem Rate",
      "Redeem Amount",
      "Redeem Weight",
      "agent Balance",
      "P/L in Weight",
      "Agent",
      "Narration",
    ];

    csvContent += headers.join(",") + "\n";

    tableData.forEach((row) => {
      const entryNo = `${row.atEntryno}-${row.Agent.substring(0, 3)}`;

      const values = [
        row.accno ? `\t${row.accno}` : "",
        row.ledname,
        entryNo,
        row.atType,
        row.rate,
        row.atCreditAmount,
        row.atdate,
        row.dayss,
        row.intrPerc,
        row.IntrestAmount,
        row.atCreditWeight,
        row.rate,
        row.atDebitAmount,
        row.atDebitWeight,
        row.agentBalance, // agent Balance
        row.BalanceWeight, // P/L in Weight
        row.Agent,
        row.atNarration,
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
    link.setAttribute("download", "agent_report.csv");
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
  //   pdf.save("agent_report.pdf");
  // };

  // const exportToFullPDF = async () => {
  //   const tableContainer = tableContainerRef.current;
  //   const originalWidth = tableContainer.style.width;
  //   const originalHeight = tableContainer.style.height;
  //   const originalOverflow = tableContainer.style.overflow;

  //   tableContainer.style.width = `${tableContainer.scrollWidth}px`;
  //   tableContainer.style.height = `${tableContainer.scrollHeight}px`;
  //   tableContainer.style.overflow = "visible";

  //   const canvas = await html2canvas(tableContainer);
  //   const imgData = canvas.toDataURL("image/png");
  //   const pdf = new jsPDF();
  //   const imgWidth = 210; // A4 width in mm
  //   const imgHeight = (canvas.height * imgWidth) / canvas.width;
  //   pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
  //   pdf.save("agent_report.pdf");

  //   tableContainer.style.width = originalWidth;
  //   tableContainer.style.height = originalHeight;
  //   tableContainer.style.overflow = originalOverflow;
  // };

  const exportToFullPDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a2",
    });

    // Define the columns for the table
    const columns = [
      { header: "AccNo", dataKey: "col1" },
      { header: "Customer", dataKey: "col2" },
      { header: "Entryno", dataKey: "col3" },
      { header: "Type", dataKey: "col4" },
      { header: "Rate", dataKey: "col5" },
      { header: "Amount", dataKey: "col6" },
      { header: "Date", dataKey: "col7" },
      { header: "Days", dataKey: "col8" },
      { header: "int%", dataKey: "col9" },
      { header: "%amnt", dataKey: "col10" },
      { header: "Weight", dataKey: "col11" },
      { header: "Redeem Rate", dataKey: "col12" },
      { header: "Redeem Amount", dataKey: "col13" },
      { header: "Redeem Weight", dataKey: "col14" },
      { header: "agent Balalnce", dataKey: "col15" },
      { header: "P/L in Weight", dataKey: "col16" },
      { header: "Agent", dataKey: "col17" },
      { header: "Narration", dataKey: "col18" },
    ];

    // Define the rows (your data goes here)
    const rows = tableData.map((item) => ({
      col1: item.accno,
      col2: item.ledname,
      col3: `${item.atEntryno}-${item.Agent.substring(0, 3)}`,
      col4: item.atType,
      col5: item.rate,
      col6: item.atCreditAmount,
      col7: item.atdate,
      col8: item.dayss,
      col9: item.intrPerc,
      col10: item.IntrestAmount,
      col11: item.atCreditWeight,
      col12: item.redeemrate,
      col13: item.atDebitAmount,
      col14: item.atDebitWeight,
      col15: item.agentBalance,
      col16: item.BalanceWeight,
      col17: item.Agent,
      col18: item.atNarration,
    }));

    // Add title to the document
    doc.text("agent Report", 5, 20);

    // Generate table in PDF
    doc.autoTable({
      columns: columns,
      body: rows,
      startY: 30,
      margin: { top: 0, right: 5, bottom: 0, left: 5 },
    });

    // Save the generated PDF
    doc.save("agent_report.pdf");
  };

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

  return (
    // <div className="regmodal-overlay">
    <div className={`regmodal agentreportmodal`} style={{ zIndex: "1000" }}>
      <div className="schemecontrolls">
        {/* ///////// */}
        <div className="schemereg_headerLogo_Div">
          <div className="schemereg_headerLogo">
            <img src={headeLogo} alt="SherSoftLogo" />
          </div>
          <label className="schemeReg_pageHead">Agent Report</label>
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
      <div className="agentRepTablebody">
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
            className="agRepDataTable"
            // onScroll={handleScroll}
            ref={tableContainerRef}
          >
            <table>
              <thead className="agRepDataTableHead">
                <tr>
                  <th className="agRepDataTableHeadtype">Type</th>

                  <th className="agRepDataTableHeadagent">Agent</th>
                  <th className="agRepDataTableHeaddate">Date</th>

                  <th className="agRepDataTableHeadentryno">Entryno</th>

                  <th className="agRepDataTableHeadaccno">AccNo</th>
                  <th className="agRepDataTableHeadcustomer">Customer</th>

                  {/* <th className="agRepDataTableHeadrate">Rate</th> */}
                  <th className="agRepDataTableHeadamount">Amount</th>
                  {/* <th className="agRepDataTableHeadweight">Weight</th> */}
                  {/* <th className="agRepDataTableHeadnarration">Narration</th> */}

                  <th clasName="agRepDataTableHeadNDays">Days</th>
                  <th className="agRepDataTableHeadInterest">%Perc</th>
                </tr>
              </thead>
              <tbody className="agRepDataTableBodyStyle">
                {tableData.map((rowData, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={`agRepDataTableBodyStyletr ${
                      rowData.atType === "Sub Total"
                        ? "redRow"
                        : rowData.atType === "Total"
                        ? "blueRow"
                        : ""
                    }`}
                  >
                    <td className="agRepDataTableDataBoxType">
                      {rowData.atType}
                    </td>

                    <td className="agRepDataTableDataBoxAgent">
                      {rowData.Agent}
                    </td>
                    <td className="agRepDataTableDataBoxDate" style={{textAlign:'center'}}>
                      {rowData.atdate}
                    </td>

                    <td
                      className="agRepDataTableDataBoxEntryno"
                      style={{ textAlign: "center" }}
                    >
                      {rowData.atEntryno}-
                      {rowData.Agent ? rowData.Agent.substring(0, 3) : ""}
                    </td>

                    <td
                      className="agRepDataTableDataBoxAccNo"
                      style={{ textAlign: "right" ,paddingRight:'10px'}}
                    >
                      {rowData.accno}
                    </td>

                    <td className="agRepDataTableDataBoxCustomer">
                      {rowData.ledname}
                    </td>

                    {/* <td
                      className="agRepDataTableDataBoxRate"
                      style={{ textAlign: "right" }}
                    >
                      {rowData.rate}
                    </td> */}

                    <td
                      className="agRepDataTableDataBoxAmount"
                      style={{ textAlign: "right" }}
                    >
                      {rowData.atCreditAmount}
                    </td>

                    {/* <td
                      className="agRepDataTableDataBoxWeight"
                      style={{ textAlign: "right" }}
                    >
                      {rowData.atCreditWeight}
                    </td>
                      */}
                    {/* <td className="agRepDataTableDataBoxNarration" style={{textAlign:'center'}}>
                      {rowData.atNarration}
                    </td>
                   */}
                    <td
                      className="agRepDataTableDataBoxdays"
                      style={{ textAlign: "center" }}
                    >
                      {rowData.dayss}
                    </td>
                    <td
                      className="agRepDataTableDataBoxinterest"
                      style={{ textAlign: "right",paddingRight:'10px' }}
                    >
                      {rowData.intrPerc}
                    </td>
                    {/* <td
                      className="agRepDataTableDataBoxintperc"
                      style={{ textAlign: "right" }}
                    >
                      {rowData.intrPerc}
                    </td> */}
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

export default AgentReport;
