import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "../styles/EmailVerification.css";
import Swal from "sweetalert2";
import close from "../assets/images/CreateCompanyImages/Wrong (1).webp";


function EmailVerification({ data, onClose, generatedOtp, onVerified }) {
  const [otp, setOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const inputRefs = useRef([]);

  useEffect(() => {
    setOtp(generatedOtp);
    startTimer();

    const emailData = {
      otp: generatedOtp,
      companyName: data.companyName || "",
      email: data.email || "",
      mobileNum: data.mobNo || "",
    };

    sendOtpEmail(emailData); // Send the initial OTP email

    // Cleanup timer on unmount
    return () => clearInterval(timerInterval.current);
  }, [data]);

  // Timer logic
  const timerInterval = useRef(null);

  const startTimer = () => {
    setTimer(30);

    timerInterval.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerInterval.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const sendOtpEmail = (emailData) => {
    axios
      .post(`${apiBaseUrl}/sendVerfMail`, emailData)
      .then((response) => {
        //console.log("OTP email sent successfully:", response.data);
      })
      .catch((error) => {
        console.error("Failed to send OTP email:", error);
      });
  };

  const handleOtpChange = (event, index) => {
    const value = event.target.value;

    if (/^\d*$/.test(value)) {
      const newOtp = enteredOtp.split("");
      newOtp[index] = value;
      setEnteredOtp(newOtp.join(""));

      if (value && index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handlePaste = (event) => {
    const pastedData = event.clipboardData.getData("Text");
    const numericData = pastedData.replace(/\D/g, "").slice(0, 6);

    setEnteredOtp(numericData);

    const inputs = document.querySelectorAll('.otpinput');
    inputs.forEach((input, idx) => {
      input.value = numericData[idx] || '';
      if (numericData[idx] && idx < inputs.length - 1) {
        inputs[idx + 1].focus();
      }
    });
  };

  const verifyOtp = () => {
    if (enteredOtp === otp.toString()) {
      Swal.fire({
        icon: "success",
        title: "Verified!",
        text: "Email verified successfully.",
        timer: 1000,
        showConfirmButton: false,
      });
      onVerified(true);
      onClose();
    } else {
      Swal.fire({
        icon: "error",
        title: "Verification Failed",
        text: "OTP does not match or has expired.",
        timer: 1000,
        showConfirmButton: false,
      });
      onVerified(false);
    }
  };

  const resendOtp = () => {
    // Generate a new OTP
    const newGeneratedOtp = Math.floor(100000 + Math.random() * 900000);
    setOtp(newGeneratedOtp); // Update the state with the new OTP
    setEnteredOtp(""); // Clear the entered OTP
    startTimer(); // Restart the timer

    // Prepare email data with the new OTP
    const emailData = {
      otp: newGeneratedOtp,
      companyName: data.companyName || "",
      email: data.email || "",
      mobileNum: data.mobNo || "",
    };

    sendOtpEmail(emailData); // Send the new OTP email
  };

  return (
    <div className="emailVerificationRoot">
         
         <button
           className=" emailverfcontrollsbuttons emvbutton"
           onClick={onClose}
           style={{right:"1%"}}
         >
           <img src={close} alt="X" />
         </button>
      
      <div className="emailVerDataBox">
        <label>Enter the code</label>
        <span>
          Enter the code we sent to your Email <br />
          Be careful not to share it with anyone
        </span>
        <div className="otpinputdiv">
          {Array.from({ length: 6 }).map((_, index) => (
            <input
              key={index}
              type="text"
              className="otpinput"
              maxLength="1"
              onChange={(e) => handleOtpChange(e, index)}
              onPaste={handlePaste}
              ref={(el) => (inputRefs.current[index] = el)}
            />
          ))}
        </div>

        {/* Show the verify button only if the timer is greater than zero */}
        {timer > 0 ? (
          <div className="emailverifyButton" onClick={verifyOtp}>
            Verify
          </div>
        ) : (
          // When timer is 0, show the resend button
          <div className="emailverifyButton" onClick={resendOtp}>
            Resend OTP
          </div>
        )}

        {timer > 0 && <span className="emailtimerCaption">{`Resend OTP in ${timer} seconds`}</span>}
      </div>
    </div>
  );
}

export default EmailVerification;
