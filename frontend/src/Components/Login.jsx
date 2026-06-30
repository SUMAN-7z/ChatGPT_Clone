import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  successHandler,
  errorHandler,
  warningHandler,
} from "../Error_Success/Es";
import "./Login.css";

export default function Login() {
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",

  });
  const Navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;

    if (!email || !password ) {
      errorHandler("All input fields are required!");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:8080/api/login",
        loginInfo,
      );
      console.log(response.data.message);
      const { success, message ,token,username} = response.data;
      if (success) {
        localStorage.setItem("token",token);
        localStorage.setItem("username",username);
        successHandler(message);
        setTimeout(() => {
          Navigate("/");
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
        <form onSubmit={handleLogin}>
          

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={loginInfo.email}
            onChange={(e) => {
              setLoginInfo({ ...loginInfo, email: e.target.value });
            }}
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={loginInfo.password}
            onChange={(e) => {
              setLoginInfo({ ...loginInfo, password: e.target.value });
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
