import "../styles/CashReceipt.css";
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
import io from "socket.io-client";
import { AuthContext } from "../context/AuthContext";
import { useDbContext } from "../context/DbContext";

function CashReceipt({ onClose, Open, ledgerJustClosed }) {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const { agentCode } = useContext(AuthContext);

  const { dbCode } = useDbContext();

  const ledstatus = () => {
    // ////console.log("ledstatus");
  };

  useEffect(() => {
    if (ledgerJustClosed) {
      ledstatus();
    }
  }, [ledgerJustClosed]);

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

  const openPrintModal = () => {
    fetchData();
    const slnoLimit = handleCheckSlno();
    if (selectedSlNo > slnoLimit || selectedSlNo <= 0) {
      alert("Enter SlNo Correctly");
      return;
    }

    setPrintData({
      tableData: tableData,
      jvInfoData: jvInfoData,
      index: selectedSlNo,
    });
    setShowPrintModel(true);
  };
  // ////console.log("table data ===== ", tableData);

  const [jvInfoData, setJvInfoData] = useState({
    EntryNo: "",
    Branch: [1, "CASH"],
    Salesman: "",
    date: getCurrentDate(),
    totalamt: "",
  });

  //  ////console.log("info data = ", jvInfoData);

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

  const backtrackfocus = () => {
    const rowIndex = sessionStorage.getItem("journalEntryRowIndex");
    const columnIndex = sessionStorage.getItem("journalEntryColumnIndex");

    const tableContainer = tableContainerRef.current;
    const rows = tableContainer.querySelectorAll(
      ".cashRecDataTableBodyStyletr"
    );

    // Check if the row at the specified index exists
    if (rows[rowIndex]) {
      // Determine the next column index
      const nextColumnIndex =
        columnIndex - 1 < rows[rowIndex].cells.length - 1 ? columnIndex : 0;

      // Find the input field in the next column
      const nextInput =
        rows[rowIndex]?.cells[nextColumnIndex]?.querySelector("input");

      if (nextInput) {
        // Check if the current input field is the product name input field

        nextInput.focus();
      }
    }
    sessionStorage.removeItem("journalEntryRowIndex");
    sessionStorage.removeItem("journalEntryColumnIndex");
  };
  // ////console.log(RowIndex);

  const handleKeyDownTable = (event, rowIndex, columnIndex) => {
    if (event.key === "Enter" || event.key === "Return") {
      event.preventDefault();

      const tableContainer = tableContainerRef.current;
      const rows = tableContainer.querySelectorAll(
        ".cashRecDataTableBodyStyletr"
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
            // If the product name input is empty, move focus to save btn

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
        const response = await axios.get(
          `${apiBaseUrl}/main/jv_entryno/${dbCode}`
        );
        //  ////console.log("response =", response);
        const schemeRecentryNo = response.data;

        setJvInfoData((prevData) => ({
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
      const response = await axios.get(
        `${apiBaseUrl}/main/jv_entryno/${dbCode}`
      );
      // ////console.log("response =", response);
      const schemeRecentryNo = response.data;

      setJvInfoData((prevData) => ({
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
        const response = await axios.get(
          `${apiBaseUrl}/main/jvschsalesmanNames/${dbCode}`
        );

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
  //     const response = await axios.get(`${apiBaseUrl}/main/jvschsalesmanNames?search=${encodeURIComponent(searchTerm)}`);
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

  const [LedgerName, setLedgerName] = useState([]);

  useEffect(() => {
    const fetchLgname = async () => {
      try {
        const response = await axios.get(
          `${apiBaseUrl}/main/jvledgernames/${dbCode}`
        );

        // Assuming response.data is an array with objects and each object has a LedName property
        const LgName = response.data;

        // Transforming the array into the desired format
        // const supplName = cName.map((item) => item.LedName);

        const transformedData = LgName.map((item) => [
          item.Ledcode,
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
    socket.on("dataUpdated", () => {
      //   ////console.log('Data updated, fetching new data...');
      fetchLgname(); // Re-fetch the data when an update is detected
    });

    return () => {
      socket.disconnect(); // Clean up the socket connection on component unmount
      //   ////console.log("socketdisconneccted");
    };
  }, [apiBaseUrl]);

  const handleCheckLedger = (e, rowIndex, columnIndex) => {
    // ////console.log('regcustom',AcNames);
    // ////console.log("index==",rowIndex,columnIndex);

    const targetValue = e.target.value;

    const isValuePresent = LedgerName.some((item) => item[1] === targetValue);

    if (!isValuePresent && e.target.value !== "") {
      if (!window.confirm("Ledger Does not Exists,Create New..?")) {
        return;
      }
      Open(e, rowIndex, columnIndex);
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
    setJvInfoData((prevState) => ({
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

    setJvInfoData({
      Branch: [1, "CASH"],
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
    setJvInfoData({
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
          (!row.debitAccount ||
            !row.creditAccount ||
            !row.amount ||
            !jvInfoData.Salesman)
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
      const response = await axios.post(
        `${apiBaseUrl}/main/savejournal/${dbCode}`,
        {
          Branch: jvInfoData.Branch[0],
          Salesman: jvInfoData.Salesman[0],
          date: jvInfoData.date,
          EntryNo: jvInfoData.EntryNo,
          totalAmount: jvInfoData.totalamt,
          type: transformedTableData, // Pass the entire tableData array
        }
      );

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
          (!row.debitAccount ||
            !row.creditAccount ||
            !row.amount ||
            !jvInfoData.Salesman)
        );
      });

      if (hasIncompleteData) {
        alert("Enter Data Correctly.");
        setSaveDisabled(false);
        return;
      }

      if (!jvInfoData.Branch) {
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
      const response = await axios.post(
        `${apiBaseUrl}/main/jvupdate/${dbCode}`,
        {
          Branch: jvInfoData.Branch[0],
          Salesman: jvInfoData.Salesman[0],
          date: jvInfoData.date,
          EntryNo: jvInfoData.EntryNo,
          type: transformedTableData, // Pass the entire tableData array
        }
      );

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
      const response = await axios.get(
        `${apiBaseUrl}/main/jvtopandlast/${dbCode}`
      );
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
        `${apiBaseUrl}/main/findjv/${findEntryNo}/${dbCode}`
      );

      if (response.status === 200) {
        const foundData = response.data;
        //   ////console.log(foundData);
        //  ////console.log("data =", foundData);
        const newData = foundData.map((row) => ({
          //  SINo: row.Srp_entryno,
          debitAccount: LedgerName.find((item) => item[0] === row.Name),
          creditAccount: LedgerName.find((item) => item[0] === row.opposite),
          amount: row.DebitAmount,
          narration: row.narration, // You might need to adjust this based on your requirements
        }));

        const firstRowData = foundData[0]; // Assuming SrInfo data is the same for all rows
        setJvInfoData({
          ...jvInfoData,
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
        `${apiBaseUrl}/main/deletejv/${jvInfoData.EntryNo}/${dbCode}`
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
    if (jvInfoData.EntryNo > firstEno) {
      handleClearfind();
    }
    // else{
    //   return;
    // }
    try {
      const response = await axios.get(
        `${apiBaseUrl}/main/jvprevs/${jvInfoData.EntryNo}/${dbCode}`
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
        setJvInfoData({
          ...jvInfoData,
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
    if (jvInfoData.EntryNo < lastEno) {
      handleClearfind();
    }

    try {
      const response = await axios.get(
        `${apiBaseUrl}/main/jvnext/${jvInfoData.EntryNo}/${dbCode}`
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
        setJvInfoData({
          ...jvInfoData,
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
      const response = await axios.get(`${apiBaseUrl}/main/jvfirst/${dbCode}`);

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
        setJvInfoData({
          ...jvInfoData,
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
      const response = await axios.get(`${apiBaseUrl}/main/jvlast/${dbCode}`);

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
        setJvInfoData({
          ...jvInfoData,
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
        `${apiBaseUrl}/main/totalweight/${
          tableData[selectedSlNo - 1 || 0].name[0]
        }/${dbCode}`
      );
      //////console.log("res===",response.data);
      setaccumulatedWt(response.data[0].WeightDifference);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    // <div className="regmodal-overlay">
    <div className="cashRecRoot ">
      <div className="schemecontrolls">
        {/* ///////// */}
        <div className="schemereg_headerLogo_Div">
          <div className="schemereg_headerLogo" onClick={handleCheckSlno}>
            <img src={headeLogo} alt="SherSoftLogo" />
          </div>
          <label className="schemeReg_pageHead">Cash Receipt</label>
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

      <div className="cashRecBody">
        <div className="cashRecBodyData">
          <div className="cashRecTopdata">
            <div className="cashRecTopdatasections cashRecsec1">
              <div className="cashRecTopdatasectionsrows cashrecentryno">
                <label>Entry No</label>
                <input
                  ref={entryNoInputRef}
                  readOnly
                  style={{ textAlign: "center" }}
                  value={jvInfoData.EntryNo}
                  onKeyDown={(e) => handleKeyDown(e, branchinputRef)}
                  onChange={(e) =>
                    setJvInfoData({
                      ...jvInfoData,
                      EntryNo: e.target.value,
                    })
                  }
                />
              </div>
              <div className="cashRecTopdatasectionsrows"></div>
            </div>
            <div className="cashRecTopdatasections cashRecsec2">
              <div className="cashRecTopdatasectionsrows sec2row ">
                <label className="cashRecsec2label">Select Cash A/c</label>
                <ComboBox
                  //    findedValue={schemeRecInfoData.cashAcc[0]}
                  findedValue={
                    Array.isArray(jvInfoData.Branch)
                      ? jvInfoData.Branch[1]
                      : jvInfoData.Branch
                  }
                  comboRef={branchinputRef}
                  // options={selectcashAcc}
                  options={[[1, "CASH"]]}
                  className="cashReccashaccCombo"
                  inputClassName="cashReccashaccComboinput"
                  onKeyDown={(e) => {
                    handleKeyDown(e, salesmaninputRef);
                    // checkledgerExists(e);
                  }}
                  onInputChange={(e) =>
                    setJvInfoData({ ...jvInfoData, Branch: e })
                  }
                />
                <label htmlFor="" className="cashrecamntlabel">
                  Amount
                </label>
                <input type="text" className="cashrecamnt" />
              </div>
              <div className="cashRecTopdatasectionsrows sec2row ">
                <label className="cashRecsec2label">Select Salesman</label>

                <ComboBox
                  //    findedValue={schemeRecInfoData.cashAcc[0]}
                  findedValue={
                    Array.isArray(jvInfoData.Salesman)
                      ? jvInfoData.Salesman[1]
                      : jvInfoData.Salesman
                  }
                  comboRef={salesmaninputRef}
                  options={agentName}
                  className="cashReccashaccCombo"
                  inputClassName="cashReccashaccComboinput"
                  onKeyDown={(e) => {
                    handleKeyDown(e, dateInputRef);
                  }}
                  onInputChange={(e) => {
                    setJvInfoData({ ...jvInfoData, Salesman: e });
                    //  handleAgentSearch(e)
                  }}
                />
              </div>
            </div>
            <div className="cashRecTopdatasections  cashRecSec3">
              <div className="cashRecTopdatasectionsrows cashRecsec3row">
                <label>Date</label>
                <input
                  value={jvInfoData.date}
                  type="date"
                  ref={dateInputRef}
                  onKeyDown={(e) => handleKeyDownTable(e, RowIndex, 0)}
                  onChange={(e) =>
                    setJvInfoData({
                      ...jvInfoData,
                      date: e.target.value,
                    })
                  }
                />
              </div>
              {/* <div
                className="cashRecTopdatasectionsrows sec3row"
                style={{ backgroundColor: "blue" }}
              >
                
              </div> */}
            </div>
          </div>

          {/*---------------- receipt data table.----------------------- */}

          <div
            className="cashRecDataTable"
            //  onScroll={handleScroll}
            ref={tableContainerRef}
          >
            <table>
              <thead className="cashRecDataTableHead">
                <tr>
                  <th className="cashRecDataTableHeadslno">SI No</th>
                  <th className="cashRecDataTableHeadDbAcc">
                    Select A/c (Paid to)
                  </th>

                  <th className="cashRecDataTableHeadamount">Amount</th>
                  <th className="cashRecDataTableHeadamount">Disc</th>
                  <th className="cashRecDataTableHeadamount">Total</th>

                  <th className="cashRecDataTableHeadnarration">Narration</th>
                </tr>
              </thead>
              <tbody className="cashRecDataTableBodyStyle">
                {tableData.map((rowData, rowIndex) => (
                  <tr
                    key={rowIndex}
                    style={{
                      background:
                        rowIndex % 2 === 1 ? "#EBEBEB" : "transparent",
                    }}
                    className="cashRecDataTableBodyStyletr"
                  >
                    <td
                      className="cashRecDataTableDataBoxSlno"
                      style={{ textAlign: "center" }}
                    >
                      {rowIndex % 2 === 0 ? rowIndex / 2 + 1 : ""}
                    </td>

                    <td
                      className="cashRecDataTableDataBoxDbAcc"
                      style={{ width: "29%" }}
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
                          className="cashRecDataTableDataBox test"
                          inputClassName="dataBox"
                          comboRef={(ref) => `combo_${rowIndex}`}
                          onKeyDown={(e) => {
                            handleKeyDownTable(e, rowIndex, 1);
                            //checkNameExists(e);
                          }}
                          onInputChange={(e) => {
                            handleCellChange(e, rowIndex, "debitAccount");
                          }}
                          onBlur={(e) => handleCheckLedger(e, rowIndex, 1)}
                        />
                      )}
                    </td>

                    <td className="cashRecDataTableDataBoxamount">
                      {rowIndex % 2 === 0 && (
                        <input
                          value={
                            tableData[
                              rowIndex > 0 && rowIndex % 2 === 0
                                ? rowIndex - rowIndex / 2
                                : rowIndex
                            ]["amount"]
                          }
                          className="cashRecDataTableDataBox textalignRight"
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

                    <td className="cashRecDataTableDataBoxamount">
                      {rowIndex % 2 === 0 && (
                        <input
                          value={
                            tableData[
                              rowIndex > 0 && rowIndex % 2 === 0
                                ? rowIndex - rowIndex / 2
                                : rowIndex
                            ]["amount"]
                          }
                          className="cashRecDataTableDataBox textalignRight"
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

                    <td className="cashRecDataTableDataBoxamount">
                      {rowIndex % 2 === 0 && (
                        <input
                          value={
                            tableData[
                              rowIndex > 0 && rowIndex % 2 === 0
                                ? rowIndex - rowIndex / 2
                                : rowIndex
                            ]["amount"]
                          }
                          className="cashRecDataTableDataBox textalignRight"
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

                    <td className="cashRecDataTableDataBoxStonenarration">
                      {rowIndex % 2 === 0 && (
                        <input
                          value={
                            tableData[
                              rowIndex > 0 && rowIndex % 2 === 0
                                ? rowIndex - rowIndex / 2
                                : rowIndex
                            ]["narration"]
                          }
                          className="cashRecDataTableDataBox textalignRight"
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

          <div className="cashRecDataTablefootertotal  ">
            {/* <div className="cashRecfooterbtn">Edit Item</div>
            <div className="cashRecfooterbtn">Delete Item</div> */}

            <input
              className="cashRecDataTablefootertotalamount  ml-[38.8%]"
              value={jvInfoData.totalamt}
              style={{ textAlign: "right" }}
              onChange={(e) =>
                jvInfoData({
                  ...jvInfoData,
                  totalamt: e.target.value,
                })
              }
              readOnly
            />
            <input
              className="cashRecDataTablefootertotalamount "
              value={jvInfoData.totalamt}
              style={{ textAlign: "right" }}
              onChange={(e) =>
                jvInfoData({
                  ...jvInfoData,
                  totalamt: e.target.value,
                })
              }
              readOnly
            />
            <input
              className="cashRecDataTablefootertotalamount"
              value={jvInfoData.totalamt}
              style={{ textAlign: "right" }}
              onChange={(e) =>
                jvInfoData({
                  ...jvInfoData,
                  totalamt: e.target.value,
                })
              }
              readOnly
            />

           <div className="h-full w-[20%]  flex justify-end items-center ml-5">
              <label htmlFor="printob" className="font-Inter ">Print Ob</label>
              <input type="checkbox" id="printob" />
           </div>
            {/* <input
              className="cashRecDataTablefootertotalGm"
              value={jvInfoData.totalgm}
              style={{ textAlign: "right" }}
              onChange={(e) =>
                setJvInfoData({
                  ...jvInfoData,
                  totalgm: e.target.value,
                })
              }
            /> */}
          </div>

          <div className="cashRecCurrentBalance">
            Current Balance of Cash :0.00
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

export default CashReceipt;
