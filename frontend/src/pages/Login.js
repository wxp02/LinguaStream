import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import google from "../assets/google.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  let navigate = useNavigate();

  const loginer = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: pass,
        }),
      });
      const data = await response.json();
      if(data.login === "pass"){
        navigate("/home");
      }else{
        alert("login error");
        console.log("login error");
        // error with login display something on the page
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="root">
      <div className="holding">
        <div className="signup-form">
          <h1>Login</h1>
          <form>
            <input value={email}
              onChange={(e) => setEmail(e.target.value)} type="text" placeholder="Email Address" />
            <br />
            <input value={pass}
              onChange={(e) => setPass(e.target.value)}type="password" placeholder="Password" />
            <br />
          </form>
          <button className="signup-button" onClick={loginer}>Login</button>
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
