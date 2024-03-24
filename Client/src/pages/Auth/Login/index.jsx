import "@fortawesome/fontawesome-free/css/all.css";
import axios from "axios";
import { useState } from "react";
import { apiUrl } from "../../../settings/apiurl";
import { useNavigate } from "react-router-dom";

const LogIn = (props) => {
  const { setAuth } = props;
  const navigate = useNavigate("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginForm = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${apiUrl}/login`, {
        username,
        password,
      });
      setAuth(true);
      const { accessToken, refreshToken } = response.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("username", username);
      navigate("/wallet");
    } catch (error) {
      setAuth(false);
      alert("Unexpected Error, Try Again!");
    }
  };

  return (
    <div className="container mt-5 pt-5">
      <form className="col-md-4 offset-md-4">
        <h2 className="text-primary">Login</h2>
        <div className="form-outline mb-4">
          <input
            id="username"
            type="text"
            name="username"
            value={username}
            className="form-control"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <label className="form-label" htmlFor="username">
            Username
          </label>
        </div>

        <div className="form-outline mb-4">
          <input
            type="password"
            id="password"
            value={password}
            className="form-control"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <label className="form-label" htmlFor="password">
            Password
          </label>
        </div>

        <div className="row mb-4">
          <div className="col d-flex justify-content-center">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="form2Example31"
              />
              <label className="form-check-label" htmlFor="form2Example31">
                Remember me
              </label>
            </div>
          </div>

          <div className="col">
            <a href="#!">Forgot password?</a>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => handleLoginForm(e)}
          className="btn btn-primary btn-block mb-4"
        >
          Log in
        </button>

        <div className="text-center">
          <p>
            Not a member?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/auth/register");
              }}
            >
              Register
            </a>
          </p>
          <p>or sign up with:</p>
          <div className="btn-group">
            <button type="button" className="btn btn-link btn-floating">
              <i className="fab fa-facebook-f"></i>
            </button>

            <button type="button" className="btn btn-link btn-floating">
              <i className="fab fa-google"></i>
            </button>

            <button type="button" className="btn btn-link btn-floating">
              <i className="fab fa-twitter"></i>
            </button>

            <button type="button" className="btn btn-link btn-floating">
              <i className="fab fa-github"></i>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LogIn;
