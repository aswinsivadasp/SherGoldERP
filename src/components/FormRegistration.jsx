import React, { useRef, useEffect, useState, useContext } from "react";
import "../styles/FormRegistration.css";
import close from "../assets/images/close.png";
import ssLogo from "../assets/images/sslogo.png";
import saveImg from "../assets/images/SaveImage.png";
import printImg from "../assets/images/Printer.png";
import clearImg from "../assets/images/Document.png";
import findImg from "../assets/images/search.png";
import editImg from "../assets/images/Editing.png";
import deleteImg from "../assets/images/Delete.png";
import exitImg from "../assets/images/Exit1.png";
import { AuthContext } from "../context/AuthContext";

import excel from "../assets/images/Excel file.png";
import pdf from "../assets/images/Pdf.png";
//import ComboBox from "shersoft-combov1";
import ComboBox from "./ComboBox";
import minimize from "../assets/images/mini.png";
import maximize from "../assets/images/maximize.png";

import axios from "axios";
import { useDbContext } from "../context/DbContext";

function FormRegistration({ onClose }) {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const { dbCode } = useDbContext();


  const [editDisabled, setEditDisabled] = useState(true);
  const [deleteDisabled, setDeleteDisabled] = useState(true);
  const [saveDisabled, setSaveDisabled] = useState(false);

  const abbrInputRef = useRef(null);
  const nameInputRef = useRef(null);
  const slnoInputRef = useRef(null);
  const saveButtonRef = useRef(null);
  const tableContainerRef = useRef(null);
  const TypeOfVoucherRef = useRef(null);
  const agentRef = useRef(null);
  const editref = useRef(null);

  useEffect(() => {
    slnoInputRef.current.focus();
  }, []);

  // const { agentCode } = useContext(AuthContext);
  const [agentCode, setAgentCode] = useState("");

  useEffect(() => {
    const storedAgentCode = sessionStorage.getItem("agentCode");
    if (storedAgentCode) {
      setAgentCode(storedAgentCode);
    }
  }, []);

  const addRow = () => {
    // ////console.log("add row called");
    setTableData([...tableData, {}]);
  };

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/getformregdatas/${dbCode}`);
        setTableData(response.data);
        // ////console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [apiBaseUrl]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/getformregdatas/${dbCode}`);
      setTableData(response.data);
      // ////console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

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

  const [formData, setFormData] = useState({
    slno: "",
    name: "",
    typeOfVoucher: "",
    abbr: "",
    agent: "",
  });
  useEffect(() => {
    const fetchEno = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/formregEntryno/${dbCode}`);

        //////console.log("response=", response.data);

        setFormData((item) => ({
          ...item,
          slno: response.data,
        }));
      } catch (error) {
        console.error("Error fetching entryno:", error);
      }
    };

    fetchEno();
  }, [apiBaseUrl]);

  const fetchEno = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/formregEntryno/${dbCode}`);

     // ////console.log("response=", response.data);

      setFormData((item) => ({
        ...item,
        slno: response.data,
      }));
    } catch (error) {
      console.error("Error fetching entryno:", error);
    }
  };

  const handleClear = () => {
    setFormData({
      name: "",
      typeOfVoucher: "",
      abbr: "",
      agent: "",
    });
    // Reset dataFound state
    fetchEno();

    fetchData();
    fetchAgname();

    setEditDisabled(true);
    setDeleteDisabled(true);
    setSaveDisabled(false);

    slnoInputRef.current.focus();
  };

  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.typeOfVoucher ||
      !formData.abbr ||
      !formData.agent ||
      !formData.slno
    ) {
      alert("Enter Data Correctly");
      setSaveDisabled(false);

      return;
    }
    setSaveDisabled(true);

    try {
      const response = await axios.post(
        `${apiBaseUrl}/insertformReg/${dbCode}`,
        formData
      );

      // Check the response status and handle accordingly
      if (response.status === 200) {
        alert("Form registered");
        // window.location.reload();
        handleClear();
      } else {
        // Handle other response statuses or errors
        console.error("Error submitting data:", response.data);
        setSaveDisabled(false);
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("Error:", error.message);
      setSaveDisabled(false);
    }
  };

  const [agentName, setagentName] = useState([]);

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

  const [typeofVoucher, setTypeofVoucher] = useState([
    [1, "RECEIPT"],
    [2, "REDEEM"],
  ]);

  ////////update/////

  const handleUpdate = async () => {

    if (
      !formData.name ||
      !formData.typeOfVoucher ||
      !formData.abbr ||
      !formData.agent ||
      !formData.slno
    ) {
      alert("Enter Data Correctly");

      return;
    }

    try {
      const response = await axios.post(
        `${apiBaseUrl}/updateformReg/${dbCode}`,
        formData
      );

      if (!window.confirm("Do You Want To Edit..?")) {
        return;
      }


      // Check the response status and handle accordingly
      if (response.status === 200) {
        alert("Form updated");
        // window.location.reload();
        handleClear();
      } else {
        // Handle other response statuses or errors
        console.error("Error submitting data:", response.data);
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("Error:", error.message);
    }
  };
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
        `${apiBaseUrl}/formregfindbyentryno/${findEntryNo}/${dbCode}`
      );

      // Check the response status and handle accordingly
      if (response.status === 200) {
        setEditDisabled(false);
        setDeleteDisabled(false);
        setSaveDisabled(true);
        // Data retrieved successfully, update the form data
        const foundData = response.data[0]; // Assuming the response is an array with one item
        // ////console.log("data =", foundData);

        setFormData({
          ...formData,
          slno: foundData.entry,
          name: foundData.name,
          typeOfVoucher: foundData.voucher,
          abbr: foundData.abbr,
          agent: agentName.find((item) => item[0] === foundData.agent),
        });
      } else {
        setEditDisabled(true);
        setDeleteDisabled(true);
        setSaveDisabled(false);
        // Handle other response statuses or errors
        console.error("Error retrieving data:", response.data);
      }
    } catch (error) {
      setEditDisabled(true);
      setDeleteDisabled(true);
      setSaveDisabled(false);
      // Handle network errors or other exceptions
      console.error("Error:", error.message);
    }
  };

  const handleDelete = async () => {
    try {
      if (!window.confirm("Do You Want To Delete..?")) {
        return;
      }

      const response = await axios.delete(
        `${apiBaseUrl}/deleteform/${formData.slno}/${dbCode}`
      );
      if (response.status === 200) {
        alert("Form Deleted ");
        // window.location.reload();
        handleClear();
      } else {
        console.error("Error deleting data:", response.data);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };
  const handleKeyDown = (event, nextInputRef) => {
    if (event.key === "Enter" || event.key === "Return") {
      if (nextInputRef === saveButtonRef && saveDisabled) {
        editref.current.focus();
        return;
      }

      nextInputRef.current.focus();
    }
  };

  return (
    <div className="formRegRoot">
      <div className="formreghead ">
        <div className="formreg_dialogHeadpart">
          <img src={ssLogo} alt="SS" />
          <label>Form Registration</label>
        </div>
        <div className="formreg_dialogHeadControlls">
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
            marginLeft: "1%",
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
          onClick={handleUpdate}
          disabled={editDisabled}
          ref={editref}
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
        {/* <div className="schemeReg_arrowButtons">
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
        </div> */}
      </div>
      {/*............................ NavbarEnd.............................................. */}

      {/* ...................................Body.................................. */}

      <div className="formRegBody">
        <section className="formRegsec1">
          <div className="formRegsec1row">
            <label htmlFor="">SlNo</label>
            <input
              value={formData.slno}
              style={{ width: "30%", textAlign: "center" }}
              readOnly
              ref={slnoInputRef}
              onKeyDown={(e) => handleKeyDown(e, nameInputRef)}
            />
          </div>
          <div className="formRegsec1row">
            <label htmlFor="">Name</label>
            <input
              ref={nameInputRef}
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              onKeyDown={(e) => handleKeyDown(e, TypeOfVoucherRef)}
            />
          </div>
          <div className="formRegsec1row">
            <label htmlFor="">Type of Voucher</label>

            <ComboBox
              findedValue={
                Array.isArray(formData.typeOfVoucher)
                  ? formData.typeOfVoucher[1]
                  : formData.typeOfVoucher
              }
              className="typeofVouchercombo"
              comboRef={TypeOfVoucherRef}
              options={typeofVoucher}
              onInputChange={(e) =>
                setFormData({ ...formData, typeOfVoucher: e })
              }
              onKeyDown={(e) => handleKeyDown(e, abbrInputRef)}
            />
          </div>
          <div className="formRegsec1row">
            <label htmlFor="">Abbreviation</label>
            <input
              ref={abbrInputRef}
              value={formData.abbr}
              onChange={(e) =>
                setFormData({ ...formData, abbr: e.target.value })
              }
              onKeyDown={(e) => handleKeyDown(e, agentRef)}
            />
          </div>
          <div className="formRegsec1row">
            <label htmlFor="">SalesMan</label>
            <ComboBox
              findedValue={
                Array.isArray(formData.agent)
                  ? formData.agent[1]
                  : formData.agent
              }
              onInputChange={(e) => setFormData({ ...formData, agent: e })}
              className="typeofVouchercombo"
              comboRef={agentRef}
              options={agentName}
              onKeyDown={(e) => handleKeyDown(e, saveButtonRef)}
            />
          </div>
        </section>

        <section className="formRegsec2">
          <div
            className="schRepDataTable"
            // onScroll={handleScroll}
            ref={tableContainerRef}
          >
            <table
              style={{ width: "95%", height: "100%", borderRadius: "10px" }}
            >
              <thead className="formregDataTableHead">
                <tr>
                  <th className="schRepDataTableHeadaccno">SlNo</th>
                  <th className="schRepDataTableHeadcustomer">FormName</th>

                  <th className="schRepDataTableHeadentryno">Abbrevation</th>
                  <th className="schRepDataTableHeadtype">TypeOfVoucher</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((rowData, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={`formregDataTableBodyStyletr ${
                      rowData.atType === "Sub Total"
                        ? "redRow"
                        : rowData.atType === "Total"
                        ? "blueRow"
                        : ""
                    }`}
                  >
                    <td
                      className="formregDataTableDataBoxslno"
                      style={{ textAlign: "center", width: "10%" }}
                    >
                      {rowData.fmrEntryNo}
                    </td>

                    <td
                      className="formregDataTableDataBoxname"
                      style={{ width: "20%" }}
                    >
                      {rowData.fmrName}
                    </td>

                    <td
                      className="formregDataTableDataBoxabr"
                      // style={{ textAlign: "center" }}
                      style={{ width: "40%" }}
                    >
                      {rowData.fmrAbbreviation}
                    </td>

                    <td className="formregDataTableDataBoxType">
                      {rowData.fmrTypeOfVoucher}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
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
  );
}

export default FormRegistration;
