import React, { useState, useEffect, useRef, useContext } from "react";
import "../styles/HomePage.css";
import reg from "../assets/images/registration.png";
import rec from "../assets/images/receipt.png";
import redeem from "../assets/images/gift.png";
import backup from "../assets/images/backup.png";
import dash from "../assets/images/dashboard.png";
import exit from "../assets/images/exit.png";
import ss from "../assets/images/SS.png";
import ledger from "../assets/images/ledger .png";
import staff from "../assets/images/management.png";
import { useNavigate } from "react-router-dom";
import SchemeRegistration from "../components/SchemeRegistration";
import SchemeCashReceipt from "../components/SchemeCashReceipt";
import PrimaryNav from "../components/PrimaryNav";
import SchemeRedeem from "../components/SchemeRedeem";
import SchemeReport from "../components/SchemeReport";
import ssLogo from "../assets/images/sslogo.png";
import minimize from "../assets/images/mini.png";
import maximize from "../assets/images/maximize.png";
import close from "../assets/images/close.png";
import toggle from "../assets/images/MobToggle.png";
import toggleClose from "../assets/images/xred.webp";
import rateSettings from "../assets/images/rateSettings.png";
import rateclass from "../assets/images/rateClass.png";
import SubM from "../assets/images/next.png";

import ComboBox from "../components/ComboBox";
import axios from "axios";
import LedgerReg from "../components/LedgerReg";
import StaffReg from "../components/StaffReg";
import zIndex from "@mui/material/styles/zIndex";
import Print from "../components/Print";
import RateClassReg from "../components/RateClassReg";
import RateSettings from "../components/RateSettings";
import { AuthContext } from "../context/AuthContext";
import ReceiptList from "../components/ReceiptList";
import "../styles/primaryNavbar.css";
import ReceiptListReport from "../components/ReceiptListReport";
import FormRegistration from "../components/FormRegistration";
import DayBook from "../components/DayBook";
import DayBookReport from "../components/DayBookReport";
import JournalEntry from "../components/JournalEntry";
import ContraEntry from "../components/ContraEntry";
import LedgerRepModel from "../components/LedgerRepModel";
import LedgerReport from "../components/LedgerReport";
import QuickSearch from "../components/QuickSearch";
import AgentReportModel from "../components/AgentReportModel";
import AgentReport from "../components/AgentReport";
import { useDbContext } from "../context/DbContext";
import SmsSettings from "../components/SmsSettings";
import CdbSettings from "../components/CdbSettings";
import CashReceipt from "../components/CashReceipt";

