import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";

const NavBar = ({ coinId }) => {
  const [amountCoin, setAmountCoin] = useState(1000);

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
        <div className="container-fluid">
          <NavLink to={"/"} className="navbar-brand" href="#">
            PờRồMin Trader
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarColor01"
            aria-controls="navbarColor01"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarColor01">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <NavLink to={"/crypto/buy"} className="nav-link">
                  Buy Crypto
                  <span className="visually-hidden">(current)</span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to={"/Markets"} className="nav-link">
                  Markets
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to={`/trade/${coinId}`} className="nav-link">
                  Trade
                </NavLink>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  data-bs-toggle="dropdown"
                  href="#"
                  role="button"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  More
                </a>
                <div className="dropdown-menu">
                  <NavLink to={"/account"} className="dropdown-item">
                    Account
                  </NavLink>
                  <NavLink to={"/auth"} className="dropdown-item">
                    Login
                  </NavLink>
                  <div className="dropdown-divider"></div>
                  <a
                    className="dropdown-item"
                    rel="noopener noreferrer"
                    target="_blank"
                    href="https://www.facebook.com/nguyenhoangan32"
                  >
                    fb: Nguyen Hoang An
                  </a>
                </div>
              </li>
            </ul>
            <form className="d-flex">
              <NavLink
                to={"/wallet"}
                className="nav-link text-bg-primary my-auto me-sm-2"
              >
                <span className="fw-bold me-2">{amountCoin} PRM</span>
                <span className="badge bg-success">Available Balance</span>
              </NavLink>
              <input
                className="form-control me-sm-2"
                type="search"
                placeholder="Search"
              />
              <button className="btn btn-secondary my-2 my-sm-0" type="submit">
                Search
              </button>
            </form>
          </div>
        </div>
      </nav>
      <Outlet />
    </div>
  );
};

export default NavBar;
