import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./login.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const { loading, error, dispatch } = useContext(AuthContext);
  const navigate = useNavigate()

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleRegister = () => {
    window.location.href = "/register";
  }

  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    try {
      if(credentials.username == "" || credentials.password == ""){
        toast.error("Fields cannot be empty!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        return;
      }
      const res = await axios.post("https://video-call-pf4x.onrender.com/api/auth/login", credentials);
      console.log(res.data.username);
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.username });
      toast.success("Login Successful!, Redirecting to Home Page!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setTimeout(() => {
        navigate("/")
      }, 2000);
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err.response.data });
      toast.error(error.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  return (
    <div className="login">
      <div className="navbar">
      <div className="navContainer">
        <span className="logo">Video Call Application</span>
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
          <button className="form-element" disabled={loading} onClick={handleClick} type="submit">Login</button>
        </div>
        <div>
          <label id="already" className="form-element " htmlFor="login">Dont have an account?</label>
          <button className="registerbtn" onClick={handleRegister} >Register</button>
        </div>
      </form>
      <ToastContainer />
      {error && <ToastContainer />}
    </div>
  );
};

export default Login;
