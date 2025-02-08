import React from "react";
import ApiIcon from '@mui/icons-material/Api';
import SettingsIcon from '@mui/icons-material/Settings';
function Header() {
  return (
    <div className="header">
      <div className="left-section">
        <ApiIcon/>
        <div>
          <a href="#">Your Work</a>
        </div>
        <div>
          <a href="#">Projects</a>
        </div>
        <div>
          <a href="#">Filters</a>
        </div>
        <div>
          <a href="#">Dashboards</a>
        </div>
        <div>
          <a href="#">Teams</a>
        </div>
        <div>
          <a href="#">Plans</a>
        </div>
        <div>
          <a href="#">Apps</a>
        </div>
        <div>
          <button style={{backgroundColor:"#1E90FF",color:"white"}}>Create</button>
        </div>
      </div>

      <div className="right-section">
        <div>
          <input type="text" className="search-bar" placeholder="Search..." />
        </div>
        <div>
          <SettingsIcon/>
        </div>
        <div className="profile-circle">A</div>
      </div>
    </div>
  );
}

export default Header;
