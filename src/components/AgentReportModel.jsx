import React, { useRef, useEffect, useState, useContext } from "react";
import "../styles/AgentReportModel.css";
import close from "../assets/images/close.png";
import ssLogo from "../assets/images/sslogo.png";
import "../components/ComboBox";
import ComboBox from "../components/ComboBox";
import show from "../assets/images/check-mark .png";
import exit from "../assets/images/cross .png";
import axios from "axios";
import Swal from "sweetalert2";
import io from "socket.io-client";
import { AuthContext } from "../context/AuthContext";
import { Group } from "antd/es/avatar";
import { useDbContext } from "../context/DbContext";


function AgentReportModel({ onClose, openReport }) {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const { agentCode } = useContext(AuthContext);
  const { dbCode } = useDbContext();


  const orderbyref = useRef(null);
  const brachref = useRef(null);
  const reporttyperef = useRef(null);
  const ledgerRef = useRef(null);
  const showqtyref = useRef(null);
  const showcostcenteref = useRef(null);

  const getCurrentDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const [agentRepData, setagentRepData] = useState({
    fromDate: getCurrentDate(),
    toDate: getCurrentDate(),
  
    reportType: "agentCommisionReport",
    phoneNo:"",
    agent:""
  
  });

  // ////console.log("agentRepData",agentRepData);
  
 
  const [agentName, setagentName] = useState([]);
  const [agentobj, setAgentObj] = useState([]);
  const fetchAgname = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/main/schsalesmanNames/${dbCode}`);

      // Assuming response.data is an array with objects and each object has a LedName property
      const AgName = response.data;

      // Transforming the array into the desired format
      // const supplName = cName.map((item) => item.LedName);

      const transformedData = AgName.map((item) => [item.Auto, item.Name]);
      setagentName(transformedData);

      // setsupplierName(supplName);
    } catch (error) {
      console.error("Error fetching agent Values:", error.message);
    }
  };

  useEffect(() => {
    const fetchAgname = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/main/schsalesmanNames/${dbCode}`);

        // Assuming response.data is an array with objects and each object has a LedName property
        const AgName = response.data;

        // Transforming the array into the desired format
        // const supplName = cName.map((item) => item.LedName);

        const transformedData = AgName.map((item) => [item.Auto, item.Name]);
        setagentName(transformedData);

        // setsupplierName(supplName);
      } catch (error) {
        console.error("Error fetching agent Values:", error.message);
      }
    };

    fetchAgname();
  }, [apiBaseUrl]);


  return (
    <div className="agentrepodiaroot">
      <div className="agentrepodiahead ">
        <div className="agentrepodia_dialogHeadpart">
          <img src={ssLogo} alt="SS" />
          <label>Agent Report</label>
        </div>
        <div className="agentrepodia_dialogHeadControlls">
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

      <div className="agentrepodiaBody">
        <div className="agentrepodiaDate">
          <section className="Dfrom">
            <label htmlFor="">From</label>

            <input
              type="Date"
              onChange={(e) =>
                setagentRepData({
                  ...agentRepData,
                  fromDate: e.target.value,
                })
              }
              value={agentRepData.fromDate}
            />
          </section>
          <section className="Dto">
            <label htmlFor="">To</label>{" "}
            <input
              type="Date"
              value={agentRepData.toDate}
              onChange={(e) =>
                setagentRepData({
                  ...agentRepData,
                  toDate: e.target.value,
                })
              }
            />
          </section>
        </div>

        <div className="agentrepodiaForms">
          <section>
            <label htmlFor="">Report Type</label>
            {/* <ComboBox
              className="agbranchinput"
              comboRef={reporttyperef}
              options={[
                [1, "Summary"],
                [2, "Pending Bills"],
                [3, "Daily"],
                [4, "All Ledger"],
                [5, "All Time Ledger"],
                [6, "Receipt Wise Ledger Report"],
                [7, "FxLedger Report"],
                [8, "Ecom Agent Ledger Report"],
              ]}
            /> */}

            <select
              // value={ReportData.reportType}
              className="agbranchinput"
              // onChange={(e) =>
              //   setReportData({
              //     ...ReportData,
              //     reportType: e.target.value,
              //   })
              // }

              style={{
                height: "4vh",
           
                border: "1px solid black",
              }}
            >
              <option value="agentCommisionReport">Simple</option>
                          {/* <option value="reportOrderbyEntryno">Order By EntryNo</option> */}

            </select>

          </section>
          <section>
            <label htmlFor="">Select Agent</label>
            <ComboBox
              findedValue={
                Array.isArray(agentRepData.ledger)
                  ? agentRepData.ledger[1]
                  : agentRepData.ledger
              }
              className="agbranchinput"
              comboRef={ledgerRef}
              options={agentName}
              onInputChange={(e) =>
                setagentRepData({
                  ...agentRepData,
                  agent: e,
                })
              }
            />
          </section>
          <section>
            <label htmlFor="">Phone Number</label>
            <input
              className="agbranchinput"
              ref={brachref}
              onChange={(e) =>
                setagentRepData({
                  ...agentRepData,
                  phoneNo: e.target.value,
                })
              }
            />
          </section>
        </div>

        <div className="agentrepodiaButton">
          <button onClick={() => openReport(agentRepData)}>
            <img className="btnimg" src={show} alt="" />
            Show
          </button>

          <button onClick={onClose}>
            <img className="btnimg" src={exit} alt="" />
            Exit
          </button>
        </div>
      </div>
    </div>
  );
}

export default AgentReportModel;
