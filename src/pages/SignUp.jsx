import React, { useState, useRef, useEffect } from "react";
import "../styles/SignUp.css";
import ss from "../assets/images/shersoftnavLogo.png";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useDbContext } from "../context/DbContext";


function SignUp() {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const { dbCode } = useDbContext();

  const navigate = useNavigate();


  const [userData, setUserData] = useState({
    userName: "",
    password: "",
    email: "",
    phoneNo: "",
    userType: "ADMIN",
  });

  const handleSubmit = async () => {
    try {
      {
        // Make a POST request to your server with the form data
        if(userData.userName==''||userData.password==''){
            alert("Please fill the fields");
            return
        }
        const response = await axios.post(`${apiBaseUrl}/main/userReg/${dbCode}`, userData);

        if (response.status === 200) {
          alert("user Registered");
          navigate('/home');
        } else {
          // Handle other response statuses or errors
          console.error("Error submitting data:", response.data);
        }
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("Error:", error.message);
    }
  };
 // ////console.log("userData=", userData);
  const userNameRef = useRef(null);
  const passwordRef = useRef(null);
  const emailRef = useRef(null);
  const phonenoRef = useRef(null);
  const userTypeRef = useRef(null);
  const registerButtonRef = useRef(null);

  const handleKeyDown = (event, nextInputRef) => {
    if (event.key === "Enter" || event.key === "Return") {
      nextInputRef.current.focus();
    }
  };
  useEffect(() => {
    userNameRef.current.focus();
  }, []);

  return (
    <div className="SignUpRoot">
      <div className="SignUpForm">
        <div className="SignUpHead">
          <img src={ss} alt="" />
          <label htmlFor=""> Sign Up</label>
        </div>
        <div className="SignUpBody">
          <div className="SignUpBodyRows">
            <label htmlFor="">User Name</label>
            <input
              type="text"
              required
              onChange={(e) =>
                setUserData({ ...userData, userName: e.target.value })
              }
              ref={userNameRef}
              onKeyDown={(e) => handleKeyDown(e, passwordRef)}
            />
          </div>
          <div className="SignUpBodyRows">
            <label htmlFor="">Password</label>
            <input
              type="password"
              required
              onChange={(e) =>
                setUserData({ ...userData, password: e.target.value })
              }
              ref={passwordRef}
              onKeyDown={(e) => handleKeyDown(e, emailRef)}
            />
          </div>
          <div className="SignUpBodyRows">
            <label htmlFor="">email</label>
            <input
              type="email"
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
              ref={emailRef}
              onKeyDown={(e) => handleKeyDown(e, phonenoRef)}
            />
          </div>
          <div className="SignUpBodyRows">
            <label htmlFor="">Phone NO:</label>
            <input
              type="text"
              required
              onChange={(e) =>
                setUserData({ ...userData, phoneNo: e.target.value })
              }
              ref={phonenoRef}
              onKeyDown={(e) => handleKeyDown(e, userTypeRef)}
            />
          </div>
          <div className="SignUpBodyRows">
            <label htmlFor="">User Type</label>
            <select
              onChange={(e) =>
                setUserData({ ...userData, userType: e.target.value })
              }
              ref={userTypeRef}
              onKeyDown={(e) => handleKeyDown(e, registerButtonRef)}
            >
              <option value="ADMIN">ADMIN</option>
              <option value="EMPLOYEE">EMPLOYEE</option>
            </select>
          </div>
          <div
            className="SignUpBodyRowsButton"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <button
              ref={registerButtonRef}
              className="SignUpButton"
              onClick={handleSubmit}
            >
              Register
            </button>
            <button className="SignUpButton" onClick={() => navigate('/')}>Login</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
