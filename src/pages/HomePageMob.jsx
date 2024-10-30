import React, { useState, useRef, useEffect, useContext } from "react";
import "../styles/HomePageMob.css";
import reg from "../assets/images/registration.png";
import rec from "../assets/images/receipt.png";
import redeem from "../assets/images/gift.png";
import backup from "../assets/images/backup.png";
import dash from "../assets/images/dashboard.png";
import exit from "../assets/images/exit.png";
import ss from "../assets/images/ssmobv.png";
import { useNavigate } from "react-router-dom";

import SchemeRegistration from "../components/SchemeRegistration";
import SchemeCashReceipt from "../components/SchemeCashReceipt";
import SchemeRedeem from "../components/SchemeRedeem";
import SchemeReport from "../components/SchemeReport";
import ssLogo from "../assets/images/sslogo.png";
import minimize from "../assets/images/mini.png";
import maximize from "../assets/images/maximize.png";
import close from "../assets/images/close.png";
// import toggle from "../assets/images/MobToggle.png";
import toggle from "../assets/images/menus.png";

import toggleClose from "../assets/images/xred.webp";

import ComboBox from "../components/ComboBox";
import axios from "axios";
import LedgerReg from "../components/LedgerReg";
import StaffReg from "../components/StaffReg";
import zIndex from "@mui/material/styles/zIndex";
import Print from "../components/Print";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import { useDbContext } from "../context/DbContext";

