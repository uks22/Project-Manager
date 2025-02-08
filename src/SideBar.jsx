import React, { useState } from "react";
import "./index.css"; // Add the CSS to a separate file
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ListIcon from '@mui/icons-material/List';
import DashBoardIcon from '@mui/icons-material/Dashboard';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ViewModuleOutlinedIcon from '@mui/icons-material/ViewModuleOutlined';
const SideBar = (props) => {
    const [collapsed, setCollapsed] = useState(false);

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
            <div className="logo">Planning</div>
            <ul>
                <li onClick={props.handleBacklogChange}>
                    <i className="fas fa-home"></i>
                    {!collapsed&&<ViewModuleOutlinedIcon style={{marginRight:"10px"}}/>}
                    <span >Backlog</span>
                </li>
                <li onClick={props.handleBoardChange}>
                    <i className="fas fa-search"></i>
                    {!collapsed&&<DashBoardIcon style={{marginRight:"10px"}}/>}
                    <span >Board</span>
                </li>
                <li onClick={props.handleViewChange}>
                    <i className="fas fa-video"></i>
                    {!collapsed&&<ListIcon style={{marginRight:"10px"}}/>}
                    <span>List</span>
                </li>
                <li onClick={()=>{
                    props.handleIssueCount();
                    props.handleHistory();
                    }}>
                    <i className="fas fa-bell"></i>
                    {!collapsed&&<AssessmentIcon style={{marginRight:"10px"}}/>}
                    <span>Reports</span>
                </li>
                <li>
                    <i className="fas fa-folder-open"></i>
                    <span>Subscriptions</span>
                </li>
                <li>
                    <i className="fas fa-th-large"></i>
                    <span>Trending</span>
                </li>
                <li>
                    <i className="fas fa-history"></i>
                    <span>History</span>
                </li>
                <li>
                    <i className="fas fa-cogs"></i>
                    <span>Settings</span>
                </li>
            </ul>
                <ArrowBackIosIcon
                    className="sidebar-toggle-btn"
                    onClick={toggleSidebar}
                    id="toggle-icon"
                    style={{
                        width: "10px",
                        transition: "transform 0.3s ease",
                        transform: collapsed ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                    alt="Toggle Sidebar"
                />
        </div>
    );
};

export default SideBar;
