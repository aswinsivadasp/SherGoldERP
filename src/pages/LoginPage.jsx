import React, { useState, useRef, useEffect, useContext } from "react";
import "../styles/LoginPage.css";
import ss from "../assets/images/shersoftnavLogo.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import { useDbContext } from "../context/DbContext";

function LoginPage() {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const location = useLocation();
  const dbDetails = location.state?location.state.selectedRowData:""
  ////console.log("dbDetails==",dbDetails);
  
  
  const { login } = useContext(AuthContext);
  const { setDbCode } = useDbContext();
  const navigate = useNavigate();
  useEffect(() => {
    userNameRef.current.focus();
  
  }, [dbDetails, navigate]);

  const [loginData, setLoginData] = useState({
    userName: "",
    password: "",
  });

  const userNameRef = useRef(null);
  const passwordRef = useRef(null);
  const loginBtnRef = useRef(null);

  useEffect(() => {
    userNameRef.current.focus();
  }, []);

  const handleKeyDown = (event, nextInputRef) => {
    if (event.key === "Enter" || event.key === "Return") {
      nextInputRef.current.focus();
    }
  };

  const [error, setError] = useState("");

  // const handleLogin = async () => {
  //   try {
  //     const response = await axios.get(`${apiBaseUrl}/main/userLogin`);
  //     const data = response.data;

  //     const user = data.find(user => user.userName === loginData.userName && user.password === loginData.password);

  //     if (user) {
  //       sessionStorage.setItem("agentCode", user.agentCode);
  //       login(user.agentCode,user.userType); // Pass the agentCode to the login function
  //       navigate('/home');
  //     } else {
  //       setError('Invalid username or password');
  //     }
  //   } catch (error) {
  //     console.error('Error:', error);
  //     setError('An error occurred while logging in');
  //   }
  // };

  
  const handleLogin = async () => {
  // Redirect if dbDetails is missing
  if (!dbDetails) {
    alert("Select a company first");
    navigate('/');
  }
    try {
      const response = await axios.post(`${apiBaseUrl}/main/userLogin`, {
        userName: loginData.userName,
        password: loginData.password,
        dbName: dbDetails.Code // Include dbDetails.Code here
      });
  
      const data = response.data;
  
      const user = data.find(user => user.userName === loginData.userName && user.password === loginData.password);
  
      if (user) {
        sessionStorage.setItem("agentCode", user.agentCode);
        sessionStorage.setItem("dbCode", dbDetails.Code);

        setDbCode(dbDetails.Code);
        login(user.agentCode, user.userType); // Pass the agentCode to the login function
        navigate('/home');
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while logging in');
    }
  };
  
  
  
  
  useEffect(() => {
    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener('popstate', handlePopstate);
    return () => {
      window.removeEventListener('popstate', handlePopstate);
    };
  }, []);

  const handlePopstate = () => {
    window.history.pushState(null, null, window.location.pathname);
  };

  return (
    <div className="LoginRoot">
      <div className="loginForm">
        <div className="loginHead">
          <img src={ss} alt="" />
          <label htmlFor=""> Login In To  {dbDetails.Code ? dbDetails.Code.toUpperCase() : ""}</label>
        </div>
        <div className="loginBody">
          <div className="loginBodyRows">
            <label htmlFor="">User Name</label>
            <input
              type="text"
              ref={userNameRef}
              onKeyDown={(e) => handleKeyDown(e, passwordRef)}
              onChange={(e) => setLoginData({ ...loginData, userName: e.target.value })}
            />
          </div>
          <div className="loginBodyRows">
            <label htmlFor="">Password</label>
            <input
              type="password"
              ref={passwordRef}
              onKeyDown={(e) => handleKeyDown(e, loginBtnRef)}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            />
          </div>
          <div className="loginBodyRowsButton" style={{ display: "flex", justifyContent: "center" }}>
            <button className="loginButton" ref={loginBtnRef} onClick={handleLogin} style={{ width: '30%' }}>
              Log In
            </button>
            <button className="loginButton"  onClick={()=>navigate('/')} style={{ width: '30%' }}>
            Exit
            </button>
          </div>
          {error && <div className="errorMessage">{error}</div>}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