function HomePageMob() {
  const navigate = useNavigate();
  const { logout, agentCode } = useContext(AuthContext);
  // ////console.log(agentCode);

  const [userType, setuserType] = useState("");

  useEffect(() => {
    const storeduType = sessionStorage.getItem("userType");
    if (storeduType) {
      setuserType(storeduType);
    }
  }, []);

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const { dbCode } = useDbContext();

  const getCurrentDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
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

  const [ReportData, setReportData] = useState({
    fromDate: getCurrentDate(),
    toDate: getCurrentDate(),
    reportType: "Simple",
    agent: "",
    customer: "",
    mobileNo: "",
    accno: "",
  });
  // ////console.log("rep", ReportData);

  const handleClear = () => {
    setReportData({
      fromDate: getCurrentDate(),
      toDate: getCurrentDate(),
      reportType: "Simple",
      agent: "",
      customer: "",
      mobileNo: "",
    });
  };
  // ////console.log("finddialogdata==", ReportData);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setShowModal(true);
  }, []);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showLedgerRegModal, setShowLedgerRegModal] = useState(false);

  const [showStaffRegModal, setShowStaffRegModal] = useState(false);

  const openRegistrationModal = () => {
    // if (isMobile) {
    //   navigate("/registration");
    // } else {
    setShowRegistrationModal(true);
    // }
  };
  const openLedgerRegModal = () => {
    // if (isMobile) {
    //   navigate("/registration");
    // } else {
    setShowLedgerRegModal(true);
    // }
  };

  const openStaffRegModal = () => {
    // if (isMobile) {
    //   navigate("/registration");
    // } else {
    setShowStaffRegModal(true);
    // }
  };
  const openReceiptModal = () => {
    // if (isMobile) {
    //   navigate("/receipt");
    // } else {
    setShowReceiptModal(true);
    // }
  };

  const openRedeemModal = () => {
    //     if(isMobile){
    // navigate("./redeem")
    //     }else{
    setShowRedeemModal(true);
    // }
  };

  const openReportModal = () => {
    // Close the showFindDialog
    //  setShowFindDialog(false);
    // Open the showReportModal

    setShowReportModal(true);
  };

  const openReportPage = () => {
    navigate("/report"); // Navigate to the report page
  };

  const [showFindDialog, setShowFindDialog] = useState(false); // State for controlling the visibility of the find dialog
  const [findEntryNo, setFindEntryNo] = useState(""); // State to store the entry number entered in the find dialog
  // ////console.log(findEntryNo);
  const openFindDialog = () => {
    setShowFindDialog(true);
    fetchAccno();
    fetchAgname();
    fetchRegCname();
  };

  //////console.log(ReportData);
  const reportAgent = () => {
    setReportData({
      ...ReportData,
      agent: agentName.find((item) => item[0] === parseInt(agentCode)),
    });
  };

  const closeFindDialog = (e) => {
    handleClear(e);
    setShowFindDialog(false);
    setFindEntryNo("");
  };

  const isMobile = window.innerWidth <= 768;

  const customerRef = useRef(null);
  const agentRef = useRef(null);
  const pNoRef = useRef(null);
  const accRef = useRef(null);

  const [RegcnameData, setRegCnameData] = useState([]);
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

  const [accNo, setaccNo] = useState([]);
  // ////console.log('......',accnoAuto);
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

  useEffect(() => {
    // Push a new state to the history stack when the component mounts
    window.history.pushState(null, null, window.location.pathname);

    // Add a listener to the 'popstate' event
    window.addEventListener("popstate", handlePopstate);

    // Clean up the listener when the component unmounts
    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };
  }, []);

  const handlePopstate = () => {
    // Push another state to the history stack, effectively preventing the user from going back
    window.history.pushState(null, null, window.location.pathname);
  };



  const schemeRegistrationRef = useRef(null);

  const handleClearInSchemeReg = () => {
    if (schemeRegistrationRef.current) {
      schemeRegistrationRef.current.handleClear();
    }
  };
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div className="HomePageMobroot">
       {/* <button className="toggle-btn" onClick={toggleSidebar}>
        <img src={toggle} alt="Toggle Sidebar" />
      </button>
      <Sidebar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} /> */}
      {/* ////////mobVw headtags//////// */}
      <div className="homemob_headDiv">
        <label className="homemob_headDivhead">SherGold ERP</label>
        <label className="homemob_headDivtag">
          A Complete Accounting & Inventory Package
        </label>
      </div>
      {/* ///////////////////////////////////// */}

      <div className="homemob_bodyDiv">
        <div className="homemob_bodyDivRows">
          <button
            className="homemob_bodyDivCol"
            onClick={() => navigate("/registration")}
            disabled
          >
            <img src={reg} alt="img" />
            <label>Registration</label>
          </button>
          <button
            className="homemob_bodyDivCol"
            onClick={() => navigate("/receipt")}
          >
            <img src={rec} alt="img" />
            <label> Cash Receipt</label>
          </button>
        </div>
        <div className="homemob_bodyDivRows">
          <button
            className="homemob_bodyDivCol"
            // onClick={() => navigate("/redeem")}
          >
            <img src={redeem} alt="img" />
            <label> Redeem</label>
          </button>
          <button className="homemob_bodyDivCol">
            <img src={backup} alt="img" />
            <label>Backup</label>
          </button>
        </div>
        <div className="homemob_bodyDivRows">
          <button
            className="homemob_bodyDivCol"
            onClick={(e) => {
              openFindDialog(e);
              reportAgent(e);
            }}
          >
            <img src={dash} alt="img" />
            <label>Report</label>
          </button>
          <button className="homemob_bodyDivCol" onClick={() => navigate("/")}>
            <img src={exit} alt="img" />
            <label>Exit</label>
          </button>
        </div>
      </div>
      {/* ///////////////////mobVw footertags////////// */}
      <div className="shersoftdivMob">
        <div className="shersoftdivMobimg">
          <img src={ss} alt="SS" />
        </div>
        <div className="shersoftdivMobcontents">
          <div className="shersoftdivMobcontentsdiv">
            <label className="shersoftdivMobcontentHead">SherSoft</label>
          </div>
          <div className="shersoftdivMobcontentsdiv">
            <label className="softcmpnyMob">Software Company</label>
          </div>
          <div className="shersoftdivMobcontentsdiv">
            <label className="softcmpnyMob">www.shersoftware.com</label>
          </div>
          <div className="shersoftdivMobcontentsdiv">
            <label className="softcmpnyMob">PH:9847997755</label>
          </div>
          <div className="shersoftdivMobcontentsdiv">
            <label className="softcmpnyMob">Email:shersoftware@gmail.com</label>
          </div>
        </div>
      </div>

      {/* ////////////////////////////////////// */}

      {showFindDialog && (
        <div
          className=" report_dialog"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "98%",
          }}
        >
          <div className="report_dialogHead">
            <div className="report_dialogHeadpart">
              <img src={ssLogo} alt="SS" />
              <label>Scheme Report</label>
            </div>
            <div className="report_dialogHeadControlls">
              {/* <button className="controllsbuttons">
                <img src={minimize} alt="min" />
              </button>
              <button className="controllsbuttons">
                <img src={maximize} alt="exp" />
              </button> */}
              <button
                className="controllsbuttons xbutton"
                onClick={(e) => {
                  closeFindDialog(e);
                }}
                style={{ width: "30px", height: "30px", marginRight: "2vw" }}
              >
                <img src={close} alt="X" />
              </button>
            </div>
          </div>
          <div className="report_dialogBody">
            <div className="report_dialogBodypart1" style={{ gap: "0" }}>
              <div
                className="report_dialogBodypart1sec"
                style={{ width: "50%", gap: "5%" }}
              >
                <label>From</label>

                <input
                  //style={{width:'90%'}}
                  type="date"
                  value={ReportData.fromDate}
                  onChange={(e) =>
                    setReportData({
                      ...ReportData,
                      fromDate: e.target.value,
                    })
                  }
                />
              </div>

              <div
                className="report_dialogBodypart1sec"
                style={{ width: "50%", gap: "5%" }}
              >
                <label>To</label>

                <input
                  type="date"
                  value={ReportData.toDate}
                  onChange={(e) =>
                    setReportData({
                      ...ReportData,
                      toDate: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="report_dialogBodypart2">
              <div className="report_dialogBodypart2sec">
                <label className="schReportmoblabel">Report Type</label>
                {/* <ComboBox className="sec2combo" comboRef={customerRef} options={[['01,Simple'],['02,date wise']]} /> */}
                <select
                  value={ReportData.reportType}
                  className="sec2combo selectcombo"
                  onChange={(e) =>
                    setReportData({
                      ...ReportData,
                      reportType: e.target.value,
                    })
                  }
                  style={{ width: "98%", border: "1px solid black" }}
                >
                  <option value="Simple">Simple</option>
                  <option value="Date wise">Date wise</option>
                </select>
              </div>
              <div className="report_dialogBodypart2sec">
                <label className="schReportmoblabel">
                  Select Scheme Customer
                </label>
                <ComboBox
                  findedValue={
                    Array.isArray(ReportData.customer)
                      ? ReportData.customer[1]
                      : ReportData.customer
                  }
                  className="sec2combo1"
                  comboRef={customerRef}
                  options={RegcnameData}
                  onInputChange={(e) =>
                    setReportData({
                      ...ReportData,
                      customer: e,
                    })
                  }
                  readOnly={userType !== "ADMIN"}
                />
              </div>
              <div className="report_dialogBodypart2sec">
                <label className="schReportmoblabel">
                  {" "}
                  Select Scheme Agent
                </label>
                <ComboBox
                  findedValue={
                    Array.isArray(ReportData.agent)
                      ? ReportData.agent[1]
                      : ReportData.agent
                  }
                  className="sec2combo1"
                  comboRef={agentRef}
                  options={agentName}
                  onInputChange={(e) =>
                    setReportData({
                      ...ReportData,
                      agent: e,
                    })
                  }
                  readOnly={userType !== "ADMIN"}
                />
              </div>
              <div className="report_dialogBodypart2sec">
                <label className="schReportmoblabel">
                  Select Account Number
                </label>
                <ComboBox
                  findedValue={
                    Array.isArray(ReportData.accno)
                      ? ReportData.accno[1]
                      : ReportData.accno
                  }
                  className="sec2combo1"
                  comboRef={accRef}
                  options={accNo}
                  onInputChange={(e) =>
                    setReportData({
                      ...ReportData,
                      accno: e,
                    })
                  }
                  readOnly={userType !== "ADMIN"}
                />
              </div>
              <div className="report_dialogBodypart2sec">
                <label className="schReportmoblabel">Phone Number</label>
                <input
                  value={ReportData.mobileNo}
                  style={{ width: "98%" }}
                  className="sec2combo selectcombo"
                  ref={pNoRef}
                  onChange={(e) =>
                    setReportData({
                      ...ReportData,
                      mobileNo: e.target.value,
                    })
                  }
                  readOnly={userType !== "ADMIN"}
                />
              </div>
            </div>
            <div className="report_dialogBodypart3">
              <button
                className="report_dialogBodypart3buttons"
                onClick={openReportModal}
                style={{ width: "25%", height: "72%" }}
              >
                <label>Show</label>
              </button>
              {/* <button className="report_dialogBodypart3buttons">
                <label>Date Wise</label>
              </button> */}
              <button
                style={{ width: "25%", height: "72%" }}
                className="report_dialogBodypart3buttons"
                onClick={(e) => {
                  closeFindDialog(e);
                }}
              >
                <label>Exit</label>
              </button>
            </div>
          </div>
        </div>
      )}

      {showReportModal && (
        <SchemeReport
          onClose={() => {
            setShowReportModal(false);
            handleClear();
          }}
          reportData={ReportData}
        />
      )}
    </div>
  );
}

export default HomePageMob;
