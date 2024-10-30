import React, { useState, useEffect, useRef,useContext } from "react";
import "../styles/SchemeCashReceiptMob.css";
import sslogo from "../assets/images/ssMob.png";
//import ComboBox from "shersoft-combov1";
import ComboBox from "./ComboBox";
import toggle from "../assets/images/MobToggle.png";
import save from "../assets/images/SaveImage.png";
import find from "../assets/images/findMob.png";
import edit from "../assets/images/Editing.png";
import Delete from "../assets/images/Delete.png";
import print from "../assets/images/Printer.png";
import exit from "../assets/images/Exit1.png";
import close from "../assets/images/findclose.png"
import home from "../assets/images/arrow.png";
import clear from "../assets/images/Document.png";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

import { AuthContext } from "../context/AuthContext";
import { useDbContext } from "../context/DbContext";

function SchemeCashReceiptMob() {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const { dbCode } = useDbContext();

  const { agentCode } = useContext(AuthContext);

  const agentCodeRef = useRef(agentCode);

  useEffect(() => {
    agentCodeRef.current = agentCode;
  }, [agentCode]);

  const [userType, setuserType] = useState("");


  useEffect(() => {
    const storeduType = sessionStorage.getItem("userType");
    if (storeduType) {
      setuserType(storeduType);
    }
  }, []);


  const [showFind, setShowFind] = useState(true);
  const navigate = useNavigate();

  const cashaccinputRef = useRef(null);
  const rateInputRef = useRef(null);
  const dateInputRef = useRef(null);
  const saveButtonRef = useRef(null);
  const accnoRef = useRef(null);
  const agentRef = useRef(null);
  const accnameRef = useRef(null);
  const printButtonRef = useRef(null);
  const amountInputRef = useRef(null);
  const gmInputRef = useRef(null);
  const printgmRef = useRef(null);
  const narrationInputRef = useRef(null);

  const [startDate, setStartDate] = useState(new Date());
  /////////////table///////////
  const tableContainerRef = useRef(null);
  const cashaccref = useRef(null);

  const entryNoInputRef = useRef(null);

  // const cashSupplierInputRef = useRef(null);
  // const supplierNameInputRef = useRef(null);
  // const supplierInVoNoInputRef = useRef(null);
  // const searchBtnInputRef = useRef(null);
  // const amountInputRef = useRef(null);
  // const invoDateInputRef = useRef(null);
  // const detailsBtnInputRef = useRef(null);
  // const purchaseAcInputRef = useRef(null);
  // const typeInputRef = useRef(null);
  // const obInputRef = useRef(null);
  // const salesManInputRef = useRef(null);
  // const locationInputRef = useRef(null);
  const addRow = () => {
    // ////console.log("add row called");
    setTableData([...tableData, {}]);
  };

  const [editDisabled, setEditDisabled] = useState(true);
  const [deleteDisabled, setDeleteDisabled] = useState(true);
  const [saveDisabled, setSaveDisabled] = useState(false);
  const[printDisabled,setPrintDisabled]=useState(true)

  const handleScroll = () => {
    const tableContainer = tableContainerRef.current;
    if (
      tableContainer.scrollTop + tableContainer.clientHeight >=
      tableContainer.scrollHeight - 1
    ) {
      // User has scrolled to the bottom, add new rows
      addRow();
    }
  };

  //////////current date///////////

  const getCurrentDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  ////////////////////////// form data states //////////

  const [tableData, setTableData] = useState([
    ...Array(14).fill({
      SINo: "",
      name: "",
      agent: "",
      accountNumber: "",
      amount: "",
      gm: "",
      narration: "",
      printgm: "",
    }),
  ]);

 /// ////console.log("table data ===== ", tableData);

  const [schemeRecInfoData, setschemeRecInfoData] = useState({
    EntryNo: "",
    cashAcc: "",
    rate: "",
    date: getCurrentDate(),
    totalamt: 0,
    totalgm: 0,
    agCode:agentCode

  });
  // ////console.log("info data = ", schemeRecInfoData);

  ///////////////////////////////////////////////
  // const[accountTransaction,setAccountTransaction]=useState({
  // atDate:"",
  // atLedcode:"",
  // atType:"",
  // atEntryNo:"",
  // atAmount:"",
  // atNarration:"",

  //})

  ///////////////////////////////////////////////

  const handleCellChange = (event, rowIndex, field) => {
    // fetchAccNoData(event, rowIndex);

    if (rowIndex > 0 && rowIndex % 2 === 0) {
      const newData = [...tableData]; // Create a copy of the tableData array
      newData[rowIndex - rowIndex / 2] = {
        ...newData[rowIndex - rowIndex / 2],
        [field]: event,
      }; // Update the value of the specified field in the row
      setTableData(newData); // Update the tableData state with the modified data
    } else {
      const newData = [...tableData]; // Create a copy of the tableData array
      newData[rowIndex] = { ...newData[rowIndex], [field]: event }; // Update the value of the specified field in the row
      setTableData(newData); // Update the tableData state with the modified data
    }
  };

  // const handleCellChangeinput = (event, rowIndex, field) => {

  //     const newData = [...tableData]; // Create a copy of the tableData array
  //     newData[rowIndex] = { ...newData[rowIndex], [field]: event.target.value }; // Update the value of the specified field in the row
  //     setTableData(newData); // Update the tableData state with the modified data

  // };
  const calculateGmvalue = (amount, index) => {
    if (amount !== "" || null) {
      const Rate = schemeRecInfoData.rate;
      //  ////console.log("log rate", Rate);
      if (Rate !== 0) {
        const calcgm = (amount / Rate).toFixed(3);
        handleCellChange(calcgm, index, "gm");
      }
    } else {
      handleCellChange("", index, "gm");
    }
  };

  const checkNameExists = (e) => {
    if (e.key === "Enter" || e.key === "Return") {
      if (!cnameData.find((item) => item[1] === e.target.value)) {
        alert("account not registered");
      }
    }
  };

  const checkAccnoExists = (e) => {
    if (e.key === "Enter" || e.key === "Return") {
      if (!accNo.find((item) => item[1] === e.target.value)) {
        alert("Account number not registered");
      }
    }
  };
  const checkledgerExists = (e) => {
    if (e.key === "Enter" || e.key === "Return") {
      if (!selectcashAcc.find((item) => item[1] === e.target.value)) {
        alert("Account does not Exist");
      }
    }
  };

  const handleCellChangeinput = (event, rowIndex, field) => {
    const newData = [...tableData]; // Create a copy of the tableData array

    if (rowIndex > 0 && rowIndex % 2 === 0) {
      if (field === "printgm") {
        newData[rowIndex - rowIndex / 2] = {
          ...newData[rowIndex - rowIndex / 2],
          [field]: event.target.checked ? 1 : 0, // If checkbox is checked, set value to 1, otherwise 0
        };
      } else {
        newData[rowIndex - rowIndex / 2] = {
          ...newData[rowIndex - rowIndex / 2],
          [field]: event.target.value,
        }; // Update the value of the specified field in the row
      }
      newData[rowIndex - rowIndex / 2] = {
        ...newData[rowIndex - rowIndex / 2],
        SINo: rowIndex / 2 + 1,
      }; // Update the SINo for the row
      setTableData(newData); // Update the tableData state with the modified data
    } else {
      if (field === "printgm") {
        newData[rowIndex] = {
          ...newData[rowIndex],
          [field]: event.target.checked ? 1 : 0, // If checkbox is checked, set value to 1, otherwise 0
        };
      } else {
        newData[rowIndex] = {
          ...newData[rowIndex],
          [field]: event.target.value,
        }; // Update the value of the specified field in the row
      }
      newData[rowIndex] = { ...newData[rowIndex], SINo: rowIndex / 2 + 1 }; // Update the SINo for the row
      setTableData(newData); // Update the tableData state with the modified data
    }
  };

  useEffect(() => {
    entryNoInputRef.current.focus();
  }, []);

  const handleKeyDown = (event, nextInputRef) => {
    if (event.key === "Enter" || event.key === "Return") {
      nextInputRef.current.focus();
    }
  };
  const [RowIndex, setRowIndex] = useState(0);
  // ////console.log(RowIndex);

  const handleKeyDownTable = (event, rowIndex, columnIndex) => {
    if (event.key === "Enter" || event.key === "Return") {
      event.preventDefault();

      const tableContainer = tableContainerRef.current;
      const rows = tableContainer.querySelectorAll(
        ".schRecDataTableBodyStyletr"
      );

      // Check if the row at the specified index exists
      if (rows[rowIndex]) {
        // Determine the next column index
        const nextColumnIndex =
          columnIndex < rows[rowIndex].cells.length - 1 ? columnIndex + 1 : 0;

        // Find the input field in the next column
        const nextInput =
          rows[rowIndex]?.cells[nextColumnIndex]?.querySelector("input");

        if (nextInput) {
          // Check if the current input field is the product name input field
          const currentInputAccno = columnIndex === 3;

          if (currentInputAccno && !event.target.value.trim()) {
            // If the product name input is empty, move focus to other charges input

            saveButtonRef.current.focus();
          } else {
            // Otherwise, move focus to the next input field

            nextInput.focus();
          }
        }
      }
    }

    setRowIndex(rowIndex);
  };

  /////////////////////////////////////////////

  useEffect(() => {
    const fetchSchEntryno = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/SchRec_entryno/${parseInt(agentCode)}/${dbCode}`);
        // ////console.log("response =", response);
        const schemeRecentryNo = response.data.map((item) => item[""]);

        setschemeRecInfoData((prevData) => ({
          ...prevData,
          EntryNo: schemeRecentryNo[0],
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
      const response = await axios.get(`${apiBaseUrl}/SchRec_entryno/${parseInt(agentCode)}/${dbCode}`);
      // ////console.log("response =", response);
      const schemeRecentryNo = response.data.map((item) => item[""]);

      setschemeRecInfoData((prevData) => ({
        ...prevData,
        EntryNo: schemeRecentryNo[0],
      }));
      // setSchEntryNo(schemeentryNo[0] );
    } catch (error) {
      console.error("Error fetching entry no:", error.message);
    }
  };

  /////customer name //////

  const [cnameData, setCnameData] = useState([]);
  // ////console.log("cnamedata=====", cnameData);
  ///const [cnameAuto, setCNameAuto] = useState({});

  // const [purchasecashorsuppl, setpurchasecashorsuppl] = useState([]);

  // const [supplierName, setsupplierName] = useState([]);

  useEffect(() => {
    const fetchCname = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/SchRec_Cname/${dbCode}`);

        // Assuming response.data is an array with objects and each object has a LedName property
        const cName = response.data;

        // Transforming the array into the desired format
        // const supplName = cName.map((item) => item.LedName);

        const transformedData = cName.map((item) => [
          item.Ledcode,
          item.LedName,
        ]);
        setCnameData(transformedData);

        // setsupplierName(supplName);
      } catch (error) {
        console.error("Error fetching cashorsuppl Values:", error.message);
      }
    };

    fetchCname();
  }, [apiBaseUrl]);

  // ////console.log('cnameData=', cnameData);

  // useEffect(() => {
  //   const fetchCname = async () => {
  //     try {
  //       const response = await axios.get(`${apiBaseUrl}/SchRec_Cname`);
  //       setCnameData(response.data);

  //       // ////console.log("11111", response.data);
  //     } catch (error) {
  //       console.error("Error fetching cname data:", error.message);
  //     }
  //   };

  //   fetchCname();
  // }, [apiBaseUrl]);

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

  // useEffect(() => {
  //   const fetchAgname = async () => {
  //     try {
  //       const response = await axios.get(`${apiBaseUrl}/salesmanNames`);
  //       // setagentName(response.data);
  //       // setagentName(response.data.map((item) => item.Name));

  //       setAgentObj(response.data);
  //     } catch (error) {
  //       console.error("Error fetching Agname data:", error.message);
  //     }
  //   };

  //   fetchAgname();
  // }, [apiBaseUrl]);

  // ////console.log("......", agentobj);

  // const agentAutoValue = agentobj.find(item => item.Name === selectedName)?.Auto || '';

  // // Update the state with the corresponding Auto value
  // setComboId(agentAutoValue);
  //////acc no////////////

  const [accNo, setaccNo] = useState([]);
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

  // useEffect(() => {
  //   const fetchAccno = async () => {
  //     try {
  //       const response = await axios.get(`${apiBaseUrl}/SchRec_Accno`);
  //       // setaccNo(response.data);
  //       setaccNo(response.data);
  //     } catch (error) {
  //       console.error("Error fetching Accno data:", error.message);
  //     }
  //   };

  //   fetchAccno();
  // }, [apiBaseUrl]);

  const [selectcashAcc, setselectcashAcc] = useState([]);
 // ////console.log("selectcashAcc", selectcashAcc);

  useEffect(() => {
    const selectcashAcc = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/SchRec_caba/${dbCode}`);

        // Assuming response.data is an array with objects and each object has a LedName property
        const caba = response.data;

        // Transforming the array into the desired format
        // const supplName = cName.map((item) => item.LedName);

        const transformedData = caba.map((item) => [
          item.ledcode,
          item.LedName,
        ]);
        setselectcashAcc(transformedData);

        if (userType === "EMPLOYEE") {
          ////console.log("function called");
          
          fetchcashAcc(transformedData);
        }

        // setsupplierName(supplName);
      } catch (error) {
        console.error("Error fetching selectcashAcc Values:", error.message);
      }
    };
    selectcashAcc();
  }, [apiBaseUrl,userType]);

  const Selectcashacc = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/SchRec_caba/${dbCode}`);

      // Assuming response.data is an array with objects and each object has a LedName property
      const caba = response.data;

      // Transforming the array into the desired format
      // const supplName = cName.map((item) => item.LedName);

      const transformedData = caba.map((item) => [item.ledcode, item.LedName]);
      setselectcashAcc(transformedData);
      if (userType === "EMPLOYEE") {
        ////console.log("function called");
        
        fetchcashAcc(transformedData);
      }

      // setsupplierName(supplName);
    } catch (error) {
      console.error("Error fetching selectcashAcc Values:", error.message);
    }
  };

  // useEffect(() => {
  //   Selectcashacc();

  const fetchcashAcc = async (data) => {
    try {
      const response = await axios.get(
        `${apiBaseUrl}/fetchcashacc/${parseInt(agentCode)}/${dbCode}`
      );
      const caba = response.data[0];
      // ////console.log("agentcode,==", parseInt(agentCode));

      // ////console.log("caba===", caba.cashAcc);

      setschemeRecInfoData((prevState) => ({
        ...prevState,
        cashAcc: data.find((item) => item[0] === parseInt(caba.cashAcc)),
      }));
      // ////console.log(
      //   "acc=",
      //   data.find((item) => item[0] === parseInt(caba.cashAcc))
      // );
    } catch (error) {
      console.error("Error fetching Accno data:", error.message);
    }
  };


  ///////////////////current rate //////////////////////////////

  useEffect(() => {
    const fetchSchCurrentRate = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/currentgoldRate/${dbCode}`);
        const currentrate = response.data[0]?.currentRate;
        setschemeRecInfoData((prevData) => ({
          ...prevData,
          rate: currentrate,
        }));
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
      setschemeRecInfoData((prevData) => ({ ...prevData, rate: currentrate }));
    } catch (error) {
      console.error("Error fetching names Values:", error.message);
    }
  };

  ////////////////total calculations/////////////////////////////

  useEffect(() => {
    let totalAmount = 0;
    let totalGm = 0;
    tableData.forEach((rowData) => {
      totalAmount += parseFloat(rowData.amount || 0);
      totalGm += parseFloat(rowData.gm || 0);
    });
    setschemeRecInfoData((prevState) => ({
      ...prevState,
      totalamt: totalAmount.toFixed(3), // Update total amount
      totalgm: totalGm.toFixed(3), // Update total gm
    }));
  }, [tableData]);

  ////////////////////

  const [comboValue, setComboValue] = useState("");
  const handleClearCombo = () => {
    setComboValue("");
  };
  ///////////////////////////////////clear/////////////////////////////

  const handleClear = () => {

    fetchSchEntryno();
    fetchSchCurrentRate();
    Selectcashacc();
    setdispWt("");
    setschemeRecInfoData({
      cashAcc: "",

      date: getCurrentDate(),
      totalamt: "",
      totalgm: "",
    });

    setTableData([
      ...Array(14).fill({
        SINo: "",
        name: "",
        agent: "",
        accountNumber: "",
        amount: "",
        gm: "",
        narration: "",
        printgm: "",
      }),
    ]);

    entryNoInputRef.current.focus();
    setRowIndex(0);
    setEditDisabled(true);
    setDeleteDisabled(true);
    setSaveDisabled(false);
    setShowFind(true)
    setPrintDisabled(true)
    // const [editDisabled, setEditDisabled] = useState(true);
    // const [deleteDisabled, setDeleteDisabled] = useState(true);
    // const [saveDisabled, setSaveDisabled] = useState(false);
  };

  const handleClearfind = () => {
    // fetchSchEntryno();
    // fetchSchCurrentRate();
    // setschemeRecInfoData({
    //   cashAcc: "",

    //   date: getCurrentDate(),
    //   totalamt: "",
    //   totalgm: "",
    // });

    setTableData([
      ...Array(14).fill({
        SINo: "",
        name: "",
        agent: "",
        accountNumber: "",
        amount: "",
        gm: "",
        narration: "",
        printgm: "",
      }),
    ]);

    entryNoInputRef.current.focus();
    setRowIndex(0);
    setEditDisabled(true);
    setDeleteDisabled(true);
    setSaveDisabled(false);
    setShowFind(true)
    setPrintDisabled(true)

    
    // const [editDisabled, setEditDisabled] = useState(true);
    // const [deleteDisabled, setDeleteDisabled] = useState(true);
    // const [saveDisabled, setSaveDisabled] = useState(false);
  };
  ////////////////////////////////////////////////////////

  const sendSMS = async (aNo,mobileNo, customerName, grandTotal,total, netwt, gm) => {
    const message = `Account No.:${aNo[1]} NAME:${customerName[1]} Amount:${grandTotal} Total:${total} Weight:${gm}gm Total weight:${netwt}gm Thank you CHUNDANGATHRA GOLD AND DIAMONDS`;

    const url = `http://sapteleservices.com/SMS_API/sendsms.php`;
    const params = {
      username: "chundangathra",
      password: "81ed95",
      mobile: mobileNo,
      sendername: "CHUJWL",
      message: message,
      routetype: "1",
      tid: "1607100000000318300",
    };

    try {
      const response = await axios.get(url, { params });
      return response.data;
    } catch (error) {
      console.error(`Error sending SMS to ${mobileNo}:`, error.message);
      return null;
    }
  };




  const handleSave = async () => {
    setSaveDisabled(true);


    try {
      if (!schemeRecInfoData.cashAcc) {
        // If cashAcc is not filled, display an alert and return without saving
        alert("Enter Data  Correctly.");
        setSaveDisabled(false);

        return;

      }

      const hasData = tableData.some((row) => {
        return (
          row.name &&
          row.agent &&
          row.accountNumber &&
          row.amount &&
          Object.values(row).some((value) => value !== "")
        );
      });

      if (!hasData) {
        // If no data is entered, display an alert and return without saving
        alert("Enter Data  Correctly.");
        setSaveDisabled(false);

        return;
      }

      const filteredTableData = tableData.filter((row) => {
        // Check if any of the fields in the row is not empty
        return Object.values(row).some((value) => value !== "");
      });

      const transformedTableData = filteredTableData.map((row) => ({
        SINo: row.SINo || null,
        name: row.name[0] || null, // Access the second item of the name array
        agent: row.agent[0] || null, // Access the second item of the agent array
        accountNumber: row.accountNumber[0] || null, // Access the second item of the accountNumber array
        amount: row.amount || null,
        gm: row.gm || null,
        narration: row.narration || null,
        printgm: row.printgm || null,
      }));
      // ////console.log("transformedTableData", transformedTableData);
      const response = await axios.post(`${apiBaseUrl}/saveSchRec/${dbCode}`, {
        statementType: "SchRec_insert",
        cashacc: schemeRecInfoData.cashAcc[0],
        rate: schemeRecInfoData.rate,
        date: schemeRecInfoData.date,
        totalamount: schemeRecInfoData.totalamt,
        totalgm: schemeRecInfoData.totalgm,
        agCode:parseInt(agentCode),
        type: transformedTableData, // Pass the entire tableData array
      });

      if (response.data.success) {
        setSaveDisabled(false);
        // handleClear();
        //  Swal.fire("Success", "Data saved successfully!", "success");


        const accountNumbers = transformedTableData.map(
          (row) => row.accountNumber
        );
        const mobileNumbersResponse = await axios.post(
          `${apiBaseUrl}/fetchMobileNos/${dbCode}`,
          {
            accountNumbers,
          }
        );

        if (mobileNumbersResponse.data) {
          //////console.log("Mobile Numbers:", mobileNumbersResponse.data);

          // Send SMS to each mobile number
          mobileNumbersResponse.data.forEach(async (mobileNumber) => {

           // ////console.log(transformedTableData);
           // ////console.log(mobileNumber);
            const customerData = transformedTableData.find(
              (row) => row.name === mobileNumber.accname
            );
              // ////console.log("customerData==", customerData);

              if (customerData) {
           
                const grandTotal = customerData.amount;
                const netwt = mobileNumber.totalWt;
                const total=mobileNumber.totalAmt
                const gm = customerData.gm;
                // const smsResponse = await sendSMS(
                //   accNo.find((item) => item[0] ===  customerData.accountNumber),
                //   mobileNumber.mobileNo,
                //   cnameData.find((item) => item[0] === mobileNumber.accname),
                //   grandTotal,
                //   total,
                //   netwt,
                //   gm
                // );
  
            
              // ////console.log(`SMS sent to ${mobileNumber.mobileNo}:`, smsResponse);
            }
          });
        }

        alert("Entry Saved");
        handlePrint();

        handleClear()
        // Optionally, you can perform additional actions after successful save
        setPrintDisabled(false)
      } else {
        // Swal.fire("Error", "Failed to save data!", "error");
        alert("Failed to save data!");
        setSaveDisabled(false);

      }
    } catch (error) {
      console.error("Error saving data:", error.message);
      //  Swal.fire("Error", "Internal server error!", "error");
      alert("Internal server error!");
      setSaveDisabled(false);

    }
    // handleClear();
  };

  const handleEdit = async () => {
    try {
      if (!schemeRecInfoData.cashAcc) {
        // If cashAcc is not filled, display an alert and return without saving
        alert("Enter Data  Correctly.");
        return;
      }

      const hasData = tableData.some((row) => {
        return (
          row.name &&
          row.agent &&
          row.accountNumber &&
          row.amount &&
          Object.values(row).some((value) => value !== "")
        );
      });

      if (!hasData) {
        // If no data is entered, display an alert and return without saving
        alert("Enter Data  Correctly.");
        return;
      }

      const filteredTableData = tableData.filter((row) => {
        // Check if any of the fields in the row is not empty
        return Object.values(row).some((value) => value !== "");
      });

      const transformedTableData = filteredTableData.map((row) => ({
        SINo: row.SINo || null,
        name: row.name[0] || null, // Access the second item of the name array
        agent: row.agent[0] || null, // Access the second item of the agent array
        accountNumber: row.accountNumber[0] || null, // Access the second item of the accountNumber array
        amount: row.amount || null,
        gm: row.gm || null,
        narration: row.narration || null,
        printgm: row.printgm || null,
      }));
      //////console.log("transformedTableData", transformedTableData);
      const response = await axios.post(`${apiBaseUrl}/updateSchRec/${dbCode}`, {
        statementType: "SchRec_insert",
        cashacc: schemeRecInfoData.cashAcc[0],
        rate: schemeRecInfoData.rate,
        date: schemeRecInfoData.date,
        totalamount: schemeRecInfoData.totalamt,
        totalgm: schemeRecInfoData.totalgm,
        EntryNo: schemeRecInfoData.EntryNo,
        agCode:parseInt(agentCode),
        type: transformedTableData, // Pass the entire tableData array
      });

      if (response.data.success) {
        const accountNumbers = transformedTableData.map(
          (row) => row.accountNumber
        );
        const mobileNumbersResponse = await axios.post(
          `${apiBaseUrl}/fetchMobileNos/${dbCode}`,
          {
            accountNumbers,
          }
        );

        if (mobileNumbersResponse.data) {
         // ////console.log("Mobile Numbers:", mobileNumbersResponse.data);

          // Send SMS to each mobile number
          mobileNumbersResponse.data.forEach(async (mobileNumber) => {
            const customerData = transformedTableData.find(
              (row) => row.accountNumber[0] === mobileNumber.accountNumber
            );

            if (customerData) {
           
              const grandTotal = customerData.amount;
              const netwt = mobileNumber.totalWt;
              const total=mobileNumber.totalAmt
              const gm = customerData.gm;
              // const smsResponse = await sendSMS(
              //   accNo.find((item) => item[0] ===  customerData.accountNumber),
              //   mobileNumber.mobileNo,
              //   cnameData.find((item) => item[0] === mobileNumber.accname),
              //   grandTotal,
              //   total,
              //   netwt,
              //   gm
              // );

              // ////console.log(`SMS sent to ${mobileNumber.mobileNo}:`, smsResponse);
            }
          });
        }



        handleClear();
        // Swal.fire("Success", "Data Edit successfully!", "success");
        alert("Entry Edited");
        // Optionally, you can perform additional actions after successful save
        setShowFind(true);

      } else {
        // Swal.fire("Error", "Failed to edit data!", "error");
        alert("Failed to edit data!");
      }
    } catch (error) {
      console.error("Error edit data:", error.message);
      // Swal.fire("Error", "Internal server error!", "error");
      alert("Internal server error!");
    }
    handleClear();
  };

  const getDisplayValue = (value) => {
    if (Array.isArray(value) && value.length > 0) {
      return value[0];
    }
    return "";
  };

  //////console.log("datra",tableData[0].accountNumber);

  const [accNoData, setAccNoData] = useState([]);
  // ////console.log("accNoData===", accNoData);
  // const fetchAccNoData = async (e, rowIndex) => {
  //   try {
  //     const response = await axios.get(
  //       `${apiBaseUrl}/findbyaccnotable/${e[1]}`
  //     );
  //     const fetchedData = response.data;
  //     const newData = [...tableData];

  //     // Check if fetched data exists and is in the correct format
  //     if (Array.isArray(fetchedData) && fetchedData.length > 0) {
  //       const { accname, agent } = fetchedData[0]; // Assuming only one record is fetched

  //       // Find the corresponding array in cnameData based on accname
  //       const matchingCnameData = cnameData.find((item) => item[0] === accname);

  //       // Find the corresponding array in agentName based on agent
  //       const matchingAgentData = agentName.find((item) => item[0] === parseInt(agentCode));

  //       // Update the name and agent fields of the current row in tableData
  //       if (rowIndex > 0 && rowIndex % 2 === 0) {
  //         newData[rowIndex - rowIndex / 2] = {
  //           ...newData[rowIndex - rowIndex / 2],
  //           name: matchingCnameData || [], // Store the matching array from cnameData or an empty array
  //           agent: matchingAgentData || [], // Store the matching array from agentName or an empty array
  //           accountNumber: e,
  //         };
  //       } else {
  //         newData[rowIndex] = {
  //           ...newData[rowIndex],
  //           name: matchingCnameData || [], // Store the matching array from cnameData or an empty array
  //           agent: matchingAgentData || [], // Store the matching array from agentName or an empty array
  //           accountNumber: e,
  //         };
  //       }
  //       setTableData(newData);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error.message);
  //   }
  // };


  const fetchAccNoData = async (e, rowIndex, agCode) => {
    try {

      // ////console.log("eeeee====",e.target.value);
      
      const response = await axios.get(
        `${apiBaseUrl}/findbyaccnotable/${e.target.value}/${dbCode}`
      );
      const fetchedData = response.data;
      const newData = [...tableData];

      // Check if fetched data exists and is in the correct format
      if (Array.isArray(fetchedData) && fetchedData.length > 0) {
        const { accname, agent } = fetchedData[0]; // Assuming only one record is fetched

        // Find the corresponding array in cnameData based on accname
        const matchingCnameData = cnameData.find((item) => item[0] === accname);

        // Find the corresponding array in agentName based on agent
        const matchingAgentData = agentName.find(
          (item) => item[0] === parseInt(agentCode)
        );

        // Update the name and agent fields of the current row in tableData
        if (rowIndex > 0 && rowIndex % 2 === 0) {
          newData[rowIndex - rowIndex / 2] = {
            ...newData[rowIndex - rowIndex / 2],
            name: matchingCnameData || [], // Store the matching array from cnameData or an empty array
            agent: matchingAgentData || [], // Store the matching array from agentName or an empty array
             accountNumber:accNo.find((item) => item[1] ===e.target.value)
          };
        } else {
          newData[rowIndex] = {
            ...newData[rowIndex],
            name: matchingCnameData || [], // Store the matching array from cnameData or an empty array
            agent: matchingAgentData || [], // Store the matching array from agentName or an empty array
            accountNumber:accNo.find((item) => item[1] ===e.target.value)
          };
        }
        setTableData(newData);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const [showFindDialog, setShowFindDialog] = useState(false); // State for controlling the visibility of the find dialog
  const [findEntryNo, setFindEntryNo] = useState(""); // State to store the entry number entered in the find dialog
  // ////console.log(findEntryNo);
  const openFindDialog = () => {
    setShowFindDialog(true);
  };

  const closeFindDialog = () => {
    setShowFindDialog(false);
    setFindEntryNo("");
  };

  // const handleFind = () => {

  //   ////console.log("Finding entry number:", findEntryNo);
  //   closeFindDialog();
  // };
  const [firstEno, setFirstEno] = useState("");
  const [lastEno, setLastEno] = useState("");
  // ////console.log(firstEno,lastEno);

  const fetchfirstandlast = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/topandlast/${parseInt(agentCode)}/${dbCode}`);
      if (response.status === 200) {
        setFirstEno(response.data[0].firstentryno);
        setLastEno(response.data[0].lastentryno);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };
  // ////console.log('accNo==',accNo);
  // ////console.log('accccc=',accNo.find((item) => item[0] === 10));

  const handleFindbyentrynumber = async () => {

    handleClearfind();
    try {
      const response = await axios.get(
        `${apiBaseUrl}/SchRecfindbyentryNo/${findEntryNo}/${parseInt(agentCode)}/${dbCode}`
      );

      if (response.status === 200) {
        const foundData = response.data;
        // ////console.log(foundData);
        //  ////console.log("data =", foundData);
        const newData = foundData.map((row) => ({
          //  SINo: row.Srp_entryno,
          name: cnameData.find((item) => item[0] === row.Srp_name),
          agent: agentName.find((item) => item[0] === row.Srp_agent),
          accountNumber: accNo.find((item) => item[0] === row.Srp_accountno),
          amount: row.Srp_amount, // You might need to adjust this based on your requirements
          gm: row.Srp_gm, // You might need to adjust this based on your requirements
          narration: row.Srp_narration, // You might need to adjust this based on your requirements
          printgm: row.Srp_printgm, // You might need to adjust this based on your requirements
        }));

        const firstRowData = foundData[0]; // Assuming SrInfo data is the same for all rows
        setschemeRecInfoData({
          ...schemeRecInfoData,
          EntryNo: firstRowData.SrInfo_entryno,
          cashAcc: selectcashAcc.find(
            (item) => item[0] === firstRowData.SrInfo_cashaccount
          ),
          rate: firstRowData.SrInfo_rate,
          date: formatDate(firstRowData.SrInfo_date),
          totalamt: firstRowData.SrInfo_totalamount,
          totalgm: firstRowData.SrInfo_totalgm,
        });
        // sr_AppEnable:foundData.Address1 || foundData,

        // Add the new data to tableData
        // Add the new data to tableData
        setTableData((prevTableData) => [...newData, ...prevTableData]);

        setEditDisabled(false);
        setDeleteDisabled(false);
        setSaveDisabled(true);
        setShowFind(false);
        

      } else {
        console.error("Error finding data:", response.data);
      }
    } catch (error) {
      console.error("Error:", error.message);
      //setDataFound(false);
    }
    closeFindDialog();
  };
  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  // ////console.log('formatted date',formatDate);

  const handleDelete = async () => {

    if (!window.confirm("Do You Want To Delete..?")) {
      return;
    }

    try {
      const response = await axios.delete(
        `${apiBaseUrl}/deleterecbyentryno/${schemeRecInfoData.EntryNo}/${parseInt(agentCode)}/${dbCode}`
      );
      if (response.status === 200) {
        // Swal.fire({
        //   position: "top-end",
        //   icon: "success",
        //   title: "Scheme deleted",
        //   showConfirmButton: false,
        //   timer: 2000,
        // });
        alert("Entry Deleted Successfully!");
        // window.location.reload();
        handleClear();
        setShowFind(true);

      } else {
        console.error("Error deleting data:", response.data);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };
  
    


  const handlePrint = () => {
    navigate("/printMob", {
      state: {
        receiptData: tableData,
        receiptInfo: schemeRecInfoData,
      }
    });
  };
  const [dispWt, setdispWt] = useState("");

  const dispTotalWt = async (index,e) => {
    // ////console.log("index===",index);
  //   if(e.key==='Enter'||e.key==='Return')
  //  {
     try {
      const response = await axios.get(
        `${apiBaseUrl}/totalweight/${tableData[ 0].name[0]}/${dbCode}`
        // `${apiBaseUrl}/totalweight/${e}`

      );
      var calcgm =0;
      if (e.target.value !== "" || null) {
        const Rate = schemeRecInfoData.rate;
        //  ////console.log("log rate", Rate);
        if (Rate !== 0) {
           calcgm = (e.target.value / Rate).toFixed(3);
          //  ////console.log("calcgm===",calcgm);
          
        }
      
       }
      const totalWeight = parseFloat(response.data[0].WeightDifference||0) + parseFloat(calcgm);
      
      // setdispWt(response.data[0].WeightDifference||0);
      setdispWt(totalWeight.toFixed(3));


      // ////console.log("res===",response.data[0].WeightDifference);
      // ////console.log("parse=", parseFloat(response.data[0].WeightDifference));
      
      // ////console.log("wt===",calcgm);
      // ////console.log("parse2", parseFloat(calcgm));
      
      // ////console.log("totalgm=",dispWt);
      


    } catch (error) {
      console.error("Error fetching data:", error);
    }
  // }
  //   else{
  //     return
  //   }
  };



  return (
    <div className="SchemeCashReceiptMobRoot">
      <div className="SchemeCashReceiptMobnavBar">
        <div
          className="SchemeCashReceiptMobnavBartoggle"
          onClick={() => {navigate("/home");
            setdispWt("");
          }}
        >
          <img src={home} alt="X"  />
        </div>
        <div className="schemeMobshesofttag"  style={{width:'35%',justifyContent:'left'}}>
          <img src={sslogo} alt="SS" />
          <label className="schemeMobshesofttaglabel">Scheme Receipt</label>
        </div>
 
        {showFind ? (
          <div className=" scherecmobnavitems" >
             <button
              className="SchemeRecMobnavBaritemsbuttons"
              onClick={handleClear}
            >
              <img
                src={clear}
                alt="Clear"
                className="SchemeRecMobbuttonimg"
              />
            </button>
            <button

              className="SchemeRecMobnavBaritemsbuttons"
              onClick={handleSave}
              ref={saveButtonRef}
              disabled={saveDisabled}

            >
              <img
                src={save}
                alt="Save"
                className="SchemeRecMobbuttonimg"
              />
            </button>
            
            <button
              className="SchemeRecMobnavBaritemsbuttons"
              ref={printButtonRef}
              disabled={printDisabled}
              onClick={handlePrint}
            >
              <img
                src={print}
                alt="Print"
                className="SchemeRecMobbuttonimg"
              />
            </button>
            <button
              className="SchemeRecMobnavBaritemsbuttons"
              // onClick={handleFindClick,handleFind}
              //   onClick={() => {
              //     // handleFindClick();
              //     handleFind();
              //   }}

              onClick={openFindDialog}
            >
              <img
                src={find}
                alt="Find"
                className="SchemeRecMobbuttonimg"
              />
            </button>
          </div>
        ) : (
          <div className="scherecmobnavitems">
             <button
              className="SchemeRecMobnavBaritemsbuttons"
              ref={printButtonRef}
              onClick={handlePrint}
            >
              <img
                src={print}
                alt="Print"
                className="SchemeRecMobbuttonimg"
              />
            </button>
            <button
              className="SchemeRecMobnavBaritemsbuttons"
              onClick={handleClear}
            >
              <img
                src={clear}
                alt="Clear"
                className="SchemeRecMobbuttonimg"
              />
            </button>
            <button
              className="SchemeRecMobnavBaritemsbuttons"
              onClick={handleEdit}
              disabled={editDisabled||userType!=='ADMIN'}
            >
              <img
                src={edit}
                alt="Edit"
                className="SchemeRecMobbuttonimg"
              />
            </button>
            <button

              className="SchemeRecMobnavBaritemsbuttons"
               onClick={handleDelete}
              disabled={deleteDisabled||userType!=='ADMIN'}
            >
              <img
                src={Delete}
                alt="Delete"
                className="SchemeRecMobbuttonimg"
              />
            </button>
          </div>
        )}
      </div>
      <div className="schemeRecMobBody">
        <div className="schemeRecMobBodySec1">
          <div className="schemeRecMobBodySec1Rowtop">
            <div className="schemeRecMobBodySec1RowCol">
              <label htmlFor="">Entry No</label>
              <input
                type="number"
                ref={entryNoInputRef}
                onKeyDown={(e) => handleKeyDown(e, dateInputRef)}
                readOnly
                style={{ textAlign: "center" }}
                value={schemeRecInfoData.EntryNo}
                onChange={(e) =>
                  setschemeRecInfoData({
                    ...schemeRecInfoData,
                    EntryNo: e.target.value,
                  })
                }
              />
            </div>
            <div className="schemeRecMobBodySec1RowCol">
              <label htmlFor="" className="datelabel">
                Date
              </label>
              <input
                type="date"
                className="dateinput"
                value={schemeRecInfoData.date}
                ref={dateInputRef}
                onKeyDown={(e) => handleKeyDown(e, cashaccinputRef)}
                onChange={(e) =>
                  setschemeRecInfoData({
                    ...schemeRecInfoData,
                    date: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="schemeRecMobBodySec1Row">
            <label htmlFor="">Select Cash Account</label>
            <ComboBox
              className="scheRecMobCashAccCombo"
              inputClassName="comboInputPadding"
              options={selectcashAcc}
              comboRef={cashaccinputRef}
              onKeyDown={(e) => handleKeyDown(e, rateInputRef)}
              findedValue={
                Array.isArray(schemeRecInfoData.cashAcc)
                  ? schemeRecInfoData.cashAcc[1]
                  : schemeRecInfoData.cashAcc
              }
              onInputChange={(e) =>
                setschemeRecInfoData({ ...schemeRecInfoData, cashAcc: e })
              }
              readOnly={userType==='EMPLOYEE'?true:false}

            />
          </div>
          <div className="schemeRecMobBodySec1Row">
            <label htmlFor="">Rate</label>
            <input
              ref={rateInputRef}
              onKeyDown={(e) => handleKeyDown(e, accnoRef)}
              value={schemeRecInfoData.rate}
              type="number"
              onChange={(e) =>
                setschemeRecInfoData({
                  ...schemeRecInfoData,
                  rate: e.target.value,
                })
              }
              style={{ textAlign: "right" }}
            />
          </div>
        </div>
        <div className="schemeRecMobBodySec2">
         
          <div className="schemeRecMobBodySec2Row">
            <label htmlFor="">Account Number</label>
            <ComboBox
              className="scheRecMobCashAccCombo"
              inputClassName="comboInputPadding"

              options={accNo}
              comboRef={accnoRef}
              onKeyDown={(e) => handleKeyDown(e, amountInputRef)}
              findedValue={
                Array.isArray(tableData[0]?.accountNumber)
                  ? tableData[0]?.accountNumber?.[1] ?? ""
                  : tableData[0]?.accountNumber
              }
              onInputChange={(e) => {
                handleCellChange(e, 0, "accountNumber");
              }}
              onBlur={  (e)=>  fetchAccNoData(e, 0)
              }
              inlineStyles={{ textAlign: "right" }}
            />
          </div>
          <div className="schemeRecMobBodySec2Row">
            <label htmlFor="">Name</label>
            <ComboBox
              className="scheRecMobCashAccCombo"
              inputClassName="comboInputPadding"

              options={cnameData}
              comboRef={accnameRef}
              onKeyDown={(e) => {
                handleKeyDown(e, agentRef);
                checkNameExists(e);
              }}
              findedValue={
                Array.isArray(tableData[0]?.name)
                  ? tableData[0]?.name?.[1] ?? ""
                  : tableData[0]?.name
              }
              onInputChange={(e) => {
                handleCellChange(e, 0, "name");

                // handleNameSelection(
                //   e,
                //   rowIndex > 0 && rowIndex % 2 === 0
                //     ? rowIndex - rowIndex / 2
                //     : rowIndex
                // );
              }}
            />
          </div>
          <div className="schemeRecMobBodySec2Row">
            <label htmlFor="">Agent</label>
            <ComboBox
              className="scheRecMobCashAccCombo"
              inputClassName="comboInputPadding"

              options={agentName}
              comboRef={agentRef}
              onKeyDown={(e) => handleKeyDown(e, amountInputRef)}
              findedValue={
                Array.isArray(tableData[0]?.agent)
                  ? tableData[0]?.agent?.[1] ?? ""
                  : tableData[0]?.agent
              }
              onInputChange={(e) => handleCellChange(e, 0, "agent")}
              readOnly={true}

            />
          </div>
          <div
            className="schemeRecMobBodySec2Rowamount"
            //  style={{ backgroundColor: "blue" }}
          >
            <div className="schemeRecMobBodySec2Rowcol1">
              <label htmlFor="">Amount</label>
              <input
                type="number"
                ref={amountInputRef}
                onKeyDown={(e) => handleKeyDown(e, gmInputRef)}
                value={tableData[0]["amount"]}
                style={{ textAlign: "right" }}
                onChange={(e) => {
                  handleCellChangeinput(e, 0, "amount");
                }}
                onBlur={(e) => {
                  calculateGmvalue(e.target.value, 0);
                  dispTotalWt(0,e);
                }}
              />
            </div>
            <div className="schemeRecMobBodySec2Rowcol2">
              <label htmlFor="">Gm</label>
              <input
                ref={gmInputRef}
                onKeyDown={(e) => handleKeyDown(e, printgmRef)}
                readOnly
                value={tableData[0]["gm"]}
                style={{ textAlign: "right" }}
                onChange={(e) => handleCellChangeinput(e, 0, "gm")}
              />
            </div>
            <div className="schemeRecMobBodySec2Rowcol3">
              <input
                ref={printgmRef}
                onKeyDown={(e) => handleKeyDown(e, narrationInputRef)}
                checked={tableData[0]["printgm"] === 1}
                type="checkbox"
                onChange={(e) => handleCellChangeinput(e, 0, "printgm")}
              />
              <label htmlFor="">Print Gm</label>
            </div>
          </div>
          <div
            className="schemeRecMobBodySec2Row"
            //  style={{ backgroundColor: "blue" }}
          >
           
              <label htmlFor="">TW</label>
              <input
                type="number"
                value={dispWt}
                readOnly
                
              />
           
          </div>

          <div className="schemeRecMobBodySec2Row2">
            <label htmlFor="">Narration</label>
            <input
              type="text"
              ref={narrationInputRef}
              onKeyDown={(e) => handleKeyDown(e, saveButtonRef)}
              value={tableData[0]["narration"]}
              onChange={(e) => handleCellChangeinput(e, 0, "narration")}
            />
          </div>
          

        
        </div>
      </div>
      {showFindDialog && (
        <div className="find_dialog_scheRecMob">
          <input
            type="text"
            value={findEntryNo}
            onChange={(e) => setFindEntryNo(e.target.value)}
            placeholder="Enter Entry No"
           
          />
          <button  onClick={handleFindbyentrynumber}>
            Find
          </button>
          <div
          className="findCloseDiv"
            onClick={() => {
              closeFindDialog();
              handleClear();
            }}
            style={{border:'none',backgroundColor:'transparent'}}
           
          >
            <img src={close} alt="Close"  style={{width:"100%",height:"100%"}}/>
          </div>
        </div>
      )}
    </div>
  );
}

export default SchemeCashReceiptMob;
