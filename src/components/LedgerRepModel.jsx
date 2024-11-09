import React, { useRef, useEffect, useState, useContext } from "react";
import "../styles/LedgerRepModel.css";
import close from "../assets/images/close.png";
import ssLogo from "../assets/images/sslogo.png";
import "../components/ComboBox";
import ComboBox from "../components/ComboBox";
import show from "../assets/images/check-mark .png";
import exit from "../assets/images/cross .png";
import axios from "axios";
import Swal from "sweetalert2";
import io from 'socket.io-client';
import { AuthContext } from "../context/AuthContext";
import { Group } from "antd/es/avatar";
import { useDbContext } from "../context/DbContext";


function LedgerRepModel({ onClose, openReport }) {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const { agentCode } = useContext(AuthContext);
  const { dbCode } = useDbContext();


  const orderbyref = useRef(null)
  const brachref = useRef(null);
  const reporttyperef = useRef(null);
  const ledgerRef=useRef(null);
  const showqtyref = useRef(null);
  const showcostcenteref = useRef(null);

  const getCurrentDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const [ledgerRepData, setledgerRepData] = useState({
    fromDate: getCurrentDate(),
    toDate: getCurrentDate(),
    orderBy:"",
    ledger:"",
    branch:"",
    reportType: "Simple",
    openingBalance:"",
    simpleLedgerReport:"",
    optionType:"",
    showQty:"",
    showCostCenter:"",
    customReportType:"",
    costCenter:"",
    Group:""


  });

//  ////console.log("ledgerRepData==",ledgerRepData);
 
  const [activeTab, setActiveTab] = useState("tab1");
  const [selectedOption, setSelectedOption] = useState(1);
  const options = [
    [1, "Summary"],
    [2, "Detailed"],

  ];

  const [selectedOption2, setSelectedOption2] = useState(1);

  const options2 = [
    [1, "No"],
    [2, "Yes"],

  ];

  const [selectedOption3, setSelectedOption3] = useState(1);

  const options3 = [
    [1, "No"],
    [2, "Yes"],

  ];

  const handleOptionChange = (e) => {
    setSelectedOption(parseInt(e.target.value));
    reporttyperef.current = parseInt(e.target.value); // Update the ref with the selected value
  };
  const handleOptionChange2 = (e) => {
    setSelectedOption2(parseInt(e.target.value));
    reporttyperef.current = parseInt(e.target.value); // Update the ref with the selected value
  };
  const handleOptionChange3 = (e) => {
    setSelectedOption3(parseInt(e.target.value));
    reporttyperef.current = parseInt(e.target.value); // Update the ref with the selected value
  };


  const [LedgerName, setLedgerName] = useState([]);

  useEffect(() => {
    const fetchLgname = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/main/jvledgernames/${dbCode}`);

        // Assuming response.data is an array with objects and each object has a LedName property
        const LgName = response.data;

        // Transforming the array into the desired format
        // const supplName = cName.map((item) => item.LedName);

        const transformedData = LgName.map((item) => [
          item.Ledcode,
          item.LedName,
        ]);
        setLedgerName(transformedData);

        // setsupplierName(supplName);
      } catch (error) {
        console.error("Error fetching agent Values:", error.message);
      }
     

    };

    fetchLgname();


        // Connect to the WebSocket server
    const socket = io(apiBaseUrl); // Make sure the URL matches your backend server
    socket.on('dataUpdated', () => {
   //   ////console.log('Data updated, fetching new data...');
      fetchLgname(); // Re-fetch the data when an update is detected


    });

    return () => {
      socket.disconnect(); // Clean up the socket connection on component unmount
   //   ////console.log("socketdisconneccted");

    };

  }, [apiBaseUrl]);




  const [under, setUnder] = useState([]);
  

  useEffect(() => {
    const fetchLedgerheads = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/main/spledgerheads`);

        // Assuming response.data is an array with objects and each object has a LedName property
        const LgName = response.data;

        // Transforming the array into the desired format
        // const supplName = cName.map((item) => item.LedName);

        const transformedData = LgName.map((item) => [
          item.lh_id,
          item.lh_name,
        ]);
        setUnder(transformedData);

        // setsupplierName(supplName);
      } catch (error) {
        console.error("Error fetching agent Values:", error.message);
      }
     

    };

    fetchLedgerheads();


  }, [apiBaseUrl]);








  return (
    <div className="ledgerrepodiaroot">
      <div className="ledgerrepodiahead ">
        <div className="ledgerrepodia_dialogHeadpart">
          <img src={ssLogo} alt="SS" />
          <label>Ledger Report</label>
        </div>
        <div className="ledgerrepodia_dialogHeadControlls">
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
      <div className="tabs">
        <div
          className={activeTab === "tab1" ? "active" : ""}
          onClick={() => setActiveTab("tab1")}
        >
          Ledger
        </div>
        <div
          className={activeTab === "tab2" ? "active" : ""}
          onClick={() => setActiveTab("tab2")}
        >
          Options
        </div>
        <div
          className={activeTab === "tab3" ? "active" : ""}
          onClick={() => setActiveTab("tab3")}
        >
          Custom
        </div>
        <div
          className={activeTab === "tab4" ? "active" : ""}
          onClick={() => setActiveTab("tab4")}
        >
          Cost Center
        </div>
        <div
          className={activeTab === "tab5" ? "active" : ""}
          onClick={() => setActiveTab("tab5")}
        >
          Group
        </div>
      </div>

      {activeTab === "tab1" && (
        <div className="ledgerrepodiaBody">


          <div className="ledgerrepodiaDate">
            <section className="Dfrom">
              <label htmlFor="">From</label>

              <input
                type="Date"
                onChange={(e) =>
                  setledgerRepData({
                    ...ledgerRepData,
                    fromDate: e.target.value,
                  })
                }
                value={ledgerRepData.fromDate}
              />
            </section>
            <section className="Dto">
              <label htmlFor="">To</label>{" "}
              <input type="Date"

                value={ledgerRepData.toDate}

                onChange={(e) =>
                  setledgerRepData({
                    ...ledgerRepData,
                    toDate: e.target.value,
                  })
                }
              />
            </section>
          </div>

          <div className="ledgerrepodiaForms">
            <section>
              <label htmlFor="">Order By</label>
              <ComboBox
                className="branchinput"
                comboRef={orderbyref}
                options={[[1, ""]]}
              />
            </section>
            <section>
              <label htmlFor="">Select Ledger</label>
              <ComboBox
               findedValue={
                Array.isArray(ledgerRepData.ledger)
                  ? ledgerRepData.ledger[1]
                  : ledgerRepData.ledger
              }
                className="branchinput"
                comboRef={ledgerRef}
                options={LedgerName}
                onInputChange={(e) =>
                  setledgerRepData({
                    ...ledgerRepData,
                    ledger: e,
                  })
                } 
                
                />
            </section>
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
                options={[
                  [1, "Summary"],
                  [2, "Pending Bills"],
                  [3, "Daily"],
                  [4, "All Ledger"],
                  [5, "All Time Ledger"],
                  [6, "Receipt Wise Ledger Report"],
                  [7, "FxLedger Report"],
                  [8, "Ecom Agent Ledger Report"]

                ]}
              />
            </section>
          </div>

          <div className="ledgerrepodiaButton">
            <button  onClick={() => openReport(ledgerRepData)}>
              <img className="btnimg" src={show} alt="" />
              Show
            </button>

            <button  onClick={onClose}>
              <img className="btnimg" src={exit} alt="" />
              Exit
            </button>
          </div>
        </div>
      )}
      {activeTab === "tab2" && (
        <div className="ledgerrepodiaBody">


          <div className="ledgerrepodiaDate">
            <section className="Dfrom">
              <label htmlFor="">From</label>

              <input
                type="Date"
                onChange={(e) =>
                  setledgerRepData({
                    ...ledgerRepData,
                    fromDate: e.target.value,
                  })
                }
                value={ledgerRepData.fromDate}
              />
            </section>
            <section className="Dto">
              <label htmlFor="">To</label>
              <input type="Date"

                value={ledgerRepData.toDate}

                onChange={(e) =>
                  setledgerRepData({
                    ...ledgerRepData,
                    toDate: e.target.value,
                  })
                }
              />
            </section>
          </div>

          <div className="ledgerrepodiaForms">
            <div className="flex flex-row gap-12">
            <label>
              <input
                type="checkbox"
                checked={ledgerRepData.openingBalance}
                onChange={(e) =>
                  setledgerRepData({
                    ...ledgerRepData,
                    openingBalance: e.target.checked,
                  })
                }
              />
              &nbsp;&nbsp;Opening Balance
            </label>
            <label>
              <input
                type="checkbox"
                //checked={ledgerRepData2.openingBalance}
                // onChange={(e) =>
                //   setledgerRepData2({
                //     ...ledgerRepData2,
                //     simpleLedgerReport: e.target.checked,
                //   })
                // }
              />
              &nbsp;&nbsp;Simple Ledger Report
            </label>
            </div>
           
            <section>
              <label htmlFor="reportType">Type:</label>
              {options.map(([value, label]) => (
                <div key={value}>
                  <input
                    type="radio"
                    id={`option-${value}`}
                    name="reportType"
                    value={value}
                    checked={selectedOption === value}
                    onChange={handleOptionChange}
                  />
                  <label htmlFor={`option-${value}`}>{label}</label>
                </div>
              ))}
            </section>
            <section>
              <label htmlFor="">Show Qty</label>
              {options2.map(([value, label]) => (
                <div key={value}>
                  <input
                    type="radio"
                    id={`option-${value}`}
                    name="reportType"
                    value={value}
                    checked={selectedOption2 === value}
                    onChange={handleOptionChange2}
                  />
                  <label htmlFor={`option-${value}`}>{label}</label>
                </div>
              ))}
            </section>
            <section>
              <label htmlFor="">Show Cost Center</label>
              {options3.map(([value, label]) => (
                <div key={value}>
                  <input
                    type="radio"
                    id={`option-${value}`}
                    name="reportType"
                    value={value}
                    checked={selectedOption3 === value}
                    onChange={handleOptionChange3}
                  />
                  <label htmlFor={`option-${value}`}>{label}</label>
                </div>
              ))}
            </section>
          </div>


          <div className="ledgerrepodiaButton">
            <button  onClick={() => openReport(ledgerRepData)}>
              <img className="btnimg" src={show} alt="" />
              Show
            </button>

            <button  onClick={onClose}>
              <img className="btnimg" src={exit} alt="" />
              Exit
            </button>
          </div>
        </div>
      )}

      {activeTab === "tab3" && (
        <div className="ledgerrepodiaBody">


          <div className="ledgerrepodiaDate">
            <section className="Dfrom">
              <label htmlFor="">From</label>

              <input
                type="Date"
                onChange={(e) =>
                  setledgerRepData({
                    ...ledgerRepData,
                    fromDate: e.target.value,
                  })
                }
                value={ledgerRepData.fromDate}
              />
            </section>
            <section className="Dto">
              <label htmlFor="">To</label>{" "}
              <input type="Date"

                value={ledgerRepData.toDate}

                onChange={(e) =>
                  setledgerRepData({
                    ...ledgerRepData,
                    toDate: e.target.value,
                  })
                }
              />
            </section>
          </div>

          <div className="ledgerrepodiaForms3">
            <section>
              <label htmlFor="">Report Type</label>
              <ComboBox
                className="branchinput"
                comboRef={reporttyperef}
                options={[
                  [1, "Cash Flow"],
                  [2, "Fund Flow"],
                  [3, "Cash Book Projection"],


                ]}
              />
            </section>
          </div>

          <div className="ledgerrepodiaButton">
            <button  onClick={() => openReport(ledgerRepData)}>
              <img className="btnimg" src={show} alt="" />
              Show
            </button>

            <button  onClick={onClose}>
              <img className="btnimg" src={exit} alt="" />
              Exit
            </button>
          </div>
        </div>
      )}

      {activeTab === "tab4" && (
        <div className="ledgerrepodiaBody">


          <div className="ledgerrepodiaDate">
            <section className="Dfrom">
              <label htmlFor="">From</label>

              <input
                type="Date"
                onChange={(e) =>
                  setledgerRepData({
                    ...ledgerRepData,
                    fromDate: e.target.value,
                  })
                }
                value={ledgerRepData.fromDate}
              />
            </section>
            <section className="Dto">
              <label htmlFor="">To</label>{" "}
              <input type="Date"

                value={ledgerRepData.toDate}

                onChange={(e) =>
                  setledgerRepData({
                    ...ledgerRepData,
                    toDate: e.target.value,
                  })
                }
              />
            </section>
          </div>

          <div className="ledgerrepodiaForms3">
            <section>
              <label htmlFor="">Cost Center</label>
              <ComboBox
                className="branchinput"
                comboRef={reporttyperef}
                options={[
                  [1, ""],
                  [2, ""],
                  [3, ""],



                ]}
              />
            </section>
          </div>

          <div className="ledgerrepodiaButton">
            <button  onClick={() => openReport(ledgerRepData)}>
              <img className="btnimg" src={show} alt="" />
              Show
            </button>

            <button  onClick={onClose}>
              <img className="btnimg" src={exit} alt="" />
              Exit
            </button>
          </div>
        </div>
      )}

      {activeTab === "tab5" && (
        <div className="ledgerrepodiaBody">


          <div className="ledgerrepodiaDate">
            <section className="Dfrom">
              <label htmlFor="">From</label>

              <input
                type="Date"
                onChange={(e) =>
                  setledgerRepData({
                    ...ledgerRepData,
                    fromDate: e.target.value,
                  })
                }
                value={ledgerRepData.fromDate}
              />
            </section>
            <section className="Dto">
              <label htmlFor="">To</label>{" "}
              <input type="Date"

                value={ledgerRepData.toDate}

                onChange={(e) =>
                  setledgerRepData({
                    ...ledgerRepData,
                    toDate: e.target.value,
                  })
                }
              />
            </section>
          </div>

          <div className="ledgerrepodiaForms3">
            <section>
              <label htmlFor="">Group</label>
              <ComboBox
                className="branchinput"
                comboRef={reporttyperef}
                options={under}
              />
            </section>
          </div>

          <div className="ledgerrepodiaButton">
            <button onClick={() => openReport(ledgerRepData)}>
              <img className="btnimg" src={show} alt="" />
              Show
            </button>

            <button  onClick={onClose}>
              <img className="btnimg" src={exit} alt="" />
              Exit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LedgerRepModel;
