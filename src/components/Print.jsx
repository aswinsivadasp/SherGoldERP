import React, { useState, useRef, useEffect } from "react";
import "../styles/print.css";
import pdf from "../assets/images/pdf.webp";
import { useLocation } from "react-router-dom";
import { ToWords } from "to-words";
import toggleClose from "../assets/images/xred.webp";
import close from "../assets/images/close-button.png";
import prnt from "../assets/images/print.png";
import ReactToPrint from "react-to-print";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { useDbContext } from "../context/DbContext";

function Print({ printData, onClose, totalwt }) {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const { dbCode } = useDbContext();
  const [companyName, setCompanyName] = useState("");

  useEffect(() => {
    fetchcompanydetails();
  }, []);

  
    
    const fetchcompanydetails = async () => {
      try {
        const response = await axios.get(
          `${apiBaseUrl}/main/findCompanyDetails/${dbCode}`
        );
        const foundData = response.data[0];
        setCompanyName(foundData.name || "SherGold");
        console.log("found", foundData.name);

        // setsupplierName(supplName);
      } catch (error) {
        console.error("Error fetching company datas:", error.message);
        // alert(error.response.data);
      }
    };


  const printRef = useRef();

  const { schemeRecInfoData, tableData, index } = printData || {};
  //   ////console.log('Scheme Rec Info Data:', schemeRecInfoData);
  // ////console.log('Table Data:', tableData);
  const location = useLocation();

  //  ////console.log('Receipt Data:', receiptData);
  //  ////console.log('Receipt Info:', receiptInfo);

  const toWords = new ToWords();

  const downloadPDF = () => {
    const printRoot = document.querySelector(".printRoot");
    const pdfButton = document.querySelector(".RecpdfDownloadButton");
    const closeButton = document.querySelector(".RecCloseButton");
    const pntButton = document.querySelector(".RecPrintButton");

    const originalBorder = printRoot.style.border;
    // Hide the PDF button
    pdfButton.style.visibility = "hidden";
    closeButton.style.visibility = "hidden";
    pntButton.style.visibility = "hidden";

    printRoot.style.border = "none";

    html2canvas(printRoot, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("receipt.pdf");

      // Restore the PDF button visibility
      pdfButton.style.visibility = "visible";
      closeButton.style.visibility = "visible";
      pntButton.style.visibility = "visible";

      printRoot.style.border = originalBorder;
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "2-digit", month: "short", year: "numeric" };
    const formattedDate = new Intl.DateTimeFormat("en-GB", options).format(
      date
    );
    const [day, month, year] = formattedDate.split(" ");
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="printRoot">
      <div className="printBody" ref={printRef}>
        <div className="RecpdfDownloadButton" onClick={downloadPDF}>
          <img src={pdf} alt="PDF" style={{ width: "100%", height: "100%" }} />
        </div>
        <ReactToPrint
          trigger={() => (
            <button className="RecPrintButton" onClick={downloadPDF}>
              <img
                src={prnt}
                alt="PNT"
                style={{ width: "100%", height: "100%" }}
              />
            </button>
          )}
          content={() => printRef.current}
        />
        <button
          className="RecCloseButton"
          style={{ padding: "0", backgroundColor: "red", border: "none" }}
          onClick={onClose}
        >
          <img src={close} alt="X" style={{ width: "75%", height: "75%" }} />
        </button>
        <div className="printHead">
          <label htmlFor="" className="receiptHead">
            RECEIPT
          </label>
          <label htmlFor="" className="receiptCompanyName">
          {companyName}
          </label>
        </div>
        <div id="printContent" className="printContent">
          <div className="printContentBody">
            <div className="printContentBodyRow1">
              <div className="printContentBodyRow1sec1">
                <span className="RecPrintfontsize">No.</span>
                <span className="RecPrintfontsize printmobentryno">
                  {schemeRecInfoData.EntryNo} -
                  {tableData[index - 1 || 0].agent[1].substring(0, 3)}
                </span>
              </div>
              <div className="printContentBodyRow1sec2">
                <span className="RecPrintfontsize">Date:</span>
                <span className="recMobdateSpan RecPrintfontsize">
                  {formatDate(schemeRecInfoData.date)}
                </span>
              </div>
            </div>
            <div className="printContentBodyRow2">
              <div className="printContentBodyRow2sec">
                <span className="RecPrintfontsize">Account Number</span>
              </div>
              <div className="printContentBodyRow2sec">
                <span
                  style={{ fontWeight: "600" }}
                  className="recMargin Recboldfontsize"
                >
                  {tableData[index - 1 || 0].accountNumber[1]}
                </span>
              </div>
            </div>
            <div className="printContentBodyRow2">
              <div className="printContentBodyRow2sec">
                <span className="RecPrintfontsize">Received From</span>
              </div>
              <div className="printContentBodyRow2sec">
                <span
                  style={{ fontWeight: "600" }}
                  className="recMargin Recboldfontsize"
                >
                  {tableData[index - 1 || 0].name[1]}
                </span>
              </div>
            </div>
            <div className="printContentBodyRow2">
              <div className="printContentBodyRow2sec">
                <span className="RecPrintfontsize sofrup">
                  The sum of rupees
                </span>
              </div>
              <div className="printContentBodyRow2sec">
                <span className="RecPrintfontsize recMargin wordssize">
                  {toWords.convert(tableData[index - 1 || 0].amount, {
                    currency: false,
                  })}
                </span>
              </div>
            </div>
            <div className="printContentBodyRow2">
              <div className="printContentBodyRow2sec">
                <span
                  style={{ fontStyle: "italic" }}
                  className="bycashspan RecPrintfontsize"
                >
                  By Cash / cheque/DD No
                </span>
              </div>
              <div className="printContentBodyRow2sec">
                <span className="RecPrintfontsize recMargin">CASH</span>
              </div>
            </div>
            <div className="printContentBodyRow2">
              <div className="printContentBodyRow2sec amntdiv">
                <div className="printContentBodyRow2secAmnt">
                  <div className="printContentBodyRow2secAmntsec1">
                    <span className="rupeeSign" style={{ color: "white" }}>
                      ₹
                    </span>
                  </div>
                  <div className="printContentBodyRow2secAmntsec2">
                    {tableData[index - 1 || 0].amount}
                  </div>
                </div>
              </div>
              <div className="printContentBodyRow2sec"></div>
            </div>
            <div className="printContentBodyRow2">
              <span className="pritnFooterData RecPrintfontsize">
                * All Cheque / DD are subject to realization
              </span>
            </div>
            <div className="printContentBodyRow2">
              <div className="printContentBodyRow2sec">
                <span className="RecPrintfontsize">Rate/Gm</span>
              </div>
              <div className="printContentBodyRow2sec">
                <span
                  className="rupeeSign recMargin"
                  style={{ marginRight: "4px", marginLeft: 0 }}
                >
                  ₹
                </span>
                <span className="RecPrintfontsize " style={{ marginLeft: "0" }}>
                  {schemeRecInfoData.rate}
                </span>
              </div>
            </div>
            {/* {tableData[index - 1 || 0].printgm === 1 && ( */}
            <div className="printContentBodyRow2 recWght">
              <div className="printContentBodyRow2sec">
                <span className="RecPrintfontsize">Weight</span>
              </div>
              <div className="printContentBodyRow2sec">
                <span className="RecPrintfontsize recMargin">
                  {tableData[index - 1 || 0].gm}
                  &nbsp;gm
                </span>
              </div>
            </div>
            {/* )} */}
          </div>
          {/* {tableData[index - 1 || 0].printgm === 1 && ( */}

          <div className="printContentBodyfooter">
            <div className="printContentBodyfootersec">
              <span className="RecPrintfontsize twt">Total Weight</span>
            </div>
            <div className="printContentBodyfootersec">
              <span className="RecPrintfontsize recMargin twt">
                {totalwt || 0}
                &nbsp;gm
              </span>
              {/* <span className="RecPrintfontsize recsig">
                Receiver Signature
              </span> */}
            </div>
          </div>
          {/* )} */}
          <div
            className="printContentBodyfootersecsign "
            style={{ width: "100%", textAlign: "right", height: "10%" }}
          >
            {/* <p>    ---------------------------------------------   </p> */}
            <span
              className="RecPrintfontsize "
              style={{ marginRight: "10%", marginBottom: "2%" }}
            >
              Receiver Signature
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Print;
