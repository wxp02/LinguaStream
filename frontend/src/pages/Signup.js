import React from "react";
import "./Signup.css";
import { Link } from "react-router-dom";
import google from "../assets/google.png";

export default function Signup() {
  return (
    <div className="root">
      <div className="holder">
        <div className="signup-form">
          <h1>Sign Up</h1>
          <form>
            <input type="text" placeholder="Full Name" />
            <br />
            <input type="text" placeholder="Email Address" />
            <br />
            <input type="password" placeholder="Password" />
            <br />
            <input type="password" placeholder="Confirm Password" />
            <br />
          </form>
        </div>
        <div className="other-side">
          <button className="signup-button">Sign up</button>
          <p>
            Already have an account?{" "}
            <Link className="login-sign" to="/login">
              Login
            </Link>
          </p>
          <p>Or</p>
          <button className="google-button">
            <img src={google} alt="Logo" />
            Sign up with Google
          </button>
        </div>
      </div>
    </div>
  );
}
