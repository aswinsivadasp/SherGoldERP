import React, { useState, useRef, useEffect, useContext } from "react";
import "../styles/SchemeRegistration.css";
import "../styles/LedgerReport.css";
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
import "jspdf-autotable";
import html2canvas from "html2canvas";
import { AuthContext } from "../context/AuthContext";
import { useDbContext } from "../context/DbContext";

function LedgerReport({ onClose, ledgerReportData }) {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const { agentCode } = useContext(AuthContext);
  const { dbCode } = useDbContext();


  // ////console.log("ledgerReportData===", ledgerReportData);

  const agentCodeRef = useRef(agentCode);

  useEffect(() => {
    agentCodeRef.current = agentCode;
  }, [agentCode]);

  // ////console.log("reportData ",reportData );
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
        const response = await axios.post(
          `${apiBaseUrl}/main/ledger_Report/${dbCode}`,
          ledgerReportData
        );
        setTableData(response.data);
        //  ////console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [apiBaseUrl, ledgerReportData]);

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
      "Date",
      "Particulars",
      "Account Number",
      "Voucher",
      "Entry No",
      "Debit",
      "Credit",
      "Balance"
    ];

    csvContent += headers.join(",") + "\n";

    tableData.forEach((row) => {
      // const entryNo = `${row.atEntryno}-${row.Agent.substring(0, 3)}`;

      const values = [
        row.Date,
        row.Particulars,
        row.AccountNumber,
        row.Voucher,
        row.EntryNo,
        row.Debit,
        row.Credit,
        row.Balance,
        // row.Voucher,
       
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
    link.setAttribute("download", "Ledger_report.csv");
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

  // const exportToFullPDF = async () => {
  //   const tableContainer = tableContainerRef.current;
  //   const originalWidth = tableContainer.style.width;
  //   const originalHeight = tableContainer.style.height;
  //   const originalOverflow = tableContainer.style.overflow;

  //   tableContainer.style.width = `${tableContainer.scrollWidth}px`;
  //   tableContainer.style.height = `${tableContainer.scrollHeight}px`;
  //   tableContainer.style.overflow = "visible";

  //   // const canvas = await html2canvas(tableContainer);
  //   const canvas = await html2canvas(tableContainer, { scale: 3 });
  //   const imgData = canvas.toDataURL("image/png");
  //   const pdf = new jsPDF();
  //   const imgWidth = 210; // A4 width in mm
  //   const imgHeight = (canvas.height * imgWidth) / canvas.width;
  //   pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
  //   pdf.save("ledger_report.pdf");

  //   tableContainer.style.width = originalWidth;
  //   tableContainer.style.height = originalHeight;
  //   tableContainer.style.overflow = originalOverflow;
  // };



  const exportToFullPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
  
    // Define the columns for the table
    const columns = [
      { header: 'Date', dataKey: 'col1' },
      { header: 'Particulars', dataKey: 'col2' },
      { header: 'Account Number', dataKey: 'col3' },
      { header: 'Voucher', dataKey: 'col4' },
      { header: 'Entry No', dataKey: 'col5' },
      { header: 'Debit', dataKey: 'col6' },
      { header: 'Credit', dataKey: 'col7' },
      { header: 'Debit', dataKey: 'col8' }

    ];
  
    // Define the rows (your data goes here)
    const rows = tableData.map(item => ({
      col1: item.Date,
      col2: item.Particulars,
      col3: item.AccountNumber,
      col4: item.Voucher,
      col5: item.EntryNo,
      col6: item.Debit,
      col7: item.Credit,
      col8: item.Balance,

    }));
    
  
    // Add title to the document
    doc.text("Ledger Report", 5, 20);
  
    // Generate table in PDF
    doc.autoTable({
      columns: columns,
      body: rows,
      startY: 30,
      margin: { top: 0, right: 5, bottom: 0, left: 5 },
    });
  
    // Save the generated PDF
    doc.save("ledger_report.pdf");
  };
  
  // const exportToFullPDF = () => {
  //   const doc = new jsPDF({
  //     orientation: 'portrait',
  //     unit: 'mm',
  //     format: 'a4',
  //   });
  
  //   // Define the columns for the table with specific column widths
  //   const columns = [
  //     { header: 'Date', dataKey: 'col1', width: 25 }, // width in mm
  //     { header: 'Particulars', dataKey: 'col2', width: 40 },
  //     { header: 'Account Number', dataKey: 'col3', width: 35 },
  //     { header: 'Voucher', dataKey: 'col4', width: 30 },
  //     { header: 'Entry No', dataKey: 'col5', width: 20 },
  //     { header: 'Debit', dataKey: 'col6', width: 30 },
  //     { header: 'Credit', dataKey: 'col7', width: 30 },
  //     { header: 'Balance', dataKey: 'col8', width: 30 },
  //   ];
  
  //   // Define the rows (your data goes here)
  //   const rows = tableData.map(item => ({
  //     col1: item.Date,
  //     col2: item.Particulars,
  //     col3: item.AccountNumber,
  //     col4: item.Voucher,
  //     col5: item.EntryNo,
  //     col6: item.Debit,
  //     col7: item.Credit,
  //     col8: item.Balance,
  //   }));
  
  //   // Add title to the document
  //   doc.text("Ledger Report", 14, 20);
  
  //   // Generate table in PDF with custom column widths
  //   doc.autoTable({
  //     columns: columns,
  //     body: rows,
  //     startY: 30,
  //     columnStyles: {
  //       col1: { cellWidth: 25 },
  //       col2: { cellWidth: 40 },
  //       col3: { cellWidth: 35 },
  //       col4: { cellWidth: 30 },
  //       col5: { cellWidth: 20 },
  //       col6: { cellWidth: 30 },
  //       col7: { cellWidth: 30 },
  //       col8: { cellWidth: 30 },
  //     },
  //   });
  
  //   // Save the generated PDF
  //   doc.save("ledger_report.pdf");
  // };
  
  return (
    // <div className="regmodal-overlay">
    <div className={`regmodal ledgerreportmodal`} style={{ zIndex: "1000" }}>
      <div className="schemecontrolls">
        {/* ///////// */}
        <div className="schemereg_headerLogo_Div">
          <div className="schemereg_headerLogo">
            <img src={headeLogo} alt="SherSoftLogo" />
          </div>
          <label className="schemeReg_pageHead">Ledger Report</label>
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
      <div className="ledgerRepTablebody">
        <div
          className="ledgerreportDataTable"
          // onScroll={handleScroll}
          ref={tableContainerRef}
        >
          <table>
            <thead className="ledgerreportDataTableHead">
              <tr>
                <th className="ledgerreportDataTableHeaddate">Date</th>

                <th className="ledgerreportDataTableHeadParticular">
                  Particulars
                </th>
                <th className="ledgerreportDataTableHeadParticular">
                  Account Number
                </th>
                <th className="ledgerreportDataTableHeadVoucher">Voucher</th>

                <th className="ledgerreportDataTableHeadentryno">Entry No</th>
                <th className="ledgerreportDataTableHeadDeb">Debit</th>
                <th className="ledgerreportDataTableHeadCred">Credit</th>
                <th className="ledgerreportDataTableHeadBalance">Balance</th>
              </tr>
            </thead>
            <tbody className="ledgerreportDataTableBodyStyle">
              {tableData.map((rowData, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`ledgerreportDataTableBodyStyletr ${
                    rowData.Particulars === "Closing Balance"
                      ? "ledgerredRow"
                      : rowData.Particulars === "Total"
                      ? "blueRow"
                      : ""
                  }`}
                >
                  <td className="ledgerreportDataTableDataBoxDate">
                    {rowData.Date}
                  </td>

                 

                  <td className="ledgerreportDataTableDataBoxParticulars">
                    {rowData.Particulars}
                  </td>
                  <td className="ledgerreportDataTableDataBoxParticulars">
                    {rowData.AccountNumber}
                  </td>
                  <td className="ledgerreportDataTableDataBoxVoucher">
                    {rowData.Voucher}
                  </td>

                  <td
                    className="ledgerreportDataTableDataBoxEntryno"
                    style={{ textAlign: "center",width:"5%" }}
                  >
                    {rowData.EntryNo}
                    {/* -{rowData.Agent.substring(0, 3)} */}
                  </td>

                  

                  <td
                    className="ledgerreportDataTableDataBoxDeb"
                    style={{ textAlign: "right" }}
                  >
                    {rowData.Debit}
                  </td>

                  <td
                    className="ledgerreportDataTableDataBoxCred"
                    style={{ textAlign: "right" }}
                  >
                    {rowData.Credit}
                  </td>


                  <td
                    className="ledgerreportDataTableDataBoxBalance"
                    style={{ textAlign: "right" }}
                  >
                    {rowData.Balance}
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

export default LedgerReport;
