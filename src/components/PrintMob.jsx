import React, { useState, useRef, useEffect } from "react";
import "../styles/printmob.css";
import pdf from "../assets/images/pdf.webp";
import prnt from "../assets/images/print.png";

import { useLocation } from "react-router-dom";
import { ToWords } from "to-words";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";
import ReactToPrint from "react-to-print";
import { useDbContext } from "../context/DbContext";

function PrintMob() {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const { dbCode } = useDbContext();

  const printRef = useRef();

  const location = useLocation();

  const { receiptData, receiptInfo, totalWt } = location.state || {};
  const [accumulatedWt, setaccumulatedWt] = useState("");

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${apiBaseUrl}/totalweight/${receiptData[0].name[0]}/${dbCode}`
      );
      //////console.log("res===",response.data);
      setaccumulatedWt(response.data[0].WeightDifference);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (receiptData && receiptData.length) {
      fetchData();
    }
  }, [receiptData]);

  //  ////console.log('Receipt Data:', receiptData);
  //  ////console.log('Receipt Info:', receiptInfo);
  if (!receiptData || !receiptInfo || !receiptData.length) {
    return null;
  }

  const toWords = new ToWords();

  const downloadPDF = () => {
    const printRoot = document.querySelector(".printRootmob");
    const pdfButton = document.querySelector(".RecpdfDownloadButtonmob");
    const pntButton = document.querySelector(".RecPrintButtonmob");

    // Hide the PDF button
    pdfButton.style.visibility = "hidden";
    pntButton.style.visibility = "hidden";

    html2canvas(printRoot, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("receipt.pdf");

      // Restore the PDF button visibility
      pdfButton.style.visibility = "visible";
      pntButton.style.visibility = "visible";
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
    <div className="printRootmob">
      <div className="printBodymob" ref={printRef}>
        <div className="RecpdfDownloadButtonmob" onClick={downloadPDF}>
          <img src={pdf} alt="PDF" style={{ width: "100%", height: "100%" }} />
        </div>
        <ReactToPrint
          trigger={() => (
            <div className="RecPrintButtonmob">
              <img
                src={prnt}
                alt="PNT"
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          )}
          content={() => printRef.current}
        />
        <div className="printHeadmob">
          <label htmlFor="" className="receiptHeadmob">
            RECEIPT
          </label>
          <label htmlFor="" className="receiptCompanyNamemob">
            CHUNDANGATHRA GOLD & DIAMONDS
          </label>
        </div>
        <div id="printContentmob" className="printContentmob">
          <div className="printContentBodymob">
            <div className="printContentBodyRow1mob">
              <div className="printContentBodyRow1sec1mob">
                <span className="RecPrintfontsizemob">No.</span>
                <span className="RecPrintfontsizemob printmobentryno">
                  {receiptInfo.EntryNo} -{" "}
                  {receiptData[0].agent[1].substring(0, 3)}
                </span>
              </div>
              <div className="printContentBodyRow1sec2mob">
                <span className="RecPrintfontsizemob">Date:</span>
                <span className="recMobdateSpanmob RecPrintfontsizemob">
                  {formatDate(receiptInfo.date)}
                </span>
              </div>
            </div>
            <div className="printContentBodyRow2mob">
              <div className="printContentBodyRow2secmob">
                <span className="RecPrintfontsizemob">Account Number</span>
              </div>
              <div className="printContentBodyRow2secmob">
                <span
                  style={{ fontWeight: "600" }}
                  className="recMarginmob Recboldfontsizemob"
                >
                  {receiptData[0].accountNumber[1]}
                </span>
              </div>
            </div>
            <div className="printContentBodyRow2mob">
              <div className="printContentBodyRow2secmob">
                <span className="RecPrintfontsizemob">Received From</span>
              </div>
              <div className="printContentBodyRow2secmob">
                <span
                  style={{ fontWeight: "600" }}
                  className="recMarginmob Recboldfontsizemob"
                >
                  {receiptData[0].name[1]}
                </span>
              </div>
            </div>
            <div className="printContentBodyRow2mob">
              <div className="printContentBodyRow2secmob ">
                <span className="RecPrintfontsizemob sofrup">
                  The sum of rupees
                </span>
              </div>
              <div className="printContentBodyRow2secmob srupword">
                <span className="RecPrintfontsizemob recMarginmob wordssizemob ">
                  {toWords.convert(receiptData[0].amount, { currency: false })}
                </span>
              </div>
            </div>
            <div className="printContentBodyRow2mob">
              <div className="printContentBodyRow2secmob">
                <span
                  style={{ fontStyle: "italic" }}
                  className="bycashspanmob RecPrintfontsizemob"
                >
                  By Cash / cheque/DD No
                </span>
              </div>
              <div className="printContentBodyRow2secmob">
                <span className="RecPrintfontsizemob recMarginmob">CASH</span>
              </div>
            </div>
            <div className="printContentBodyRow2mob  ">
              <div className="printContentBodyRow2secmob amntdiv">
                <div className="printContentBodyRow2secAmntmob">
                  <div className="printContentBodyRow2secAmntsec1mob">
                    <span className="rupeeSignmob" style={{ color: "white" }}>
                      ₹
                    </span>
                  </div>
                  <div className="printContentBodyRow2secAmntsec2mob">
                    {receiptData[0].amount}
                  </div>
                </div>
              </div>
              <div className="printContentBodyRow2secmob"></div>
            </div>
            <div className="printContentBodyRow2mob">
              <span className="pritnFooterDatamob RecPrintfontsizemob">
                * All Cheque / DD are subject to realization
              </span>
            </div>
            <div className="printContentBodyRow2mob">
              <div className="printContentBodyRow2secmob">
                <span className="RecPrintfontsizemob">Rate/Gm</span>
              </div>
              <div className="printContentBodyRow2secmob">
                <span
                  className="rupeeSignmob recMarginmob"
                  style={{ marginRight: "4px", marginLeft: 0 }}
                >
                  ₹
                </span>
                <span className="RecPrintfontsizemob " style={{marginLeft:'0'}}>
                  {receiptInfo.rate}
                </span>
              </div>
            </div>

            {/* {receiptData[0].printgm === 1 && ( */}
            <div className="printContentBodyRow2mob recWght">
              <div className="printContentBodyRow2secmob">
                <span className="RecPrintfontsizemob">Weight</span>
              </div>
              <div className="printContentBodyRow2secmob">
                <span className="RecPrintfontsizemob recMarginmob">
                  {receiptData[0].gm}&nbsp;gm
                </span>
              </div>
            </div>
            {/* )} */}
            {/* {receiptData[0].printgm === 1 && ( */}
            <div className="printContentBodyRow2mob recWght">
              <div className="printContentBodyRow2secmob">
                <span className="RecPrintfontsizemob">Total Weight</span>
              </div>
              <div className="printContentBodyRow2secmob">
                <span className="RecPrintfontsizemob recMarginmob">
                  {accumulatedWt || 0}&nbsp;gm
                </span>
              </div>
            </div>
            {/* )} */}
          </div>
          <div className="printContentBodyfootermob">
            <span className="RecPrintfontsizemob">Receiver Signature</span>
            <br />
          </div>
          {/* <div className=" spaceprint">--------------</div> */}
        </div>
      </div>
    </div>
  );
}

export default PrintMob;
