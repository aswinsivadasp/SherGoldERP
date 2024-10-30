import React, { useRef, useEffect, useState,useContext} from "react";
import "../styles/SchemeRegistration.css";
import "../styles/SchemeRedeem.css";
import { FaRegWindowMinimize } from "react-icons/fa";
import { IoMdExpand } from "react-icons/io";
import { IoMdClose } from "react-icons/io";

import expand from "../assets/images/resize.png";
import exit from "../assets/images/close.png";
import ssLogo from "../assets/images/sslogo.png";
import minimize from "../assets/images/mini.png";
import maximize from "../assets/images/maximize.png";
import close from "../assets/images/close.png";

import headeLogo from "../assets/images/shersoftnavLogo.png";
import saveImg from "../assets/images/SaveImage.png";
import printImg from "../assets/images/Printer.png";
import clearImg from "../assets/images/Document.png";
import findImg from "../assets/images/search.png";
import editImg from "../assets/images/Editing.png";
import deleteImg from "../assets/images/Delete.png";
import exitImg from "../assets/images/Exit1.png";
import playandpause from "../assets/images/Play and pause button.png";
import leftarrow from "../assets/images/Play button arrowhead left.png";
import rightarrow from "../assets/images/Play button arrowhead right.png";
import playandpauseRight from "../assets/images/Play and pause button right.png";
import binImg from "../assets/images/Bin.png";
import axios from "axios";
import ComboBox from "./ComboBox";
import { AuthContext } from "../context/AuthContext";
import { useDbContext } from "../context/DbContext";


