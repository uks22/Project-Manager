import React, { useState } from "react";
import "./AuthForm.css"; // Import your external CSS file

const AuthForm = (props) => {
  const [isSignUp, setIsSignUp] = useState(false);
  var [name, setName] = useState("");
  var [email, setEmail] = useState("");
  var [password, setPassword] = useState("");
  const handleSignUp = () => {
    setIsSignUp(true);
    setName("");
    setEmail("");
    setPassword("");
  };

  const handleSignIn = () => {
    setIsSignUp(false);
    setName("");
    setEmail("");
    setPassword("");
  };

  function handleChange(event) {
    const val = event.target.value;
    const name = event.target.name;
    if (name === "email") {
      setEmail(val);
    } else if (name === "password") {
      setPassword(val);
    } else {
      setName(val);
    }
  }
  return (
    <div className={`loginoutercontainer`}>
      <div
        className={`logincontainer ${isSignUp ? "right-panel-active" : ""}`}
        id="container"
      >
        <div className="form-container sign-up-container">
          <form className="loginform" action="#">
            <h1 className="loginh1">Create Account</h1>
            <input
              name="name"
              onChange={handleChange}
              value={name}
              className="logininput"
              type="text"
              placeholder="Name"
            />
            <input
              name="email"
              onChange={handleChange}
              className="logininput"
              type="email"
              placeholder="Email"
            />
            <input
              name="password"
              onChange={handleChange}
              className="logininput"
              type="password"
              placeholder="Password"
            />
            <button
              onClick={(event) => {
                event.preventDefault();
                props.handleFormSubmit({
                  name,
                  email,
                  password,
                  type: "create",
                });
              }}
              className="loginbutton"
            >
              Sign Up
            </button>
          </form>
        </div>

        <div className="form-container sign-in-container">
          <form className="loginform" action="#">
            <h1 className="loginh1">Sign in</h1>
            <input
              name="email"
              value={email}
              onChange={handleChange}
              className="logininput"
              type="email"
              placeholder="Email"
            />
            <input
              name="password"
              value={password}
              onChange={handleChange}
              className="logininput"
              type="password"
              placeholder="Password"
            />
            <a className="loginanchor" href="#">
              Forgot your password?
            </a>
            <button
              className="loginbutton"
              onClick={(event) => {
                event.preventDefault();
                props.handleFormSubmit({ email, password, type: "login" });
              }}
            >
              Sign In
            </button>
          </form>
        </div>

        <div className="loginoverlay-container">
          <div className="loginoverlay">
            <div className="loginoverlay-panel loginoverlay-left">
              <h1 className="loginh1" style={{ color: "white" }}>
                Welcome Back!
              </h1>
              <p className="loginmsg">
                To keep connected with us please login with your personal info
              </p>
              <button className="ghost loginbutton" onClick={handleSignIn}>
                Sign In
              </button>
            </div>
            <div className="loginoverlay-panel loginoverlay-right">
              <h1 className="loginh1" style={{ color: "white" }}>
                Hello, Friend!
              </h1>
              <p className="loginmsg">
                Enter your personal details and start journey with us
              </p>
              <button className="ghost loginbutton" onClick={handleSignUp}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
