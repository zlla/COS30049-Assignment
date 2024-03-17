import "@fortawesome/fontawesome-free/css/all.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../../../settings/apiurl";
import { useState } from "react";

const SignUp = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegisterForm = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${apiUrl}/register`, {
        email,
        username,
        password,
      });

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mt-5 pt-5">
      <form className="col-md-4 offset-md-4">
        <h2 className="text-primary">Sign up</h2>

        <div className="form-outline mb-4">
          <input
            type="text"
            id="username"
            value={username}
            className="form-control"
            onChange={(e) => setUsername(e.target.value)}
          />
          <label className="form-label" htmlFor="username">
            Username
          </label>
        </div>

        <div className="form-outline mb-4">
          <input
            type="email"
            id="email"
            value={email}
            className="form-control"
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className="form-label" htmlFor="email">
            Email
          </label>
        </div>

        <div className="form-outline mb-4">
          <input
            type="password"
            id="password"
            value={password}
            className="form-control"
            onChange={(e) => setPassword(e.target.value)}
          />
          <label className="form-label" htmlFor="password">
            Password
          </label>
        </div>

        <button
          type="button"
          onClick={(e) => handleRegisterForm(e)}
          className="btn btn-primary btn-block mb-4"
        >
          Sign in
        </button>

        <div className="text-center">
          <p>
            Already have an account? <a href="/auth/login">Login</a>
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

export default SignUp;
