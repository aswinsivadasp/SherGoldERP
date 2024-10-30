

import "../styles/JournalEntry.css";
import "../styles/ContraEntry.css";
import React, { useState, useRef, useEffect, useContext } from "react";
import "../styles/SchemeRegistration.css";
import "../styles/SchemeCashReceipt.css";
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
import toggleClose from "../assets/images/xred.webp";
import close from "../assets/images/findclose.png";
//import ComboBox from "shersoft-combov1";
import ComboBox from "./ComboBox";
import axios from "axios";
import Swal from "sweetalert2";
import Print from "./Print";
import io from 'socket.io-client';
import { AuthContext } from "../context/AuthContext";
import { useDbContext } from "../context/DbContext";

function ContraEntry({ onClose,Open }) {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const { agentCode } = useContext(AuthContext);
  const { dbCode } = useDbContext();



  const agentCodeRef = useRef(agentCode);

  useEffect(() => {
    agentCodeRef.current = agentCode;
  }, [agentCode]);

  const [showPrintModel, setShowPrintModel] = useState(false);

  const [printData, setPrintData] = useState(null);

  const handleClosePrint = () => {
    setShowPrintModel(false);
  };
  const [startDate, setStartDate] = useState(new Date());
  /////////////table///////////
  const tableContainerRef = useRef(null);
  const cashaccref = useRef(null);

  const entryNoInputRef = useRef(null);
  const branchinputRef = useRef(null);
  const salesmaninputRef = useRef(null);

  const rateInputRef = useRef(null);
  const dateInputRef = useRef(null);
  const saveButtonRef = useRef(null);
  const editButtonRef = useRef(null);

  const addRow = () => {
    // ////console.log("add row called");
    setTableData([...tableData, {}]);
  };

  const [editDisabled, setEditDisabled] = useState(true);
  const [deleteDisabled, setDeleteDisabled] = useState(true);
  const [saveDisabled, setSaveDisabled] = useState(false);

  // const handleScroll = () => {
  //   const tableContainer = tableContainerRef.current;
  //   if (
  //     tableContainer.scrollTop + tableContainer.clientHeight >=
  //     tableContainer.scrollHeight - 1
  //   ) {
  //     // User has scrolled to the bottom, add new rows
  //     addRow();
  //   }
  // };

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
      debitAccount: "",
      creditAccount: "",
      amount: "",
      narration: "",
    }),
  ]);
