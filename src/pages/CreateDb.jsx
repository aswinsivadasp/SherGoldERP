import React, { useState, useRef, useEffect, useContext } from "react";
import "../styles/CreateDb.css";
import ss from "../assets/images/SS.png";
import contact from "../assets/images/contact.png";
import crtCmp from "../assets/images/CreateCompanyImages/CreateCmp.webp";
import opnCmp from "../assets/images/CreateCompanyImages/openCmp.webp";
import settings from "../assets/images/CreateCompanyImages/Settings.webp";
import exit from "../assets/images/CreateCompanyImages/Cdbexit.webp";
import CreateCompany from "../components/CreateCompany";
import OpenCompany from "../components/OpenCompany";
import CdbSettings from "../components/CdbSettings";

function CreateDb() {
  const [showcreateCompanyModal, setShowCreateCompanyModal] = useState(false);
  const [showopenCompanyModal, setShowopenCompanyModal] = useState(false);
  const [showcdbsettingsModal, setShowcdbsettingsModal] = useState(false);

  
  const opencdbSettings = () => {
  
    setShowcdbsettingsModal(true);
  
  };

  const openRegistrationModal = () => {
   
    setShowCreateCompanyModal(true);
  
  };
  const opencompanyModal = () => {

    setShowopenCompanyModal(true);
  };
  const handleClearcustomerCode = () => {

    localStorage.removeItem("customerCode");

  };



  return (
    <div className="CreateDbRoot">
      <div className="CreateDbnavbar">
        <div className="CreateDbnavbarBtn" style={{ marginLeft: "1%" }}    onClick={openRegistrationModal}>
          {" "}
          <img src={crtCmp} alt="Crt" /> Create Company
        </div>
        <div className="CreateDbnavbarBtn"   onClick={opencompanyModal}>
          <img src={opnCmp} alt="Opn" /> Open Company
        </div>
        <div className="CreateDbnavbarBtn" style={{ gap: "20%" }} 
        onClick={opencdbSettings}
        >
          {" "}
          <img src={settings} alt="" /> Settings
        </div>
        <div className="CreateDbnavbarBtn" style={{ gap: "25%" }} onClick={handleClearcustomerCode}>
          <img src={exit} alt="Ext" /> Exit
        </div>
      </div>
      <div className="shergoldheaddivcdb">
        <label className="shergoldheadcdb">SherGold ERP</label>
        <label className="shergoldtagcdb">
          A Complete Accounting & Inventory Package
        </label>
      </div>
      <div className="CreateDbfooter">
        <div className="CreateDbfooterCompany">
          <img src={ss} alt="" />
          <div className="CreateDbfooterCompanyContent">
            <label className="CreateDbfooterCompanyContentCname">
              SherSoft
            </label>
            <label className="CreateDbfooterCompanyContentdes">
              Software Company
            </label>
            <label className="CreateDbfooterCompanyContentdes2">
              www.shersoftware.com
            </label>
            <label className="CreateDbfooterCompanyContentdes3">
              PH:9847997755
            </label>
            <label className="CreateDbfooterCompanyContentdes4">
              Email:shersoftware@gmail.com
            </label>
          </div>
          <div className="CreateDbfooterCompanyContact">
            <div className="CreateDbfooterCompanyContactrow">
              <img src={contact} alt="PH:" />
              <span>7560889991</span>
              <span>7560889994</span> <span>7560889997</span>
              <span>7560879990</span>
            </div>
            <div className="CreateDbfooterCompanyContactrow">
              <img src={contact} alt="PH:" />
              <span>7560889992</span>
              <span>7560889995</span> <span>7560889998</span>
              <span> 7560888930</span>
            </div>
            <div className="CreateDbfooterCompanyContactrow">
              <img src={contact} alt="PH:" />
              <span>7560889993</span>
              <span>7560889996</span> <span>7560889970</span>
              <span> 7560888669</span>
            </div>
            <div
              className="CreateDbfooterCompanyContactrow "
              style={{ fontWeight: "250", fontSize: "10.1px" }}
            >
              < span className="CreateDbfooterCompanyContactrowtag">
                Please take Backup to External media otherwise “Shersoft” have no
                resposibility for data loss
              </span>
            </div>
          </div>
        </div>
      </div>
      {showcreateCompanyModal && (
        <CreateCompany
          onClose={() => setShowCreateCompanyModal(false)}
          // Open={(e, accountNameInputRef) => {
          //   setLedval(e.target.value);
          //   setShowLedgerRegModal(true);
          //   //setShowRegistrationModal(false);
          //   sessionStorage.setItem("accountNameInputRef", accountNameInputRef);
          // }}
        />
      )}
      {showopenCompanyModal && (
        <OpenCompany
          onClose={() => setShowopenCompanyModal(false)}
          // Open={(e, accountNameInputRef) => {
          //   setLedval(e.target.value);
          //   setShowLedgerRegModal(true);
          //   //setShowRegistrationModal(false);
          //   sessionStorage.setItem("accountNameInputRef", accountNameInputRef);
          // }}
        />
      )}
      {showcdbsettingsModal && (
        <CdbSettings
          onClose={() => {
            setShowcdbsettingsModal(false);
          }}
        />
      )}
    </div>
  );
}

export default CreateDb;
