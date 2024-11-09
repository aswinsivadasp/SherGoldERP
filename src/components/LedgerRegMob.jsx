import React, { useState, useRef, useEffect, useContext } from "react";
import "../styles/LedgerRegMob.css";
import toggle from "../assets/images/MobToggle.png";
import save from "../assets/images/SaveImage.png";
import find from "../assets/images/findMob.png";
import edit from "../assets/images/Editing.png";
import Delete from "../assets/images/Delete.png";
import print from "../assets/images/Printer.png";
import exit from "../assets/images/Exit1.png";
import close from "../assets/images/findclose.png";
import home from "../assets/images/arrow.png";
import clear from "../assets/images/Document.png";
import sslogo from "../assets/images/ssMob.png";
import { useNavigate } from "react-router-dom";
import serchIcon from "../assets/images/Magnifiying Glass .png";

import { AuthContext } from "../context/AuthContext";

//import ComboBox from "shersoft-combov1";
import ComboBox from "./ComboBox";
import axios from "axios";
import Swal from "sweetalert2";
import { useDbContext } from "../context/DbContext";
function LedgerRegMob({ onClose, val }) {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const { agentCode } = useContext(AuthContext);
  const { dbCode } = useDbContext();


  const agentCodeRef = useRef(agentCode);

  useEffect(() => {
    agentCodeRef.current = agentCode;
  }, [agentCode]);

  const [userType, setuserType] = useState("");
  const navigate = useNavigate();

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
  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };
  const [showFind, setShowFind] = useState(true);

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
    lr_Name: "" || val,
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
    setShowFind(true);
  };
  const handleKeyDown = (event, nextInputRef) => {
    if (event.key === "Enter" || event.key === "Return") {
      nextInputRef.current.focus();
    }
  };
  useEffect(() => {
    // nameInputRef.current.focus();
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

    if (formData.lr_Mobile.length !== 10 && formData.lr_Mobile.length !== 0) {
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
          `${apiBaseUrl}/main/insertledger/${dbCode}`,
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
          if (val) {
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

    if (
      formData.lr_Mobile &&
      formData.lr_Mobile.length !== 10 &&
      formData.lr_Mobile.length !== 0
    ) {
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
          `${apiBaseUrl}/main/spupdateledger/${dbCode}`,
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
        const response = await axios.get(`${apiBaseUrl}/main/spledgernames/${dbCode}`);
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
      const response = await axios.get(`${apiBaseUrl}/main/spledgernames/${dbCode}`);
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
        const response = await axios.get(`${apiBaseUrl}/main/spledgerheads/${dbCode}`);
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
        const response = await axios.get(`${apiBaseUrl}/main/SchReg_empname/${dbCode}`);

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
        `${apiBaseUrl}/main/spledgerFindbyname/${formData.lr_Name[0]}/${formData.lr_Name[1]}/${dbCode}`
      );

      // Check the response status and handle accordingly
      if (response.status === 200) {
        setEditDisabled(false);
        setDeleteDisabled(false);
        setSaveDisabled(true);
        // Data retrieved successfully, update the form data
        const foundData = response.data[0]; // Assuming the response is an array with one item
        ////console.log("data =", foundData);
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
        setShowFind(false);
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
        `${apiBaseUrl}/main/spledgerFindbygstNo/${formData.lr_Gstno}/${dbCode}`
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
        setShowFind(false);
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
        `${apiBaseUrl}/main/spledgerFindbymob/${formData.lr_Mobile}/${dbCode}`
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
        setShowFind(false);
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
      const response = await axios.get(`${apiBaseUrl}/main/schUsedEntry/${e[0]}/${dbCode}`);
      // ////console.log("count=", response.data[0].CountExists);

      setcountExist(response.data[0].CountExists);
      // const count = response.data[0].CountExists;
      // return count;
    } catch (error) {
      console.error("Error fetching employee names:", error.message);
    }
  };
  const handleDelete = async () => {
    if (countExist > 0) {
      alert("Entry used");
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
        `${apiBaseUrl}/main/spdeleteLedger/${formData.lr_Name[0]}/${dbCode}`
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
  return (
    <div className="ledgerregmobRoot">
      {/* --------------Nav Bar----------------- */}

      <div className="ledgerregMobnav">
        <div className="ledgerregMobtoggle" onClick={() => navigate("/home")}>
          <img src={home} alt="X" />
        </div>
        <div
          className="schemeMobshesofttag"
          style={{ width: "40%", justifyContent: "left", marginLeft: "55px" }}
        >
          <img src={sslogo} alt="SS" />
          <label className="ledgerregMobshesofttaglabel">
            Ledger Registration
          </label>
        </div>

        {showFind ? (
          <div className=" ledgerregmobnavitems">
            <button
              className="ledgeregMobnavBaritemsbuttons"
              onClick={handleClear}
            >
              <img src={clear} alt="Clear" className="ledgerregMobbuttonimg" />
            </button>
            <button
              className="ledgeregMobnavBaritemsbuttons"
              onClick={handleSubmit}
              ref={saveBtnRef}
              disabled={saveDisabled}
            >
              <img src={save} alt="Save" className="ledgerregMobbuttonimg" />
            </button>

            <button className="ledgeregMobnavBaritemsbuttons">
              <img src={print} alt="Print" className="ledgerregMobbuttonimg" />
            </button>
            <button
              className="ledgeregMobnavBaritemsbuttons"
              // onClick={handleFindClick,handleFind}
              //   onClick={() => {
              //     // handleFindClick();
              //     handleFind();
              //   }}

              onClick={handleFindByname}
            >
              <img src={find} alt="Find" className="ledgerregMobbuttonimg" />
            </button>
          </div>
        ) : (
          <div className="ledgerregmobnavitems">
            <button
              className="ledgeregMobnavBaritemsbuttons"
              // ref={printButtonRef}
              // onClick={handlePrint}
            >
              <img src={print} alt="Print" className="ledgerregMobbuttonimg" />
            </button>
            <button
              className="ledgeregMobnavBaritemsbuttons"
              onClick={handleClear}
            >
              <img src={clear} alt="Clear" className="ledgerregMobbuttonimg" />
            </button>
            <button
              className="ledgeregMobnavBaritemsbuttons"
              onClick={handleUpdate}
              disabled={editDisabled || userType !== "ADMIN"}
            >
              <img src={edit} alt="Edit" className="ledgerregMobbuttonimg" />
            </button>
            <button
              className="ledgeregMobnavBaritemsbuttons"
              onClick={handleDelete}
              disabled={deleteDisabled || userType !== "ADMIN"}
            >
              <img
                src={Delete}
                alt="Delete"
                className="ledgerregMobbuttonimg"
              />
            </button>
          </div>
        )}
      </div>
      <div className="ledgerRegMobBody">
        <div className="ledgerregBodyrowsDate">
          <label>Date</label>
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

        <div className="192.168.29.14" style={{ height: "22.5vh" }}>
          <div className="ledgerregBodyrows" style={{ height: "30%" }}>
            <label>Name</label>
            <ComboBox
              //   inputType="number"
              findedValue={
                Array.isArray(formData.lr_Name)
                  ? formData.lr_Name[1]
                  : formData.lr_Name
              }
              comboRef={nameInputRef}
              options={Lednames}
              className="comboclassmob"
              onInputChange={(e) => setFormData({ ...formData, lr_Name: e })}
              onKeyDown={(e) => handleKeyDown(e, dateRef)}
            />
          </div>
          <div className="ledgerregBodyrows" style={{ height: "30%" }}>
            <label htmlFor="">Under</label>
            <ComboBox
              findedValue={
                Array.isArray(formData.lr_Under)
                  ? formData.lr_Under[1]
                  : formData.lr_Under
              }
              comboRef={underInputRef}
              options={under}
              className="comboclassmob"
              onInputChange={(e) => setFormData({ ...formData, lr_Under: e })}
              onKeyDown={(e) => handleKeyDown(e, add1InputRef)}
            />
          </div>

          <div className="ledgerregBodyrows" style={{ height: "30%" }}>
            <label style={{ height: "auto" }}>Gst No</label>
            <div className="gstnodivMob">
              <input
                value={formData.lr_Gstno}
                ref={gstInputRef}
                type="text"
                onChange={(e) =>
                  setFormData({ ...formData, lr_Gstno: e.target.value })
                }
                onKeyDown={(e) => handleKeyDown(e, CpersonInputRef)}
              />
              <button onClick={handleFindBygst}>
                <img src={serchIcon} alt="sch" />
              </button>
            </div>
          </div>
        </div>
        <div className="ledgerRegBodyMobsec">
          <div className="ledgerregBodyrows">
            <label htmlFor="">Address 1</label>
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
          <div className="ledgerregBodyrows">
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
          <div className="ledgerregBodyrows">
            <label htmlFor="">Address 3</label>
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
          <div className="ledgerregBodyrows">
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
        </div>
        <div className="ledgerRegBodyMobsec" style={{ height: "37.5vh" }}>
          <div className="ledgerregBodyrows" style={{ height: "18%" }}>
            <label>Sales Man</label>
            <ComboBox
              findedValue={
                Array.isArray(formData.lr_SalesMan)
                  ? formData.lr_SalesMan[1]
                  : formData.lr_SalesMan
              }
              comboRef={salesmanInputRef}
              options={employeeNames}
              className="comboclassmob"
              onInputChange={(e) =>
                setFormData({ ...formData, lr_SalesMan: e })
              }
              onKeyDown={(e) => handleKeyDown(e, debitAmountInputRef)}
            />
          </div>
          <div className="ledgerregBodyrows" style={{ height: "18%" }}>
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
          <div className="ledgerregBodyrows" style={{ height: "18%" }}>
            <label>Mob Number</label>
            <div className="gstnodivMob">
              <input
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
          <div className="ledgerregBodyrows" style={{ height: "18%" }}>
            <label>Telephone</label>
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
          <div className="ledgerregBodyrows" style={{ height: "18%" }}>
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
        </div>

        <div className="ledgerregBodyrowsOpbalance">
          <div
            className="ledgerregBodyrowsOpbalancesec"
            style={{ gap: "2%", height: "20%" }}
          >
            <div
              style={{ borderBottom: "1px solid black", width: "30%" }}
            ></div>
            <label>Opening Balance</label>
            <div
              style={{ borderBottom: "1px solid black", width: "30%" }}
            ></div>
          </div>
          <div className="ledgerregBodyrowsOpbalancesecDate" >
            <label>Date</label>
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

          <div className="ledgerregBodyrowsOpbalancesec">
            <div className="ledgerregBodyrowsOpbalancesecpart">
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
            <div className="ledgerregBodyrowsOpbalancesecpart">
              <label>Credit Amount</label>
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
    </div>
  );
}

export default LedgerRegMob;