function HomePage() {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const { logout, agentCode } = useContext(AuthContext);
  const { dbCode } = useDbContext();
 
  ////console.log("agdbCode==",dbCode);
  


  const [userType, setuserType] = useState("");

  useEffect(() => {
    const storeduType = sessionStorage.getItem("userType");
    if (storeduType) {
      setuserType(storeduType);
    }
  }, []);

  // Example usage of agentCode
  // useEffect(() => {
  //   ////console.log("Agent Code:", agentCode);
  // }, [agentCode]);

  const getCurrentDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const [ReportData, setReportData] = useState({
    fromDate: getCurrentDate(),
    toDate: getCurrentDate(),
    reportType: "simpleReport",
    agent: "",
    customer: "",
    mobileNo: "",
    accno: "",
  });
  //  ////console.log("rep", ReportData);

  const handleClear = () => {
  
    setReportData({
      ...ReportData,
      fromDate: getCurrentDate(),
      toDate: getCurrentDate(),
      reportType: "simpleReport",
      customer: "",
      mobileNo: "",
      accno: "",
    });
    //  reportAgent() ;
  };
  // ////console.log("finddialogdata==", ReportData);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
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
  const [showRateClassModal, setShowRateClassModal] = useState(false);
  const [showRateSettingsModal, setShowRateSettingsModal] = useState(false);
  const [showReceiptListModal, setShowReceiptListModal] = useState(false);
  const [showReceiptListReportModal, setShowReceiptListReportModal] =useState(false);
  const [showFormRegModal, setShowFormRegModal] = useState(false);
  const [showdayBookModal, setDayBookModal] = useState(false);
  const [showdayBookReportModal, setDayBookReportModal] = useState(false);
  const [showjvModal, setJvModal] = useState(false);
  const [showcvModal, setCvModal] = useState(false);
  const [showledgerdiaModal, setledgerdiaModal] = useState(false);
  const [showledgerReportModal, setledgerReportModal] = useState(false);
  const [showqSearchModal, setQsearchModal] = useState(false);
  const [showagReportdiaModal, setShowagReportdiaModal] = useState(false);
  const [showagReportModal, setShowagReportModal] = useState(false);
  const [showSmssettingsModal, setShowSmssettingsModal] = useState(false);
  const [showcashRecModal, setShowCashRecModal] = useState(false);


  const opencashRec = () => {
  
    setShowCashRecModal(true);
  
  };




  const openSmsSettings = () => {
  
    setShowSmssettingsModal(true);
  
  };

  const [agreportData, setAgreportData] = useState(null);
  // ////console.log("agdata=",agreportData);


  const openagReportdiaModal = (e) => {

    setShowagReportdiaModal(true);
   
  };
  const openAgreport = (agdata) => {
    
    setAgreportData(agdata);

    setShowagReportModal(true);
  };



  const openRegistrationModal = () => {
  
    setShowRegistrationModal(true);
  
  };
  const [ledval, setLedval] = useState("");
  const [trackbackRowIndex, setTrackbackRowIndex] = useState("");
  const [trackbackColIndex, setTrackbackColIndex] = useState("");
  const [ledgerJustClosed, setLedgerJustClosed] = useState(false);

  const openLedgerRegModal = (e) => {
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
  const [Fid, setFid] = useState("");
  const [fName, setFName] = useState("");


  const openReceiptModal = (frmId,fname) => {
    // if (isMobile) {
    //   navigate("/receipt");
    // } else {
      setFid(frmId);
      setFName(fname);
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
  const openRateClassModal = () => {
    // if (isMobile) {
    //   navigate("/registration");
    // } else {
    setShowRateClassModal(true);
    // }
  };
  const openRateSettingsModal = () => {
    // if (isMobile) {
    //   navigate("/registration");
    // } else {
    setShowRateSettingsModal(true);
    // }
  };

  const openReceiptListModal = () => {
    setShowReceiptListModal(true);
  };

  const openFormRegModal = () => {
    setShowFormRegModal(true);
  };

  const opendayBookModal = () => {
    setDayBookModal(true);
  };
  const openjvModal = () => {
    setJvModal(true);
  };
  const opencvModal = () => {
    setCvModal(true);
  };

  const openledgerdiaModal = () => {
    setledgerdiaModal(true);
  };
  const openQuicksearchModal = () => {
    setQsearchModal(true);
  };
  const [LedreportData, setLedreportData] = useState(null);

  const openledgerreportModal = (leddata) => {
    setLedreportData(leddata);

    setledgerReportModal(true);
  };




  const [dayBookData, setDayBookData] = useState(null);

  const opendayBookReportModal = (dayBookData) => {
    setDayBookReportModal(true);
    setDayBookData(dayBookData);
  };

  const [receiptListReportData, setReceiptListReportData] = useState(null);
  const openReceiptListReportModal = (reportData) => {
    setShowReceiptListReportModal(true);
    setReceiptListReportData(reportData);
  };

  const openReportPage = () => {
    navigate("/report"); // Navigate to the report page
  };

  const [showFindDialog, setShowFindDialog] = useState(false); // State for controlling the visibility of the find dialog
  const [findEntryNo, setFindEntryNo] = useState(""); // State to store the entry number entered in the find dialog
  // ////console.log(findEntryNo);
  const openFindDialog = () => {
    setShowFindDialog(true);
    fetchRegCname();
    fetchAgname();
    fetchAccno();
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
  // ////console.log("cnamedata=====", RegcnameData);

  useEffect(() => {
    const fetchRegCname = async () => {
      try {
        const response = await axios.get(
          `${apiBaseUrl}/main/SchRec_schemeregisteredcustomers/${dbCode}`
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
        `${apiBaseUrl}/main/SchRec_schemeregisteredcustomers/${dbCode}`
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

  const [accNo, setaccNo] = useState([]);

  const fetchAccno = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/main/SchRec_Accno/${dbCode}`);

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
        const response = await axios.get(`${apiBaseUrl}/main/SchRec_Accno/${dbCode}`);

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

  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const schemeRegistrationRef = useRef(null);

  const handleClearInSchemeReg = () => {
    if (schemeRegistrationRef.current) {
      schemeRegistrationRef.current.handleClear();
    }
  };

  const handleExit = () => {
    logout();
    navigate("/");
  };

  const reportAgent = () => {
    setReportData({
      ...ReportData,
      agent: agentName.find((item) => item[0] === parseInt(agentCode)),
      
    });
  };
  ////////nav items//////////////////
  const [allReceipts, setallReceipts] = useState([]);

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/main/schselectAllformRec/${dbCode}`);

        // Assuming response.data is an array with objects and each object has a LedName property
        const Rec = response.data;

        // Transforming the array into the desired format
        // const supplName = cName.map((item) => item.LedName);

        const transformedData = Rec.map((item) => [
          item.fmrAgentId,
          item.fmrAbbreviation,
        ]);
        setallReceipts(transformedData);

        // setsupplierName(supplName);
      } catch (error) {
        console.error("Error fetching allrec Values:", error.message);
      }
    };

    fetchReceipts();
  }, [apiBaseUrl]);
  const fetchReceipts = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/main/schselectAllformRec/${dbCode}`);

      // Assuming response.data is an array with objects and each object has a LedName property
      const Rec = response.data;

      // Transforming the array into the desired format
      // const supplName = cName.map((item) => item.LedName);

      const transformedData = Rec.map((item) => [
        item.fmrAgentId,
        item.fmrAbbreviation,
      ]);
      setallReceipts(transformedData);

      // setsupplierName(supplName);
    } catch (error) {
      console.error("Error fetching allrec Values:", error.message);
    }
  };



  // const navItems = [
  //   { name: "File", options: ["Form Registration"] },
  //   {
  //     name: "Master",
  //     options: [
  //       "Rate Settings",
  //       "Rate Class Registration",
  //       "Staff Registration",
  //       "Scheme Registration",
  //       "User Creation",
  //     ],
  //   },
  //   {
  //     name: "Entry",
  //     options: [
  //       "Scheme Cash Receipt",
  //       "Scheme Redeem",
  //       "Journal Entry",
  //       "Contra Entry",
  //     ],
  //   },
  //   { name: "Records List", options: [] },
  //   { name: "Inventory Reports", options: ["Scheme Report"] },
  //   {
  //     name: "Accounts Reports",
  //     options: ["Ledger Report", "Receipt List", "Day Book"],
  //   },
  //   { name: "Tools", options: [] },
  //   { name: "System", options: [] },
  // ];

  // const handleDownload = async () => {
  //   try {
  //     const response = await fetch(`${apiBaseUrl}/main/download-backup`);
  //     if (!response.ok) throw new Error('Network response was not ok.');

  //     // Convert the response to a blob and create a download link
  //     const blob = await response.blob();
  //     const url = window.URL.createObjectURL(blob);
  //     const a = document.createElement('a');
  //     a.href = url;
  //     a.download = 'backup.bak';
  //     a.click();
  //     window.URL.revokeObjectURL(url);
  //   } catch (error) {
  //     console.error('Error downloading backup:', error);
  //   }
  // };

  const [companyName, setCompanyName] = useState("");

 

  
    
    const fetchcompanydetails = async () => {
      try {
        const response = await axios.get(
          `${apiBaseUrl}/main/findCompanyDetails/${dbCode}`
        );
        const foundData = response.data[0];
        setCompanyName(foundData.name || "SherGold");
        // console.log("found", foundData.name);
        return foundData.Code

        // setsupplierName(supplName);
      } catch (error) {
        console.error("Error fetching company datas:", error.message);
        // alert(error.response.data);
      }
    };
  const downloadBackup = async () => {

    const code = await fetchcompanydetails();
    console.log(code);


    const response = await fetch(`${apiBaseUrl}/main/export-all-tables-xml-zip/${dbCode}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/zip',
        },
    });

    if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${code}_backup.zip`); // Downloaded file name
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
    } else {
        console.error('Failed to download the backup');
        alert('Failed to download the backup')
    }
};


  const navItems = [
    { 
      name: "File", 
      options: [
        { name: "Form Registration", subOptions: [] }
      ] 
    },
    {
      name: "Master",
      options: [
        { name: "Rate Settings", subOptions: [] },
        { name: "Rate Class Registration", subOptions: [] },
        { name: "Staff Registration", subOptions: [] },
        { name: "Scheme Registration", subOptions: [] },
        { 
          name: "User Creation", 
          subOptions: [
            // "Create User",
            // "Modify User",
            // "Delete User"
          ] 
        }
      ],
    },
    {
      name: "Entry",
      options: [
        { name: "Scheme Cash Receipt", subOptions: allReceipts},
        { name: "Scheme Redeem", subOptions: [] },
        { name: "Journal Entry", subOptions: [] },
        { name: "Contra Entry", subOptions: [] },
        { name: "Receipt Entry", subOptions: [[1,"Cash Receipt"]] }

      ],
    },
    { name: "Records List", options: [] },
    { 
      name: "Inventory Reports", 
      options: [
        // { name: "Scheme Report", subOptions: [] },
        // { 
        //   name: "Stock Report", 
        //   subOptions: [
        //     "Daily Stock Report",
        //     "Monthly Stock Report",
        //     "Annual Stock Report"
        //   ] 
        // }
      ] 
    },
    {
      name: "Accounts Reports",
      options: [
        { name: "Ledger Report", subOptions: [] },
        { name: "Receipt List", subOptions: [] },
        { name: "Agent Report", subOptions: [] },

        { name: "Day Book", subOptions: [] }
      ],
    },
    { name: "Tools",   options: [
      { name: "SoftWare Settings", subOptions: [[1,"Sms Settings"]] },
      
    ], },
    { name: "System", options: [{name:"BackUp",subOptions:[]} , { name: "Search", subOptions: [] }] },
    
  ];


  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeSubDropdown, setActiveSubDropdown] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  

  const handleToggleDropdown = (itemName) => {
    setActiveDropdown((prevItem) => (prevItem === itemName ? null : itemName));
    setActiveSubDropdown(null);
    setSelectedOption(null); // Reset selected option when toggling dropdown
  };

  const closeDropdown = () => {
    setActiveDropdown(null);
    setActiveSubDropdown(null);
    setSelectedOption(null);
  };

  const handleToggleSubDropdown = (optionName, e) => {
    e.stopPropagation();
    setActiveSubDropdown((prevOption) => (prevOption === optionName ? null : optionName));
  };

  useEffect(() => {
    const closeDropdown = () => {
      setActiveDropdown(null);
      setActiveSubDropdown(null);
      setSelectedOption(null);
    };

    document.addEventListener("click", closeDropdown);

    return () => {
      document.removeEventListener("click", closeDropdown);
    };
  }, []);

  const handleKeyDownNav = (e, options) => {
    if (activeDropdown) {
      let index = selectedOption !== null ? selectedOption : -1;
      if (e.key === "ArrowDown") {
        index = (index + 1) % options.length;
        setSelectedOption(index);
      } else if (e.key === "ArrowUp") {
        index = (index - 1 + options.length) % options.length;
        setSelectedOption(index);
      } else if (e.key === "Enter" && index !== -1) {
        handleOptionSelectNav(options[index]);
      }
    }
  };

  const handleOptionSelectNav = (option) => {
    //  console.log(`Selected: ${option}`);
    closeDropdown();
    

    if (option === "User Creation" && userType === "ADMIN") {
      navigate("/signUp");
    } else if (option === "Receipt List" && userType === "ADMIN") {
      fetchReceipts();

      openReceiptListModal();
    } else if (option === "Form Registration" && userType === "ADMIN") {
      openFormRegModal();
    } else if (option === "Day Book" && userType === "ADMIN") {
      opendayBookModal();
    } else if (option === "Journal Entry" && userType === "ADMIN") {
      openjvModal();
    } else if (option === "Contra Entry" && userType === "ADMIN") {
      opencvModal();
    } else if (option === "Ledger Report" && userType === "ADMIN") {
      openledgerdiaModal();
    } 
    else if (option === "Agent Report" && userType === "ADMIN") {
      openagReportdiaModal();
    } 
    else if (option === "Search" && userType === "ADMIN") {
      openQuicksearchModal();
    }
    else if (option === "BackUp" && userType === "ADMIN") {
      downloadBackup();
    }
   else if (option === "Create User" && userType === "ADMIN") {
      ////console.log("opt==Create user");
      
    } else if (option === "Modify User" && userType === "ADMIN") {
      ////console.log("opt==Mod user");
    }
    else if (allReceipts.some((receipt) => receipt[1] === option[1]) && userType === "ADMIN") {
      openReceiptModal(option[0],option[1]);
    }
    else if (option[1] === "Sms Settings" && userType === "ADMIN") {
      // console.log(`Selected: ${option}`);
      openSmsSettings();
    }
    else if (option[1] === "Cash Receipt" && userType === "ADMIN") {
      // console.log(`Selected: ${option}`);
      opencashRec();
    }
    
  };

  ///////////////////////////////////////////////////////////////




  return (
    <div className="HomeRoot">
      {/* //////////////PrimaryNav/////////////// */}
      {/* <div
        className="top_navbarMain"
        onClick={closeDropdown}
        onKeyDown={(e) =>
          handleKeyDownNav(
            e,
            navItems.find((item) => item.name === activeDropdown)?.options || []
          )
        }
        tabIndex="0"
      >
        {navItems.map((item) => (
          <div
            key={item.name}
            className={`primaryNavitems ${
              activeDropdown === item.name ? "active" : ""
            }`}
            onClick={(e) => {
              e.stopPropagation();
              handleToggleDropdown(item.name);
            }}
          >
            {item.name}
            {item.options.length > 0 && ( // Render dropdown only if options exist
              <div className="dropdownMenu">
                {item.options.map((option, index) => (
                  <div
                    key={index}
                    className={`dropdownItem ${
                      selectedOption === index ? "selected" : ""
                    }`}
                    onClick={(e) => {
                      handleOptionSelectNav(option);
                      e.stopPropagation();
                    }}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div> */}
       <div
        className="top_navbarMain"
        onClick={closeDropdown}
        onKeyDown={(e) =>
          handleKeyDownNav(
            e,
            navItems.find((item) => item.name === activeDropdown)?.options || []
          )
        }
        tabIndex="0"

      >
        {navItems.map((item) => (
          <div
            key={item.name}
            className={`primaryNavitems ${
              activeDropdown === item.name ? "active" : ""
            }`}
            onClick={(e) => {
              e.stopPropagation();
              handleToggleDropdown(item.name);
            }}

          >
            {item.name}
            {item.options.length > 0 && activeDropdown === item.name && (
              <div className="dropdownMenu">
                {item.options.map((option, index) => (
                  <div
                    key={index}
                    className={`dropdownItem ${
                      selectedOption === index ? "selected" : ""
                    } ${activeSubDropdown === option.name ? "active" : ""}`}
                    onClick={(e) => {
                      if (option.subOptions.length > 0) {
                        handleToggleSubDropdown(option.name, e);
                      } else {
                        handleOptionSelectNav(option.name);
                        e.stopPropagation();
                      }
                    }}
                  >
                    {option.name}
                    {option.subOptions.length > 0 && (
                      <span className="arrow"><img style={{height:"100%",width:'100%'}} src={SubM} alt="▶" /></span>
                    )}
                    {activeSubDropdown === option.name && option.subOptions.length > 0 && (
                      <div className="subDropdownMenu ">
                        {option.subOptions.map((subOption, subIndex) => (
                          <div
                            key={subIndex}
                            className="subDropdownItem"
                            onClick={(e) => {
                              handleOptionSelectNav(subOption);
                              e.stopPropagation();
                            }}
                            
                            
                          >
                            {subOption[1]}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      

      {/* ///////////////////////////////////////////// */}

      <div className="shergoldheaddiv">
        <label className="shergoldhead">SherGold ERP</label>
        <label className="shergoldtag">
          A Complete Accounting & Inventory Package
        </label>
      </div>

      {/* <button
        className="hommeToggleButton"
        style={{
          backgroundColor: "transparent",
          border: "none",
          width: "3vw",
          height: "4vh",
        }}
        onClick={(e) => {
          toggleSidebar(e);
          toggleModal(e);
        }}
      >
        {showSidebar ? (
          <img className="toggleImg" src={toggleClose} alt="Close" />
        ) : (
          <img className="toggleImg" src={toggle} alt="Toggle" />
        )}{" "}
      </button> */}

      <div className="homeBody">
        <div className="homeBodyrows">
          <button
            className="homeBodycols"
            onClick={openRegistrationModal}
            disabled={userType === "ADMIN" ? false : true}
          >
            {/* onClick={() => navigate("/registration")} */}
            <img src={reg} alt="img" />
            <label className="font-Inter">Registration</label>
          </button>
          <button className="homeBodycols" onClick={()=>openReceiptModal("","")}>
            <img src={rec} alt="img" />
            <label className="font-Inter"> Cash Receipt</label>
          </button>
          {/* onClick={() => navigate("/receipt")} */}

          <button
            className="homeBodycols"
            disabled={userType === "ADMIN" ? false : true}
            onClick={openLedgerRegModal}
          >
            <img src={ledger} alt="img" />
            <label className="font-Inter"> Ledger Reg</label>
          </button>
        </div>
        <div className="homeBodyrows">
          <button
            className="homeBodycols"
            onClick={openStaffRegModal}
            disabled={userType === "ADMIN" ? false : true}
          >
            <img src={staff} alt="img" />
            <label className="font-Inter"> Staff Reg</label>
          </button>
          <button
            className="homeBodycols"
            disabled={userType === "ADMIN" ? false : true}
            onClick={openRedeemModal}
          >
            <img src={redeem} alt="img" />
            <label className="font-Inter"> Redeem</label>
          </button>

          <button
            className="homeBodycols"
            onClick={(e) => {
              openFindDialog(e);
              reportAgent(e);
            }}
          >
            <img src={dash} alt="img" />
            <label className="font-Inter">Report</label>
          </button>
        </div>
        <div className="homeBodyrows">
          <button
            className="homeBodycols"
            disabled={userType === "ADMIN" ? false : true}
            onClick={openRateClassModal}
          >
            <img src={rateclass} alt="img" />
            <label className="font-Inter">Rate Class</label>
          </button>

          <button
            className="homeBodycols"
            disabled={userType === "ADMIN" ? false : true}
            onClick={openRateSettingsModal}
          >
            <img src={rateSettings} alt="Rate Settings" />
            <label className="font-Inter">Rate Settings</label>
          </button>
          <button className="homeBodycols" onClick={handleExit}>
            <img src={exit} alt="img" />
            <label className="font-Inter">Exit</label>
          </button>
        </div>
      </div>

      <div className="shersoftdiv">
        <div className="shersoftdivimg">
          <img src={ss} alt="SS" />
        </div>
        <div className="shersoftdivcontents">
          <label
            className="shersoftdivcontentHead"
            style={{ marginBottom: "3%" }}
          >
            SherSoft
          </label>
          <label className="softcmpny">Software Company</label>
          <label className="companysite">www.shersoftware.com</label>
          <label className="mobNumber">PH:9847997755</label>
          <label className="ssMailId">Email:shersoftware@gmail.com</label>
        </div>
      </div>
      {/* ///////model view notifiactaion//// */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <button className="close" onClick={toggleModal}>
              &times;
            </button>
            <div className="alertContentdiv">
              <label className="alertContentdivdata">
                <span style={{ color: "black" }}>
                  Please take backup to External Medias other wise 'SherSoft'
                  have no resposibility for data loss...........
                </span>
                <br />
                <span style={{ color: "#000080" }}>
                  For Support Contact Us : <br />
                  &nbsp;7560889991/&nbsp;2/&nbsp;7560889970 <br />
                  {/* &nbsp;7560879990/&nbsp;7/&nbsp;8
                  <br /> */}
                  &nbsp;7560888930/&nbsp;669
                </span>
              </label>
            </div>
          </div>
        </div>
      )}

      {showRegistrationModal && (
        <SchemeRegistration
          onClose={() => setShowRegistrationModal(false)}
          Open={(e, accountNameInputRef) => {
            setLedval(e.target.value);
            setShowLedgerRegModal(true);
            //setShowRegistrationModal(false);
            sessionStorage.setItem("accountNameInputRef", accountNameInputRef);
          }}
        />
      )}
      {showLedgerRegModal && (
        <LedgerReg
          onClose={() => {
            setShowLedgerRegModal(false);
            setLedval("");
            //ledstatus();
            setLedgerJustClosed(true);
          }}
          val={ledval}
        />
      )}
      {showStaffRegModal && (
        <StaffReg onClose={() => setShowStaffRegModal(false)} />
      )}
      {showReceiptModal && (
        <SchemeCashReceipt
          onClose={() => {setShowReceiptModal(false);
            setFid("");
          }}
          agent={agentCode}
          formId={Fid}
          formName={fName}
        />
      )}
      {showRedeemModal && (
        <SchemeRedeem onClose={() => setShowRedeemModal(false)} />
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

      {showRateClassModal && (
        <RateClassReg
          onClose={() => {
            setShowRateClassModal(false);
            handleClear();
          }}
        />
      )}
      {showRateSettingsModal && (
        <RateSettings
          onClose={() => {
            setShowRateSettingsModal(false);
            handleClear();
          }}
        />
      )}

      {showReceiptListModal && (
        <ReceiptList
          onClose={() => {
            setShowReceiptListModal(false);
            handleClear();
          }}
          openReceiptListReport={openReceiptListReportModal}
        />
      )}
      {showReceiptListReportModal && (
        <ReceiptListReport
          onClose={() => {
            setShowReceiptListReportModal(false);
            handleClear();
          }}
          reportData={receiptListReportData}
        />
      )}
      {showFormRegModal && (
        <FormRegistration
          onClose={() => {
            setShowFormRegModal(false);
            handleClear();
          }}
        />
      )}
      {showdayBookModal && (
        <DayBook
          onClose={() => {
            setDayBookModal(false);
            handleClear();
          }}
          openReport={opendayBookReportModal}
        />
      )}
      {showdayBookReportModal && (
        <DayBookReport
          onClose={() => {
            setDayBookReportModal(false);
            handleClear();
          }}
          dayBookRepData={dayBookData}
        />
      )}

      {showjvModal && (
        <JournalEntry
          onClose={() => {
            setJvModal(false);
            handleClear();
          }}
          Open={(e, rowIndex, columnIndex) => {
            setLedval(e.target.value);
            openLedgerRegModal(e);
            sessionStorage.setItem("journalEntryRowIndex", rowIndex);
            sessionStorage.setItem("journalEntryColumnIndex", columnIndex);

            /// setShowLedgerRegModal(true);
            /// setJvModal(false);
          }}
          ledgerJustClosed={ledgerJustClosed}
        />
      )}
      {showcvModal && (
        <ContraEntry
          onClose={() => {
            setCvModal(false);
            handleClear();
          }}
          Open={(e, rowIndex, columnIndex) => {
            setLedval(e.target.value);
            openLedgerRegModal(e);
            // setShowLedgerRegModal(true);
            /// setJvModal(false);
            sessionStorage.setItem("contraEntryRowIndex", rowIndex);
            sessionStorage.setItem("contraEntryColumnIndex", columnIndex);
          }}
        />
      )}

      {showledgerdiaModal && (
        <LedgerRepModel
          onClose={() => {
            setledgerdiaModal(false);
            handleClear();
          }}
          openReport={openledgerreportModal}
        />
      )}

      {showledgerReportModal && (
        <LedgerReport
          onClose={() => {
            setledgerReportModal(false);
            handleClear();
          }}
          ledgerReportData={LedreportData}
        />
      )}
        {showqSearchModal && (
        <QuickSearch
          onClose={() => {
          setQsearchModal(false)
            handleClear();
          }}
          
        />
      )}
      {showagReportdiaModal && (
        <AgentReportModel
        onClose={() => {
          setShowagReportdiaModal(false);
          handleClear();
        }}
       openReport={openAgreport}
        />
      )}
      {showagReportModal && (
        <AgentReport
          onClose={() => {
            setShowagReportModal(false);
            handleClear();
          }}
          agentReportData={agreportData}
        />
      )}
      {showSmssettingsModal && (
        <SmsSettings
          onClose={() => {
            setShowSmssettingsModal(false);
          }}
        />
      )}
      {showcashRecModal && (
        <CashReceipt
          onClose={() => {
            setShowCashRecModal(false);
          }}
        />
      )}
      
      {showFindDialog && (
        <div className=" report_dialog">
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
                  handleClear();
                }}
              >
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
                  value={ReportData.fromDate}
                  onChange={(e) =>
                    setReportData({
                      ...ReportData,
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
                <label>Report Type</label>
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
                >
                  <option value="simpleReport">Simple</option>
                  <option value="reportOrderbyEntryno">Order By EntryNo</option>
                </select>
              </div>
              <div className="report_dialogBodypart2sec">
                <label>Select Scheme Customer</label>
                <ComboBox
                  findedValue={
                    Array.isArray(ReportData.customer)
                      ? ReportData.customer[1]
                      : ReportData.customer
                  }
                  className="sec2combo"
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
                <label>Select Scheme Agent</label>
                <ComboBox
                  findedValue={
                    Array.isArray(ReportData.agent)
                      ? ReportData.agent[1]
                      : ReportData.agent
                  }
                  className="sec2combo"
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
                <label>Select Account Number</label>
                <ComboBox
                  findedValue={
                    Array.isArray(ReportData.accno)
                      ? ReportData.accno[1]
                      : ReportData.accno
                  }
                  className="sec2combo"
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
                <label>Phone Number</label>
                <input
                  value={ReportData.mobileNo}
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
              >
                <label>Show</label>
              </button>
              {/* <button className="report_dialogBodypart3buttons">
                <label>Date Wise</label>
              </button> */}
              <button
                className="report_dialogBodypart3buttons"
                onClick={(e) => {
                  closeFindDialog(e);
                  handleClear();
                }}
              >
                <label>Exit</label>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
