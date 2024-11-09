import React, { useState } from "react";
import "../styles/QuickSearch.css";
import axios from "axios";
import close from "../assets/images/close.png";
import { ClipLoader } from "react-spinners";
import { useDbContext } from "../context/DbContext";

function QuickSearch({ onClose }) {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const { dbCode } = useDbContext();

  const [tableData, setTableData] = useState([]);
  const [selectedField, setSelectedField] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  const getTableHeaders = () => {
    if (tableData.length === 0) return [];
    return Object.keys(tableData[0]);
  };

  const fetchData = async () => {
    setIsLoading(true); // Show loader when the search starts
    try {
      const response = await axios.get(
        `${apiBaseUrl}/main/quick_Search/${selectedField}?search=${searchTerm}/${dbCode}`
      );
      setTableData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false); // Hide loader after data is fetched or error occurs
    }
  };

  const spinnerProps = {
    color: "#026CC3",
    size: 30,
    speedMultiplier: 0.8,
    css: {
      opacity: "0.8",
    },
  };

  const handleCheckboxChange = (field) => {
    setSelectedField(field);
  };

  const handleRowClick = (index) => {
    setSelectedRowIndex(index);
  };

  return (
    <div className="QuickSearchRoot">
      <div className="qHead">
        <span style={{ width: "20%", marginLeft: "2%" }}>Quick Search</span>
        <button
          className="controllsbuttons xbutton"
          style={{ position: "absolute", right: "20px" }}
          onClick={onClose}
        >
          <img src={close} alt="X" />
        </button>
      </div>
      <div className="qBody">
        <div className="qBodyHead">
          <div className="qSerachBar">
            <label htmlFor="">Search Keyword</label>
            <div className="sInput">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button onClick={fetchData}>Search</button>
            </div>
          </div>

          <div className="qsearchFeildsRow">
            <input
              type="checkBox"
              checked={selectedField === "schemeRegistrtion"}
              onChange={() => handleCheckboxChange("schemeRegistrtion")}
            />
            <label htmlFor="">Scheme AccountNo</label>

            <input
              type="checkBox"
              checked={selectedField === "Ledger"}
              onChange={() => handleCheckboxChange("Ledger")}
            />
            <label htmlFor="">Ledger</label>

            <input
              type="checkBox"
              checked={selectedField === "stock"}
              onChange={() => handleCheckboxChange("")}
            />
            <label htmlFor="">Stock</label>

            <input
              type="checkBox"
              checked={selectedField === "customerCard"}
              onChange={() => handleCheckboxChange("")}
            />
            <label htmlFor="">Customer Card</label>

            <input
              type="checkBox"
              checked={selectedField === "barcode"}
              onChange={() => handleCheckboxChange("")}
            />
            <label htmlFor="">Barcode</label>

            <input
              type="checkBox"
              checked={selectedField === "PhoneNo"}
              onChange={() => handleCheckboxChange("PhoneNo")}
            />
            <label htmlFor="">Phone No</label>
          </div>

          <div className="qsearchFeildsRow">
            <input
              type="checkBox"
              checked={selectedField === "purchase"}
              onChange={() => handleCheckboxChange("")}
            />
            <label htmlFor="">Purchase</label>

            <input
              type="checkBox"
              checked={selectedField === "compatibleModel"}
              onChange={() => handleCheckboxChange("compatibleModel")}
            />
            <label htmlFor="">Compatible Model</label>

            <input
              type="checkBox"
              checked={selectedField === "sales"}
              onChange={() => handleCheckboxChange("")}
            />
            <label htmlFor="">Sales</label>
          </div>
        </div>

        <div className="qsearchTable">
          {isLoading ? (
            <div className="loader-container">
              <ClipLoader {...spinnerProps} />
            </div>
          ) : tableData.length > 0 ? (
            <table>
              <thead className="qSearchpDataTableHead">
                <tr>
                  {getTableHeaders().map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, index) => (
                  <tr
                    key={index}
                    className={index === selectedRowIndex ? "selected-row" : ""}
                    onClick={() => handleRowClick(index)}
                  >
                    {getTableHeaders().map((key) => (
                      <td className="qSchDataTableDataBox" key={key}>
                        {row[key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default QuickSearch;
