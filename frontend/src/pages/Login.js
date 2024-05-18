import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import cross from "../assets/cross.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [showError, setShow] = useState("");
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
        setError(data.message);
        setShow("True");
        // error with login display something on the page
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  function errorShower(){
    if(showError==="True"){
      return(
      <div className="error-holder">
      <p>{error}</p>
      <img onClick={()=>{setShow("False")}} src={cross} alt=""/>
    </div>);
    }
  }

  return (
    <div className="root">
      {errorShower()}
      
      <div className="holding">
        <div className="signup-form">
          <h1><Link to="/">linguastream</Link></h1>
          <h1 style={{fontWeight: 500, fontSize: "1.3em", marginTop: "1em"}}>Login</h1>
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
          </div>
        </div>
      </div>
    </div>
  );
}
