import { useState } from "react";
import axios from "axios";
import "./register.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = () => {
    window.location.href = "/login";
  }

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      if(credentials.username == "" || credentials.email == "" || credentials.password == ""){
        toast.error("Fields cannot be empty!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        return;
      }

      const user = await axios.get("https://video-call-pf4x.onrender.com/api/auth/user?username=" + credentials.username);
      if (user.data !== "Username is available") {
        toast.error(user.data, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
      else {
        const res = await axios.post("https://video-call-pf4x.onrender.com/api/auth/register", credentials);
        if (res) {
          toast.success("Registration Successful! Please Login to continue!", {
            position: toast.POSITION.TOP_RIGHT,
          });
          setTimeout(() => {
            window.location.href = "/login";
          }, 3000);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="register">
      <div className="navbar">
      <div className="navContainer">
        <span className="logo"> Video Call Application</span>
        </div>
      </div>
      <form method="post">
        <div>
          <label className="form-element" htmlFor="username">Username:</label>
          <input
            type="text"
            placeholder="Enter your username"
            name="username"
            id="username"
            onChange={handleChange}
            className="form-element"
            required
          />
        </div>
        <div>
          <label className="form-element" htmlFor="email">Email:</label>
          <input
            type="email"
            placeholder="Enter your email address "
            name="email"
            id="email"
            onChange={handleChange}
            className="form-element"
            required
          />
        </div>
        <div>
          <label className="form-element" htmlFor="password">Password:</label>
          <input
            type="password"
            placeholder="Enter your password"
            name="password"
            id="password"
            onChange={handleChange}
            className="form-element"
            required
          />
        </div>
        <div>
          <button className="form-element" onClick={handleClick} type="submit">Register</button>
        </div>
        <div>
          <label id="already" className="form-element " htmlFor="login">Already have an account?</label>
          <button className="loginbtn" onClick={handleLogin}  >Login</button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}

export default Register;
