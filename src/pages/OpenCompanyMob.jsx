import React, { useState, useRef, useEffect, useContext } from "react";
import "../styles/OpenCompanyMob.css";
import ss from "../assets/images/shersoftnavLogo.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import { useDbContext } from "../context/DbContext";
import ComboBox from "../components/ComboBox";
import CdbSettings from "../components/CdbSettings";

function OpenCompanyMob() {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  const navigate = useNavigate();
  const [companyCode, setCompanyCode] = useState([]);
  const [cmpData, setCmpData] = useState({
    Cdata: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const customerCode = localStorage.getItem("customerCode");
  const fetchDatabaseNames = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${apiBaseUrl}/main/getalldatabases/${
          Array.isArray(cmpData.Cdata) ? cmpData.Cdata[0] : ""
        }`
      );
      setTableData(response.data);
      if (response.data.length > 0) {
        setHighlightedRow(0);
        // Don't automatically set selectedRowData here
      }
    } catch (error) {
      console.error("Error fetching database names:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const [selectedRowData, setSelectedRowData] = useState(null);
  const selectcmpref = useRef(null);

  const tableRef = useRef(null);
  const [tableData, setTableData] = useState([]);

  const [highlightedRow, setHighlightedRow] = useState(-1);

  const fetchCmpname = async () => {
    const customerCode = localStorage.getItem("customerCode");
    if(!customerCode){
     return
    }

    try {
      const response = await axios.get(`${apiBaseUrl}/main/getalldatabases/${customerCode}`);

      // Assuming response.data is an array with objects and each object has a LedName property
      const cData = response.data;
// console.log("res",cData);

      // Transforming the array into the desired format
      // const supplName = cName.map((item) => item.LedName);

      const transformedData = cData.map((item) => [
        item.CustomerCode,
        item.name,
      ]);
      setCompanyCode(transformedData);
      // console.log(transformedData);
      

      // setsupplierName(supplName);
    } catch (error) {
      console.error("Error fetching company datas:", error.message);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      if (document.activeElement === selectcmpref.current) {
        // If ComboBox is focused, focus the table
        tableRef.current?.focus();
      } else if (tableData.length > 0 && highlightedRow >= 0) {
        // Only select if we have data and a valid highlighted row
        onRowSelect(highlightedRow);
      }
    } else if (event.key === "ArrowDown") {
      event.preventDefault(); // Prevent page scrolling
      setHighlightedRow((prev) => Math.min(prev + 1, tableData.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault(); // Prevent page scrolling
      setHighlightedRow((prev) => Math.max(prev - 1, 0));
    }
  };

  const handleRowClick = (rowIndex) => {
    setHighlightedRow(rowIndex);
    onRowSelect(rowIndex); // Select the row immediately on click
  };

  const onRowSelect = (rowIndex) => {
    // Pass the rowIndex parameter to ensure we're selecting the correct row
    if (rowIndex >= 0 && rowIndex < tableData.length) {
      const selectedRow = tableData[rowIndex];
      setSelectedRowData(selectedRow);
      ////console.log("Selected Row Data:", selectedRow);
      navigate("/login", { state: { selectedRowData: selectedRow } });
      // Here you can add any additional logic needed when a row is selected
    }
  };

  useEffect(() => {
    ////console.log("Updated Selected Row Data:", selectedRowData);
  }, [selectedRowData]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [tableData, highlightedRow]);

  return (
    <div className="OpenCompanyMobRoot">
       {customerCode ? (
      <div className="OpenCompanyMobDia">
        <label className="OpenCompanyMobDiaHead">Open Company</label>

        <div className="opencmpmobselectrow">
          <label htmlFor="" className="opnCmplabel">Select Company</label>
          <ComboBox
          
            comboRef={selectcmpref}
            options={companyCode}
            findedValue={
              Array.isArray(cmpData.Cdata) ? cmpData.Cdata[1] : cmpData.Cdata
            }
            className="selectcmpCombo opencmpmobselect"
            onInputChange={(e) =>
              setCmpData({
                ...cmpData,
                Cdata: e,
              })
            }
            onBlur={() => fetchDatabaseNames()}
            onFocus={()=>fetchCmpname()}
          />
        </div>

        <table ref={tableRef} tabIndex="0">
          <thead className="opncmpMobTableHead">
            <tr>
              <th className="opncmpMobHeadslno">SlNo</th>

              <th className="opncmpMobHeadcode">Code</th>
            </tr>
          </thead>
          <tbody className="opncmpMobBodyStyle">
            {tableData.map((rowData, rowIndex) => (
              <tr
                key={rowIndex}
                onClick={() => handleRowClick(rowIndex)}
                onDoubleClick={() => onRowSelect(rowIndex)}
                className={`opncmpMobBodyStyletr ${
                  highlightedRow === rowIndex ? "highlighted" : ""
                }`}
              >
                <td
                  className={`opncmpMobDataBoxSlno ${
                    highlightedRow === rowIndex ? "highlighted" : ""
                  }`}
                  style={{ textAlign: "center" }}
                >
                  {rowIndex + 1}
                </td>

                <td className="opncmpMobDataBoxcode">{rowData.Code}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>  ) : (
         <CdbSettings 
         onClose={()=>navigate("/")} 
         
         />  )}
    </div>
  );
}

export default OpenCompanyMob;
