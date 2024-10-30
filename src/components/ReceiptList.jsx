import React, { useState, useRef, useEffect, useContext } from "react";
import "../styles/receiptList.css";
import ss from "../assets/images/SS.png";
import ssLogo from "../assets/images/sslogo.png";
import close from "../assets/images/close.png";
import ComboBox from "./ComboBox";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useDbContext } from "../context/DbContext";



function ReceiptList({ onClose, openReceiptListReport }) {
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
    const { dbCode } = useDbContext();

  const { logout, agentCode } = useContext(AuthContext);

  const [userType, setuserType] = useState("");

  useEffect(() => {
    const storeduType = sessionStorage.getItem("userType");
    if (storeduType) {
      setuserType(storeduType);
    }
  }, []);


    const getCurrentDate = () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, "0");
        const day = String(currentDate.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };



    const [ReceiptListReportData, setReceiptListReportData] = useState({
        fromDate: getCurrentDate(),
        toDate: getCurrentDate(),
        reportType: "Simple",
        agent: "",
        customer: "",
        mobileNo: "",
        accno: "",
      });
      const handleClear = () => {
        setReceiptListReportData({
          fromDate: getCurrentDate(),
          toDate: getCurrentDate(),
          reportType: "Simple",
          customer: "",
          mobileNo: "",
          accno: "",
        });
      };



      const customerRef = useRef(null);
      const agentRef = useRef(null);
      const pNoRef = useRef(null);
      const accRef = useRef(null);
      
  const [RegcnameData, setRegCnameData] = useState([]);
  // ////console.log("cnamedata=====", RegcnameData);

  useEffect(() => {
    const fetchRegCname = async () => {
      try {
        const response = await axios.get(
          `${apiBaseUrl}/SchRec_schemeregisteredcustomers/${dbCode}`
        );

        // Assuming response.data is an array with objects and each object has a LedName property
        const cName = response.data;

        // Transforming the array into the desired format
        // const supplName = cName.map((item) => item.LedName);

        const transformedData = cName.map((item) => [
          item.accname,
          item.LedName,
        ]);
        setRegCnameData(transformedData);

        // setsupplierName(supplName);
      } catch (error) {
        console.error("Error fetching regcustomers Values:", error.message);
      }
    };

    fetchRegCname();
  }, [apiBaseUrl]);

  const fetchRegCname = async () => {
    try {
      const response = await axios.get(
        `${apiBaseUrl}/SchRec_schemeregisteredcustomers/${dbCode}`
      );

      // Assuming response.data is an array with objects and each object has a LedName property
      const cName = response.data;

      // Transforming the array into the desired format
      // const supplName = cName.map((item) => item.LedName);

      const transformedData = cName.map((item) => [item.accname, item.LedName]);
      setRegCnameData(transformedData);

      // setsupplierName(supplName);
    } catch (error) {
      console.error("Error fetching regcustomers Values:", error.message);
    }
  };

  //////////agent name///////////////

  const [agentName, setagentName] = useState([]);
  const [agentobj, setAgentObj] = useState([]);
  const fetchAgname = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/schsalesmanNames/${dbCode}`);

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
        const response = await axios.get(`${apiBaseUrl}/schsalesmanNames/${dbCode}`);

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

  const [accNo, setaccNo] = useState([]);


  const fetchAccno = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/SchRec_Accno/${dbCode}`);

      // Assuming response.data is an array with objects and each object has a LedName property
      const Accno = response.data;

      // Transforming the array into the desired format
      // const supplName = cName.map((item) => item.LedName);

      const transformedData = Accno.map((item) => [item.auto, item.accno]);
      setaccNo(transformedData);

      // setsupplierName(supplName);
    } catch (error) {
      console.error("Error fetching accno Values:", error.message);
    }
  };
  // ////console.log('......',accnoAuto);

  useEffect(() => {
    const fetchAccno = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/SchRec_Accno/${dbCode}`);

        // Assuming response.data is an array with objects and each object has a LedName property
        const Accno = response.data;

        // Transforming the array into the desired format
        // const supplName = cName.map((item) => item.LedName);

        const transformedData = Accno.map((item) => [item.auto, item.accno]);
        setaccNo(transformedData);

        // setsupplierName(supplName);
      } catch (error) {
        console.error("Error fetching accno Values:", error.message);
      }
    };

    fetchAccno();
  }, [apiBaseUrl]);
  const reportAgent=()=>{
    setReceiptListReportData({
      ...ReceiptListReportData,
      agent:agentName.find((item) => item[0] === parseInt(agentCode))
      
    });
  }

  return (
    <div className="receiptListRoot">
      <div className="report_dialogHead">
        <div className="report_dialogHeadpart">
          <img src={ssLogo} alt="SS" />
          <label>Receipt List</label>
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

      <div className="report_dialogBody">
            <div className="report_dialogBodypart1">
              <div className="report_dialogBodypart1sec">
                <label>From</label>

                <input
                  type="date"
                  value={ReceiptListReportData.fromDate}
                  onChange={(e) =>
                    setReceiptListReportData({
                      ...ReceiptListReportData,
                      fromDate: e.target.value,
                    })
                  }
                />
              </div>
              <div className="report_dialogBodypart1sec">
                {/* <label>Order By</label>

                <input type="text" /> */}
              </div>
              <div className="report_dialogBodypart1sec">
                <label>To</label>

                <input
                  type="date"
                  value={ReceiptListReportData.toDate}
                  onChange={(e) =>
                    setReceiptListReportData({
                      ...ReceiptListReportData,
                      toDate: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="report_dialogBodypart2">
              <div className="report_dialogBodypart2sec">
                <label>Report Type</label>
                {/* <ComboBox className="sec2combo" comboRef={customerRef} options={[['01,Simple'],['02,date wise']]} /> */}
                <select
                  value={ReceiptListReportData.reportType}
                  className="sec2combo selectcombo"
                  onChange={(e) =>
                    setReceiptListReportData({
                      ...ReceiptListReportData,
                      reportType: e.target.value,
                    })
                  }
                >
                  <option value="Simple">Simple</option>
                  <option value="Date wise">Date wise</option>
                </select>
              </div>
              <div className="report_dialogBodypart2sec">
                <label>Select Scheme Customer</label>
                <ComboBox
                  findedValue={
                    Array.isArray(ReceiptListReportData.customer)
                      ? ReceiptListReportData.customer[1]
                      : ReceiptListReportData.customer
                  }
                  className="sec2combo"
                  comboRef={customerRef}
                  options={RegcnameData}
                  onInputChange={(e) =>
                    setReceiptListReportData({
                      ...ReceiptListReportData,
                      customer: e,
                    })
                  }
                //   readOnly={userType!=='ADMIN'}
                />
              </div>
              <div className="report_dialogBodypart2sec">
                <label>Select Scheme Agent</label>
                <ComboBox
                  findedValue={
                    Array.isArray(ReceiptListReportData.agent)
                      ? ReceiptListReportData.agent[1]
                      : ReceiptListReportData.agent
                  }
                  className="sec2combo"
                  comboRef={agentRef}
                  options={agentName}
                  onInputChange={(e) =>
                    setReceiptListReportData({
                      ...ReceiptListReportData,
                      agent: e,
                    })
                  }
                //   readOnly={userType!=='ADMIN'}

                />
              </div>
              <div className="report_dialogBodypart2sec">
                <label>Select Account Number</label>
                <ComboBox
                  findedValue={
                    Array.isArray(ReceiptListReportData.accno)
                      ? ReceiptListReportData.accno[1]
                      : ReceiptListReportData.accno
                  }
                  className="sec2combo"
                  comboRef={accRef}
                  options={accNo}
                  onInputChange={(e) =>
                    setReceiptListReportData({
                      ...ReceiptListReportData,
                      accno: e,
                    })
                  }

                //   readOnly={userType!=='ADMIN'}

                />
              </div>
              <div className="report_dialogBodypart2sec">
                <label>Phone Number</label>
                <input
                  value={ReceiptListReportData.mobileNo}
                  className="sec2combo selectcombo"
                  ref={pNoRef}
                  onChange={(e) =>
                    setReceiptListReportData({
                      ...ReceiptListReportData,
                      mobileNo: e.target.value,
                    })
                  }
                //   readOnly={userType!=='ADMIN'}

                />
              </div>
            </div>
            <div className="report_dialogBodypart3">
              <button
                className="report_dialogBodypart3buttons"
                onClick={() => openReceiptListReport(ReceiptListReportData)}
              >
                <label>Show</label>
              </button>
              {/* <button className="report_dialogBodypart3buttons">
                <label>Date Wise</label>
              </button> */}
              <button
                className="report_dialogBodypart3buttons"
                onClick={onClose}
              >
                <label>Exit</label>

              </button>
            </div>
          </div>
    </div>
  );
}

export default ReceiptList;
