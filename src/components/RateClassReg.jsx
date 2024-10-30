import React, { useRef, useEffect, useState } from "react";
import "../styles/SchemeRegistration.css";
import "../styles/RateClassReg.css";
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
import { useDbContext } from "../context/DbContext";

function RateClassReg({ onClose }) {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const { dbCode } = useDbContext();

  const rateClassInputRef = useRef(null);
  const touchpercInputRef = useRef(null);
  const savebtnRef = useRef(null);


  const [editDisabled, setEditDisabled] = useState(true);
  const [deleteDisabled, setDeleteDisabled] = useState(true);
  const [saveDisabled, setSaveDisabled] = useState(false);

  const [rateClassData, setRateClassData] = useState({
    rateClass: "",
    touchperc: 0,
  });
  const [rateclassid, setrateclassid] = useState("");
  // ////console.log("rateclassid", rateclassid);
  const selectedid = (e) => {
    if (Array.isArray(e)) {
      setrateclassid(e[0]);
    }
  };

  // ////console.log("rateClassData", rateClassData);
  //////////agent name///////////////

  const [rateClass, setRateClass] = useState([]);
  const [rateClassalldata, setRateClassalldata] = useState([]);

  
    // ////console.log("rateclasses==",rateClass);

  useEffect(() => {
    const fetchrateClass = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/selectall/${dbCode}`);

        const rateClass = response.data;
        setRateClassalldata(rateClass)

        const transformedData = rateClass.map((item) => [
          item.id,
          item.rateClass,
        ]);
        setRateClass(transformedData);
      } catch (error) {
        console.error("Error fetching rateClass Values:", error.message);
      }
    };

    fetchrateClass();
  }, [apiBaseUrl]);

  const fetchrateClass = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/selectall/${dbCode}`);

      const rateClass = response.data;
      setRateClassalldata(rateClass)

      const transformedData = rateClass.map((item) => [
        item.id,
        item.rateClass,
      ]);
      setRateClass(transformedData);
    } catch (error) {
      console.error("Error fetching rateClass Values:", error.message);
    }
  };

  const handleKeyDown = (event, nextInputRef) => {
    if (event.key === "Enter" || event.key === "Return") {
      nextInputRef.current.focus();
    }
  };
  useEffect(() => {
    rateClassInputRef.current.focus();
  }, []);

  const handleClear = () => {
    setRateClassData({
      rateClass: "",
      touchperc: 0,
    });
    fetchrateClass();
    rateClassInputRef.current.focus();
    setrateclassid("");
  };

  const handleSubmit = async () => {
    setSaveDisabled(true);
    if (!rateClassData.rateClass) {
      setSaveDisabled(false);
      alert("Enter Data Correctly");
     
      return;
    }
   

    if (Array.isArray(rateClassData.rateClass)) {
      setSaveDisabled(false);
      alert("Duplicate entry");
     
      return;
    }
    const isDuplicate = rateClass.some(
      (item) => item[1].toLowerCase() === rateClassData.rateClass.toLowerCase()
    );
  
    if (isDuplicate) {
      setSaveDisabled(false);
      alert("Duplicate entry");
      return;
      
    }
    try {
      {
        setSaveDisabled(true);

        // Make a POST request to your server with the form data
        const response = await axios.post(
          `${apiBaseUrl}/insertrateclass/${dbCode}`,
          rateClassData
        );

        // Check the response status and handle accordingly
        if (response.status === 200) {
          alert("Record Saved");
          handleClear();
          setSaveDisabled(false);

        } else {
          // Handle other response statuses or errors
          console.error("Error submitting data:", response.data);
          alert("Error submitting data:");
          setSaveDisabled(false);

        }
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("Error:", error.message);
      alert("Error submitting data:", error.message);
      setSaveDisabled(false);

    }
  };

  const handleEdit = async () => {
    if (rateclassid == "") {
      alert("Name Not Found");
      return;
    }
    if (!rateClassData.rateClass) {
      alert("Enter Data Correctly");
      return;
    }
   
    try {
      const response = await axios.post(
        `${apiBaseUrl}/updaterateclass/${rateclassid}/${dbCode}`,
        rateClassData
      );
      if (response.status === 200) {
        handleClear();
        alert("Entry Edited");
      } else {
        console.error("Error updating data:", response.data);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
    fetchrateClass();
  };

  //////delete/////
  const handleDelete = async () => {
    try {
      if (!Array.isArray(rateClassData.rateClass)) {
        alert("Name Not Found");
        return;
      }
      const response = await axios.delete(
        `${apiBaseUrl}/spdeleterateclass/${rateClassData.rateClass[0]}/${dbCode}`
      );
      if (response.status === 200) {
        // Swal.fire({
        //   position: "top-end",
        //   icon: "success",
        //   title: "Scheme deleted",
        //   showConfirmButton: false,
        //   timer: 2000,
        // });
        alert(" Record Deleted");
        // window.location.reload();
        handleClear();
      } else {
        console.error("Error deleting data:", response.data);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };



  const handleRateClassChange = (selectedRateClass) => {
 
    setRateClassData({ ...rateClassData, rateClass: selectedRateClass });
    selectedid(selectedRateClass);
    const selectedRateClassData = rateClassalldata.find(
      (item) => item.rateClass === selectedRateClass[1]
    );
    if (selectedRateClassData) {
      setRateClassData((prevData) => ({
        ...prevData,
        touchperc: selectedRateClassData.touchPercent==null?0:selectedRateClassData.touchPercent,

      }));
    }
  };

  return (
    <div className="regmodal rateclassmodal">
      <div className="report_dialogHead rateclassHead">
        <div className="report_dialogHeadpart">
          <img src={ssLogo} alt="SS" />
          <label>Rate Class Registration</label>
        </div>
        <div className="report_dialogHeadControlls">
          <button className="controllsbuttons xbutton" onClick={onClose}>
            <img src={close} alt="X" />
          </button>
        </div>
      </div>

      {/*............................ Navbar.............................................. */}
      <div className="schemeReg_navbar rateClassNavbar">
        <button
          style={{
            border: "none",
            backgroundColor: "transparent",
            marginLeft: "2%",
          }}
          className={`schemeNav_items }`}
          ref={savebtnRef}
          onClick={handleSubmit}

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
          onClick={handleClear}
        >
          <div className="schemeReg_buttonImage">
            <img src={clearImg} alt="clearImg" />
          </div>
          Clear
        </button>

        <button
          style={{ border: "none", backgroundColor: "transparent" }}
          className={`schemeNav_items }`}
          onClick={handleEdit}

          // disabled={editDisabled}
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

          // disabled={deleteDisabled}
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
      </div>
      {/*............................ NavbarEnd.............................................. */}

      <div className="rateClassBody">
        <div className="rateClassrow">
          <label htmlFor="">Rate Class</label>
          <ComboBox
            findedValue={
              Array.isArray(rateClassData.rateClass)
                ? rateClassData.rateClass[1]
                : rateClassData.rateClass
            }
            comboRef={rateClassInputRef}
            options={rateClass}
            className="rateClassinput"
            onKeyDown={(e) => handleKeyDown(e, touchpercInputRef)}
            onInputChange={(e) => handleRateClassChange(e)}
          />
        </div>
        <div className="rateClassrow">
          <label htmlFor="">Touch % (Purity) </label>
          <input
         
            value={rateClassData.touchperc}
            ref={touchpercInputRef}
            style={{textAlign:'right'}}
            className="touchperc"
            onKeyDown={(e) => handleKeyDown(e, savebtnRef)}
            onChange={(e) => {
              setRateClassData({ ...rateClassData, touchperc: e.target.value });
            }}
          />
          <input
            style={{ width: "10%", display: "none" }}
            disabled
            value={rateclassid}
          />
        </div>
      </div>
    </div>
  );
}

export default RateClassReg;
