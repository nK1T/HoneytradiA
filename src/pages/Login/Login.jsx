import React, { useContext, useEffect, useState } from "react";
import styles from "./login.module.scss";
import { Link, Navigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { Context } from "../../main";
import { FaEye, FaEyeSlash, FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const { isAuthorized, setIsAuthorized } = useContext(Context);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/signin`,
        { username, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (data.success) {
        setUsername("");
        setPassword("");
        setIsAuthorized(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  if (isAuthorized) {
    return <Navigate to={"/"} />;
  }
  return (
    <div>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.top}>
            <p>Admin login</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                <FaUser size={12} />
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className={styles.inputField}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                <RiLockPasswordFill />
                Password
              </label>
              <div className={styles.passwordField}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.inputPasswordField}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.passwordShowBtn}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <button type="submit" className={styles.btn}>
              Login{loading && <ClipLoader size={15} color="#fbfdfd" />}
            </button>
          </form>
      <ToastContainer position="top-right" />
        </div>
      </div>
    </div>
  );
};

export default Login;
