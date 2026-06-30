import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  successHandler,
  errorHandler,
  warningHandler,
} from "../Error_Success/Es";
import "./Signup.css";

export default function Signup() {
  const [signupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
  });
  const Navigate = useNavigate();
  const handleSignup = async (e) => {
    e.preventDefault();
    const { email, password, name, address } = signupInfo;

    if (!email || !password || !name || !address) {
      errorHandler("All input fields are required!");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:8080/api/signup",
        signupInfo,
      );
      console.log(response.data.message);
      const { success, message } = response.data;
      if (success) {
        successHandler(message);
        setTimeout(() => {
          Navigate("/login");
        }, 1000);
      } else {
        errorHandler(message);
      }
    } catch (error) {
      if (error.response) {
        errorHandler(error.response.data.message);
      } else {
        errorHandler(error.message);
      }
    }
  };
  return (
    <>
      <div
        // onClick={() => {
        //   successHandler("hello");
        //   errorHandler("hello");
        //   warningHandler("hello");
        // }}
        className="container"
      >
        <form onSubmit={handleSignup}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={signupInfo.name}
            onChange={(e) => {
              setSignupInfo({ ...signupInfo, name: e.target.value });
            }}
            placeholder="Enter your name"
          />

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={signupInfo.email}
            onChange={(e) => {
              setSignupInfo({ ...signupInfo, email: e.target.value });
            }}
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={signupInfo.password}
            onChange={(e) => {
              setSignupInfo({ ...signupInfo, password: e.target.value });
            }}
          />

          <label htmlFor="address"> Address</label>
          <input
            id="address"
            type="text"
            placeholder="Enter your address"
            value={signupInfo.address}
            onChange={(e) => {
              setSignupInfo({ ...signupInfo, address: e.target.value });
            }}
          />

          <button type="submit">Sign Up</button>
        </form>
      </div>
      <ToastContainer theme="colored" />
    </>
  );
}

//rfc
