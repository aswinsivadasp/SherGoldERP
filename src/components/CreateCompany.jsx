import React, { useState, useRef, useEffect, useContext } from "react";
import "../styles/CreateCompany.css";
import headeLogo from "../assets/images/shersoftnavLogo.png";

import close from "../assets/images/CreateCompanyImages/Wrong (1).webp";
import save from "../assets/images/CreateCompanyImages/Diskette.webp";
import find from "../assets/images/CreateCompanyImages/Magnifying glass.webp";
import edit from "../assets/images/CreateCompanyImages/Editing (1).webp";
import del from "../assets/images/CreateCompanyImages/Bin.webp";
import exit from "../assets/images/CreateCompanyImages/Exit (1).webp";
import clear from "../assets/images/CreateCompanyImages/image 24.webp";

import toggleClose from "../assets/images/xred.webp";
import ComboBox from "./ComboBox";
import axios from "axios";
import EmailVerification from "./EmailVerification";

function CreateCompany({ onClose }) {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const [isVerified, setIsVerified] = useState(false);
  const getCurrentDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const saveBtnRef = useRef(null);
  const editBtnRef = useRef(null);

  const companyCodeRef = useRef(null);
  const customerCodeRef = useRef(null);
  const companyNameRef = useRef(null);
  const fromDateeRef = useRef(null);
  const toDateRef = useRef(null);
  const locationRef = useRef(null);
  const add1Ref = useRef(null);
  const add2Ref = useRef(null);
  const add3Ref = useRef(null);
  const telNoRef = useRef(null);
  const mobNoRef = useRef(null);
  const emailRef = useRef(null);
  const gstNoRef = useRef(null);
  const chkdefaultRef = useRef(null);
  const chkdoubleRef = useRef(null);
  const chkOptionRef = useRef(null);
  const chkDoubleAllRef = useRef(null);
  const typeRef = useRef(null);
  const taxCalcRef = useRef(null);
  const softwareTypeRef = useRef(null);
  const shopTypeRef = useRef(null);
  const packageRef = useRef(null);
  const taxMethodRef = useRef(null);
  const stockValuationRef = useRef(null);
  const decimalPointRef = useRef(null);
  const taxTypeRef = useRef(null);

  const salesmanInputRef = useRef(null);
  const [otp, setOtp] = useState("");

  const [verifyEmailModal, setVerifyEmailModal] = useState(false);

  const openEmail = (email) => {
    const generatedOtp = Math.floor(100000 + Math.random() * 900000);
    setOtp(generatedOtp);
    setVerifyEmailModal(true);
  };

  const [location, setLocation] = useState("");
  const validateEmail = (email) => {
    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const [compData, setCompData] = useState({
    companyCode: "",
    customerCode: "",
    companyName: "",
    fpFrom: getCurrentDate(),
    fpTo: getCurrentDate(),
    location: "",
    add1: "",
    add2: "",
    add3: "",
    telNo: "",
    mobNo: "",
    email: "",
    gstNo: "",
    type: "",
    taxCalc: "",
    package: "",
    taxMethod: "",
    decPoint: "",
    taxType: "",
  });

  const handleBrowse = (event) => {
    // The value of event.target.files will contain the files in the selected directory

    const files = event.target.files;
    if (files.length > 0) {
      // Extract the path of the first file in the directory
      const path = files[0].webkitRelativePath;
      const directoryPath = path.substring(0, path.indexOf("/"));
      setLocation(directoryPath);
    }
  };

  const [activeTab, setActiveTab] = useState("default");
  useEffect(() => {
    companyCodeRef.current.focus();
  }, []);

  const handleKeyDown = (event, nextInputRef) => {
    if (event.key === "Enter" || event.key === "Return") {
      if (nextInputRef) {
        nextInputRef.current.focus();
      } else {
        // If nextInputRef is null, it means we're at the last field in a tab section
        // So, we manually focus the next tab element
        const currentTab = document.querySelector(
          ".createCmpnyTabBtn.crCmpactive-tab"
        );
        const nextTab = currentTab.nextElementSibling;
        if (nextTab && nextTab.classList.contains("createCmpnyTabBtn")) {
          nextTab.click();
        }
      }
    }
  };

  // const handleSave = async () => {
  //   const DBName = compData.companyCode;

  //   if (!DBName) {
  //     alert("Company Code is Required");

  //     return;
  //   }
  //   if(!compData.customerCode){
  //     alert("Customer Code is Required")
  //     return;
  //   }
  //   if (!validateEmail(compData.email)) {
  //     alert("Invalid email address");
  //     emailRef.current.focus();
  //     return;
  //   }else{
  //     openEmail()
  //   }

  //   try {
  //     // Make the POST request to create a new database
  //     const response = await axios.post(`${apiBaseUrl}/main/createDatabase`, {
  //       compData,
  //     });
  //     alert(response.data);
  //   } catch (error) {
  //     console.error("Error creating database:", error);
  //     alert(error.response.data);
  //   }
  // };
  const handleSave = async () => {
    if (!compData.companyCode) {
      alert("Company Code is Required");
      return;
    }
    if (!compData.customerCode) {
      alert("Customer Code is Required");
      return;
    }
    if (!validateEmail(compData.email)) {
      alert("Invalid email address");
      return;
    }

    openEmail();
  };

  const handleCreateDatabase = async (verified) => {
    if (!verified) {
      return;
    }
    try {
      const response = await axios.post(`${apiBaseUrl}/main/createDatabase`, {
        compData,
      });
    
        
        localStorage.setItem("customerCode", compData.customerCode);
    
      alert(response.data);
      onClose(); // Close after successful creation
    } catch (error) {
      console.error("Error creating database:", error);
      alert(error.response.data);
    }
  };

  const handleUpdateDatabase = async () => {
    try {
      const response = await axios.post(
        `${apiBaseUrl}/main/updatecompanyDetails`,
        {
          compData,
        }
      );
      alert(response.data);
    } catch (error) {
      console.error("Error creating database:", error);
      alert(error.response.data);
    }
  };

  const handleClear = () => {
    setCompData({
      companyCode: "",
      customerCode: "",
      companyName: "",
      fpFrom: getCurrentDate(),
      fpTo: getCurrentDate(),
      location: "",
      add1: "",
      add2: "",
      add3: "",
      telNo: "",
      mobNo: "",
      email: "",
      gstNo: "",
      type: "",
      taxCalc: "",
      package: "",
      taxMethod: "",
      decPoint: "",
      taxType: "",
    });
  };

  const [companyCode, setCompanyCode] = useState([]);

  //console.log(companyCode);

  useEffect(() => {
    const fetchCmpname = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/main/getAllCompanies`);

        // Assuming response.data is an array with objects and each object has a LedName property
        const cData = response.data;

        const transformedData = cData.map((item) => [
          item.CustomerCode,

          item.code,
        ]);
        setCompanyCode(transformedData);

        // setsupplierName(supplName);
      } catch (error) {
        console.error("Error fetching company datas:", error.message);
      }
    };

    fetchCmpname();
  }, [apiBaseUrl]);

  function formatDateForInput(dateStr) {
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month}-${day}`;
  }

  const handleFind = async () => {
    if (compData.companyCode === "") {
      alert("Select Company Code");
    }
    try {
      const response = await axios.get(
        `${apiBaseUrl}/main/findCompanyDetails/${
          Array.isArray(compData.companyCode)
            ? compData.companyCode[1]
            : compData.companyCode
        }`
      );

      // Assuming response.data is an array with objects and each object has a LedName property
      const foundData = response.data[0];
      console.log("foundData=", foundData);

      setCompData({
        ...compData,
        companyCode: companyCode.find((item) => item[1] === foundData.Code),

        customerCode: foundData.CustomerCode,
        companyName: foundData.name,
        fpFrom: formatDateForInput(foundData.sdateFormatted),
        fpTo: formatDateForInput(foundData.edateFormatted),
        location: "",
        add1: foundData.add1,
        add2: foundData.add2,
        add3: foundData.add3,
        telNo: foundData.telephone,
        mobNo: foundData.mobile,
        email: foundData.email,
        gstNo: "",
        type: foundData.stype,
        taxCalc: foundData.TaxCalculation,
        package: "",
        taxMethod: "",
        decPoint: "",
        taxType: "",
      });

      // setsupplierName(supplName);
    } catch (error) {
      console.error("Error fetching company datas:", error.message);
      // alert(error.response.data);
    }
  };

  return (
    <div className="createCompanyroot">
      <div className="createCompanyHead ">
        <div className="createCompanyHeadpart">
          {/* <img src={headeLogo} alt="SS" />
          <label>Create Company</label> */}
        </div>
        <div className="createCompanyHeadControlls">
          <button
            className=" createCompanycontrollsbuttons crxbutton"
            onClick={onClose}
          >
            <img src={close} alt="X" />
          </button>
        </div>
      </div>
      <div className="createCmpnyNav">
        <div
          className="createCmpnyNavBtn"
          ref={saveBtnRef}
          onClick={handleSave}
        >
          <img src={save} alt="Save" />
          <span>Save</span>
        </div>
        <div className="createCmpnyNavBtn" onClick={handleClear}>
          <img src={clear} alt="" />
          <span>Clear</span>
        </div>
        <div className="createCmpnyNavBtn" onClick={handleFind}>
          <img src={find} alt="" />
          <span>Find</span>
        </div>
        <div
          className="createCmpnyNavBtn"
          ref={editBtnRef}
          onClick={handleUpdateDatabase}
        >
          <img src={edit} alt="" />
          <span>Edit</span>
        </div>
        {/* <div className="createCmpnyNavBtn">
          <img src={del} alt="" />
          <span>Delete</span>
        </div> */}
        <div className="createCmpnyNavBtn" onClick={onClose}>
          <img src={exit} alt="" />
          <span>Exit</span>
        </div>
      </div>
      <div className="createCmpnyBodytop">
        <div className="createCmpnyBodytopRows">
          <div className="createCmpnyBodytopRowssec">
            <label htmlFor="">Company Code</label>
            <ComboBox
              comboRef={companyCodeRef}
              options={companyCode}
              findedValue={
                Array.isArray(compData.companyCode)
                  ? compData.companyCode[1]
                  : compData.companyCode
              }
              className="cCodecompo CompinputHieght"
              onKeyDown={(e) => handleKeyDown(e, customerCodeRef)}
              onInputChange={(e) =>
                setCompData({ ...compData, companyCode: e })
              }
            />
          </div>
          <div className="createCmpnyBodytopRowssec">
            <label htmlFor="">Customer Code</label>
            <input
              ref={customerCodeRef}
              value={compData.customerCode}
              className="cCodecompo CompinputHieght"
              onKeyDown={(e) => handleKeyDown(e, companyNameRef)}
              onChange={(e) =>
                setCompData({ ...compData, customerCode: e.target.value })
              }
            />
          </div>
        </div>
        <div className="createCmpnyBodytopRows">
          <label htmlFor="">Company Name</label>
          <ComboBox
            comboRef={companyNameRef}
            options={[]}
            findedValue={
              Array.isArray(compData.companyName)
                ? compData.companyName[1]
                : compData.companyName
            }
            className="cNamecombo CompinputHieght"
            onKeyDown={(e) => handleKeyDown(e, fromDateeRef)}
            onInputChange={(e) =>
              setCompData({
                ...compData,
                companyName: Array.isArray(e) ? e[1] : e,
              })
            }
          />
        </div>
        <div className="createCmpnyBodytopRows">
          <label htmlFor="">Financial Period</label>
          <span>From</span>
          <input
            type="Date"
            className="Fperioddate CompinputHieght"
            ref={fromDateeRef}
            value={compData.fpFrom}
            onKeyDown={(e) => handleKeyDown(e, toDateRef)}
            onChange={(e) =>
              setCompData({ ...compData, fpFrom: e.target.value })
            }
          />
          <span>To</span>
          <input
            type="Date"
            className="Fperioddate CompinputHieght"
            ref={toDateRef}
            value={compData.fpTo}
            onKeyDown={(e) => handleKeyDown(e, add1Ref)}
            onChange={(e) => setCompData({ ...compData, fpTo: e.target.value })}
          />
        </div>
        {/* <div className="createCmpnyBodytopRows">
          <label htmlFor="">Location</label>
          <input
            type="text"
            className="locinput  CompinputHieght"
            ref={locationRef}
            onKeyDown={(e) => handleKeyDown(e, add1Ref)}
            onChange={(e) =>
              setCompData({ ...compData, location: e.target.value })
            }
          />
          <button className="LocBrowseButton CompinputHieght">Browse</button>
        </div> */}
      </div>
      <div className="createCmpnyTab">
        <div className="createCmpnyTabHeads">
          <div
            className={`createCmpnyTabBtn ${
              activeTab === "default" ? "crCmpactive-tab" : ""
            }`}
            style={{ borderRadius: "0.82px 0 0 0 " }}
            onClick={() => setActiveTab("default")}
          >
            Address
          </div>
          <div
            className={`createCmpnyTabBtn ${
              activeTab === "Settings" ? "crCmpactive-tab" : ""
            }`}
            onClick={() => setActiveTab("Settings")}
          >
            Settings
          </div>
          {/* <div
            className={`createCmpnyTabBtn ${
              activeTab === "CompanySettings" ? "crCmpactive-tab" : ""
            }`}
            onClick={() => setActiveTab("CompanySettings")}
          >
            Company Settings
          </div> */}
        </div>
        {activeTab === "default" && (
          <div className="createCmpnyTabAddress">
            <div className="createCmpnyTabAddressRows">
              <label htmlFor="">Address</label>
              <input
                type="text"
                className="CompinputHieght"
                ref={add1Ref}
                value={compData.add1}
                onChange={(e) =>
                  setCompData({ ...compData, add1: e.target.value })
                }
                onKeyDown={(e) => handleKeyDown(e, add2Ref)}
              />
            </div>
            <div className="createCmpnyTabAddressRows">
              <label htmlFor=""></label>
              <input
                type="text"
                className="CompinputHieght"
                ref={add2Ref}
                value={compData.add2}
                onChange={(e) =>
                  setCompData({ ...compData, add2: e.target.value })
                }
                onKeyDown={(e) => handleKeyDown(e, add3Ref)}
              />
            </div>
            <div className="createCmpnyTabAddressRows">
              <label htmlFor=""></label>
              <input
                type="text"
                className="CompinputHieght"
                ref={add3Ref}
                value={compData.add3}
                onChange={(e) =>
                  setCompData({ ...compData, add3: e.target.value })
                }
                onKeyDown={(e) => handleKeyDown(e, telNoRef)}
              />
            </div>
            <div className="createCmpnyTabAddressRows">
              <label htmlFor="">Tel No</label>
              <input
                type="text"
                className="CompinputHieght crcmptelnoinput"
                ref={telNoRef}
                value={compData.telNo}
                onChange={(e) =>
                  setCompData({ ...compData, telNo: e.target.value })
                }
                onKeyDown={(e) => handleKeyDown(e, mobNoRef)}
              />
              <label htmlFor="" style={{ textAlign: "center" }}>
                Mob No
              </label>
              <input
                type="text"
                className="CompinputHieght crcmptelnoinput"
                ref={mobNoRef}
                value={compData.mobNo}
                onChange={(e) =>
                  setCompData({ ...compData, mobNo: e.target.value })
                }
                onKeyDown={(e) => handleKeyDown(e, emailRef)}
              />
            </div>
            <div className="createCmpnyTabAddressRows">
              <label htmlFor="">Email</label>
              <input
                type="email"
                className="CompinputHieght"
                ref={emailRef}
                value={compData.email}
                onChange={(e) =>
                  setCompData({ ...compData, email: e.target.value })
                }
                onKeyDown={(e) => handleKeyDown(e, gstNoRef)}
              />
            </div>
            <div className="createCmpnyTabAddressRows">
              <label htmlFor="">GST No</label>
              <input
                type="text"
                className="CompinputHieght"
                ref={gstNoRef}
                value={compData.gstNo}
                onChange={(e) =>
                  setCompData({ ...compData, gstNo: e.target.value })
                }
                onKeyDown={(e) => handleKeyDown(e, null)}
              />
            </div>
          </div>
        )}
        {activeTab === "Settings" && (
          <div className="createCmpnyTabSettings">
            <div className="createCmpnyTabAddressRows">
              {/* <input
                type="checkbox"
                style={{ width: "20px" }}
                className="CompinputHieght "
                ref={chkdefaultRef}
                onKeyDown={(e) => handleKeyDown(e, chkdoubleRef)}

              />
              <label htmlFor="">Default</label> */}

              <label htmlFor="">Type</label>
              <ComboBox
                comboRef={typeRef}
                className="CompinputHieght crcmptelnoinput"
                options={[]}
                findedValue={
                  Array.isArray(compData.type)
                    ? compData.type[1]
                    : compData.type
                }
                onKeyDown={(e) => handleKeyDown(e, taxCalcRef)}
                onInputChange={(e) => setCompData({ ...compData, type: e })}
              />
            </div>
            <div className="createCmpnyTabAddressRows">
              {/* <input
                type="checkbox"
                style={{ width: "20px" }}
                className="CompinputHieght "
                ref={chkdoubleRef}
                onKeyDown={(e) => handleKeyDown(e, chkOptionRef)}

              />
              <label htmlFor="">Double</label> */}

              <label htmlFor="">Tax Calculation</label>
              <ComboBox
                comboRef={taxCalcRef}
                className="CompinputHieght crcmptelnoinput"
                options={[]}
                findedValue={
                  Array.isArray(compData.taxCalc)
                    ? compData.taxCalc[1]
                    : compData.taxCalc
                }
                onKeyDown={(e) => handleKeyDown(e, packageRef)}
                onInputChange={(e) => setCompData({ ...compData, taxCalc: e })}
              />
            </div>
            <div className="createCmpnyTabAddressRows">
              <label htmlFor="">Package</label>
              <ComboBox
                comboRef={packageRef}
                className="CompinputHieght crcmptelnoinput"
                options={[]}
                findedValue={
                  Array.isArray(compData.package)
                    ? compData.package[1]
                    : compData.package
                }
                onKeyDown={(e) => handleKeyDown(e, taxMethodRef)}
                onInputChange={(e) => setCompData({ ...compData, package: e })}
              />
            </div>
            <div className="createCmpnyTabAddressRows">
              <label htmlFor="">Tax Method</label>
              <ComboBox
                comboRef={taxMethodRef}
                className="CompinputHieght crcmptelnoinput"
                options={[]}
                findedValue={
                  Array.isArray(compData.taxMethod)
                    ? compData.taxMethod[1]
                    : compData.taxMethod
                }
                onInputChange={(e) =>
                  setCompData({ ...compData, taxMethod: e })
                }
                onKeyDown={(e) => handleKeyDown(e, decimalPointRef)}
              />
            </div>

            <div className="createCmpnyTabAddressRows">
              <label htmlFor="">Decimal Point</label>
              <ComboBox
                comboRef={decimalPointRef}
                className="CompinputHieght crcmptelnoinput"
                options={[]}
                findedValue={
                  Array.isArray(compData.decPoint)
                    ? compData.decPoint[1]
                    : compData.decPoint
                }
                onInputChange={(e) => setCompData({ ...compData, decPoint: e })}
                onKeyDown={(e) => handleKeyDown(e, taxTypeRef)}
              />
            </div>
            <div className="createCmpnyTabAddressRows">
              <label htmlFor="">Tax Type</label>
              <ComboBox
                comboRef={taxTypeRef}
                className="CompinputHieght crcmptelnoinput"
                options={[]}
                findedValue={
                  Array.isArray(compData.taxType)
                    ? compData.taxType[1]
                    : compData.taxType
                }
                onInputChange={(e) => setCompData({ ...compData, taxType: e })}
                onKeyDown={(e) => handleKeyDown(e, saveBtnRef)}
              />
            </div>
            {/* <div className="createCmpnyTabAddressRows"> */}
            {/* <input
                type="checkbox"
                style={{ width: "20px" }}
                className="CompinputHieght "
                ref={chkOptionRef}
                onKeyDown={(e) => handleKeyDown(e, chkDoubleAllRef)}

              />
              <label htmlFor="">Option</label> */}

            {/* <label htmlFor="">Software Type</label>
              <ComboBox
                comboRef={softwareTypeRef}
                className="CompinputHieght crcmptelnoinput"
                options={[]}
                onKeyDown={(e) => handleKeyDown(e, shopTypeRef)}

              /> */}
            {/* </div> */}
            {/* <div className="createCmpnyTabAddressRows"> */}
            {/* <input
                type="checkbox"
                style={{ width: "20px" }}
                className="CompinputHieght "
                ref={chkDoubleAllRef}
                onKeyDown={(e) => handleKeyDown(e, typeRef)}

              />
              <label htmlFor="">Double All</label> */}

            {/* <label htmlFor="">Shop Type</label>
              <ComboBox
                comboRef={shopTypeRef}
                className="CompinputHieght crcmptelnoinput"
                options={[]}
                onKeyDown={(e) => handleKeyDown(e, null)}

              /> */}
            {/* </div> */}
          </div>
        )}
        {/* {activeTab === "CompanySettings" && (
          <div className="createCmpnyTabCompanySettings">
            <div className="createCmpnyTabAddressRows">
              <label htmlFor="">Package</label>
              <ComboBox
                comboRef={packageRef}
                className="CompinputHieght crcmptelnoinput"
                options={[]}
                onKeyDown={(e) => handleKeyDown(e, taxMethodRef)}

              />
            </div>
            <div className="createCmpnyTabAddressRows">
              <label htmlFor="">Tax Method</label>
              <ComboBox
                comboRef={taxMethodRef}
                className="CompinputHieght crcmptelnoinput"
                options={[]}
                onKeyDown={(e) => handleKeyDown(e, stockValuationRef)}

              />
            </div>
            <div className="createCmpnyTabAddressRows">
              <label htmlFor="">Stock Valuation</label>
              <ComboBox
                comboRef={stockValuationRef}
                className="CompinputHieght crcmptelnoinput"
                options={[]}
                onKeyDown={(e) => handleKeyDown(e, decimalPointRef)}

              />
            </div>
            <div className="createCmpnyTabAddressRows">
              <label htmlFor="">Decimal Point</label>
              <ComboBox
                comboRef={decimalPointRef}
                className="CompinputHieght crcmptelnoinput"
                options={[]}
                onKeyDown={(e) => handleKeyDown(e, taxTypeRef)}

              />
            </div>
            <div className="createCmpnyTabAddressRows">
              <label htmlFor="">Tax Type</label>
              <ComboBox
                comboRef={taxTypeRef}
                className="CompinputHieght crcmptelnoinput"
                options={[]}
                onKeyDown={(e) => handleKeyDown(e, saveBtnRef)}

              />
            </div>
          </div>
        )} */}
      </div>
      <div className="createCmpnyFooter"></div>

      {verifyEmailModal && (
        <EmailVerification
          onClose={() => {
            setVerifyEmailModal(false);
          }}
          data={compData}
          generatedOtp={otp}
          onVerified={(e) => {
            handleCreateDatabase(e);
          }}
        />
      )}
    </div>
  );
}

export default CreateCompany;
