import React, {useState} from "react";
import "./Signup.css";
import { Link, useNavigate } from "react-router-dom";
import cross from "../assets/cross.png";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confPass, setCPass] = useState("");
  const [error, setError] = useState("");
  const [showError, setShow] = useState("");

  let navigate = useNavigate();

  const signer = async () => {
    if(pass !== confPass){
      //alert("Passwords dont match");
      //console.log("Passwords dont match");
      setError("Passwords don't match");
      setShow("True");
      // add a display render for the passwords not matching

    }else{
      try {
        const response = await fetch("http://127.0.0.1:5000/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            email: email,
            password: pass,
            confirm: confPass
          }),
        });
        const data = await response.json();
        if(data.signup === "pass"){
          navigate("/home");
        }else{
          setError(data.message);
          setShow("True");
          // error with login display something on the page
        }
      } catch (error) {
        console.error("Error:", error);
      }
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
      <div className="holder">
        <div className="signup-form">
          <h1><Link to="/">linguastream</Link></h1>
          <h1 style={{fontWeight: 500, fontSize: "1.3em", marginTop: "0.5em"}}>Sign Up</h1>
          <form>
            <input type="text" value={name}
              onChange={(e) => setName(e.target.value)}  placeholder="Full Name" />
            <br />
            <input type="text" value={email}
              onChange={(e) => setEmail(e.target.value)}   placeholder="Email Address" />
            <br />
            <input type="password" value={pass}
              onChange={(e) => setPass(e.target.value)}   placeholder="Password" />
            <br />
            <input type="password" value={confPass}
              onChange={(e) => setCPass(e.target.value)}  placeholder="Confirm Password" />
            <br />
          </form>
          <button className="signup-button" onClick={signer}>Sign up</button>
          <p className="signup-switch">
            Already have an account?{" "}
            <Link className="login-sign" to="/login">
              Login
            </Link>
          </p>
        </div>
        
      </div>
    </div>
  );
}
