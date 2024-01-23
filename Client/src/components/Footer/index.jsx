import { Outlet } from "react-router-dom";
import "./style/index.css";

const Footer = () => {
  return (
    <div className="footer-container">
      <Outlet />
      <hr className="mt-5" />
      <div className="footer container">
        <div className="footer-content row">
          <div className="footer-section about col-md-4">
            <h5>About Us</h5>
            <p>
              We are a reputable cryptocurrency exchange platform, providing a
              secure and convenient trading experience for our users.
            </p>
          </div>

          <div className="footer-section contact col-md-4">
            <h5>Contact</h5>
            <p>Email: nnguyenhoangann@gmail.com</p>
            <p>Phone: 0386609932</p>
          </div>

          <div className="footer-section links col-md-4">
            <h5>Useful Links</h5>
            <ul className="list-unstyled">
              <li>
                <a href="/">About</a>
              </li>
              <li>
                <a href="/">User Guide</a>
              </li>
              <li>
                <a href="/">Privacy Policy</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="text-center">
            &copy; 2024 CryptoTrade. All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
