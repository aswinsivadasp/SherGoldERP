import React, { useState, useEffect, useRef } from "react";
import "../styles/SchemeRegistrationMob.css";
import sslogo from "../assets/images/ssMob.png";
//import ComboBox from "shersoft-combov1";
import ComboBox from "./ComboBox";
import toggle from "../assets/images/MobToggle.png";
import save from "../assets/images/SaveImage.png";
import find from "../assets/images/findMob.png";
import edit from "../assets/images/Editing.png";
import Delete from "../assets/images/Delete.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { useDbContext } from "../context/DbContext";


function SchemeRegistrationMob() {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const { dbCode } = useDbContext();

  const [dataFound, setDataFound] = useState(false);
  const navigate = useNavigate();

  const [showFind, setShowFind] = useState(true);
  const handleFindClick = () => {
    setShowFind(!showFind); // Toggle the value of showFind
   // ////console.log("find clicked");
  };

  const accountNameInputRef = useRef(null);
  const agentNameInputRef = useRef(null);
  const saveButtonRef = useRef(null);
  const entryNoInputRef = useRef(null);
  const durationInputRef = useRef(null);
  const accountNoInputRef = useRef(null);
  const address1InputRef = useRef(null);
  const address2InputRef = useRef(null);
  const cityInputRef = useRef(null);
  const pincodeInputRef = useRef(null);
  const contactPersonInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const telNoInputRef = useRef(null);
  const mobNoInputRef = useRef(null);
  const narrationInputRef = useRef(null);
  const amountInputRef = useRef(null);
  const rateInputRef = useRef(null);
  const gmInputRef = useRef(null);
  const dateInputRef = useRef(null);
  const searchButtonRef = useRef(null);
  const handleKeyDown = (event, nextInputRef) => {
    if (event.key === "Enter" || event.key === "Return") {
      nextInputRef.current.focus();
    }
  };
  const handleBlur = (currentRef, nextInputRef) => {
    if (nextInputRef && nextInputRef.current) {
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
  const [schemeRegData, setschemeRegData] = useState({
    entryNo: "",
    date: getCurrentDate(),
    accountName: "",
    agent: "",
    duration: "",
    accountNo: "",
    add1: "",
    add2: "",
    city: "",
    pincode: "",
    contactPerson: "",
    mobile: "",
    email: "",
    tele: "",
    narration: "",
    amount: 0,
    rate: "",
    gm: "",
  });
  const [gmvalue, setgmvalue] = useState("");
 // ////console.log("gvalue =====", gmvalue);
  const calculateGm = () => {
  //  ////console.log("function is called");
    const amount = parseFloat(schemeRegData.amount);
    const rate = parseFloat(schemeRegData.rate);
   // ////console.log("amount", amount);
    //////console.log("rate", rate);
    if (!isNaN(amount) && !isNaN(rate) && rate !== 0) {
     // ////console.log("calculation initiated");

      const gmValue = amount / rate;
      setgmvalue(gmValue);
      setschemeRegData((prevData) => ({
        ...prevData,
        gm: gmValue.toFixed(3),
      }));
    } else {
      setschemeRegData((prevData) => ({
        ...prevData,
        gm: "", // Clear the "gm" value as well
      }));
    }
  };

  useEffect(() => {
    calculateGm();
  }, [schemeRegData.amount, schemeRegData.rate]);
  // const fetchUpdatedAccountNames = async () => {
  //   try {
  //     const response = await axios.get(`${apiBaseUrl}/accountNames`);
  //     const schemeDet = response.data;
  //     const AccNames = schemeDet.map((item) => item.accname);
  //     setANames(AccNames);
  //   } catch (error) {
  //     console.error("Error fetching updated account names:", error.message);
  //   }
  // };

  const fetchUpdatedAccountNames = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/accountNames/${dbCode}`);
      const schemeDet = response.data;
      const AccNames = schemeDet.map((item) => [item.Ledcode, item.LedName]);
      setANames(AccNames);
    } catch (error) {
      console.error("Error fetching updated account names:", error.message);
    }
  };

  // const [employeeNames, setEmployeeNames] = useState([]);

  // useEffect(() => {
  //     const fetchEmployeeNames = async () => {
  //         try {
  //             const response = await axios.get(`${apiBaseUrl}/getEmployeeNames`);

  //             setEmployeeNames(response.data);
  //         } catch (error) {
  //             console.error('Error fetching employee names:', error.message);
  //         }
  //     };

  //     fetchEmployeeNames();
  // }, []);

  /*"here i created a combobx to get the id of the selected option to store to the database.
  specifications of the combobox:-to the corresponding id also i created a special combobox with the required funtionality.
  we need to pass the options in the form of arrays each array of options contain its id/primarykeyvalue and corresponding value.
  the positon of the values in the array is important.becuase the value of the first index is willl be displayed in the dropdown as options.
  Also we need to ensue that while saving the id which is in the o th index only passin g to the database.

  "*/
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

  const [regcustomers, setregcustomers] = useState([]);

  useEffect(() => {
    const fetchschregisteredcustomers = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/registeredcustomers/${dbCode}`);

        const Names = response.data.map((item) => item.accname);

        setregcustomers(Names);
      } catch (error) {
        console.error("Error fetching sch reg names:", error.message);
      }
    };

    fetchschregisteredcustomers();
  }, []);

  const fetchupdschregisteredcustomers = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/registeredcustomers/${dbCode}`);

      const Names = response.data.map((item) => item.accname);

      setregcustomers(Names);
    } catch (error) {
      console.error("Error fetching sch reg names:", error.message);
    }
  };

 // ////console.log(schemeRegData);
  const handleClear = () => {
    setschemeRegData({
      entryNo: sch_entryno,
      date: getCurrentDate(),
      accountName: "",
      agent: "",
      duration: "",
      accountNo: "",
      add1: "",
      add2: "",
      city: "",
      pincode: "",
      contactPerson: "",
      mobile: "",
      email: "",
      tele: "",
      narration: "",
      amount: 0,

      // Clear the "gm" value as well
    });
    // Reset dataFound state
    setDataFound(false);
    fetchSchCurrentRate();
    // Calculate gm value after clearing the fields
    calculateGm();
  };

  const [sch_entryno, setsch_entryno] = useState("");

  //////////////////////////functionalities//////////////////
  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleSubmit = async () => {
    try {
      {
        if (schemeRegData.accountName == "") {
          alert("enter data correctly");
        } else if (schemeRegData.email && !validateEmail(schemeRegData.email)) {
          alert("Invalid email address");
        } else if (!customernames.includes(schemeRegData.accountName[0])) {
          // Display an alert for duplicate entry
          alert("Customer is not registered");
        } else if (regcustomers.includes(schemeRegData.accountName[0])) {
          alert("duplicate entry");
        } else {
          const updatedSchemeRegData = {
            ...schemeRegData,
            agent: schemeRegData.agent[0],
            accountName: schemeRegData.accountName[0],
          };
          // Make a POST request to your server with the form data
          const response = await axios.post(
            `${apiBaseUrl}/insertScheme/${dbCode}`,
            updatedSchemeRegData
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

            fetchSchEntryno();
            alert("Account registered");
            // window.location.reload();
            handleClear();
          } else {
            // Handle other response statuses or errors
            console.error("Error submitting data:", response.data);
          }
        }
      }
      await fetchupdschregisteredcustomers();
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("Error:", error.message);
    }
  };

  const [AcNames, setANames] = useState([]);
  // ////console.log(AcNames);
  // Replace the useEffect hooks as shown below

  useEffect(() => {
    const fetchSchEntryno = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/Sch_entryno/${dbCode}`);
        const schemeentryNo = response.data.map((item) => item[""]);
        setschemeRegData((prevData) => ({
          ...prevData,
          entryNo: schemeentryNo[0],
        }));
      } catch (error) {
        console.error("Error fetching entry no:", error.message);
      }
    };

    fetchSchEntryno();
  }, [apiBaseUrl]);

  const fetchSchEntryno = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/Sch_entryno/${dbCode}`);
      const schemeentryNo = response.data.map((item) => item[""]);
      setschemeRegData((prevData) => ({
        ...prevData,
        entryNo: schemeentryNo[0],
      }));
    } catch (error) {
      console.error("Error fetching entry no:", error.message);
    }
  };

  // useEffect(() => {
  //   const fetchAccountNames = async () => {
  //     try {
  //       const response = await axios.get(`${apiBaseUrl}/accountNames`);
  //       const schemeDet = response.data;
  //       const AccNames = schemeDet.map((item) => item.accname);
  //       setANames(AccNames);
  //     } catch (error) {
  //       console.error("Error fetching names Values:", error.message);
  //     }
  //   };

  //   fetchAccountNames();
  // }, [apiBaseUrl]);

  const [customernames, setCustomersNames] = useState([]);
  useEffect(() => {
    const fetchAccountNames = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/accountNames/${dbCode}`);
        const schemeDet = response.data;
        const AccNames = schemeDet.map((item) => [item.Ledcode, item.LedName]);
        const cnames = schemeDet.map((item) => item.Ledcode);
        setANames(AccNames);
        setCustomersNames(cnames);
      } catch (error) {
        console.error("Error fetching names Values:", error.message);
      }
    };

    fetchAccountNames();
  }, [apiBaseUrl]);

  useEffect(() => {
    const fetchSchCurrentRate = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/currentgoldRate/${dbCode}`);
        const currentrate = response.data[0]?.currentRate;
        setschemeRegData((prevData) => ({ ...prevData, rate: currentrate }));
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
      setschemeRegData((prevData) => ({ ...prevData, rate: currentrate }));
    } catch (error) {
      console.error("Error fetching names Values:", error.message);
    }
  };

  const handleFind = async () => {
    try {
      if (regcustomers.includes(schemeRegData.accountName[0])) {
        // Display an alert for duplicate entry

        // Make a GET request to your server with the selected name for finding data
        const response = await axios.get(
          `${apiBaseUrl}/findbyAccname/${schemeRegData.accountName[0]}/${dbCode}`
        );

        // Check the response status and handle accordingly
        if (response.status === 200) {
          // Data retrieved successfully, update the form data
          const foundData = response.data[0]; // Assuming the response is an array with one item
          // ////console.log("data =", foundData);

          const formattedDate = new Date(foundData.Date)
            .toISOString()
            .split("T")[0];
          setschemeRegData({
            ...schemeRegData,
            entryNo: foundData.entryno,
            date: formattedDate,
            accountName: AcNames.find((item) => item[0] === foundData.accname),
            agent: employeeNames.find((item) => item[0] === foundData.agent),
            duration: foundData.duration,
            accountNo: foundData.accno,
            add1: foundData.Address1,
            add2: foundData.Address2,
            city: foundData.City,
            pincode: foundData.pin,
            contactPerson: foundData.contactperson,
            mobile: foundData.mobileNo,
            email: foundData.email,
            tele: foundData.phoneNo,
            narration: foundData.NARRATION,
            amount: foundData.Amount,
            rate: foundData.rate,
            gm: foundData.grm,
            // sr_AppEnable:foundData.Address1 || foundData,
          });
          setDataFound(true);
          setShowFind(false);
        } else {
          // Handle other response statuses or errors
          console.error("Error retrieving data:", response.data);
          setDataFound(false);
        }
      } else {
        if (schemeRegData.accountName === "") {
          alert("Select an Account Name");
        } else {
          alert("Account Not Registered");
        }
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("Error:", error.message);
      setDataFound(false);
    }
  };
  /////////////////////////////////////

  const handleSearchByAccountNo = async () => {
    try {
      const response = await axios.get(
        `${apiBaseUrl}/findbyAccno/${schemeRegData.accountNo}/${dbCode}`
      );

      if (response.status === 200) {
        const foundData = response.data[0];
        // ////console.log("data =", foundData);
        const formattedDate = new Date(foundData.Date)
          .toISOString()
          .split("T")[0];
        setschemeRegData({
          ...schemeRegData,
          entryNo: foundData.entryno,
          date: formattedDate,
          accountName: AcNames.find((item) => item[0] === foundData.accname),
          agent: employeeNames.find((item) => item[0] === foundData.agent),
          duration: foundData.duration,
          accountNo: foundData.accno,
          add1: foundData.Address1,
          add2: foundData.Address2,
          city: foundData.City,
          pincode: foundData.pin,
          contactPerson: foundData.contactperson,
          mobile: foundData.mobileNo,
          email: foundData.email,
          tele: foundData.phoneNo,
          narration: foundData.NARRATION,
          amount: foundData.Amount,
          rate: foundData.rate,
          gm: foundData.grm,
          // sr_AppEnable:foundData.Address1 || foundData,
        });
        setDataFound(true);
        setShowFind(false);
        // Update state or perform other actions with foundData
      } else {
        console.error("Error finding data:", response.data);
      }
    } catch (error) {
      console.error("Error:", error.message);
      setDataFound(false);
    }
  };

  ////////update/////

  const handleUpdate = async () => {
    try {
      if (schemeRegData.email && !validateEmail(schemeRegData.email)) {
        alert("Invalid email address");
      } else if (dataFound == true) {
        // Make a POST request to your server with the form data

        const updatedSchemeRegData = {
          ...schemeRegData,
          agent: schemeRegData.agent[0],
          accountName: schemeRegData.accountName[0],
        };
       // ////console.log("up", updatedSchemeRegData);
        const response = await axios.post(
          `${apiBaseUrl}/updateScheme/${dbCode}`,
          updatedSchemeRegData
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
          alert("Account Edited");
          // window.location.reload();
          handleClear();
        } else {
          // Handle other response statuses or errors
          console.error("Error submitting data:", response.data);
        }
      }
      await fetchupdschregisteredcustomers();
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("Error:", error.message);
    }
  };
  //////delete/////
  const handleDelete = async () => {
    try {
      if (schemeRegData.accountName === "") {
        alert("please select an  Account Name");
      } else {
        const response = await axios.delete(
          `${apiBaseUrl}/deletebyAccname/${schemeRegData.accountName[0]}/${dbCode}`
        );
        if (response.status === 200) {
          // Swal.fire({
          //   position: "top-end",
          //   icon: "success",
          //   title: "Scheme deleted",
          //   showConfirmButton: false,
          //   timer: 2000,
          // });
          fetchSchEntryno();
          alert("Account Deleted Successfully!");
          window.location.reload();
          setShowFind(false);
        } else {
          console.error("Error deleting data:", response.data);
        }
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <div className="SchemeRegistrationMobRoot">
      <div className="SchemeRegistrationMobnavBar">
        <div
          className="SchemeRegistrationMobnavBartoggle"
          onClick={() => navigate("/home")}
        >
          <img src={toggle} alt="#" />
        </div>
        <div className="schemeMobshesofttag">
          <img src={sslogo} alt="SS" />
          <label className="schemeMobshesofttaglabel">
            Scheme Registration
          </label>
        </div>
        {showFind ? (
          <div className="SchemeRegistrationMobnavBaritems">
            <div
              className="SchemeRegistrationMobnavBaritemsbuttons"
              onClick={handleSubmit}
            >
              <img
                src={save}
                alt="Save"
                className="SchemeRegistrationMobsavebutton"
              />
            </div>
            <div
              className="SchemeRegistrationMobnavBaritemsbuttons"
              // onClick={handleFindClick,handleFind}
              onClick={() => {
                // handleFindClick();
                handleFind();
              }}
            >
              <img
                src={find}
                alt="Find"
                className="SchemeRegistrationMobfindbutton"
              />
            </div>
          </div>
        ) : (
          <div className="SchemeRegistrationMobnavBaritems">
            <div
              className="SchemeRegistrationMobnavBaritemsbuttons"
              onClick={handleUpdate}
            >
              <img
                src={edit}
                alt="Edit"
                className="SchemeRegistrationMobsavebutton"
              />
            </div>
            <div
              className="SchemeRegistrationMobnavBaritemsbuttons"
              onClick={handleDelete}
            >
              <img
                src={Delete}
                alt="Delete"
                className="SchemeRegistrationMobfindbutton"
              />
            </div>
          </div>
        )}
      </div>
      <div className="SchemeRegistrationMobBody">
        <div className="SchemeRegistrationMobBodypart1">
          <div className="SchemeRegistrationMobBodypart1innerDiv">
            <div className="SchemeRegistrationMobBodypart1innerDivRow">
              <div className="SchemeRegistrationMobBodypart1innerDivRowpartentynoParent">
                <div className="SchemeRegistrationMobBodypart1innerDivRowpartentyno">
                  <label className="schEntyNoLabel">Entry No</label>
                  <input
                    readOnly
                    style={{ textAlign: "center" }}
                    className="schEntyNoinput"
                    ref={entryNoInputRef}
                    value={schemeRegData.entryNo}
                  />
                </div>
                <div className="SchemeRegistrationMobBodypart1innerDivRowpartentyno">
                  <label className="schDateLabel">Date</label>
                  <input
                    value={schemeRegData.date}
                    type="Date"
                    className="schDateinput"
                    ref={dateInputRef}
                    onKeyDown={(e) => handleKeyDown(e, accountNameInputRef)}
                    onBlur={() =>
                      handleBlur(entryNoInputRef, accountNameInputRef)
                    }
                    onChange={(e) =>
                      setschemeRegData({
                        ...schemeRegData,
                        date: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="SchemeRegistrationMobBodypart1innerDivRow">
              <label className="schAccName">Account Name</label>
              <ComboBox
                // findedValue={schemeRegData.accountName}
                findedValue={
                  Array.isArray(schemeRegData.accountName)
                    ? schemeRegData.accountName[1]
                    : schemeRegData.accountName
                }
                comboRef={accountNameInputRef}
                options={AcNames}
                className="schAccNameinput"
                inputClassName="schAccNameinputClassnameCombo"
                onKeyDown={(e) => handleKeyDown(e, agentNameInputRef)}
                onInputChange={(value) =>
                  setschemeRegData({ ...schemeRegData, accountName: value })
                }
              />
            </div>
            <div className="SchemeRegistrationMobBodypart1innerDivRow">
              <label className="schAccName">Agent</label>
              <ComboBox
                // findedValue={schemeRegData.agent}
                findedValue={
                  Array.isArray(schemeRegData.agent)
                    ? schemeRegData.agent[1]
                    : schemeRegData.agent
                }
                className="schAccNameinput"
                inputClassName="schAccNameinputClassnameCombo"
                options={employeeNames}
                comboRef={agentNameInputRef}
                onKeyDown={(e) => handleKeyDown(e, durationInputRef)}
                // onBlur={() => handleBlur(entryNoInputRef, durationInputRef)}
                onInputChange={(value) =>
                  setschemeRegData({ ...schemeRegData, agent: value })
                }
              />
            </div>
            <div className="SchemeRegistrationMobBodypart1innerDivRow">
              <div className="schDurationparentDiv">
                <label>Duration</label>
                <input
                  value={schemeRegData.duration}
                  type="number"
                  className="schDurInput"
                  placeholder="IN MONTHS"
                  ref={durationInputRef}
                  onKeyDown={(e) => handleKeyDown(e, accountNoInputRef)}
                  onBlur={() => handleBlur(entryNoInputRef, accountNoInputRef)}
                  onChange={(e) =>
                    setschemeRegData({
                      ...schemeRegData,
                      duration: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="SchemeRegistrationMobBodypart1innerDivRow">
              <div className="schAccNoParentDiv">
                <div className="schAccNoParentDivpart1">
                  <label>Account Number</label>
                  <input
                    value={schemeRegData.accountNo}
                    type="number"
                    className="schAccNoPart1input"
                    ref={accountNoInputRef}
                    onKeyDown={(e) => handleKeyDown(e, address1InputRef)}
                    onBlur={() => handleBlur(entryNoInputRef, address1InputRef)}
                    onChange={(e) =>
                      setschemeRegData({
                        ...schemeRegData,
                        accountNo: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="schAccNoParentDivbutton">
                  <button
                    className="schSearchButton"
                    ref={searchButtonRef}
                    onClick={handleSearchByAccountNo}
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="SchemeRegistrationMobBodypart2">
          <div className="SchemeRegistrationMobBodypart2innerDiv">
            <div className="SchemeRegistrationMobBodypart2innerDivRow">
              <label>Address 1</label>
              <input
                value={schemeRegData.add1}
                className="schAddr1input"
                ref={address1InputRef}
                onKeyDown={(e) => handleKeyDown(e, address2InputRef)}
                onChange={(e) =>
                  setschemeRegData({ ...schemeRegData, add1: e.target.value })
                }
              />
            </div>
            <div className="SchemeRegistrationMobBodypart2innerDivRow">
              <label>Address 2</label>
              <input
                value={schemeRegData.add2}
                className="schAddr1input"
                ref={address2InputRef}
                onKeyDown={(e) => handleKeyDown(e, cityInputRef)}
                onChange={(e) =>
                  setschemeRegData({ ...schemeRegData, add2: e.target.value })
                }
              />
            </div>
            <div className="SchemeRegistrationMobBodypart2innerDivRow">
              <div className="SchemeRegistrationMobBodypart2innerDivRowparentdiv">
                <div className="SchemeRegistrationMobBodypart2innerDivRowcol">
                  <label>City/Town</label>
                  <input
                    value={schemeRegData.city}
                    className="schCityinput"
                    ref={cityInputRef}
                    onKeyDown={(e) => handleKeyDown(e, pincodeInputRef)}
                    onChange={(e) =>
                      setschemeRegData({
                        ...schemeRegData,
                        city: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="SchemeRegistrationMobBodypart2innerDivRowcol">
                  <label className="schpincodelabel">Pincode</label>
                  <input
                    type="number"
                    value={schemeRegData.pincode}
                    className="schpincodeinput"
                    ref={pincodeInputRef}
                    onKeyDown={(e) => handleKeyDown(e, contactPersonInputRef)}
                    onChange={(e) =>
                      setschemeRegData({
                        ...schemeRegData,
                        pincode: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="SchemeRegistrationMobBodypart2innerDivRow">
              <div className="SchemeRegistrationMobBodypart2innerDivRowparentdiv">
                <div className="SchemeRegistrationMobBodypart2innerDivRowcol">
                  <label>Contact Person</label>
                  <input
                    value={schemeRegData.contactPerson}
                    className="schCityinput"
                    ref={contactPersonInputRef}
                    onKeyDown={(e) => handleKeyDown(e, mobNoInputRef)}
                    onChange={(e) =>
                      setschemeRegData({
                        ...schemeRegData,
                        contactPerson: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="SchemeRegistrationMobBodypart2innerDivRowcol">
                  <label className="schpincodelabel">Mobile</label>
                  <input
                    value={schemeRegData.mobile}
                    type="number"
                    className="schpincodeinput"
                    ref={mobNoInputRef}
                    onKeyDown={(e) => handleKeyDown(e, emailInputRef)}
                    onChange={(e) =>
                      setschemeRegData({
                        ...schemeRegData,
                        mobile: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="SchemeRegistrationMobBodypart2innerDivRow">
              <div className="SchemeRegistrationMobBodypart2innerDivRowparentdiv">
                <div className="SchemeRegistrationMobBodypart2innerDivRowcol">
                  <label>Email</label>
                  <input
                    value={schemeRegData.email}
                    type="email"
                    id="email"
                    name="email"
                    pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                    required
                    className="schCityinput"
                    ref={emailInputRef}
                    onKeyDown={(e) => handleKeyDown(e, telNoInputRef)}
                    onChange={(e) =>
                      setschemeRegData({
                        ...schemeRegData,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="SchemeRegistrationMobBodypart2innerDivRowcol">
                  <label className="schpincodelabel">Telephone</label>
                  <input
                    value={schemeRegData.tele}
                    type="number"
                    className="schpincodeinput"
                    ref={telNoInputRef}
                    onKeyDown={(e) => handleKeyDown(e, narrationInputRef)}
                    onBlur={() => handleBlur(telNoInputRef, narrationInputRef)}
                    onChange={(e) =>
                      setschemeRegData({
                        ...schemeRegData,
                        tele: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="SchemeRegistrationMobBodypart3">
          <div className="SchemeRegistrationMobBodypart3innerDiv">
            <div className="SchemeRegistrationMobBodypart3innerDivRow">
              <label>Narration</label>
              <input
                value={schemeRegData.narration}
                type="text"
                className="schNarrationinput"
                ref={narrationInputRef}
                onKeyDown={(e) => handleKeyDown(e, amountInputRef)}
                onChange={(e) =>
                  setschemeRegData({
                    ...schemeRegData,
                    narration: e.target.value,
                  })
                }
              />
            </div>
            <div className="SchemeRegistrationMobBodypart3innerDivRow">
              <div className="SchemeRegistrationMobBodypart3innerDivRowparent">
                <div className="SchemeRegistrationMobBodypart3innerDivRowcol">
                  <label>Amount</label>
                  <input
                    value={schemeRegData.amount}
                    type="number"
                    className="schAmtinput"
                    placeholder="Rs."
                    ref={amountInputRef}
                    onKeyDown={(e) => handleKeyDown(e, rateInputRef)}
                    onChange={(e) =>
                      setschemeRegData({
                        ...schemeRegData,
                        amount: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="SchemeRegistrationMobBodypart3innerDivRowcol">
                  <label className="schRatelabel">Rate</label>
                  <input
                    readOnly
                    value={schemeRegData.rate}
                    type="number"
                    className="schRateinput"
                    ref={rateInputRef}
                    onKeyDown={(e) => handleKeyDown(e, gmInputRef)}
                    onChange={(e) =>
                      setschemeRegData({
                        ...schemeRegData,
                        rate: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="SchemeRegistrationMobBodypart3innerDivRow">
              <div className="SchemeRegistrationMobBodypart3innerDivRowcol">
                <label>Gm</label>
                <input
                  value={schemeRegData.gm}
                  type="number"
                  className="schAmtinput"
                  ref={gmInputRef}
                  onChange={(e) =>
                    setschemeRegData({ ...schemeRegData, gm: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SchemeRegistrationMob;
