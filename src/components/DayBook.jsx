import React, { useRef, useEffect, useState, useContext } from "react";
import "../styles/DayBook.css";
import close from "../assets/images/close.png";
import ssLogo from "../assets/images/sslogo.png";
import CreatableSelect from "react-select/creatable";
import "../components/ComboBox";
import ComboBox from "../components/ComboBox";
import show from "../assets/images/check-mark .png";
import exit from "../assets/images/cross .png";
import { data } from "autoprefixer";
function DayBook({ onClose, openReport }) {
  const brachref = useRef(null);
  const reporttyperef = useRef(null);

  const getCurrentDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const [daybookData, setDaybookData] = useState({
    fromDate: getCurrentDate(),
    toDate: getCurrentDate(),
    reportType: "Simple",
    branch: "",
  });

  return (
    <div className="daybookroot">
      <div className="dayBookhead ">
        <div className="dayBook_dialogHeadpart">
          <img src={ssLogo} alt="SS" />
          <label>Day Book</label>
        </div>
        <div className="dayBook_dialogHeadControlls">
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

      <div className="dayBookBody">
        <div className="daybookDate">
          <section className="Dfrom">
            <label htmlFor="">From</label>

            <input
              type="Date"
              onChange={(e) =>
                setDaybookData({
                  ...daybookData,
                  fromDate: e.target.value,
                })
              }
              value={daybookData.fromDate}
            />
          </section>
          <section className="Dto">
            <label htmlFor="">To</label>{" "}
            <input type="Date"

             value={daybookData.toDate} 
             
             onChange={(e) =>
              setDaybookData({
                ...daybookData,
                toDate: e.target.value,
              })
            }
            />
          </section>
        </div>

        <div className="dayBookForms">
          <section>
            <label htmlFor="">Branch</label>
            <ComboBox
              className="branchinput"
              comboRef={brachref}
              options={[[1, "SHOP"]]}
            />
          </section>
          <section>
            <label htmlFor="">Report Type</label>
            <ComboBox
              className="branchinput"
              comboRef={reporttyperef}
              options={[[1, "DAY BOOK"]]}
            />
          </section>
        </div>

        <div className="daybookButton">
          <button className="daybookshowBtn" onClick={()=>openReport(daybookData)}>
            <img className="btnimg " src={show} alt="" />
            Show
          </button>

          <button onClick={onClose} className="daybookexitbtn">
            <img className="btnimg " src={exit} alt="" />
            Exit
          </button>
        </div>
      </div>
    </div>
  );
}

export default DayBook;
