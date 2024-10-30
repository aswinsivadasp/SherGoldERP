import React, { useState, useRef, useEffect } from "react";
import "../styles/SchemeRegistration.css";
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
//import ComboBox from "shersoft-combov1";
import ComboBox from "./ComboBox";
import toggleClose from "../assets/images/xred.webp";
import io from "socket.io-client";

import axios from "axios";
import Swal from "sweetalert2";
import { Alert, AlertTitle } from "@mui/material";
import { useDbContext } from "../context/DbContext";
function SchemeRegistration({ onClose, Open }) {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const { dbCode } = useDbContext();

  const [minimized, setMinimized] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [dataFound, setDataFound] = useState(false);

  const [editDisabled, setEditDisabled] = useState(true);
  const [deleteDisabled, setDeleteDisabled] = useState(true);
  const [saveDisabled, setSaveDisabled] = useState(false);

  const toggleMinimize = () => {
    setMinimized(!minimized);
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
  const intperRef = useRef(null);

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

  //////entry no////

  const [sch_entryno, setSchEntryNo] = useState("");

  //  ////console.log("sch_entryno=", sch_entryno);
  // Replace the useEffect hooks as shown below

  useEffect(() => {
    const fetchSchEntryno = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/Sch_entryno/${dbCode}`);
        //  ////console.log("response =", response);
        const schemeentryNo = response.data.map((item) => item[""]);

        setschemeRegData((prevData) => ({
          ...prevData,
          entryNo: schemeentryNo[0],
          accountNo: `00${schemeentryNo[0]}`,
        }));
        // setSchEntryNo(schemeentryNo[0] );
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
        accountNo: `00${schemeentryNo[0]}`,
      }));
      setSchEntryNo(schemeentryNo[0]);
    } catch (error) {
      console.error("Error fetching entry no:", error.message);
    }
  };

  const fetchSchEntryno2 = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/Sch_entryno/${dbCode}`);
      const schemeentryNo = response.data.map((item) => item[""]);

      setschemeRegData((prevData) => ({
        ...prevData,
        entryNo: schemeentryNo[0],
        // accountNo: `00${schemeentryNo[0]}`,
      }));
      setSchEntryNo(schemeentryNo[0]);
    } catch (error) {
      console.error("Error fetching entry no:", error.message);
    }
  };

  useEffect(() => {
    // Connect to the WebSocket server
    const socket = io(apiBaseUrl); // Make sure the URL matches your backend server
    socket.on("entrynoUpdated", () => {
      //   ////console.log('Data updated, fetching new data...');
      fetchSchEntryno2(); // Re-fetch the data when an update is detected
    });

    return () => {
      socket.disconnect(); // Clean up the socket connection on component unmount
      //   ////console.log("socketdisconneccted");
    };
  }, [apiBaseUrl]);

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
      backtrackfocus();
    };

    fetchAccountNames();

    const socket = io(apiBaseUrl); // Make sure the URL matches your backend server
    socket.on("dataUpdated", () => {
      //   ////console.log('Data updated, fetching new data...');
      fetchAccountNames();
    });

    return () => {
      socket.disconnect(); // Clean up the socket connection on component unmount
      //   ////console.log("socketdisconneccted");
    };
  }, [apiBaseUrl]);

  const backtrackfocus = () => {
    const ref = sessionStorage.getItem("accountNameInputRef");

    if (ref) {
      accountNameInputRef.current.focus();
    }

    sessionStorage.removeItem("accountNameInputRef");
  };

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
  ///////
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
    gm: 0.0,
    intperc: "",
  });
  // ////console.log(schemeRegData);
  const [gmvalue, setgmvalue] = useState("");
  // ////console.log("gvalue =====", gmvalue);
  const calculateGm = () => {
    // ////console.log("function is called");
    const amount = parseFloat(schemeRegData.amount);
    const rate = parseFloat(schemeRegData.rate);
    // ////console.log("amount", amount);
    // ////console.log("rate", rate);
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

  const fetchcustomerdetails = async (e) => {
    if (!Array.isArray(e)) {
      return;
    }
    fetchAccountNames();

    try {
      const response = await axios.get(
        `${apiBaseUrl}/scheRegcustomerDetails/${e[0]}/${dbCode}`
      );

      if (response.status === 200) {
        const foundData = response.data[0]; // Assuming the response is an array with one item
        // ////console.log("data =", foundData);

        setschemeRegData({
          ...schemeRegData,
          accountName: AcNames.find((item) => item[0] === foundData.Ledcode),
          add1: foundData.add1,
          add2: foundData.add2,
          pincode: foundData.PinNo,
          mobile: foundData.Mobile,
          email: foundData.Email,
          tele: foundData.Telno,
          // sr_AppEnable:foundData.Address1 || foundData,
        });
      } else {
        // Handle other response statuses or errors
        console.error("Error retrieving data:", response.data);
      }
    } catch (error) {
      console.error("Error fetching ledger datas:", error.message);
    }
  };

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
      intperc: "",

      // Clear the "gm" value as well
    });
    // Reset dataFound state
    fetchSchEntryno();
    setDataFound(false);
    fetchSchCurrentRate();
    setEditDisabled(true);
    setDeleteDisabled(true);
    setSaveDisabled(false);
    // Calculate gm value after clearing the fields
    calculateGm();
    entryNoInputRef.current.focus();
  };

  const handleClearFind = () => {
    setschemeRegData({
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
      intperc: "",

      // Clear the "gm" value as well
    });

    entryNoInputRef.current.focus();
    setEditDisabled(true);
    setDeleteDisabled(true);
    setSaveDisabled(false);
  };
  // const getCurrentDate = () => {
  //   const currentDate = new Date();
  //   const year = currentDate.getFullYear();
  //   const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  //   const day = String(currentDate.getDate()).padStart(2, "0");
  //   return `${year}-${month}-${day}`;
  // };

  // // Set the default date value to the current date
  // useEffect(() => {
  //   setschemeRegData((prevData) => ({
  //     ...prevData,
  //     date: getCurrentDate(), // Set the default date here
  //   }));
  // }, []);

  //////////////////////////functionalities//////////////////

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  // ////console.log("regc", regcustomers);

  const handleSubmit = async () => {
    setSaveDisabled(true);
    try {
      {
        if (
          schemeRegData.mobile &&
          schemeRegData.mobile.length !== 10 &&
          schemeRegData.mobile.length !== 0
        ) {
          alert("Invalid Mobile Number.");
          setSaveDisabled(false);

          return;
        }
        if (schemeRegData.accountName == "") {
          alert("enter data correctly");
          setSaveDisabled(false);
          return;
        } else if (schemeRegData.email && !validateEmail(schemeRegData.email)) {
          alert("Invalid email address");
          setSaveDisabled(false);
          return;
        } else if (!customernames.includes(schemeRegData.accountName[0])) {
          // Display an alert for duplicate entry
          alert("Customer is not registered");
          setSaveDisabled(false);
          return;
        } else if (regcustomers.includes(schemeRegData.accountName[0])) {
          alert("duplicate entry");
          setSaveDisabled(false);
          return;
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
            setSaveDisabled(false);
            // Handle other response statuses or errors
            console.error("Error submitting data:", response.data);
          }
        }
      }
      await fetchupdschregisteredcustomers();
    } catch (error) {
      setSaveDisabled(false);

      // Handle network errors or other exceptions
      console.error("Error:", error.message);
    }
  };
  const names = [
    "Aswin",
    "Vishnu",
    "Saneen",
    "dsdsd",
    "sadr3e",
    "qwwerew",
    "sdfghj",
    "dfghjk",
    "wesdcvhj",
    "uaguahuahsu",
    "sssssssssssssssssss",
  ];
  const [AcNames, setANames] = useState([]);
  // ////console.log(AcNames);
  const [AgNames, setAgNames] = useState([]);

  const handleFind = async () => {
    handleClearFind();
    try {
      if (regcustomers.includes(schemeRegData.accountName[0])) {
        // Display an alert for duplicate entry

        // Make a GET request to your server with the selected name for finding data
        const response = await axios.get(
          `${apiBaseUrl}/findbyAccname/${schemeRegData.accountName[0]}/${dbCode}`
        );

        // Check the response status and handle accordingly
        if (response.status === 200) {
          setEditDisabled(false);
          setDeleteDisabled(false);
          setSaveDisabled(true);
          // Data retrieved successfully, update the form data
          const foundData = response.data[0]; // Assuming the response is an array with one item
          // ////console.log("data =", foundData);

          fetchExist(AcNames.find((item) => item[0] === foundData.accname));

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
            intperc: foundData.intperc,
            // sr_AppEnable:foundData.Address1 || foundData,
          });
          setDataFound(true);
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

  //////////////////////////////

  const handleSearchByAccountNo = async () => {
    handleClearFind();

    try {
      const response = await axios.get(
        `${apiBaseUrl}/findbyAccno/${schemeRegData.accountNo}/${dbCode}`
      );

      if (response.status === 200) {
        setEditDisabled(false);
        setDeleteDisabled(false);
        setSaveDisabled(true);
        const foundData = response.data[0];
        fetchExist(AcNames.find((item) => item[0] === foundData.accname));

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
          intperc: foundData.intperc,
          // sr_AppEnable:foundData.Address1 || foundData,
        });
        setDataFound(true);
        // Update state or perform other actions with foundData
      } else {
        console.error("Error finding data:", response.data);
      }
    } catch (error) {
      console.error("Error:", error.message);
      setDataFound(false);
    }
  };

  const handleFindFirst = async () => {
    handleClearFind();

    try {
      const response = await axios.get(
        `${apiBaseUrl}/SchRegfindfirst/${schemeRegData.entryNo}/${dbCode}`
      );

      if (response.status === 200) {
        setEditDisabled(false);
        setDeleteDisabled(false);
        setSaveDisabled(true);
        const foundData = response.data[0];
        fetchExist(AcNames.find((item) => item[0] === foundData.accname));

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
          intperc: foundData.intperc,
          // sr_AppEnable:foundData.Address1 || foundData,
        });
        setDataFound(true);
        // Update state or perform other actions with foundData
      } else {
        console.error("Error finding data:", response.data);
      }
    } catch (error) {
      console.error("Error:", error.message);
      setDataFound(false);
    }
  };

  const handleFindLast = async () => {
    handleClearFind();

    try {
      const response = await axios.get(
        `${apiBaseUrl}/SchRegfindlast/${schemeRegData.entryNo}/${dbCode}`
      );

      if (response.status === 200) {
        setEditDisabled(false);
        setDeleteDisabled(false);
        setSaveDisabled(true);
        const foundData = response.data[0];
        fetchExist(AcNames.find((item) => item[0] === foundData.accname));

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
          intperc: foundData.intperc,
          // sr_AppEnable:foundData.Address1 || foundData,
        });
        setDataFound(true);
        // Update state or perform other actions with foundData
      } else {
        console.error("Error finding data:", response.data);
      }
    } catch (error) {
      console.error("Error:", error.message);
      setDataFound(false);
    }
  };

  const [firstEno, setFirstEno] = useState("");
  const [lastEno, setLastEno] = useState("");
  // ////console.log(firstEno,lastEno);

  const fetchfirstandlast = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/ScheRegtopandlast/${dbCode}`);
      if (response.status === 200) {
        setFirstEno(response.data[0].firstentryno);
        setLastEno(response.data[0].lastentryno);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };
  const handleFindNext = async () => {
    fetchfirstandlast();
    if (schemeRegData.entryNo < firstEno) {
      handleClearFind();
    }
    try {
      const response = await axios.get(
        `${apiBaseUrl}/SchRegfindnext/${schemeRegData.entryNo}/${dbCode}`
      );

      if (response.status === 200) {
        setEditDisabled(false);
        setDeleteDisabled(false);
        setSaveDisabled(true);
        const foundData = response.data[0];
        // ////console.log("data =", foundData);
        fetchExist(AcNames.find((item) => item[0] === foundData.accname));

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
          intperc: foundData.intperc,
          // sr_AppEnable:foundData.Address1 || foundData,
        });
        setDataFound(true);
        // Update state or perform other actions with foundData
      } else {
        console.error("Error finding data:", response.data);
      }
    } catch (error) {
      console.error("Error:", error.message);
      setDataFound(false);
    }
  };

  const handleFindprev = async () => {
    fetchfirstandlast();
    if (schemeRegData.entryNo > firstEno) {
      handleClearFind();
    }
    try {
      const response = await axios.get(
        `${apiBaseUrl}/SchRegfindprev/${schemeRegData.entryNo}/${dbCode}`
      );

      if (response.status === 200) {
        setEditDisabled(false);
        setDeleteDisabled(false);
        setSaveDisabled(true);
        const foundData = response.data[0];
        fetchExist(AcNames.find((item) => item[0] === foundData.accname));
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
          intperc: foundData.intperc,
          // sr_AppEnable:foundData.Address1 || foundData,
        });
        setDataFound(true);
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
      const mobileNumber = schemeRegData.mobile
        ? schemeRegData.mobile.toString()
        : "";
      if (
        schemeRegData.mobile &&
        mobileNumber.length !== 10 &&
        mobileNumber.length !== 0
      ) {
        alert("Invalid Mobile Number.");

        return;
      }
      if (schemeRegData.email && !validateEmail(schemeRegData.email)) {
        alert("Invalid email address");
      } else if (dataFound == true) {
        // Make a POST request to your server with the form data

        const updatedSchemeRegData = {
          ...schemeRegData,
          agent: schemeRegData.agent[0],
          accountName: schemeRegData.accountName[0],
        };
        //  ////console.log("up", updatedSchemeRegData);
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

  const [countExist, setcountExist] = useState("");

  const fetchExist = async (e) => {
    // ////console.log("e",e);
    try {
      const response = await axios.get(`${apiBaseUrl}/schUsedEntry/${e[0]}/${dbCode}`);
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
    try {
      if (schemeRegData.accountName === "") {
        alert("please select an  Account Name");
      } else {
        if (!window.confirm("Do You Want To Delete..?")) {
          return;
        }

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
          alert("Account Deleted ");
          // window.location.reload();
          handleClear();
        } else {
          console.error("Error deleting data:", response.data);
        }
      }
      await fetchupdschregisteredcustomers();
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  ///////////////////////////////////validations//////////////////////////

  const handleCheckCustomer = (e) => {
    // ////console.log('regcustom',AcNames);

    const targetValue = e.target.value;
    const isValuePresent = AcNames.some((item) => item[1] === targetValue);

    if (!isValuePresent && e.target.value !== "") {
      alert("Customer Not Registered");
      Open(e, accountNameInputRef);
    }
  };
  useEffect(() => {
    entryNoInputRef.current.focus();
  }, []);
  return (
    // <div className="regmodal-overlay">
    <div className={`regmodal ${minimized ? "minimized" : ""}`}>
      <div className="schemecontrolls">
        {/* ///////// */}
        <div className="schemereg_headerLogo_Div">
          <div className="schemereg_headerLogo">
            <img src={headeLogo} alt="SherSoftLogo" />
          </div>
          <label className="schemeReg_pageHead">Scheme Registration</label>
        </div>
        <img
          alt="X"
          src={toggleClose}
          className="close-icon"
          onClick={onClose}
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
          className={`schemeNav_items ${dataFound ? "disabled" : ""}`}
          ref={saveButtonRef}
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
          onClick={handleFind}
        >
          <div className="schemeReg_buttonImage">
            <img src={findImg} alt="findImg" />
          </div>
          Find
        </button>
        <button
          style={{ border: "none", backgroundColor: "transparent" }}
          className={`schemeNav_items ${dataFound ? "" : "disabled"}`}
          onClick={handleUpdate}
          disabled={!dataFound || editDisabled}
        >
          <div className="schemeReg_buttonImage">
            <img src={editImg} alt="editImg" />
          </div>
          Edit
        </button>
        <button
          style={{ border: "none", backgroundColor: "transparent" }}
          className={`schemeNav_items ${dataFound ? "" : "disabled"}`}
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
        <div className="schemeReg_arrowButtons">
          <button
            style={{ backgroundColor: "transparent" }}
            className="schemeReg_arrowButtonImage"
            onClick={handleFindFirst}
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
            onClick={handleFindNext}
          >
            <img src={rightarrow} alt="rightarrow" />
          </button>
          <button
            style={{ backgroundColor: "transparent", marginRight: "2%" }}
            className="schemeReg_arrowButtonImage"
            onClick={handleFindLast}
          >
            <img src={playandpauseRight} alt="playandpauseRight" />
          </button>
        </div>
      </div>
      {/*............................ NavbarEnd.............................................. */}

      <div className="schemeRegBody">
        <div className="schemeRegBodyData">
          <div className="schemeRegBodyDatapart1">
            <div className="schemeRegBodyDataRows part1row">
              <div className="schemeRegBodyDataRowspart1 entrynodiv">
                <label>Entry No</label>

                <input
                  readOnly
                  style={{ textAlign: "center" }}
                  ref={entryNoInputRef}
                  onKeyDown={(e) => handleKeyDown(e, dateInputRef)}
                  value={schemeRegData.entryNo}
                />
              </div>
              <div className="schemeRegBodyDataRowspart2 entrynodiv">
                <label>Date</label>
                <input
                  value={schemeRegData.date}
                  type="date"
                  ref={dateInputRef}
                  onKeyDown={(e) => handleKeyDown(e, accountNameInputRef)}
                  onChange={(e) =>
                    setschemeRegData({ ...schemeRegData, date: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="schemeRegBodyDataRows SchAccName part1row">
              <label className="accNameLabel">Account Name</label>
              {/* <input className="accNameinput" /> */}
              <ComboBox
                findedValue={
                  Array.isArray(schemeRegData.accountName)
                    ? schemeRegData.accountName[1]
                    : schemeRegData.accountName
                }
                onKeyDown={(e) => {
                  handleKeyDown(e, agentNameInputRef);
                }}
                onInputChange={(value) => {
                  setschemeRegData({ ...schemeRegData, accountName: value });
                  fetchcustomerdetails(value);
                }}
                comboRef={accountNameInputRef}
                options={AcNames}
                className="accNameinput"
                inputClassName="accNameinputClass"
                onBlur={(e) => handleCheckCustomer(e)}
              />
            </div>
            <div className="schemeRegBodyDataRows SchAccName part1row">
              <label className="accNameLabel">Agent</label>
              {/* <input className="accNameinput" /> */}
              <ComboBox
                findedValue={
                  Array.isArray(schemeRegData.agent)
                    ? schemeRegData.agent[1]
                    : schemeRegData.agent
                }
                onInputChange={(value) =>
                  setschemeRegData({ ...schemeRegData, agent: value })
                }
                onKeyDown={(e) => handleKeyDown(e, durationInputRef)}
                comboRef={agentNameInputRef}
                options={employeeNames}
                className="accNameinput"
                inputClassName="accNameinputClass"
              />
            </div>
            <div className="schemeRegBodyDataRows SchAccName part1row">
              <div className="durationdiv">
                <label className="Durationlabel">Duration</label>
                <input
                  value={schemeRegData.duration}
                  type="number"
                  onKeyDown={(e) => handleKeyDown(e, intperRef)}
                  className="Durationinput"
                  placeholder="IN MONTHS"
                  ref={durationInputRef}
                  onChange={(e) =>
                    setschemeRegData({
                      ...schemeRegData,
                      duration: e.target.value,
                    })
                  }
                />
              </div>
              <label className="schemeRegBodyDataperclabel">%Perc</label>
              <input
                value={schemeRegData.intperc}
                onKeyDown={(e) => handleKeyDown(e, accountNoInputRef)}
                className="schemeRegBodyDatapercinput"
                ref={intperRef}
                onChange={(e) =>
                  setschemeRegData({
                    ...schemeRegData,
                    intperc: e.target.value,
                  })
                }
              />
              <div className="accNodiv ">
                <div className="accNolabelDiv">
                  <label className="accountNumberlabel">Account Number</label>
                  <div className="accountNumberInputdiv">
                    <input
                      value={schemeRegData.accountNo}
                      type="text"
                      onKeyDown={(e) => handleKeyDown(e, address1InputRef)}
                      className="accountNumberInput"
                      ref={accountNoInputRef}
                      style={{ textAlign: "right" }}
                      onChange={(e) =>
                        setschemeRegData({
                          ...schemeRegData,
                          accountNo: e.target.value,
                        })
                      }
                    />
                    <button
                      className="accountNumbersearchbutton"
                      onClick={handleSearchByAccountNo}
                    >
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* ///lines/// */}
          <div className="schemeReglines">
            <div className="schemeReglinesparts"></div>
            <div className="schemeReglinesparts"></div>
          </div>
          {/* /////////////////// */}
          <div className="schemeRegBodyDatapart2">
            <div className="schemeRegBodyDataRows addressdivmob">
              <label className="schemeRegBodyDatapart2label1">Address 1</label>
              <input
                value={schemeRegData.add1}
                onKeyDown={(e) => handleKeyDown(e, address2InputRef)}
                className="schemeRegBodyDatapart2input1"
                ref={address1InputRef}
                onChange={(e) =>
                  setschemeRegData({ ...schemeRegData, add1: e.target.value })
                }
              />
              <label className="schemeRegBodyDatapart2label2">Address 2</label>
              <input
                value={schemeRegData.add2}
                onKeyDown={(e) => handleKeyDown(e, cityInputRef)}
                className="schemeRegBodyDatapart2input2"
                ref={address2InputRef}
                onChange={(e) =>
                  setschemeRegData({ ...schemeRegData, add2: e.target.value })
                }
              />
            </div>
            <div className="schemeRegBodyDataRows">
              <label className="schemeRegBodyDatapart2label1">City/Town</label>
              <input
                value={schemeRegData.city}
                onKeyDown={(e) => handleKeyDown(e, pincodeInputRef)}
                className="schemeRegBodyDatapart2input1"
                ref={cityInputRef}
                onChange={(e) =>
                  setschemeRegData({ ...schemeRegData, city: e.target.value })
                }
              />
              <label className="schemeRegBodyDatapart2label2">Pincode</label>
              <input
                type="number"
                value={schemeRegData.pincode}
                onKeyDown={(e) => handleKeyDown(e, contactPersonInputRef)}
                className="schemeRegBodyDatapart2input2"
                ref={pincodeInputRef}
                onChange={(e) =>
                  setschemeRegData({
                    ...schemeRegData,
                    pincode: e.target.value,
                  })
                }
              />
            </div>
            <div className="schemeRegBodyDataRows">
              <label className="schemeRegBodyDatapart2label1">
                Contact Person
              </label>
              <input
                value={schemeRegData.contactPerson}
                onKeyDown={(e) => handleKeyDown(e, emailInputRef)}
                className="schemeRegBodyDatapart2input1"
                ref={contactPersonInputRef}
                onChange={(e) =>
                  setschemeRegData({
                    ...schemeRegData,
                    contactPerson: e.target.value,
                  })
                }
              />
              <label className="schemeRegBodyDatapart2label2">Email</label>
              {/* {emailError && <div className="error">{emailError}</div>} */}
              <input
                value={schemeRegData.email}
                type="email"
                id="email"
                name="email"
                pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                required
                onKeyDown={(e) => handleKeyDown(e, telNoInputRef)}
                className="schemeRegBodyDatapart2input2"
                ref={emailInputRef}
                onChange={(e) =>
                  setschemeRegData({ ...schemeRegData, email: e.target.value })
                }
              />
            </div>
            <div className="schemeRegBodyDataRows">
              <label className="schemeRegBodyDatapart2label1">Tele No.</label>
              <input
                value={schemeRegData.tele}
                type="number"
                onKeyDown={(e) => handleKeyDown(e, mobNoInputRef)}
                className="schemeRegBodyDatapart2input1"
                ref={telNoInputRef}
                onChange={(e) =>
                  setschemeRegData({ ...schemeRegData, tele: e.target.value })
                }
              />
              <label className="schemeRegBodyDatapart2label2">Mobile</label>
              <input
                value={schemeRegData.mobile}
                type="number"
                onKeyDown={(e) => handleKeyDown(e, narrationInputRef)}
                className="schemeRegBodyDatapart2input2"
                ref={mobNoInputRef}
                onChange={(e) =>
                  setschemeRegData({ ...schemeRegData, mobile: e.target.value })
                }
              />
            </div>
          </div>
          {/* ///////lines//// */}
          <div className="schemeReglines">
            <div className="schemeReglinesparts1"></div>
          </div>
          {/* ///////////// */}
          <div className="schemeRegBodyDatapart3">
            <div className="schemeRegBodyDatapart3narration">
              <label>Narration</label>
              <input
                value={schemeRegData.narration}
                onKeyDown={(e) => handleKeyDown(e, saveButtonRef)}
                ref={narrationInputRef}
                onChange={(e) =>
                  setschemeRegData({
                    ...schemeRegData,
                    narration: e.target.value,
                  })
                }
              />
            </div>

            {/* <div className="schemeRegBodyDatapart3Rows">
              <label className="schemeRegBodyDatapart3Rowslabel">Amount</label>
              <input
                value={schemeRegData.amount}
                type="number"
                onKeyDown={(e) => handleKeyDown(e, rateInputRef)}
                className="schemeRegBodyDatapart3Rowsinput"
                ref={amountInputRef}
                onChange={(e) =>
                  setschemeRegData({ ...schemeRegData, amount: e.target.value })
                }
              />
              <label
                className="schemeRegBodyDatapart3Rowslabel"
                style={{ marginLeft: ".33%", textAlign: "center" }}
              >
                Rate
              </label>
              <input
                readOnly
                value={schemeRegData.rate}
                type="number"
                onKeyDown={(e) => handleKeyDown(e, gmInputRef)}
                className="schemeRegBodyDatapart3Rowsinput"
                ref={rateInputRef}
                onChange={(e) =>
                  setschemeRegData({ ...schemeRegData, rate: e.target.value })
                }
              />
              <label
                className="schemeRegBodyDatapart3Rowslabel"
                style={{ marginLeft: ".6%", textAlign: "center" }}
              >
                Gm
              </label>
              <input
                value={schemeRegData.gm}
                type="number"
                onKeyDown={(e) => handleKeyDown(e, saveButtonRef)}
                className="schemeRegBodyDatapart3Rowsinput"
                ref={gmInputRef}
                onChange={(e) =>
                  setschemeRegData({ ...schemeRegData, gm: e.target.value })
                }
              />
            </div> */}
          </div>
        </div>
      </div>
    </div>
    // </div>
  );
}

export default SchemeRegistration;
