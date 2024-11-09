import React, { useState, useRef, useEffect } from "react";
import "../styles/StaffReg.css";
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
import binImg from "../assets/images/Bin.png";
// import ComboBox from "shersoft-combov1";
import ComboBox from "./ComboBox";
import updatedComboBox from "./ComboBox";
import toggleClose from "../assets/images/xred.webp";

import axios from "axios";
import Swal from "sweetalert2";
import { useDbContext } from "../context/DbContext";

function StaffReg({ onClose }) {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const { dbCode } = useDbContext();

  const [minimized, setMinimized] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [dataFound, setDataFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [editDisabled, setEditDisabled] = useState(true);
  const [deleteDisabled, setDeleteDisabled] = useState(true);
  const [saveDisabled, setSaveDisabled] = useState(false);
  const [activeTab, setActiveTab] = useState("Details");

  const toggleMinimize = () => {
    setMinimized(!minimized);
  };
  const [selectedValue, setSelectedValue] = useState("");

  const options1 = ["Aswin", "Vishnu", "Saneen"];
  const options2 = ["Section1", "Section 2", "Section 3"];
  const options3 = ["Monthly", "Daily", "type3"];
  const options4 = ["Branch1", "Branch2", "Branch3"];
  const options5 = [
    "commission1",
    "wwewere",
    "commission2",
    "commission3",
    "T-shirt fullsleev",
  ];
  const options6 = ["ledger1", "ledger2", "ledger3"];

  // Add refs for other input fields as needed
  const [formData, setFormData] = useState({
    sr_empid: "",
    sr_Name: "",
    sr_Section: "",
    sr_cashAcc: "",
    sr_Gender: "",
    sr_Address1: "",
    sr_Address2: "",
    sr_Address3: "",
    sr_Mobile: "",
    sr_Type: "",
    sr_DateOj: "",
    sr_Salary: "",
    sr_OtRate: "",
    sr_OtHour: "",
    sr_LeaveDeduction: "",
    sr_DailyAllowance: "",
    sr_Active: "",
    sr_CasualLeave: "",
    sr_Branch: "",
    sr_CommissionStatus: "",
    sr_Percent: "",
    sr_Pf: "",
    sr_WorkingHours: "",
    sr_Ledger: "",
    sr_UserName: "",
    sr_Password: "",
    sr_Type: "EMPLOYEE",
  });
 ////console.log(formData);

  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    const handleWindowResize = () => {
      if (window.innerWidth <= 768) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  /////////////////////////////////////////////////////////
  const [selectcashAcc, setselectcashAcc] = useState([]);

  useEffect(() => {
    const selectcashAcc = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/main/SchRec_caba/${dbCode}`);

        // Assuming response.data is an array with objects and each object has a LedName property
        const caba = response.data;

        // Transforming the array into the desired format
        // const supplName = cName.map((item) => item.LedName);

        const transformedData = caba.map((item) => [
          item.ledcode,
          item.LedName,
        ]);
        setselectcashAcc(transformedData);

        // setsupplierName(supplName);
      } catch (error) {
        console.error("Error fetching selectcashAcc Values:", error.message);
      }
    };

    selectcashAcc();
  }, [apiBaseUrl]);
  ///////

  const handleSubmit = async () => {
    // ////console.log("submit called");
    if (!formData.sr_Name || !formData.sr_Section) {
      alert("Enter Data Correctly");
      setIsLoading(false);
      // ////console.log("returned from  Enter Data Correctly ");

      return; // Stop execution if name or section is empty
    }
    if (
      Names &&
      Names.includes(
        Array.isArray(formData.sr_Name) ? formData.sr_Name[1] : formData.sr_Name
      )
    ) {
      alert("Duplicate entry!");
      return;
    }

    if (formData.sr_Mobile.length !== 10) {
      alert("Invalid Mobile Number.");
      // ////console.log("returned from Invalid Mobile Number");

      setIsLoading(false);
      return; // Stop execution if mobile number is not 10 digits
    }

    try {
      // ////console.log("inside try");
      // ////console.log("formdata inside=",formData);

      setIsLoading(true);

      // ////console.log("before insert call");

      // Make a POST request to your server with the form data
      const response = await axios.post(
        `${apiBaseUrl}/main/insertSalesman/${dbCode}`,
        formData
      );

      // Check the response status and handle accordingly
      if (response.status === 200) {
        // Data submitted successfully

        alert("Salesman Registered");
        // window.location.reload();
        setIsLoading(false);
        handleClear();
      } else {
        // Handle other response statuses or errors
        console.error("Error submitting data:", response.data);
        setIsLoading(false);
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("Error:", error.message);
      setIsLoading(false);
    }
  };

  const handleEdit = async () => {
    try {
      if (!formData.sr_Name || !formData.sr_Section) {
        alert("Enter Data Correctly");
        return; // Stop execution if name or section is empty
      }

      if (formData.sr_Mobile.length !== 10 || null) {
        alert("Invalid Mobile Number.");
        return; // Stop execution if mobile number is not 10 digits
      }

      // Make a POST request to your server with the form data
      const response = await axios.post(
        `${apiBaseUrl}/main/updateSalesman/${dbCode}`,
        formData
      );

      // Check the response status and handle accordingly
      if (response.status === 200) {
        // Data submitted successfully

        alert("Entry Edited");
        // window.location.reload();
        handleClear();
      } else {
        // Handle other response statuses or errors
        console.error("Error editing data:", response.data);
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("Error:", error.message);
    }
  };

  const handleDelete = async () => {
    try {
      // Make a DELETE request to your server with the employee's name
      const response = await axios.delete(
        `${apiBaseUrl}/main/deleteSalesman/${formData.sr_Name}/${dbCode}`
      );
      //////console.log('res',response.data.message);
      // Check the response status and handle accordingly
      if (response.status === 200) {
        // Data deleted successfully

        alert(`${response.data.message}`);
        //  window.location.reload(); // You may want to use state and useEffect instead of a full reload
        handleClear();
      } else {
        // Handle other response statuses or errors
        console.error("Error deleting data:", response.data);
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("Error:", error.message);
    }
  };

  const [employeeNames, setEmployeeNames] = useState([]);
  const [Names, setNames] = useState([]);

  // ////console.log("names-=",Names);

  useEffect(() => {
    const fetchEmployeeNames = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/main/getEmployeeNames/${dbCode}`);
        const empNames = response.data.map((item) => [item.Auto, item.name]);
        setEmployeeNames(empNames);
        setNames(response.data.map((item) => item.name));
      } catch (error) {
        console.error("Error fetching employee names:", error.message);
      }
    };

    fetchEmployeeNames();
  }, []);
  const fetchEmployeeNames = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/main/getEmployeeNames/${dbCode}`);
      const empNames = response.data.map((item) => [item.Auto, item.name]);

      setEmployeeNames(empNames);
      setNames(response.data.map((item) => item.name));
    } catch (error) {
      console.error("Error fetching employee names:", error.message);
    }
  };
  /////////////////
  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleFind = async () => {
    try {
      // Make a GET request to your server with the selected name for finding data
      const response = await axios.get(
        `${apiBaseUrl}/main/getEmployeeByName/${formData.sr_Name[0]}/${dbCode}`
      );

      // Check the response status and handle accordingly
      if (response.status === 200) {
        setEditDisabled(false);
        setDeleteDisabled(false);
        setSaveDisabled(true);
        // Data retrieved successfully, update the form data
        const foundData = response.data[0]; // Assuming the response is an array with one item

        setFormData({
          ...formData,
          sr_empid: foundData.emp_code || "",
          sr_Name: foundData.Name || "",
          sr_Section: foundData.EmployeeSection || "",
          sr_cashAcc: selectcashAcc.find(
            (item) => item[0] === foundData.cashAcc
          ),
          sr_Gender: foundData.Gender || "",
          sr_Address1: foundData.Address1 || "",
          sr_Address2: foundData.address2 || "",
          sr_Address3: foundData.address3 || "",
          sr_Mobile: foundData.Mobile || "",
          sr_Type: foundData.Type || "",
          sr_DateOj: formatDate(foundData.DDate) || "",
          sr_Salary: foundData.Salary || "",
          sr_OtRate: foundData.OT || "",
          sr_OtHour: foundData.othour || "",
          sr_LeaveDeduction: foundData.LiveDeduction || "",
          sr_DailyAllowance: foundData.DAllowance || "",
          sr_Active: foundData.Active || "",
          sr_CasualLeave: foundData.CashualLeave || "",
          // sr_Branch:foundData.Address1 || "",
          sr_CommissionStatus: foundData.salescomStatus || "",
          sr_Percent: foundData.commisionper || "",
          sr_Pf: foundData.pf || "",
          sr_WorkingHours: foundData.WorkingHour || "",
          // sr_Ledger:foundData.Address1 || "",
          sr_UserName: foundData.userName || "",
          sr_Password: foundData.password || "",
          // sr_AppEnable:foundData.Address1 || "",
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
  const handleClear = () => {
    fetchEmployeeId();
    setFormData({
      sr_empid: "",
      sr_Name: "",
      sr_Section: "",
      sr_Gender: "",
      sr_Address1: "",
      sr_Address2: "",
      sr_Address3: "",
      sr_Mobile: "",
      sr_Type: "",
      sr_DateOj: "",
      sr_Salary: "",
      sr_OtRate: "",
      sr_OtHour: "",
      sr_LeaveDeduction: "",
      sr_DailyAllowance: "",
      sr_Active: "",
      sr_CasualLeave: "",
      sr_Branch: "",
      sr_CommissionStatus: "",
      sr_Percent: "",
      sr_Pf: "",
      sr_WorkingHours: "",
      sr_Ledger: "",
      sr_UserName: "",
      sr_Password: "",
      sr_AppEnable: "",
    });

    fetchEmployeeNames();
    idInputRef.current.focus();
    setDataFound(false);
    setEditDisabled(true);
    setDeleteDisabled(true);
    setSaveDisabled(false);
  };

  const [employeeId, setEmployeeId] = useState("");

  useEffect(() => {
    const fetchEmployeeId = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/main/getEmployeeId/${dbCode}`);
        //  setEmployeeId(response.data.employeeId.toString()); // Assuming employeeId is a number

        setFormData((prevData) => ({
          ...prevData,
          sr_empid: response.data[0].id,
        }));
      } catch (error) {
        console.error("Error fetching employee ID:", error.message);
      }
    };

    fetchEmployeeId();
  }, []);
  const fetchEmployeeId = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/main/getEmployeeId/${dbCode}`);
      //  setEmployeeId(response.data.employeeId.toString()); // Assuming employeeId is a number

      setFormData((prevData) => ({
        ...prevData,
        sr_empid: response.data[0].id,
      }));
    } catch (error) {
      console.error("Error fetching employee ID:", error.message);
    }
  };
  //////select////
  const handleSelect = (selectedOption, fieldName) => {
    if (selectedOption) {
      setFormData((prevData) => ({
        ...prevData,
        [fieldName]: selectedOption.value,
        [`${fieldName}_label`]: selectedOption.label,
      }));
    }
  };
  const saveButtonRef = useRef(null);
  const idInputRef = useRef(null);
  const nameInputRef = useRef(null);
  const sectionInputRef = useRef(null);
  const genderInputRef = useRef(null);
  const address1InputRef = useRef(null);
  const address2InputRef = useRef(null);
  const address3InputRef = useRef(null);
  const mobileInputRef = useRef(null);
  const typeInputRef = useRef(null);
  const dateOjInputRef = useRef(null);
  const salaryInputRef = useRef(null);
  const otRateInputRef = useRef(null);
  const otHourInputRef = useRef(null);
  const leaveDeductionInputRef = useRef(null);
  const dailyAllowanceInputRef = useRef(null);
  const activecheckBoxInputRef = useRef(null);
  const casualLeaveInputRef = useRef(null);
  const branchInputRef = useRef(null);
  const commissionStatusInputRef = useRef(null);
  const percentInputRef = useRef(null);
  const pfInputRef = useRef(null);
  const workingHoursInputRef = useRef(null);
  const ledgerInputRef = useRef(null);
  const userNameInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const tabsRef = useRef(null);
  const comboRef = useRef(null);
  const cashAccInputRef = useRef(null);

  const [selectedTab, setSelectedTab] = useState("Payroll");
  //////console.log("selected tab =", selectedTab);

  useEffect(() => {
    idInputRef.current.focus();
  }, []);
  // const handleKeyDown = (event, nextInputRef, nextTabKey) => {
  //     ////console.log("inside handle key")
  //     if (event.key === 'Enter' || event.key === 'Return') {
  //         ////console.log("inside first if");
  //       if (nextInputRef || nextInputRef.current) {
  //         ////console.log("inside second if");
  //         nextInputRef.current.focus();
  //         ////console.log('Switching to tab:', nextTabKey);
  //         setSelectedTab(nextTabKey);
  //       }
  //     }
  //   };

  const handleKeyDown = (event, nextInputRef, nextTabKey) => {
    if (event.key === "Enter" || event.key === "Return") {
      nextInputRef.current.focus();
      //  ////console.log("Switching to tab:", nextTabKey);

      setSelectedTab(nextTabKey);
    }
  };

  ////////////////////////////////

  ///combo box ///////

  const handleComboBoxInputChange = (value, fieldName) => {
    // Update the relevant field in the formData state
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: value,
    }));
  };
  const [selectedGender, setSelectedGender] = useState(""); // State variable to track selected gender

  const handleGenderChange = (event) => {
    setSelectedGender(event.target.value); // Update selected gender when a radio button is clicked
  };
  return (
    // <div className="regmodal-overlay">
    <div className={`regmodal `} style={{ width: "700px", height: "530px" }}>
      <div className="schemecontrolls">
        {/* ///////// */}
        <div className="schemereg_headerLogo_Div">
          <div className="schemereg_headerLogo">
            <img src={headeLogo} alt="SherSoftLogo" />
          </div>
          <label className="schemeReg_pageHead">Staff Registration</label>
        </div>
        <img
          alt="X"
          src={toggleClose}
          className="close-icon"
          onClick={onClose}
        />
      </div>

      {/*............................ Navbar.............................................. */}
      <div className="schemeReg_navbar" style={{ height: "7vh" }}>
        <button
          style={{
            border: "none",
            backgroundColor: "transparent",
            marginLeft: "2%",
          }}
          className={`schemeNav_items ${dataFound ? "disabled" : ""}`}
          ref={saveButtonRef}
          onClick={handleSubmit}
          disabled={dataFound || isLoading || saveDisabled}
        >
          <div className="schemeReg_buttonImage">
            <img src={saveImg} alt="SaveImg" />
          </div>
          {isLoading ? "Saving..." : "Save"}
          {/* Save */}
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
          onClick={handleFind}
        >
          <div className="schemeReg_buttonImage">
            <img src={findImg} alt="findImg" />
          </div>
          Find
        </button>
        <button
          style={{ border: "none", backgroundColor: "transparent" }}
          className={`schemeNav_items `}
          onClick={handleEdit}
          disabled={!dataFound || editDisabled}
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
          disabled={!dataFound || deleteDisabled}
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

      <div className="staffRegBody">
        <div className="staffRegBodyRows">
          <label htmlFor="">Employees Id</label>
          <input
            className="emplIdinput"
            ref={idInputRef}
            onKeyDown={(e) => handleKeyDown(e, nameInputRef)}
            value={formData.sr_empid}
            style={{ textAlign: "center" }}
            // readOnly
            onChange={(e) =>
              handleComboBoxInputChange(e.target.value, "sr_empid")
            }
          />
        </div>
        <div className="staffRegBodyRows">
          <label htmlFor="">Employees Name</label>
          <ComboBox
            options={employeeNames}
            comboRef={nameInputRef}
            onKeyDown={(e) => handleKeyDown(e, sectionInputRef)}
            className="emplnameinput"
            inputClassName="staffomboinput"
            onInputChange={(value) =>
              setFormData({ ...formData, sr_Name: value })
            }
            findedValue={
              Array.isArray(formData.sr_Name)
                ? formData.sr_Name[1]
                : formData.sr_Name
            }
          />
          <button className="staffrenamebutton">Rename</button>
        </div>
        <div className="staffRegBodyRows">
          <label htmlFor="">Section</label>
          <input
            type="text"
            className="staffsection"
            style={{ width: "68.1%" }}
            ref={sectionInputRef}
            onKeyDown={(e) => handleKeyDown(e, cashAccInputRef)}
            onChange={(e) =>
              handleComboBoxInputChange(e.target.value, "sr_Section")
            }
            value={formData.sr_Section}
          />
        </div>
        
        <div className="staffRegBodyRows">
          <label htmlFor="">Select Cash Account</label>
          <ComboBox
            findedValue={
              Array.isArray(formData.sr_cashAcc)
                ? formData.sr_cashAcc[1]
                : formData.sr_cashAcc
            }
            className="staffcashAccsection"
            comboRef={cashAccInputRef}
            onKeyDown={(e) => handleKeyDown(e, genderInputRef)}
            onInputChange={(value) =>
              setFormData({ ...formData, sr_cashAcc: value })
            }
            options={selectcashAcc}
          />
        </div>
        <div className="staffRegBodyRows">
          <label htmlFor="">Gender</label>

          <div className="gendersection">
            <label htmlFor="male">
              Male
              <input
                ref={genderInputRef}
                onKeyDown={(e) => handleKeyDown(e, address1InputRef)}
                type="radio"
                name="gender"
                value="Male"
                checked={formData.sr_Gender === "Male"}
                onChange={(e) =>
                  setFormData({ ...formData, sr_Gender: e.target.value })
                }
              />
            </label>
            <label htmlFor="female">
              Female
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={formData.sr_Gender === "Female"}
                onChange={(e) =>
                  setFormData({ ...formData, sr_Gender: e.target.value })
                }
              />
            </label>
          </div>
        </div>

        <div className="staffregTabSection">
          <div className="staffregTabSectionButtonsDiv">
            <button
              style={{
                border: "1px solid #ffff",
                borderTop: "none",
              }}
              onClick={() => setActiveTab("Details")}
              className={activeTab === "Details" ? "active-tab" : ""}
            >
              Details
            </button>
            <button
              style={{
                border: "1px solid #ffffff",
                borderLeft: "none",
                borderTop: "none",
              }}
              onClick={() => setActiveTab("default")}
              className={activeTab === "default" ? "active-tab" : ""}
            >
              Payroll
            </button>

            <button
              style={{
                border: "1px solid #ffff",
                borderTop: "none",
                borderLeft: "none",
              }}
              onClick={() => setActiveTab("Payroll App")}
              className={activeTab === "Payroll App" ? "active-tab" : ""}
            >
              Payroll App
            </button>
          </div>
          {activeTab === "Details" && (
            <div
              className="staffregTab_dataBlock"
              // style={{ backgroundColor: "green" }}
            >
              <div className="staffRegBodyRows">
                <label htmlFor="">Address</label>
                <input
                  type="text"
                  style={{ width: "68.8%" }}
                  className="staffsection"
                  ref={address1InputRef}
                  onKeyDown={(e) => handleKeyDown(e, address2InputRef)}
                  value={formData.sr_Address1}
                  onChange={(e) =>
                    setFormData({ ...formData, sr_Address1: e.target.value })
                  }
                />
              </div>
              <div className="staffRegBodyRows">
                <label htmlFor=""></label>
                <input
                  type="text"
                  style={{ width: "68.8%" }}
                  className="staffsection"
                  ref={address2InputRef}
                  onKeyDown={(e) => handleKeyDown(e, address3InputRef)}
                  value={formData.sr_Address2}
                  onChange={(e) =>
                    setFormData({ ...formData, sr_Address2: e.target.value })
                  }
                />
              </div>
              <div className="staffRegBodyRows">
                <label htmlFor=""></label>
                <input
                  type="text"
                  style={{ width: "68.8%" }}
                  className="staffsection"
                  ref={address3InputRef}
                  onKeyDown={(e) => handleKeyDown(e, mobileInputRef)}
                  value={formData.sr_Address3}
                  onChange={(e) =>
                    setFormData({ ...formData, sr_Address3: e.target.value })
                  }
                />
              </div>
              <div className="staffRegBodyRows">
                <label htmlFor="">Mobile</label>
                <input
                  type="number"
                  style={{ width: "68.8%" }}
                  className="staffsection"
                  ref={mobileInputRef}
                  onKeyDown={(e) => handleKeyDown(e, userNameInputRef)}
                  value={formData.sr_Mobile}
                  onChange={(e) =>
                    setFormData({ ...formData, sr_Mobile: e.target.value })
                  }
                />
              </div>
              <div className="staffRegBodyRows">
                <label htmlFor="">User Name</label>
                <input
                  type="text"
                  className="staffsection"
                  ref={userNameInputRef}
                  value={formData.sr_UserName}
                  onKeyDown={(e) => handleKeyDown(e, passwordInputRef)}
                  onChange={(e) =>
                    setFormData({ ...formData, sr_UserName: e.target.value })
                  }
                  style={{ width: "25%" }}
                />

                <label htmlFor="" style={{ width: "10%" }}>
                  Password
                </label>
                <input
                  type="text"
                  className="staffsection"
                  ref={passwordInputRef}
                  onKeyDown={(e) => handleKeyDown(e, saveButtonRef)}
                  value={formData.sr_Password}
                  onChange={(e) =>
                    setFormData({ ...formData, sr_Password: e.target.value })
                  }
                  style={{ width: "26%" }}
                />
              </div>
            </div>
          )}

          {activeTab === "default" && (
            <div
              className="staffregTab_dataBlock"
              // style={{ backgroundColor: "blue" }}
            >
              <div className="staffRegBodyRows">
                <label htmlFor="">Commission %</label>
                <input
                  type="number"
                  className="staffsection"
                  style={{ width: "20%" }}
                  // ref={mobileInputRef}
                  // onKeyDown={(e) => handleKeyDown(e, userNameInputRef)}
                  value={formData.sr_Percent}
                  onChange={(e) =>
                    setFormData({ ...formData, sr_Percent: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          {activeTab === "Payroll App" && (
            <div
              className="staffregTab_dataBlock"
              // style={{ backgroundColor: "green" }}
            ></div>
          )}
        </div>
      </div>
    </div>
    // </div>
  );
}

export default StaffReg;
