import "../styles/login.css";
import "../styles/dashboard.css";

import logo from "../assets/logo_wht.png";
import startImg from "../assets/keyarttlo.jpg";
import lootImg from "../assets/horseshoe.jpg";

import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <>
      <nav className="flex-row-center-center">
        <ul className="desktop-icons">
          <li>
            <img src={logo} alt="Loot Tracker logo" />
            <span>LOOT TRACKER</span>
          </li>

          <li>
            <Link to="/logout" className="logout-btn">
              Wyloguj
            </Link>
          </li>
        </ul>

        <ul className="mobile-icons">
          <li id="hamburger-menu">
            <span>☰</span>
            <span>MENU</span>
          </li>
        </ul>
      </nav>

      <main>
        <section>
          <div className="card">
            <Link to="/boss-selection" className="card-link" />
            <img src={startImg} alt="Rozpocznij zbieranie" />
            <p>Rozpocznij zbieranie</p>
          </div>

          <div className="card">
            <Link to="/loot-history-selection" className="card-link" />
            <img src={lootImg} alt="Twój loot" />
            <p>Twój loot</p>
          </div>
        </section>

        <aside></aside>
      </main>
    </>
  );
}

export default Dashboard;