//////console.log("tabledata",tableData);
  const openPrintModal = () => {
    fetchData();
    const slnoLimit = handleCheckSlno();
    if (selectedSlNo > slnoLimit || selectedSlNo <= 0) {
      alert("Enter SlNo Correctly");
      return;
    }

    setPrintData({
      tableData: tableData,
      cvInfoData: cvInfoData,
      index: selectedSlNo,
    });
    setShowPrintModel(true);
  };
  // ////console.log("table data ===== ", tableData);

  const [cvInfoData, setcvInfoData] = useState({
    EntryNo: "",
    Branch: [1, "SHOP"],
    Salesman: "",
    date: getCurrentDate(),
    totalamt: "",
  });

  // ////console.log("info data = ", cvInfoData);

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
        ".cventryDataTableBodyStyletr"
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
          const currentInputAccno = columnIndex === 1;

          if (currentInputAccno && !event.target.value.trim()) {
            // If the product name input is empty, move focus to other charges input

            if (saveDisabled) {
              // If save button is disabled, move focus to edit button
              editButtonRef.current.focus();
            } else {
              // If save button is enabled, move focus to save button
              saveButtonRef.current.focus();
            }
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
        const response = await axios.get(`${apiBaseUrl}/cv_entryno/${dbCode}`);
        //  ////console.log("response =", response);
        const schemeRecentryNo = response.data;

        setcvInfoData((prevData) => ({
          ...prevData,
          EntryNo: schemeRecentryNo,
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
      const response = await axios.get(`${apiBaseUrl}/cv_entryno/${dbCode}`);
      // ////console.log("response =", response);
      const schemeRecentryNo = response.data;

      setcvInfoData((prevData) => ({
        ...prevData,
        EntryNo: schemeRecentryNo,
      }));
    } catch (error) {
      console.error("Error fetching entry no:", error.message);
    }
  };

  

  //////////agent name///////////////

  const [agentName, setagentName] = useState([]);
  // const [agentobj, setAgentObj] = useState([]);

  useEffect(() => {
    const fetchAgname = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/jvschsalesmanNames/${dbCode}`);

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


  // const fetchAgname = async (searchTerm = '') => {
  //   try {
  //     const response = await axios.get(`${apiBaseUrl}/jvschsalesmanNames?search=${encodeURIComponent(searchTerm)}`);
  //     const AgName = response.data;
  //     const transformedData = AgName.map((item) => [item.Auto, item.Name]);
  //     setagentName(transformedData);
  //   } catch (error) {
  //     console.error("Error fetching agent Values:", error.message);
  //   }
  // };
  // const handleAgentSearch = (searchTerm) => {
  //   fetchAgname(searchTerm);
  // };

  ////////////////////ledger/////////////////////
  
  const backtrackfocus=()=>{
    const rowIndex = sessionStorage.getItem('contraEntryRowIndex');
    const columnIndex = sessionStorage.getItem('contraEntryColumnIndex');

    const tableContainer = tableContainerRef.current;
    const rows = tableContainer.querySelectorAll(
      ".cventryDataTableBodyStyletr"
    );

    // Check if the row at the specified index exists
    if (rows[rowIndex]) {
      // Determine the next column index
      const nextColumnIndex =
        columnIndex-1 < rows[rowIndex].cells.length - 1 ? columnIndex : 0;

      // Find the input field in the next column
      const nextInput =
        rows[rowIndex]?.cells[nextColumnIndex]?.querySelector("input");

      if (nextInput) {
        // Check if the current input field is the product name input field
       

          nextInput.focus();
        
      }
    }
    sessionStorage.removeItem('contraEntryRowIndex');
    sessionStorage.removeItem('contraEntryColumnIndex');

  }

  const [LedgerName, setLedgerName] = useState([]);

  useEffect(() => {
    const fetchLgname = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/cvledgernames/${dbCode}`);

        // Assuming response.data is an array with objects and each object has a LedName property
        const LgName = response.data;

        // Transforming the array into the desired format
        // const supplName = cName.map((item) => item.LedName);

        const transformedData = LgName.map((item) => [
          item.ledcode,
          item.LedName,
        ]);
        setLedgerName(transformedData);

        // setsupplierName(supplName);
      } catch (error) {
        console.error("Error fetching agent Values:", error.message);
      }
      backtrackfocus();
    };

    fetchLgname();


        // Connect to the WebSocket server
    const socket = io(apiBaseUrl); // Make sure the URL matches your backend server
    socket.on('dataUpdated', () => {
   //   ////console.log('Data updated, fetching new data...');
      fetchLgname(); // Re-fetch the data when an update is detected
    });

    return () => {
      socket.disconnect(); // Clean up the socket connection on component unmount
   //   ////console.log("socketdisconneccted");
    };

  }, [apiBaseUrl]);




  const handleCheckLedger = (e,rowIndex,columnIndex) => {
    // ////console.log('regcustom',AcNames);

    const targetValue = e.target.value;

    const isValuePresent = LedgerName.some((item) => item[1] === targetValue);

    if (!isValuePresent && e.target.value !== "") {

      if (!window.confirm("Ledger Does not Exists,Create New..?")) {
        return;
      }
      Open(e,rowIndex,columnIndex);
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
    setcvInfoData((prevState) => ({
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

    setcvInfoData({
      Branch: [1, "SHOP"],
      Salesman: "",
      date: getCurrentDate(),
    });

    setTableData([
      ...Array(14).fill({
        SINo: "",
        debitAccount: "",
        creditAccount: "",
        amount: "",
        narration: "",
      }),
    ]);

    entryNoInputRef.current.focus();
    setRowIndex(0);
    setEditDisabled(true);
    setDeleteDisabled(true);
    setSaveDisabled(false);

    // const [editDisabled, setEditDisabled] = useState(true);
    // const [deleteDisabled, setDeleteDisabled] = useState(true);
    // const [saveDisabled, setSaveDisabled] = useState(false);
  };

  const handleClearfind = () => {
    setcvInfoData({
      Branch: [1, "SHOP"],
      Salesman: "",
      date: getCurrentDate(),
    });

    setTableData([
      ...Array(14).fill({
        SINo: "",
        debitAccount: "",
        creditAccount: "",
        amount: "",
        narration: "",
      }),
    ]);

    entryNoInputRef.current.focus();
    setRowIndex(0);
    setEditDisabled(true);
    setDeleteDisabled(true);
    setSaveDisabled(false);

    // const [editDisabled, setEditDisabled] = useState(true);
    // const [deleteDisabled, setDeleteDisabled] = useState(true);
    // const [saveDisabled, setSaveDisabled] = useState(false);
  };
  ////////////////////////////////////////////////////////

  const handleSave = async () => {
    setSaveDisabled(true);

    try {

      const hasIncompleteData = tableData.some((row) => {
        return (
          Object.values(row).some((value) => value !== "") &&
          (!row.debitAccount || !row.creditAccount || !row.amount|| !cvInfoData.Salesman)
        );
      });
  
      if (hasIncompleteData) {
        alert("Enter Data Correctly.");
        setSaveDisabled(false);
        return;
      }


      const hasData = tableData.some((row) => {
        return (
          row.debitAccount &&
          row.creditAccount &&
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
        debitAccount: row.debitAccount[0] || null,
        creditAccount: row.creditAccount[0] || null,
        amount: parseInt(row.amount) || null,
        narration: row.narration || null,
      }));
      // ////console.log("transformedTableData", transformedTableData);
      const response = await axios.post(`${apiBaseUrl}/savecventry/${dbCode}`, {
        Branch: cvInfoData.Branch[0],
        Salesman: cvInfoData.Salesman[0],
        date: cvInfoData.date,
        EntryNo: cvInfoData.EntryNo,
        totalAmount: cvInfoData.totalamt,
        type: transformedTableData, // Pass the entire tableData array
      });

      if (response.data.success) {
        handleClear();
        //  Swal.fire("Success", "Data saved successfully!", "success");

        alert("Entry Saved");

        // Optionally, you can perform additional actions after successful save
      } else {
        //Swal.fire("Error", "Failed to save data!", "error");
        // alert("Failed to save data!");
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

      const hasIncompleteData = tableData.some((row) => {
        return (
          Object.values(row).some((value) => value !== "") &&
          (!row.debitAccount || !row.creditAccount || !row.amount|| !cvInfoData.Salesman)
        );
      });
  
      if (hasIncompleteData) {
        alert("Enter Data Correctly.");
        setSaveDisabled(false);
        return;
      }



      if (!cvInfoData.Branch) {
        alert("Enter Data  Correctly.");
        return;
      }

      const hasData = tableData.some((row) => {
        return (
          row.debitAccount &&
          row.creditAccount &&
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
        debitAccount: row.debitAccount[0] || null,
        creditAccount: row.creditAccount[0] || null,
        amount: parseInt(row.amount) || null,
        narration: row.narration || null,
      }));
      //////console.log("transformedTableData", transformedTableData);
      const response = await axios.post(`${apiBaseUrl}/cvupdate/${dbCode}`, {
        Branch: cvInfoData.Branch[0],
        Salesman: cvInfoData.Salesman[0],
        date: cvInfoData.date,
        EntryNo: cvInfoData.EntryNo,
        type: transformedTableData, // Pass the entire tableData array
      });

      if (response.data.success) {
        //   handleClear();

        // Swal.fire("Success", "Data Edit successfully!", "success");

        alert("Entry Edited");
        // Optionally, you can perform additional actions after successful save
        entryNoInputRef.current.focus();
      } else {
        // Swal.fire("Error", "Failed to edit data!", "error");
        alert("Failed to edit data!");
      }
    } catch (error) {
      console.error("Error edit data:", error.message);
      // Swal.fire("Error", "Internal server error!", "error");
      alert("Internal server error!");
    }
    // handleClear();
  };


  //////console.log("datra",tableData[0].accountNumber);

  const [showFindDialog, setShowFindDialog] = useState(false); // State for controlling the visibility of the find dialog
  const [findEntryNo, setFindEntryNo] = useState(""); // State to store the entry number entered in the find dialog
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [selectedSlNo, setSelectedSlno] = useState("");

 // ////console.log(findEntryNo);
  const openFindDialog = () => {
    setShowFindDialog(true);
  };

  const closeFindDialog = () => {
    setShowFindDialog(false);
    setFindEntryNo("");
  };

  const openPrintDialog = () => {
    setShowPrintDialog(true);
  };

  const closePrintDialog = () => {
    setShowPrintDialog(false);
  };

  const [firstEno, setFirstEno] = useState("");
  const [lastEno, setLastEno] = useState("");
  //////console.log(firstEno,lastEno);

  const fetchfirstandlast = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/cvtopandlast/${dbCode}`);
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
      const response = await axios.get(`${apiBaseUrl}/findcv/${findEntryNo}/${dbCode}`);

      if (response.status === 200) {
        const foundData = response.data;
          ////console.log("data =", foundData);
        const newData = foundData.map((row) => ({
          //  SINo: row.Srp_entryno,
          debitAccount: LedgerName.find((item) => item[0] === row.Name),
          creditAccount: LedgerName.find((item) => item[0] === row.opposite),
          amount: row.DebitAmount,
          narration: row.narration, // You might need to adjust this based on your requirements
        }));

        const firstRowData = foundData[0]; // Assuming SrInfo data is the same for all rows
        setcvInfoData({
          ...cvInfoData,
          Branch: [1, "SHOP"],
          EntryNo: firstRowData.EntryNo[0],
          Salesman: agentName.find((item) => item[0] === firstRowData.SalesMan),
          date: formatDate(firstRowData.DDate),
          totalamt: firstRowData.Amount,
        });
        // sr_AppEnable:foundData.Address1 || foundData,

        // Add the new data to tableData
        // Add the new data to tableData
        setTableData((prevTableData) => [...newData, ...prevTableData]);

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
        `${apiBaseUrl}/deletecv/${cvInfoData.EntryNo}/${dbCode}`
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
      } else {
        console.error("Error deleting data:", response.data);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const handleFindprev = async (e) => {
    fetchfirstandlast();
    if (cvInfoData.EntryNo > firstEno) {
      handleClearfind();
    }
    // else{
    //   return;
    // }
    try {
      const response = await axios.get(
        `${apiBaseUrl}/cvprevs/${cvInfoData.EntryNo}/${dbCode}`
      );

      //  ////console.log("response=",response.data);
      if (response.status === 200) {
        const foundData = response.data;
        //////console.log(foundData);
        //  ////console.log("data =", foundData);
        const newData = foundData.map((row) => ({
          //  SINo: row.Srp_entryno,
          debitAccount: LedgerName.find((item) => item[0] === row.Name),
          creditAccount: LedgerName.find((item) => item[0] === row.opposite),
          amount: row.DebitAmount,
          narration: row.narration, // You might need to adjust this based on your requirements
        }));

        const firstRowData = foundData[0]; // Assuming SrInfo data is the same for all rows
        setcvInfoData({
          ...cvInfoData,
          Branch: [1, "SHOP"],
          EntryNo: firstRowData.EntryNo[0],
          Salesman: agentName.find((item) => item[0] === firstRowData.SalesMan),
          date: formatDate(firstRowData.DDate),
          totalamt: firstRowData.Amount,
        });
        // sr_AppEnable:foundData.Address1 || foundData,

        // Add the new data to tableData
        // Add the new data to tableData
        setTableData((prevTableData) => [...newData, ...prevTableData]);

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
    fetchfirstandlast();
    if (cvInfoData.EntryNo < lastEno) {
      handleClearfind();
    }

    try {
      const response = await axios.get(
        `${apiBaseUrl}/cvnext/${cvInfoData.EntryNo}/${dbCode}`
      );

      if (response.status === 200) {
        const foundData = response.data;
        //////console.log(foundData);
        //  ////console.log("data =", foundData);
        const newData = foundData.map((row) => ({
          //  SINo: row.Srp_entryno,
          debitAccount: LedgerName.find((item) => item[0] === row.Name),
          creditAccount: LedgerName.find((item) => item[0] === row.opposite),
          amount: row.DebitAmount,
          narration: row.narration, // You might need to adjust this based on your requirements
        }));

        const firstRowData = foundData[0]; // Assuming SrInfo data is the same for all rows
        setcvInfoData({
          ...cvInfoData,
          Branch: [1, "SHOP"],
          EntryNo: firstRowData.EntryNo[0],
          Salesman: agentName.find((item) => item[0] === firstRowData.SalesMan),
          date: formatDate(firstRowData.DDate),
          totalamt: firstRowData.Amount,
        });
        // sr_AppEnable:foundData.Address1 || foundData,

        // Add the new data to tableData
        // Add the new data to tableData
        setTableData((prevTableData) => [...newData, ...prevTableData]);

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

  const handleFindfirst = async () => {
    handleClearfind();
    try {
      const response = await axios.get(`${apiBaseUrl}/cvfirst/${dbCode}`);

      if (response.status === 200) {
        const foundData = response.data;
      //  ////console.log(foundData);
        //  ////console.log("data =", foundData);
        const newData = foundData.map((row) => ({
          //  SINo: row.Srp_entryno,
          debitAccount: LedgerName.find((item) => item[0] === row.Name),
          creditAccount: LedgerName.find((item) => item[0] === row.opposite),
          amount: row.DebitAmount,
          narration: row.narration, // You might need to adjust this based on your requirements
        }));

        const firstRowData = foundData[0]; // Assuming SrInfo data is the same for all rows
        setcvInfoData({
          ...cvInfoData,
          Branch: [1, "SHOP"],
          EntryNo: firstRowData.EntryNo[0],
          Salesman: agentName.find((item) => item[0] === firstRowData.SalesMan),
          date: formatDate(firstRowData.DDate),
          totalamt: firstRowData.Amount,
        });
        // sr_AppEnable:foundData.Address1 || foundData,

        // Add the new data to tableData
        // Add the new data to tableData
        setTableData((prevTableData) => [...newData, ...prevTableData]);

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

  const handleFindlast = async () => {
    handleClearfind();
    try {
      const response = await axios.get(
        `${apiBaseUrl}/cvlast/${dbCode}`
      );

      if (response.status === 200) {
        const foundData = response.data;
        //////console.log(foundData);
        //  ////console.log("data =", foundData);
        const newData = foundData.map((row) => ({
          //  SINo: row.Srp_entryno,
          debitAccount: LedgerName.find((item) => item[0] === row.Name),
          creditAccount: LedgerName.find((item) => item[0] === row.opposite),
          amount: row.DebitAmount,
          narration: row.narration, // You might need to adjust this based on your requirements
        }));

        const firstRowData = foundData[0]; // Assuming SrInfo data is the same for all rows
        setcvInfoData({
          ...cvInfoData,
          Branch: [1, "SHOP"],
          EntryNo: firstRowData.EntryNo[0],
          Salesman: agentName.find((item) => item[0] === firstRowData.SalesMan),
          date: formatDate(firstRowData.DDate),
          totalamt: firstRowData.Amount,
        });
        // sr_AppEnable:foundData.Address1 || foundData,

        // Add the new data to tableData
        // Add the new data to tableData
        setTableData((prevTableData) => [...newData, ...prevTableData]);

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
  const handleCheckSlno = () => {
    const filteredTableData = tableData.filter((row) => {
      // Check if any of the fields in the row is not empty
      return Object.values(row).some((value) => value !== "");
    });
    const filteredTableDataLength = filteredTableData.length;
    return filteredTableDataLength;
  };

  const [accumulatedWt, setaccumulatedWt] = useState("");
  // ////console.log("accumulatedWt",accumulatedWt);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${apiBaseUrl}/totalweight/${tableData[selectedSlNo - 1 || 0].name[0]}/${dbCode}`
      );
      //////console.log("res===",response.data);
      setaccumulatedWt(response.data[0].WeightDifference);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    // <div className="regmodal-overlay">
    <div className="regmodal ">
      <div className="schemecontrolls">
        {/* ///////// */}
        <div className="schemereg_headerLogo_Div">
          <div className="schemereg_headerLogo" onClick={handleCheckSlno}>
            <img src={headeLogo} alt="SherSoftLogo" />
          </div>
          <label className="schemeReg_pageHead">Contra Entry</label>
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
          className={`schemeNav_items `}
          ref={saveButtonRef}
          onClick={handleSave}
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
          onClick={openPrintDialog}
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
          // onClick={handleFind}
          onClick={openFindDialog}
        >
          <div className="schemeReg_buttonImage">
            <img src={findImg} alt="findImg" />
          </div>
          Find
        </button>
        <button
          ref={editButtonRef}
          style={{ border: "none", backgroundColor: "transparent" }}
          className={`schemeNav_items }`}
          onClick={handleEdit}
          // disabled={!dataFound}
          disabled={editDisabled}
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
            onClick={(e) => {
              handleFindfirst(e);
            }}
          >
            <img src={playandpause} alt="playandpause" />
          </button>
          <button
            style={{ backgroundColor: "transparent" }}
            className="schemeReg_arrowButtonImage"
            onClick={(e) => {
              handleFindprev(e);
            }}
          >
            <img src={leftarrow} alt="leftarrow" />
          </button>
          <button
            style={{ backgroundColor: "transparent" }}
            className="schemeReg_arrowButtonImage"
            onClick={(e) => {
              handleFindnext(e);
            }}
          >
            <img src={rightarrow} alt="rightarrow" />
          </button>
          <button
            style={{ backgroundColor: "transparent", marginRight: "2%" }}
            className="schemeReg_arrowButtonImage"
            onClick={(e) => {
              handleFindlast(e);
            }}
          >
            <img src={playandpauseRight} alt="playandpauseRight" />
          </button>
        </div>
      </div>
      {/*............................ NavbarEnd.............................................. */}

      <div className="cventryBody">
        <div className="cventryBodyData">
          <div className="cventryTopdata">
            <div className="cventryTopdatasections cventrysec1">
              <div className="cventryTopdatasectionsrows">
                <label>Entry No</label>
                <input
                  ref={entryNoInputRef}
                  readOnly
                  style={{ textAlign: "center" }}
                  value={cvInfoData.EntryNo}
                  onKeyDown={(e) => handleKeyDown(e, branchinputRef)}
                  onChange={(e) =>
                    setcvInfoData({
                      ...cvInfoData,
                      EntryNo: e.target.value,
                    })
                  }
                />
              </div>
              <div className="cventryTopdatasectionsrows"></div>
            </div>
            <div className="cventryTopdatasections cventrysec2">
              <div className="cventryTopdatasectionsrows sec2row">
                <label>Select Branch</label>
                <ComboBox
                  //    findedValue={schemeRecInfoData.cashAcc[0]}
                  findedValue={
                    Array.isArray(cvInfoData.Branch)
                      ? cvInfoData.Branch[1]
                      : cvInfoData.Branch
                  }
                  comboRef={branchinputRef}
                  // options={selectcashAcc}
                  options={[[1, "SHOP"]]}
                  className="cashaccCombo"
                  inputClassName="cashaccComboinput"
                  onKeyDown={(e) => {
                    handleKeyDown(e, salesmaninputRef);
                    // checkledgerExists(e);
                  }}
                  onInputChange={(e) =>
                    setcvInfoData({ ...cvInfoData, Branch: e })
                  }
                />
              </div>
              <div className="cventryTopdatasectionsrows sec2row">
                <label>Select Salesman</label>

                <ComboBox
                  //    findedValue={schemeRecInfoData.cashAcc[0]}
                  findedValue={
                    Array.isArray(cvInfoData.Salesman)
                      ? cvInfoData.Salesman[1]
                      : cvInfoData.Salesman
                  }
                  comboRef={salesmaninputRef}
                  options={agentName}
                  className="cashaccCombo"
                  inputClassName="cashaccComboinput"
                  onKeyDown={(e) => {
                    handleKeyDown(e, dateInputRef);
                  }}
                  onInputChange={(e) =>{
                    setcvInfoData({ ...cvInfoData, Salesman: e });
                  //  handleAgentSearch(e)
                  
                  }
                    
                  }
                />
              </div>
            </div>
            <div className="cventryTopdatasections  cventrySec3">
              <div
                className="cventryTopdatasectionsrows sec3row"
                style={{ width: "14vw" }}
              >
                <label>Date</label>
                <input
                  value={cvInfoData.date}
                  type="date"
                  ref={dateInputRef}
                  onKeyDown={(e) => handleKeyDownTable(e, RowIndex, 0)}
                  onChange={(e) =>
                    setcvInfoData({
                      ...cvInfoData,
                      date: e.target.value,
                    })
                  }
                />
              </div>
              {/* <div
                className="cventryTopdatasectionsrows sec3row"
                style={{ backgroundColor: "blue" }}
              >
                
              </div> */}
            </div>
          </div>

          {/*---------------- receipt data table.----------------------- */}

          <div
            className="cventryDataTable"
            //  onScroll={handleScroll}
            ref={tableContainerRef}
          >
            <table>
              <thead className="cventryDataTableHead">
                <tr>
                  <th className="cventryDataTableHeadslno">SI No</th>
                  <th className="cventryDataTableHeadDbAcc">
                    Select Debit Account
                  </th>
                  <th className="cventryDataTableHeadCbAcc">
                    Select Credit Account
                  </th>
                  <th className="cventryDataTableHeadamount">Amount</th>
                  <th className="cventryDataTableHeadnarration">Narration</th>
                </tr>
              </thead>
              <tbody className="cventryDataTableBodyStyle">
                {tableData.map((rowData, rowIndex) => (
                  <tr
                    key={rowIndex}
                    style={{
                      background:
                        rowIndex % 2 === 1 ? "#EBEBEB" : "transparent",
                    }}
                    className="cventryDataTableBodyStyletr"
                  >
                    <td
                      className="cventryDataTableDataBoxSlno"
                      style={{ textAlign: "center" }}
                    >
                      {rowIndex % 2 === 0 ? rowIndex / 2 + 1 : ""}
                    </td>

                    <td
                      className="cventryDataTableDataBoxDbAcc"
                      style={{ width: "22%" }}
                    >
                      {rowIndex % 2 === 0 && (
                        <ComboBox
                          /*here because of the empty lines betwwen the rows of the table ,while saving the data to the state there is an empty rows storing. 
                          there for i am changing the row index values according to the row index.
                          if the row index is odd that means it is an empty row so i stores that to the prevoius index. */

                          findedValue={
                            Array.isArray(
                              tableData[
                                rowIndex > 0 && rowIndex % 2 === 0
                                  ? rowIndex - rowIndex / 2
                                  : rowIndex
                              ]?.debitAccount
                            )
                              ? tableData[
                                  rowIndex > 0 && rowIndex % 2 === 0
                                    ? rowIndex - rowIndex / 2
                                    : rowIndex
                                ]?.debitAccount?.[1] ?? ""
                              : tableData[
                                  rowIndex > 0 && rowIndex % 2 === 0
                                    ? rowIndex - rowIndex / 2
                                    : rowIndex
                                ]?.debitAccount
                          }
                          options={LedgerName}
                          className="cventryDataTableDataBox test"
                          inputClassName="dataBox"
                          comboRef={(ref) => `combo_${rowIndex}`}
                          onKeyDown={(e) => {
                            handleKeyDownTable(e, rowIndex, 1);
                            //checkNameExists(e);
                          }}
                          onInputChange={(e) => {
                            handleCellChange(e, rowIndex, "debitAccount");
                          }}
                          onBlur={(e) => handleCheckLedger(e,rowIndex,1)}

                        />
                      )}
                    </td>

                    <td
                      className="cventryDataTableDataBoxCdAcc"
                      style={{ width: "22%" }}
                    >
                      {rowIndex % 2 === 0 && (
                        <ComboBox
                          findedValue={
                            Array.isArray(
                              tableData[
                                rowIndex > 0 && rowIndex % 2 === 0
                                  ? rowIndex - rowIndex / 2
                                  : rowIndex
                              ]?.creditAccount
                            )
                              ? tableData[
                                  rowIndex > 0 && rowIndex % 2 === 0
                                    ? rowIndex - rowIndex / 2
                                    : rowIndex
                                ]?.creditAccount?.[1] ?? ""
                              : tableData[
                                  rowIndex > 0 && rowIndex % 2 === 0
                                    ? rowIndex - rowIndex / 2
                                    : rowIndex
                                ]?.creditAccount
                          }
                          options={LedgerName}
                          className="cventryDataTableDataBox test"
                          inputClassName="dataBox"
                          comboRef={(ref) => `combo_${rowIndex}`}
                          onKeyDown={(e) => {handleKeyDownTable(e, rowIndex, 2)

                           // checkNameExists(e);

                          }}
                          onInputChange={(e) =>
                            handleCellChange(e, rowIndex, "creditAccount")
                          }
                          //readOnly={true}
                          onBlur={(e) => handleCheckLedger(e,rowIndex,2)}

                        />
                      )}
                    </td>

                    <td className="cventryDataTableDataBoxamount">
                      {rowIndex % 2 === 0 && (
                        <input
                          value={
                            tableData[
                              rowIndex > 0 && rowIndex % 2 === 0
                                ? rowIndex - rowIndex / 2
                                : rowIndex
                            ]["amount"]
                          }
                          className="cventryDataTableDataBox textalignRight"
                          style={{ textAlign: "right" }}
                          onChange={(e) => {
                            handleCellChangeinput(e, rowIndex, "amount");
                          }}
                          onKeyDown={(e) => {
                            handleKeyDownTable(e, rowIndex, 3);
                          }}
                          type="number"
                        />
                      )}
                    </td>

                    <td className="cventryDataTableDataBoxStonenarration">
                      {rowIndex % 2 === 0 && (
                        <input
                          value={
                            tableData[
                              rowIndex > 0 && rowIndex % 2 === 0
                                ? rowIndex - rowIndex / 2
                                : rowIndex
                            ]["narration"]
                          }
                          className="cventryDataTableDataBox textalignRight"
                          onKeyDown={(e) => {
                            addRow();
                            handleKeyDownTable(e, rowIndex + 2, 0);
                          }}
                          onChange={(e) =>
                            handleCellChangeinput(e, rowIndex, "narration")
                          }
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="cventryDataTablefootertotal">
            <input
              className="cventryDataTablefootertotalamount"
              value={cvInfoData.totalamt}
              style={{ textAlign: "right" }}
              onChange={(e) =>
                cvInfoData({
                  ...cvInfoData,
                  totalamt: e.target.value,
                })
              }
              readOnly
            />

            {/* <input
              className="cventryDataTablefootertotalGm"
              value={cvInfoData.totalgm}
              style={{ textAlign: "right" }}
              onChange={(e) =>
                setcvInfoData({
                  ...cvInfoData,
                  totalgm: e.target.value,
                })
              }
            /> */}
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
          <button onClick={handleFindbyentrynumber}>Find</button>
          {/* <button
            onClick={() => {
              closeFindDialog();
              handleClear();
            }}
          >
            Cancel
          </button> */}
          <div
            className="findCloseDiv"
            onClick={() => {
              closeFindDialog();
              handleClear();
            }}
            style={{ border: "none", backgroundColor: "transparent" }}
          >
            <img
              src={close}
              alt="Close"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>
      )}

      {showPrintDialog && (
        <div className="find-dialog">
          <input
            type="text"
            // value={findEntryNo}
            onChange={(e) => setSelectedSlno(e.target.value)}
            placeholder="Enter Sl No"
          />
          <button onClick={openPrintModal}>Print</button>
          <div
            className="findCloseDiv"
            onClick={() => {
              closePrintDialog();
              handleClear();
            }}
            style={{ border: "none", backgroundColor: "transparent" }}
          >
            <img
              src={close}
              alt="Close"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>
      )}
      {showPrintModel && (
        <Print
          printData={printData}
          onClose={handleClosePrint}
          totalwt={accumulatedWt}
        />
      )}
    </div>
    // </div>
  );
}

export default ContraEntry;