function SchemeRedeem({ onClose }) {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const { dbCode } = useDbContext();

  // const { agentCode } = useContext(AuthContext);
  const [agentCode, setAgentCode] = useState("");

  useEffect(() => {

    const storedAgentCode = sessionStorage.getItem("agentCode");
    if (storedAgentCode) {
      setAgentCode(storedAgentCode);

    }
  }, []);
  useEffect(() => {
    if (agentCode) {
      fetchSchredEntryno();
    }
  }, [agentCode]); 

// ////console.log("agcodesession====", parseInt(agentCode));

  const accountNameInputRef = useRef(null);
  const agentNameInputRef = useRef(null);
  const accountnumberInputRef = useRef(null);
  const entryNoInputRef = useRef(null);
  const dateInputRef = useRef(null);
  const amountInputRef = useRef(null);
  const narrationInputRef = useRef(null);
  const saveButtonRef = useRef(null);
  const rateInputRef = useRef(null);
  const gmInputRef = useRef(null);

  const [editDisabled, setEditDisabled] = useState(true);
  const [deleteDisabled, setDeleteDisabled] = useState(true);
  const [saveDisabled, setSaveDisabled] = useState(false);
  useEffect(() => {
    entryNoInputRef.current.focus();
  }, []);
 
 
  const handleKeyDown = (event, nextInputRef) => {
    if (event.key === "Enter" || event.key === "Return") {
      nextInputRef.current.focus();
    }
  };
  const getCurrentDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [schemeRedeemData, setschemeRedeemData] = useState({
    entryNo: 1,
    date: getCurrentDate(),
    accountName: "",
    agent: "",
    accountNo: "",
    narration: "",
    amount: 0,
    rate: "",
    gm: 0.0,
    printgm: 0,
  });
  // ////console.log(schemeRedeemData);

  const [RegcnameData, setRegCnameData] = useState([]);
  //////console.log("cnamedata=====", RegcnameData);

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

  //////////agent name///////////////

  const [agentName, setagentName] = useState([]);
  const [agentobj, setAgentObj] = useState([]);

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

// ////console.log("agname=",agentName);

  const [Accno, setAccno] = useState([]);

  useEffect(() => {
    const fetchAcno = async () => {
      try {
        const response = await axios.get(
          `${apiBaseUrl}/SchRec_schemeregisteredaccno/${dbCode}`
        );

        // Assuming response.data is an array with objects and each object has a LedName property
        const Acno = response.data;

        // Transforming the array into the desired format
        // const supplName = cName.map((item) => item.LedName);

        const transformedData = Acno.map((item) => [item.auto, item.accno]);
        setAccno(transformedData);

        // setsupplierName(supplName);
      } catch (error) {
        console.error("Error fetching agent Values:", error.message);
      }
    };

    fetchAcno();
  }, [apiBaseUrl]);

  const handleSubmit = async () => {
    setSaveDisabled(true);

    if (
      !schemeRedeemData.entryNo ||
      !schemeRedeemData.date ||
      !schemeRedeemData.accountName ||
      !schemeRedeemData.agent ||
      !schemeRedeemData.accountNo ||
      !schemeRedeemData.amount ||
      !schemeRedeemData.rate ||
      !schemeRedeemData.gm
    ) {
      alert("Enter Data Correctly");
      setSaveDisabled(false);

      return;
    }
    try {
      {
        const updatedSchemeRedeemData = {
          ...schemeRedeemData,
          accountNo: schemeRedeemData.accountNo[0].toString(),
          agent: schemeRedeemData.agent[0],
          accountName: schemeRedeemData.accountName[0],
        };
        // Make a POST request to your server with the form data
        const response = await axios.post(
          `${apiBaseUrl}/insertRedeem/${dbCode}`,
          updatedSchemeRedeemData
        );

        // Check the response status and handle accordingly
        if (response.status === 200) {
          handleClear();

          alert("Entry Saved");
        } else {
          // Handle other response statuses or errors
          console.error("Error submitting data:", response.data);
          setSaveDisabled(false);

        }
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("Error:", error.message);
      setSaveDisabled(false);

    }
  };

  const handleEdit = async () => {
    try {
      {
        const updatedSchemeRedeemData = {
          ...schemeRedeemData,
          accountNo: schemeRedeemData.accountNo[0].toString(),
          agent: schemeRedeemData.agent[0],
          accountName: schemeRedeemData.accountName[0],

        };
        // Make a POST request to your server with the form data
        const response = await axios.post(
          `${apiBaseUrl}/editRedeem/${dbCode}`,
          updatedSchemeRedeemData
        );

        // Check the response status and handle accordingly
        if (response.status === 200) {
          handleClear();

          alert("Entry Edited");
        } else {
          // Handle other response statuses or errors
          console.error("Error updating data:", response.data);
        }
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("Error:", error.message);
    }
  };
  //////entry no////

  const [schred_entryno, setSchredEntryNo] = useState("");
  // ////console.log("sch_entryno=", schred_entryno);
  // Replace the useEffect hooks as shown below

  useEffect(() => {
    const fetchSchredEntryno = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/SchRed_entryno/${parseInt(agentCode)}/${dbCode}`);
        // ////console.log("response =", response);
        const schemeentryNo = response.data.map((item) => item[""]);

        setschemeRedeemData((prevData) => ({
          ...prevData,
          entryNo: schemeentryNo[0],
        }));
        setSchredEntryNo(schemeentryNo[0]);
      } catch (error) {
        console.error("Error fetching entry no:", error.message);
      }
    };

    fetchSchredEntryno();
  }, [apiBaseUrl]);

  const fetchSchredEntryno = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/SchRed_entryno/${parseInt(agentCode)}/${dbCode}`);
      const schemeentryNo = response.data.map((item) => item[""]);

      setschemeRedeemData((prevData) => ({
        ...prevData,
        entryNo: schemeentryNo[0],
      }));
      setSchredEntryNo(schemeentryNo[0]);
    } catch (error) {
      console.error("Error fetching entry no:", error.message);
    }
  };

  useEffect(() => {
    const fetchSchCurrentRate = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/currentgoldRate/${dbCode}`);
        const currentrate = response.data[0]?.currentRate;
        setschemeRedeemData((prevData) => ({ ...prevData, rate: currentrate }));
      } catch (error) {
        console.error("Error fetching names Values:", error.message);
      }
    };

    fetchSchCurrentRate();
  }, [apiBaseUrl]);
  const fetchSchCurrentRate = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/currentgoldRate/${dbCode}`);
      const currentrate = response.data[0]?.currentRate;
      setschemeRedeemData((prevData) => ({ ...prevData, rate: currentrate }));
    } catch (error) {
      console.error("Error fetching names Values:", error.message);
    }
  };
  ///////
  const handleClear = () => {
    setschemeRedeemData({
      entryNo: schred_entryno,
      date: getCurrentDate(),
      accountName: "",
      agent: "",
      accountNo: "",
      narration: "",
      amount: 0,
      rate: "",
      gm: 0.0,
      printgm: 0,

      // Clear the "gm" value as well
    });
    // Reset dataFound state
    fetchSchredEntryno();

    fetchSchCurrentRate();

    // Calculate gm value after clearing the fields
    // calculateGm();
    entryNoInputRef.current.focus();
    setCBalance("");
    setEditDisabled(true);
    setDeleteDisabled(true);
    setSaveDisabled(false);
  };

  const [gmvalue, setgmvalue] = useState("");
  // ////console.log("gvalue =====", gmvalue);
  const calculateGm = () => {
    // ////console.log("function is called");
    const amount = parseFloat(schemeRedeemData.amount);
    const rate = parseFloat(schemeRedeemData.rate);
    // ////console.log("amount", amount);
    // ////console.log("rate", rate);
    if (!isNaN(amount) && !isNaN(rate) && rate !== 0) {
      // ////console.log("calculation initiated");

      const gmValue = amount / rate;
      setgmvalue(gmValue);
      setschemeRedeemData((prevData) => ({
        ...prevData,
        gm: gmValue.toFixed(3),
      }));
    } else {
      setschemeRedeemData((prevData) => ({
        ...prevData,
        gm: "", // Clear the "gm" value as well
      }));
    }
  };

  useEffect(() => {
    calculateGm();
  }, [schemeRedeemData.amount, schemeRedeemData.rate]);
  const [showFindDialog, setShowFindDialog] = useState(false); 
  const [findEntryNo, setFindEntryNo] = useState(""); 
  // ////console.log(findEntryNo);
  const openFindDialog = () => {
    setShowFindDialog(true);
  };

  const closeFindDialog = () => {
    setShowFindDialog(false);
    setFindEntryNo("");
  };

  const handleFind = async () => {
    try {
      const response = await axios.get(
        `${apiBaseUrl}/schredeemfindbyentryno/${findEntryNo}/${parseInt(agentCode)}/${dbCode}`
      );

      // Check the response status and handle accordingly
      if (response.status === 200) {
        // Data retrieved successfully, update the form data
        const foundData = response.data[0]; // Assuming the response is an array with one item
        // ////console.log("data =", foundData);

        const formattedDate = new Date(foundData.Date)
          .toISOString()
          .split("T")[0];
        setschemeRedeemData({
          ...schemeRedeemData,
          entryNo: foundData.entryno,
          date: formattedDate,
          accountName: RegcnameData.find((item) => item[0] === foundData.name),
          agent: agentName.find((item) => item[0] === foundData.Salesman),
          accountNo: Accno.find(
            (item) => item[0] === parseInt(foundData.accno)
          ),
          amount: foundData.Amount,
          gm: foundData.grm,
          narration: foundData.NARRATION,
          rate: foundData.rate,
          printgm: foundData.Printgm,
        });
        setEditDisabled(false);
        setDeleteDisabled(false);
        setSaveDisabled(true);
      } else {
        // Handle other response statuses or errors
        console.error("Error retrieving data:", response.data);
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("Error:", error.message);
    }
  };

  const handlefindAccountNo = async (no) => {
    try {
      const response = await axios.get(
        `${apiBaseUrl}/schredeemfindbyaccno/${no[0]}/${dbCode}`
      );

      if (response.status === 200) {
       // ////console.log('agent inside===',agentName);
       // ////console.log('agcodeinside=',agentCode);
        const foundData = response.data[0];
        // ////console.log("data =", foundData);
        setschemeRedeemData({
          ...schemeRedeemData,

          accountName: RegcnameData.find(
            (item) => item[0] === foundData.accname
          ),
          agent: agentName.find((item) => item[0] === parseInt(agentCode)),
          accountNo: no,
          // sr_AppEnable:foundData.Address1 || foundData,
        });
      } else {
        console.error("Error finding data:", response.data);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${apiBaseUrl}/deleteredeembyentryno/${schemeRedeemData.entryNo}/${parseInt(agentCode)}/${dbCode}`
      );
      if (response.status === 200) {
        // Swal.fire({
        //   position: "top-end",
        //   icon: "success",
        //   title: "Scheme deleted",
        //   showConfirmButton: false,
        //   timer: 2000,
        // });
        alert("Entry Deleted !");
        // window.location.reload();
        handleClear();
      } else {
        console.error("Error deleting data:", response.data);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const handleFindprev = async (e) => {
    try {
      const response = await axios.get(
        `${apiBaseUrl}/SchRedfindprev/${schemeRedeemData.entryNo}/${parseInt(agentCode)}/${dbCode}`
      );

      if (response.status === 200) {
        const foundData = response.data[0];
        // ////console.log("data =", foundData);
        const formattedDate = new Date(foundData.Date)
          .toISOString()
          .split("T")[0];

        //  ////console.log("formattedDate=", formattedDate);

        setschemeRedeemData({
          ...schemeRedeemData,
          entryNo: foundData.entryno,
          date: formattedDate,
          accountName: RegcnameData.find((item) => item[0] === foundData.name),
          agent: agentName.find((item) => item[0] === foundData.Salesman),
          accountNo: Accno.find(
            (item) => item[0] === parseInt(foundData.accno)
          ),
          amount: foundData.Amount,
          gm: foundData.grm,
          narration: foundData.NARRATION,
          rate: foundData.rate,
          printgm: foundData.Printgm,
        });
        // sr_AppEnable:foundData.Address1 || foundData,

        // Add the new data to tableData
        // Add the new data to tableData

        setEditDisabled(false);
        setDeleteDisabled(false);
        setSaveDisabled(true);
      } else {
        console.error("Error finding data:", response.data);
      }
    } catch (error) {
      console.error("Error:", error.message);
      //setDataFound(false);
    }
    closeFindDialog();
  };

  const handleFindnext = async () => {
    // handleClear();
    try {
      const response = await axios.get(
        `${apiBaseUrl}/SchRedfindnext/${schemeRedeemData.entryNo}/${parseInt(agentCode)}/${dbCode}`
      );
      if (response.status === 200) {
        const foundData = response.data[0];
        //  ////console.log("data =", foundData);
        const formattedDate = new Date(foundData.Date)
          .toISOString()
          .split("T")[0];

        //  ////console.log("formattedDate=", formattedDate);

        setschemeRedeemData({
          ...schemeRedeemData,
          entryNo: foundData.entryno,
          date: formattedDate,
          accountName: RegcnameData.find((item) => item[0] === foundData.name),
          agent: agentName.find((item) => item[0] === foundData.Salesman),
          accountNo: Accno.find(
            (item) => item[0] === parseInt(foundData.accno)
          ),
          amount: foundData.Amount,
          gm: foundData.grm,
          narration: foundData.NARRATION,
          rate: foundData.rate,
          printgm: foundData.Printgm,
        });
        // sr_AppEnable:foundData.Address1 || foundData,

        // Add the new data to tableData
        // Add the new data to tableData

        setEditDisabled(false);
        setDeleteDisabled(false);
        setSaveDisabled(true);
      } else {
        console.error("Error finding data:", response.data);
      }
    } catch (error) {
      console.error("Error:", error.message);
      //setDataFound(false);
    }
  };

  const handleFindfirst = async () => {
    try {
      const response = await axios.get(
        `${apiBaseUrl}/SchRedfindfirst/${schemeRedeemData.entryNo}/${parseInt(agentCode)}/${dbCode}`
      );
      if (response.status === 200) {
        const foundData = response.data[0];
        //  ////console.log("data =", foundData);
        const formattedDate = new Date(foundData.Date)
          .toISOString()
          .split("T")[0];

        //  ////console.log("formattedDate=", formattedDate);

        setschemeRedeemData({
          ...schemeRedeemData,
          entryNo: foundData.entryno,
          date: formattedDate,
          accountName: RegcnameData.find((item) => item[0] === foundData.name),
          agent: agentName.find((item) => item[0] === foundData.Salesman),
          accountNo: Accno.find(
            (item) => item[0] === parseInt(foundData.accno)
          ),
          amount: foundData.Amount,
          gm: foundData.grm,
          narration: foundData.NARRATION,
          rate: foundData.rate,
          printgm: foundData.Printgm,
        });
        // sr_AppEnable:foundData.Address1 || foundData,

        // Add the new data to tableData
        // Add the new data to tableData

        setEditDisabled(false);
        setDeleteDisabled(false);
        setSaveDisabled(true);
      } else {
        console.error("Error finding data:", response.data);
      }
    } catch (error) {
      console.error("Error:", error.message);
      //setDataFound(false);
    }
  };
  const handleFindlast = async () => {
    try {
      const response = await axios.get(
        `${apiBaseUrl}/SchRedfindlast/${schemeRedeemData.entryNo}/${parseInt(agentCode)}/${dbCode}`
      );
      if (response.status === 200) {
        const foundData = response.data[0];
        //////console.log("data =", foundData);
        const formattedDate = new Date(foundData.Date)
          .toISOString()
          .split("T")[0];

        //  ////console.log("formattedDate=", formattedDate);

        setschemeRedeemData({
          ...schemeRedeemData,
          entryNo: foundData.entryno,
          date: formattedDate,
          accountName: RegcnameData.find((item) => item[0] === foundData.name),
          agent: agentName.find((item) => item[0] === foundData.Salesman),
          accountNo: Accno.find(
            (item) => item[0] === parseInt(foundData.accno)
          ),
          amount: foundData.Amount,
          gm: foundData.grm,
          narration: foundData.NARRATION,
          rate: foundData.rate,
          printgm: foundData.Printgm,
        });
        // sr_AppEnable:foundData.Address1 || foundData,

        // Add the new data to tableData
        // Add the new data to tableData

        setEditDisabled(false);
        setDeleteDisabled(false);
        setSaveDisabled(true);
      } else {
        console.error("Error finding data:", response.data);
      }
    } catch (error) {
      console.error("Error:", error.message);
      //setDataFound(false);
    }
  };

  const [cBalace, setCBalance] = useState("");
  // ////console.log("cBalace", cBalace);
  const CurrentBalance = async (name) => {
    // handleClear();
    try {
      const response = await axios.get(
        `${apiBaseUrl}/currentBalance/${name[0]}/${dbCode}`
      );
      if (response.status === 200) {
        const foundData = response.data[0];
        //  ////console.log("data =", foundData);
        setCBalance(foundData.balance);
      } else {
        console.error("Error finding data:", response.data);
      }
    } catch (error) {
      console.error("Error:", error.message);
      //setDataFound(false);
    }
  };

  const CurrentBalancebyAccno = async (accountNo) => {
    // handleClear();
    try {
      const response = await axios.get(
        `${apiBaseUrl}/currentBalanceBYaccno/${accountNo[0]}/${dbCode}`
      );
      if (response.status === 200) {
        const foundData = response.data[0];
        //  ////console.log("data =", foundData);
        setCBalance(foundData.balance);
      } else {
        console.error("Error finding data:", response.data);
      }
    } catch (error) {
      console.error("Error:", error.message);
      //setDataFound(false);
    }
  };

  return (
    // <div className="regmodal-overlay">
    <div className="regmodal schemeRedeemmodal">
      <div className="report_dialogHead redeemHead">
        <div className="report_dialogHeadpart">
          <img src={ssLogo} alt="SS" />
          <label>Scheme Redeem</label>
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
      <div className="schemeReg_navbar" style={{ height: "7vh" }}>
        <button
          style={{
            border: "none",
            backgroundColor: "transparent",
            marginLeft: "2%",
          }}
          className={`schemeNav_items }`}
          ref={saveButtonRef}
          onClick={handleSubmit}
          // disabled={dataFound}
          disabled={saveDisabled}
        >
          <div className="schemeReg_buttonImage">
            <img src={saveImg} alt="SaveImg" />
          </div>
          Save
        </button>
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
          onClick={handleClear}
        >
          <div className="schemeReg_buttonImage">
            <img src={clearImg} alt="clearImg" />
          </div>
          Clear
        </button>
        <button
          style={{ border: "none", backgroundColor: "transparent" }}
          className="schemeNav_items"
          //  onClick={handleFind}
          onClick={openFindDialog}
        >
          <div className="schemeReg_buttonImage">
            <img src={findImg} alt="findImg" />
          </div>
          Find
        </button>
        <button
          style={{ border: "none", backgroundColor: "transparent" }}
          className={`schemeNav_items }`}
          onClick={handleEdit}
          //disabled={!dataFound}
          disabled={editDisabled}
        >
          <div className="schemeReg_buttonImage">
            <img src={editImg} alt="editImg" />
          </div>
          Edit
        </button>
        <button
          style={{ border: "none", backgroundColor: "transparent" }}
          className={`schemeNav_items }`}
          onClick={handleDelete}
          // disabled={!dataFound}
          disabled={deleteDisabled}
        >
          <div className="schemeReg_buttonImage">
            <img src={deleteImg} alt="deleteImg" />
          </div>
          Delete
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

        {/* ////////// */}
        <div className="schemeReg_arrowButtons">
          <button
            style={{ backgroundColor: "transparent" }}
            className="schemeReg_arrowButtonImage"
            onClick={handleFindfirst}
          >
            <img src={playandpause} alt="playandpause" />
          </button>
          <button
            style={{ backgroundColor: "transparent" }}
            className="schemeReg_arrowButtonImage"
            onClick={handleFindprev}
          >
            <img src={leftarrow} alt="leftarrow" />
          </button>
          <button
            style={{ backgroundColor: "transparent" }}
            className="schemeReg_arrowButtonImage"
            onClick={handleFindnext}
          >
            <img src={rightarrow} alt="rightarrow" />
          </button>
          <button
            style={{ backgroundColor: "transparent", marginRight: "2%" }}
            className="schemeReg_arrowButtonImage"
            onClick={handleFindlast}
          >
            <img src={playandpauseRight} alt="playandpauseRight" />
          </button>
        </div>
      </div>
      {/*............................ NavbarEnd.............................................. */}

      <div className="schemeRedeemBody">
        <div className="schemeRedeemBodyTopdata">
          <div className="schemeRedeemBodyTopdatasec1">
            <label>Entry No</label>
            <input
              value={schemeRedeemData.entryNo}
              style={{ textAlign: "center" }}
              ref={entryNoInputRef}
              readOnly
              onKeyDown={(e) => handleKeyDown(e, dateInputRef)}
              onChange={(e) =>
                setschemeRedeemData({
                  ...schemeRedeemData,
                  entryNo: e.target.value,
                })
              }
            />
          </div>
          <div className="schemeRedeemBodyTopdatasec2">
            <label htmlFor="date">Date </label>
            <input
              value={schemeRedeemData.date}
              ref={dateInputRef}
              type="date"
              onKeyDown={(e) => handleKeyDown(e, accountnumberInputRef)}
              onChange={(e) =>
                setschemeRedeemData({
                  ...schemeRedeemData,
                  date: e.target.value,
                })
              }
            />
          </div>
        </div>
        <div className="schemeRedeemBodyBottomdata">
          <div className="schemeRedeemBodyBottomdatarows">
            <div className="schemeRedeemBodyBottomdatarowsSec1">
              <label> Account Number</label>

              <ComboBox
                inlineStyles={{ textAlign: "right" }}
                className="accnocombo"
                findedValue={
                  Array.isArray(schemeRedeemData.accountNo)
                    ? schemeRedeemData.accountNo[1]
                    : schemeRedeemData.accountNo
                }
                comboRef={accountnumberInputRef}
                options={Accno}
                onKeyDown={(e) => handleKeyDown(e, accountNameInputRef)}
                //  onInputChange={(e)=>////console.log(e)}
                onInputChange={(e) => {
                  handlefindAccountNo(e);
                  setschemeRedeemData({ ...schemeRedeemData, accountNo: e });
                  CurrentBalancebyAccno(e);
                }}
              />
              {/* <input type="text" /> */}
            </div>
            <div className="schemeRedeemBodyBottomdatarowsSec2">
              <label style={{ width: "35%" }}>Name</label>
              {/* <input type="text" /> */}
              <ComboBox
                className="namecombo"
                findedValue={
                  Array.isArray(schemeRedeemData.accountName)
                    ? schemeRedeemData.accountName[1]
                    : schemeRedeemData.accountName
                }
                comboRef={accountNameInputRef}
                options={RegcnameData}
                onKeyDown={(e) => handleKeyDown(e, agentNameInputRef)}
                onInputChange={(e) => {
                  setschemeRedeemData({ ...schemeRedeemData, accountName: e });

                  CurrentBalance(e);
                }}
              />
            </div>
          </div>
          <div className="schemeRedeemBodyBottomdatarows">
            <div className="schemeRedeemBodyBottomdatarowsSec1">
              <label>Agent</label>
              <ComboBox
                className="agentcombo"
                findedValue={
                  Array.isArray(schemeRedeemData.agent)
                    ? schemeRedeemData.agent[1]
                    : schemeRedeemData.agent
                }
                comboRef={agentNameInputRef}
                options={agentName}
                onKeyDown={(e) => handleKeyDown(e, amountInputRef)}
                onInputChange={(e) =>
                  setschemeRedeemData({ ...schemeRedeemData, agent: e })
                }
                readOnly={true}
              />
              {/* <input type="text" /> */}
            </div>
            <div className="schemeRedeemBodyBottomdatarowsSec2">
              <label style={{ width: "35%" }}>Amount</label>
              <input
                type="text"
                style={{ textAlign: "right" }}
                value={schemeRedeemData.amount}
                ref={amountInputRef}
                onKeyDown={(e) => handleKeyDown(e, rateInputRef)}
                onChange={(e) =>
                  setschemeRedeemData({
                    ...schemeRedeemData,
                    amount: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="schemeRedeemBodyBottomdatarows">
            <div className="schemeRedeemBodyBottomdatarowsSec1">
              <label>Rate</label>
              <input
                type="text"
                ref={rateInputRef}
                onKeyDown={(e) => handleKeyDown(e, gmInputRef)}
                onChange={(e) =>
                  setschemeRedeemData({
                    ...schemeRedeemData,
                    rate: e.target.value,
                  })
                }
                value={schemeRedeemData.rate}
                style={{ textAlign: "right" }}
              />
            </div>
            <div className="schemeRedeemBodyBottomdatarowsSec2">
              <label style={{ width: "35%" }}> Gm</label>
              <input
                style={{ width: "50.7%", textAlign: "right" }}
                value={schemeRedeemData.gm}
                onChange={(e) =>
                  setschemeRedeemData({
                    ...schemeRedeemData,
                    gm: e.target.value,
                  })
                }
                ref={gmInputRef}
                onKeyDown={(e) => handleKeyDown(e, narrationInputRef)}
              />
            </div>
          </div>
          <div className="printgmdiv">
            <input
              onChange={(e) =>
                setschemeRedeemData({
                  ...schemeRedeemData,
                  printgm: e.target.checked ? 1 : 0, // save 1 if checked, 0 if unchecked
                })
              }
              type="checkbox"
              style={{ width: "9.5%" }}
              checked={schemeRedeemData.printgm === 1}
            />
            <label style={{ width: "20%", marginRight: "1%" }}>Print Gm</label>
          </div>
          <div className="narrationDiv">
            <label>Narration</label>
            <input
              ref={narrationInputRef}
              value={schemeRedeemData.narration}
              onKeyDown={(e) => handleKeyDown(e, saveButtonRef)}
              onChange={(e) =>
                setschemeRedeemData({
                  ...schemeRedeemData,
                  narration: e.target.value,
                })
              }
            />
          </div>

          <div className="currentBalace">
            <label
              style={{
                marginLeft: "1%",
                fontSize: "15px",
                lineHeight: "15px",
                fontWeight: "500px",
              }}
              className="currentBalance"
            >
              Current Balance: <span style={{ color: "red" }}> {cBalace}</span>
            </label>
          </div>
        </div>
      </div>

      {showFindDialog && (
       

        <div className="find-dialog">
          <input
            type="text"
            value={findEntryNo}
            onChange={(e) => setFindEntryNo(e.target.value)}
            placeholder="Enter Entry No"
          />
          <button onClick={handleFind}>Find</button>
          <div
            className="findCloseDiv"
            onClick={() => {
              closeFindDialog();
              // handleClear();
            }}
            style={{
              border: "none",
              backgroundColor: "red",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img src={close} alt="Close" />
          </div>
        </div>
      )}
    </div>
    // </div>
  );
}

export default SchemeRedeem;
