import React, { useState, useRef, useEffect } from "react";
import "../styles/LedgerReg.css";
import { FaRegWindowMinimize } from "react-icons/fa";
import { IoMdExpand } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import minimize from "../assets/images/minimize.png";
import expand from "../assets/images/resize.png";
import exit from "../assets/images/close.png";
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

import serchIcon from "../assets/images/Magnifiying Glass .png";
import toggleClose from "../assets/images/xred.webp";

//import ComboBox from "shersoft-combov1";
import ComboBox from "./ComboBox";
import axios from "axios";
import Swal from "sweetalert2";
import { useDbContext } from "../context/DbContext";
function LedgerReg({ onClose,val  }) {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const { dbCode } = useDbContext();

  const getCurrentDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const [dataFound, setDataFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [debitAmount, setDebitAmount] = useState("");
  const [creditAmount, setCreditAmount] = useState("");
  const [selectedledgerName, setSelectedledgerName] = useState("");
  const [selectedItemCode, setSelectedUnder] = useState("");
  const ledgerNameOptions = ["Name 1", "Name 2", "Name 3"];
  const ledgerUnderOptions = ["under 1", "under 2", "under 3"];
  const ledgerSalesmanOptions = ["salesman 1", "salesman 2", "salesman 3"];
  const [ledcode, setledcode] = useState("");
  const [ledCodeValue, setLedCodeValue] = useState("");
  const [lh_idValue, setlh_idValue] = useState("");
  const [findSuccess, setFindSuccess] = useState(false);

  const [editDisabled, setEditDisabled] = useState(true);
  const [deleteDisabled, setDeleteDisabled] = useState(true);
  const [saveDisabled, setSaveDisabled] = useState(false);

  const nameInputRef = useRef(null);
  const underInputRef = useRef(null);
  const salesmanInputRef = useRef(null);
  const add1InputRef = useRef(null);
  const add2InputRef = useRef(null);
  const add3InputRef = useRef(null);
  const cityInputRef = useRef(null);
  const gstInputRef = useRef(null);
  const CpersonInputRef = useRef(null);
  const teleInputRef = useRef(null);
  const pincodeInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const mobInputRef = useRef(null);
  const debitAmountInputRef = useRef(null);
  const creditAmountInputRef = useRef(null);
  const saveBtnRef = useRef(null);
  const dateRef = useRef(null);
  const [formData, setFormData] = useState({
    lr_Name: ""||val,
    ledcode: "",
    lr_Under: "",
    lh_id: "",
    lr_Address1: "",
    lr_Address2: "",
    lr_Address3: "",
    lr_City: "",
    lr_Pincode: "",
    lr_Contactperson: "",
    lr_Telno: "",
    lr_Res: "",
    lr_Mobile: "",
    lr_Gstno: "",
    lr_Email: "",
    lr_SalesMan: "",
    lr_debit: "",
    lr_credit: "",
    lr_date: getCurrentDate(),
  });
  //////console.log(formData);

  const handleClear = () => {
    setFormData({
      lr_Name: "",
      lr_Under: "",
      lr_Address1: "",
      lr_Address2: "",
      lr_Address3: "",
      lr_City: "",
      lr_Pincode: "",
      lr_Contactperson: "",
      lr_Telno: "",
      lr_Res: "",
      lr_Mobile: "",
      lr_Gstno: "",
      lr_Email: "",
      lr_SalesMan: "",
      lr_debit: "",
      lr_credit: "",
      lr_date: getCurrentDate(),
    });

    setDebitAmount("");
    setCreditAmount("");
    setFindSuccess(false);
    fetchLednamesNames();
    setDataFound(false);

    setEditDisabled(true);
    setDeleteDisabled(true);
    setSaveDisabled(false);
  };
  const handleKeyDown = (event, nextInputRef) => {
    if (event.key === "Enter" || event.key === "Return") {
      nextInputRef.current.focus();
    }
  };
  useEffect(() => {
    nameInputRef.current.focus();
  }, []);

  const handleSubmit = async () => {

    setSaveDisabled(true);

    if (Lednames.includes(formData.lr_Name || formData.lr_Name[1])) {
      alert("Duplicate Ledger Name");
      setSaveDisabled(false);
      return;
    }
    if (!formData.lr_Name || !formData.lr_Under) {
      alert("Enter Data Correctly");
      setIsLoading(false);
      setSaveDisabled(false);
      return; // Stop execution if name or section is empty
    }

    if (formData.lr_Mobile.length !== 10 &&formData.lr_Mobile.length !== 0 ) {
      alert("Invalid Mobile Number.");
      setIsLoading(false);
      setSaveDisabled(false);
      return; // Stop execution if mobile number is not 10 digits
    }
    if (formData.lr_Email && !validateEmail(formData.lr_Email)) {
      alert("Invalid email address");
      setIsLoading(false);
      setSaveDisabled(false);
      return;
    }
    try {
      setIsLoading(true);
      {
        const updatedformData = {
          ...formData,
          lr_Name: Array.isArray(formData.lr_Name)
            ? formData.lr_Name[1]
            : formData.lr_Name,
          lr_Under: Array.isArray(formData.lr_Under)
            ? formData.lr_Under[0]
            : formData.lr_Under,
          lr_SalesMan: Array.isArray(formData.lr_SalesMan)
            ? formData.lr_SalesMan[0]
            : formData.lr_SalesMan,
        };
        // Make a POST request to your server with the form data
        const response = await axios.post(
          `${apiBaseUrl}/insertledger/${dbCode}`,
          updatedformData
        );

        // Check the response status and handle accordingly
        if (response.status === 200) {
          // Data submitted successfully

          // alert('Scheme Registered')
          // Swal.fire({
          //   position: "top-end",
          //   icon: "success",
          //   title: "Scheme registered",
          //   showConfirmButton: false,
          //   timer: 2000,
          // });

          alert("Ledger registered");
          // window.location.reload();
          if(val){
            onClose(); 
          }
          handleClear();
          nameInputRef.current.focus();
          setIsLoading(false);
        } else {
          // Handle other response statuses or errors
          console.error("Error submitting data:", response.data);
          setIsLoading(false);
          setSaveDisabled(false);

        }
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("Error:", error.message);
      setIsLoading(false);
      setSaveDisabled(false);
    }
  };

  const handleUpdate = async () => {
    if (!formData.lr_Name || !formData.lr_Under) {
      alert("Enter Data Correctly");

      return; // Stop execution if name or section is empty
    }

    if (formData.lr_Mobile && formData.lr_Mobile.length !== 10 && formData.lr_Mobile.length !== 0) {
      alert("Invalid Mobile Number.");
      setIsLoading(false);
      return;
    }
    if (formData.lr_Email && !validateEmail(formData.lr_Email)) {
      alert("Invalid email address");
      setIsLoading(false);
      return;
    }
    try {
      {
        const updatedformData = {
          ...formData,

          lr_Under: Array.isArray(formData.lr_Under)
            ? formData.lr_Under[0]
            : formData.lr_Under,
          lr_SalesMan: Array.isArray(formData.lr_SalesMan)
            ? formData.lr_SalesMan[0]
            : formData.lr_SalesMan,
        };
        // Make a POST request to your server with the form data
        const response = await axios.post(
          `${apiBaseUrl}/spupdateledger/${dbCode}`,
          updatedformData
        );

        // Check the response status and handle accordingly
        if (response.status === 200) {
          // Data submitted successfully

          // alert('Scheme Registered')
          // Swal.fire({
          //   position: "top-end",
          //   icon: "success",
          //   title: "Scheme registered",
          //   showConfirmButton: false,
          //   timer: 2000,
          // });

          alert("Ledger Updated");
          // window.location.reload();
          handleClear();
          nameInputRef.current.focus();
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

  const [Lednames, setLednames] = useState([]);
  useEffect(() => {
    const fetchLednamesNames = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/spledgernames/${dbCode}`);
        const ledDetails = response.data;
        const lednames = ledDetails.map((item) => [item.Ledcode, item.LedName]);
        setLednames(lednames);
      } catch (error) {
        console.error("Error fetching names Values:", error.message);
      }
    };

    fetchLednamesNames();
  }, [apiBaseUrl]);

  const fetchLednamesNames = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/spledgernames/${dbCode}`);
      const ledDetails = response.data;
      const lednames = ledDetails.map((item) => [item.Ledcode, item.LedName]);
      setLednames(lednames);
    } catch (error) {
      console.error("Error fetching names Values:", error.message);
    }
  };

  const [under, setUnder] = useState([]);
  useEffect(() => {
    const fetchparent = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/spledgerheads/${dbCode}`);
        const parDetails = response.data;
        const under = parDetails.map((item) => [item.lh_id, item.lh_name]);
        setUnder(under);
      } catch (error) {
        console.error("Error fetching names Values:", error.message);
      }
    };

    fetchparent();
  }, [apiBaseUrl]);

  const [employeeNames, setEmployeeNames] = useState([]);

  useEffect(() => {
    const fetchEmployeeNames = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/SchReg_empname/${dbCode}`);

        const empNames = response.data.map((item) => [item.Auto, item.name]);

        setEmployeeNames(empNames);
      } catch (error) {
        console.error("Error fetching employee names:", error.message);
      }
    };

    fetchEmployeeNames();
  }, []);

  const handleFindByname = async () => {
    try {
      // Make a GET request to your server with the selected name for finding data
      const response = await axios.get(
        `${apiBaseUrl}/spledgerFindbyname/${formData.lr_Name[0]}/${formData.lr_Name[1]}/${dbCode}`
      );

      // Check the response status and handle accordingly
      if (response.status === 200) {
        setEditDisabled(false);
          setDeleteDisabled(false);
          setSaveDisabled(true);
        // Data retrieved successfully, update the form data
        const foundData = response.data[0]; // Assuming the response is an array with one item
      //  ////console.log("data =", foundData);
      fetchExist(Lednames.find((item) => item[0] === foundData.Ledcode));

        const formattedDate = new Date(foundData.atDate)
          .toISOString()
          .split("T")[0];

        setFormData({
          ...formData,

          lr_Name: Lednames.find((item) => item[0] === foundData.Ledcode),
          lr_Under: under.find((item) => item[0] === foundData.lh_id),
          lr_Address1: foundData.add1,
          lr_Address2: foundData.add2,
          lr_Address3: foundData.add3,
          lr_City: foundData.city,
          lr_Pincode: foundData.PinNo,
          lr_Contactperson: foundData.CPerson,
          lr_Telno: foundData.Telno,
          lr_Res: foundData.Res,
          lr_Mobile: foundData.Mobile,
          lr_Gstno: foundData.gstno,
          lr_Email: foundData.Email,
          lr_SalesMan: employeeNames.find(
            (item) => item[0] === foundData.SalesMan
          ),
          lr_debit: foundData.atDebitAmount,
          lr_credit: foundData.atCreditAmount,
          lr_date: formattedDate,
        });
        setDataFound(true);
      } else {
        // Handle other response statuses or errors
        console.error("Error retrieving data:", response.data);
        setDataFound(false);
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("Error:", error.message);
      setDataFound(false);
    }
  };

  const handleFindBygst = async () => {
    try {
      // Make a GET request to your server with the selected name for finding data
      const response = await axios.get(
        `${apiBaseUrl}/spledgerFindbygstNo/${formData.lr_Gstno}/${dbCode}`
      );

      // Check the response status and handle accordingly
      if (response.status === 200) {
        setEditDisabled(false);
          setDeleteDisabled(false);
          setSaveDisabled(true);
        // Data retrieved successfully, update the form data
        const foundData = response.data[0]; // Assuming the response is an array with one item
        fetchExist(Lednames.find((item) => item[0] === foundData.Ledcode));

     //   ////console.log("data =", foundData);
        const formattedDate = new Date(foundData.atDate)
          .toISOString()
          .split("T")[0];

        setFormData({
          ...formData,

          lr_Name: Lednames.find((item) => item[0] === foundData.Ledcode),
          lr_Under: under.find((item) => item[0] === foundData.lh_id),
          lr_Address1: foundData.add1,
          lr_Address2: foundData.add2,
          lr_Address3: foundData.add3,
          lr_City: foundData.city,
          lr_Pincode: foundData.PinNo,
          lr_Contactperson: foundData.CPerson,
          lr_Telno: foundData.Telno,
          lr_Res: foundData.Res,
          lr_Mobile: foundData.Mobile,
          lr_Gstno: foundData.gstno,
          lr_Email: foundData.Email,
          lr_SalesMan: employeeNames.find(
            (item) => item[0] === foundData.SalesMan
          ),
          lr_debit: foundData.atDebitAmount,
          lr_credit: foundData.atCreditAmount,
          lr_date: formattedDate,
        });
        setDataFound(true);
      } else {
        // Handle other response statuses or errors
        console.error("Error retrieving data:", response.data);
        setDataFound(false);
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("Error:", error.message);
      setDataFound(false);
    }
  };

  const handleFindBymob = async () => {
    try {
      // Make a GET request to your server with the selected name for finding data
      const response = await axios.get(
        `${apiBaseUrl}/spledgerFindbymob/${formData.lr_Mobile}/${dbCode}`
      );

      // Check the response status and handle accordingly
      if (response.status === 200) {
        setEditDisabled(false);
          setDeleteDisabled(false);
          setSaveDisabled(true);
        // Data retrieved successfully, update the form data
        const foundData = response.data[0]; // Assuming the response is an array with one item
       // ////console.log("data =", foundData);

       fetchExist(Lednames.find((item) => item[0] === foundData.Ledcode));

        const formattedDate = new Date(foundData.atDate)
          .toISOString()
          .split("T")[0];

        setFormData({
          ...formData,

          lr_Name: Lednames.find((item) => item[0] === foundData.Ledcode),
          lr_Under: under.find((item) => item[0] === foundData.lh_id),
          lr_Address1: foundData.add1,
          lr_Address2: foundData.add2,
          lr_Address3: foundData.add3,
          lr_City: foundData.city,
          lr_Pincode: foundData.PinNo,
          lr_Contactperson: foundData.CPerson,
          lr_Telno: foundData.Telno,
          lr_Res: foundData.Res,
          lr_Mobile: foundData.Mobile,
          lr_Gstno: foundData.gstno,
          lr_Email: foundData.Email,
          lr_SalesMan: employeeNames.find(
            (item) => item[0] === foundData.SalesMan
          ),
          lr_debit: foundData.atDebitAmount,
          lr_credit: foundData.atCreditAmount,
          lr_date: formattedDate,
        });
        setDataFound(true);
      } else {
        // Handle other response statuses or errors
        console.error("Error retrieving data:", response.data);
        setDataFound(false);
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("Error:", error.message);
      setDataFound(false);
    }
  };

  const [countExist, setcountExist] = useState("");

  const fetchExist = async (e) => {
   // ////console.log("e",e);
    try {
      const response = await axios.get(
        `${apiBaseUrl}/schUsedEntry/${e[0]}/${dbCode}`
      );
      // ////console.log("count=", response.data[0].CountExists);

      setcountExist(response.data[0].CountExists);
      // const count = response.data[0].CountExists;
      // return count;
    } catch (error) {
      console.error("Error fetching employee names:", error.message);
    }
  };
  const handleDelete = async () => {
    if(countExist>0){
      alert("Entry used")
      return;
    }
   
    if (formData.lr_Name === "") {
      alert("invalid Name");
      return;
    }
    if (!window.confirm("Do You Want To Delete..?")) {
      return;
    }
    try {
      const response = await axios.delete(
        `${apiBaseUrl}/spdeleteLedger/${formData.lr_Name[0]}/${dbCode}`
      );
      if (response.status === 200) {
        // Swal.fire({
        //   position: "top-end",
        //   icon: "success",
        //   title: "Scheme deleted",
        //   showConfirmButton: false,
        //   timer: 2000,
        // });
        alert("Account Deleted ");
        // window.location.reload();
        handleClear();
      } else {
        console.error("Error deleting data:", response.data);
        alert("Error deleting data");
      }
    } catch (error) {
      console.error("Error:", error.message);
      alert("Error deleting data");
    }
  };


  const getLocalIPAddress = async () => {
    try {
      const response = await axios.get('https://api.ipify.org?format=json');
      return response.data.ip;
    } catch (error) {
      console.error("Error fetching IP address:", error);
      return '127.0.0.1'; // Fallback IP address
    }
  };
  
  // Function to authenticate and fetch GST details
  const fetchGSTDetails = async (gstNo) => {
    ////console.log("gstno=",gstNo);
    
    try {
      const localIp = await getLocalIPAddress();
      
      ////console.log("localip=",localIp);
      
      const apiUrl = 'https://api.mastergst.com/einvoice/authenticate?email=shersoftware%40gmail.com';
  
      // Step 1: Authenticate and get the auth token
      const authResponse = await axios.get(apiUrl, {
        headers: {
          accept: '/',
          username: 'mastergst',
          password: 'Malli#123',
          ip_address: localIp,
          client_id: 'ce357943-5598-4af5-8d7f-7119ef5dd2b3',
          client_secret: '2dbffc02-86b9-4a48-9782-03727edad504',
          gstin: '29AABCT1332L000',
        },
      });
  
      const authData = authResponse.data;
  
      if (authData.status_cd === 'Success') {
        const authToken = authData.data.AuthToken;
  
        // Step 2: Fetch GST details using the auth token
        const gstApiUrl = `https://api.mastergst.com/einvoice/type/GSTNDETAILS/version/V1_03?param1=${gstNo}&email=shersoftware%40gmail.com`;
  
        const gstResponse = await axios.get(gstApiUrl, {
          headers: {
            accept: '/',
            ip_address: localIp,
            client_id: 'ce357943-5598-4af5-8d7f-7119ef5dd2b3',
            client_secret: '2dbffc02-86b9-4a48-9782-03727edad504',
            username: 'mastergst',
            'auth-token': authToken,
            gstin: '29AABCT1332L000',
          },
        });
  
        const gstData = gstResponse.data;
  
        if (gstData.status_cd === '1') {
          // Handle successful GST details retrieval
          ////console.log('Trade Name:', gstData.data.TradeName);
          ////console.log('Address Line 1:', gstData.data.AddrBno);
          // Handle other fields as needed
          return gstData.data;
        } else {
          console.error('GST API Error:', gstData.status_desc);
        }
      } else {
        console.error('Authentication Error:', authData.status_desc);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className={`ledger_regmodal ledgerRegRootdiv `} style={{ width: "725px", height: "470px", zIndex:"10000" }}>
      <div className="schemecontrolls">
        {/* ///////// */}
        <div className="schemereg_headerLogo_Div">
          <div className="schemereg_headerLogo">
            <img src={headeLogo} alt="SherSoftLogo" />
          </div>
          <label className="schemeReg_pageHead">Ledger Registration</label>
        </div>
        <img
          alt="Close"
          className="close-icon"
          onClick={onClose}
          src={toggleClose}
        />
      </div>

      {/*............................ Navbar.............................................. */}
      <div className="schemeReg_navbar">
        <button
          style={{
            border: "none",
            backgroundColor: "transparent",
            marginLeft: "2%",
          }}
          className={`schemeNav_items`}
          ref={saveBtnRef}
          onClick={handleSubmit}
          disabled={dataFound || isLoading||saveDisabled}
        >
          <div className="schemeReg_buttonImage">
            <img src={saveImg} alt="SaveImg" />
          </div>
          {isLoading ? "Saving..." : "Save"}
        </button>
        {/* <button
          style={{ border: "none", backgroundColor: "transparent" }}
          className="schemeNav_items"
        >
          <div className="schemeReg_buttonImage">
            <img src={printImg} alt="PrintImg" />
          </div>
          Print
        </button> */}
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
          onClick={handleFindByname}
        >
          <div className="schemeReg_buttonImage">
            <img src={findImg} alt="findImg" />
          </div>
          Find
        </button>
        <button
          style={{ border: "none", backgroundColor: "transparent" }}
          className={`schemeNav_items`}
          onClick={handleUpdate}
          disabled={!dataFound||editDisabled}
        >
          <div className="schemeReg_buttonImage">
            <img src={editImg} alt="editImg" />
          </div>
          Edit
        </button>
        <button
          style={{ border: "none", backgroundColor: "transparent" }}
          className={`schemeNav_items `}
          onClick={handleDelete}
          disabled={!dataFound||deleteDisabled}
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
        {/* <div className="schemeReg_arrowButtons">
          <button
            style={{ backgroundColor: "transparent" }}
            className="schemeReg_arrowButtonImage"
          >
            <img src={playandpause} alt="playandpause" />
          </button>
          <button
            style={{ backgroundColor: "transparent" }}
            className="schemeReg_arrowButtonImage"
          >
            <img src={leftarrow} alt="leftarrow" />
          </button>
          <button
            style={{ backgroundColor: "transparent" }}
            className="schemeReg_arrowButtonImage"
          >
            <img src={rightarrow} alt="rightarrow" />
          </button>
          <button
            style={{ backgroundColor: "transparent", marginRight: "2%" }}
            className="schemeReg_arrowButtonImage"
          >
            <img src={playandpauseRight} alt="playandpauseRight" />
          </button>
        </div> */}
      </div>
      {/*............................ NavbarEnd.............................................. */}

      <div className="ledgerRegBody">
        <div className="ledgerRegBodyRow">
          <div className="ledgerRegBodyRowCol">
            <label htmlFor="">Name</label>
            <ComboBox
              //   inputType="number"
              findedValue={
                Array.isArray(formData.lr_Name)
                  ? formData.lr_Name[1]
                  : formData.lr_Name 
              }
              comboRef={nameInputRef}
              options={Lednames}
              className="comboClass"
              onInputChange={(e) => setFormData({ ...formData, lr_Name: e })}
              onKeyDown={(e) => handleKeyDown(e, dateRef)}
            />
          </div>
          <div className="ledgerRegBodyRowCol">
            <label htmlFor="" style={{ textAlign: "center" }}>
              Date
            </label>
            <input
              value={formData.lr_date}
              ref={dateRef}
              type="Date"
              onChange={(e) =>
                setFormData({ ...formData, lr_date: e.target.value })
              }
              onKeyDown={(e) => handleKeyDown(e, underInputRef)}
            />
          </div>
        </div>
        <div className="ledgerRegBodyRow">
          <div className="ledgerRegBodyRowCol">
            <label htmlFor="">Under</label>
            <ComboBox
              findedValue={
                Array.isArray(formData.lr_Under)
                  ? formData.lr_Under[1]
                  : formData.lr_Under
              }
              comboRef={underInputRef}
              options={under}
              className="comboClass"
              onInputChange={(e) => setFormData({ ...formData, lr_Under: e })}
              onKeyDown={(e) => handleKeyDown(e, add1InputRef)}
            />
          </div>
          <div className="ledgerRegBodyRowCol">
            <label htmlFor="" style={{ textAlign: "center" }}>
              Address 1
            </label>
            <input
              value={formData.lr_Address1}
              ref={add1InputRef}
              type="text"
              onChange={(e) =>
                setFormData({ ...formData, lr_Address1: e.target.value })
              }
              onKeyDown={(e) => handleKeyDown(e, add2InputRef)}
            />
          </div>
        </div>
        <div className="ledgerRegBodyRow">
          <div className="ledgerRegBodyRowCol">
            <label htmlFor="">Address 2</label>
            <input
              value={formData.lr_Address2}
              ref={add2InputRef}
              type="text"
              onChange={(e) =>
                setFormData({ ...formData, lr_Address2: e.target.value })
              }
              onKeyDown={(e) => handleKeyDown(e, add3InputRef)}
            />
          </div>
          <div className="ledgerRegBodyRowCol">
            <label htmlFor="" style={{ textAlign: "center" }}>
              Address 3
            </label>
            <input
              value={formData.lr_Address3}
              ref={add3InputRef}
              type="text"
              onChange={(e) =>
                setFormData({ ...formData, lr_Address3: e.target.value })
              }
              onKeyDown={(e) => handleKeyDown(e, cityInputRef)}
            />
          </div>
        </div>
        <div className="ledgerRegBodyRow">
          <div className="ledgerRegBodyRowCol">
            <label htmlFor="">City/Town</label>
            <input
              value={formData.lr_City}
              ref={cityInputRef}
              type="text"
              readOnly
              onChange={(e) =>
                setFormData({ ...formData, lr_City: e.target.value })
              }
              onKeyDown={(e) => handleKeyDown(e, gstInputRef)}
            />
          </div>
          <div className="ledgerRegBodyRowCol" style={{ gap: 0 }}>
            <label htmlFor="" style={{ textAlign: "center" }}>
              Gst No
            </label>
            <input
              style={{ width: "50%", marginLeft: "4%" }}
              value={formData.lr_Gstno}
              ref={gstInputRef}
              type="text"
              onChange={(e) =>
                setFormData({ ...formData, lr_Gstno: e.target.value })
              }
              onKeyDown={(e) => handleKeyDown(e, CpersonInputRef)}
              
            />
            <button onClick={(e)=>
              
              
              // fetchGSTDetails(formData.lr_Gstno)
              handleFindBygst()
            
            
            } 
              >
              <img src={serchIcon} alt="sch" />
            </button>
          </div>
        </div>
        <div className="ledgerRegBodyRow">
          <div className="ledgerRegBodyRowCol">
            <label htmlFor="">Contact Person</label>
            <input
              value={formData.lr_Contactperson}
              ref={CpersonInputRef}
              type="text"
              onChange={(e) =>
                setFormData({ ...formData, lr_Contactperson: e.target.value })
              }
              onKeyDown={(e) => handleKeyDown(e, teleInputRef)}
            />
          </div>
          <div className="ledgerRegBodyRowCol">
            <label htmlFor="" style={{ textAlign: "center" }}>
              Telephone
            </label>
            <input
              value={formData.lr_Telno}
              ref={teleInputRef}
              type="number"
              onChange={(e) =>
                setFormData({ ...formData, lr_Telno: e.target.value })
              }
              onKeyDown={(e) => handleKeyDown(e, pincodeInputRef)}
            />
          </div>
        </div>
        <div className="ledgerRegBodyRow">
          <div className="ledgerRegBodyRowCol">
            <label htmlFor="">Pin Code</label>
            <input
              value={formData.lr_Pincode}
              ref={pincodeInputRef}
              type="number"
              onChange={(e) =>
                setFormData({ ...formData, lr_Pincode: e.target.value })
              }
              onKeyDown={(e) => handleKeyDown(e, mobInputRef)}
            />
          </div>
          <div className="ledgerRegBodyRowCol" style={{ gap: 0 }}>
            <label htmlFor="" style={{ textAlign: "center" }}>
              Mob Number
            </label>
            <input
              style={{ width: "50%", marginLeft: "4%" }}
              value={formData.lr_Mobile}
              ref={mobInputRef}
              type="number"
              onChange={(e) =>
                setFormData({ ...formData, lr_Mobile: e.target.value })
              }
              onKeyDown={(e) => handleKeyDown(e, emailInputRef)}
            />
            <button onClick={handleFindBymob}>
              <img src={serchIcon} alt="sch" />
            </button>
          </div>
        </div>
        <div className="ledgerRegBodyRow">
          <div className="ledgerRegBodyRowCol">
            <label htmlFor="">Email Address</label>
            <input
              value={formData.lr_Email}
              ref={emailInputRef}
              type="email"
              onChange={(e) =>
                setFormData({ ...formData, lr_Email: e.target.value })
              }
              onKeyDown={(e) => handleKeyDown(e, salesmanInputRef)}
            />
          </div>
          <div className="ledgerRegBodyRowCol">
            <label htmlFor="" style={{ textAlign: "center" }}>
              Sales Man
            </label>
            <ComboBox
              findedValue={
                Array.isArray(formData.lr_SalesMan)
                  ? formData.lr_SalesMan[1]
                  : formData.lr_SalesMan
              }
              comboRef={salesmanInputRef}
              options={employeeNames}
              className="comboClass"
              onInputChange={(e) =>
                setFormData({ ...formData, lr_SalesMan: e })
              }
              onKeyDown={(e) => handleKeyDown(e, debitAmountInputRef)}
            />
          </div>
        </div>

        <div
          className="ledgerRegBodyRow"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "2%",
          }}
        >
          <div className="ledgerRegBodyRowLines"></div>
          <label htmlFor="">Opening Balance</label>
          <div className="ledgerRegBodyRowLines"></div>
        </div>
        <div className="ledgerRegBodyRow">
          <div className="ledgerRegBodyRowCol">
            <label htmlFor="">Debit Amount</label>
            <input
              style={{ textAlign: "right" }}
              value={formData.lr_debit}
              ref={debitAmountInputRef}
              type="number"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  lr_debit: e.target.value,
                  lr_credit: "",
                })
              }
              onKeyDown={(e) => handleKeyDown(e, creditAmountInputRef)}
            />
          </div>
          <div className="ledgerRegBodyRowCol">
            <label htmlFor="" style={{ textAlign: "center" }}>
              Credit Amount
            </label>
            <input
              style={{ textAlign: "right" }}
              value={formData.lr_credit}
              ref={creditAmountInputRef}
              type="number"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  lr_credit: e.target.value,
                  lr_debit: "",
                })
              }
              onKeyDown={(e) => handleKeyDown(e, saveBtnRef)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LedgerReg;
