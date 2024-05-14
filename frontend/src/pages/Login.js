import React from "react";
import { Link } from "react-router-dom";
import "./Login.css";
import google from "../assets/google.png";

export default function Login() {
  return (
    <div className="root">
      <div className="holding">
        <div className="signup-form">
          <h1>Login</h1>
          <form>
            <input type="text" placeholder="Email Address" />
            <br />
            <input type="password" placeholder="Password" />
            <br />
          </form>
          <button className="signup-button">Login</button>
          <div className="other">
            <p className="signup-switch">
              Need to create an account?{" "}
              <Link className="login-sign" to="/signup">
                Sign up
              </Link>
            </p>
            <p>Or</p>
            <button className="google-button">
              <img src={google} alt="Logo" />
              Login with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
