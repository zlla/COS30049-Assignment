import { Outlet, NavLink } from "react-router-dom";
import { GiWallet } from "react-icons/gi";
import { FaRegUserCircle } from "react-icons/fa";

const NavBar = ({ coinId, auth, setAuth, userInfo, setUserInfo }) => {
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
                  {auth ? (
                    <>
                      <NavLink to={"/account"} className="dropdown-item">
                        Account
                      </NavLink>
                      <a
                        className="dropdown-item"
                        onClick={() => {
                          setAuth(false);
                          localStorage.removeItem("accessToken");
                          localStorage.removeItem("refreshToken");
                          setUserInfo(null);
                        }}
                      >
                        Logout
                      </a>
                    </>
                  ) : (
                    <>
                      <NavLink to={"/auth/login"} className="dropdown-item">
                        Login
                      </NavLink>
                      <NavLink to={"/auth/register"} className="dropdown-item">
                        SignUp
                      </NavLink>
                    </>
                  )}

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
            <div className="d-flex">
              {auth && (
                <NavLink
                  to={"/wallet"}
                  style={{ fontSize: "24px" }}
                  className="nav-link text-bg-primary my-auto me-4"
                >
                  <GiWallet className="me-2" />
                  Wallet
                </NavLink>
              )}
              {userInfo && (
                <NavLink
                  style={{ fontSize: "24px" }}
                  className="nav-link text-bg-primary my-auto me-sm-2"
                  to={"/account"}
                >
                  <FaRegUserCircle className="me-2" />
                  {userInfo != null ? userInfo["username"] : ""}
                </NavLink>
              )}
            </div>
          </div>
        </div>
      </nav>
      <Outlet />
    </div>
  );
};

export default NavBar;
