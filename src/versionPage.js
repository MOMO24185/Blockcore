import React, { Component } from 'react';
import {Link} from "react-router-dom";
import logo from './images/blockcore-1@2x.png';
import "./css/VersionHistory.css";
import Button from "@mui/material/Button";

class RenderAppContract extends Component {

    render(){return(
        <div className="home-page-div">
    <section className="topbar-background-section3" />
    
    <Link style={{textDecoration: 'none'}} to="/home"><Button
      className="tabButton">
      <b>FILES</b>
    </Button></Link>
    {" "}

    <Link style={{textDecoration: 'none'}} to="/history"><Button
      className="tabButton" 
      >
      <b>VERSION HISTORY</b>
    </Button></Link>
    {" "}
    
    <Link style= {{textDecoration: 'none'}} to="/node"><Button 
      className="tabButton" 
    >
      <b>NODE VIEWER</b>
    </Button></Link>
    {" "}
    
    <Link style={{textDecoration: 'none'}} to="/account"><Button
      className="tabButton" 
    >
      <b>MANAGE ACCOUNT</b>
    </Button></Link>


    <section className="sidebar-background-section6" />
    <p className="mainpageaccdetails4" id="mainPageAccDetails">
      <p className="name-hamza-al-zoubi4">
        <span className="name-span4">Name:</span>
        <span> Hamza Al Zoubi</span>
      </p>
      
      <p className="name-hamza-al-zoubi4">
        <span className="expiration-date-span4">Expiration Date:</span>
        <span className="span4"> 29/11/2023</span>
      </p>
      <p className="name-hamza-al-zoubi4">
        <span className="name-span4">Storage:</span>
        <span> 4GB/500GB</span>
      </p>
    </p>

    
    <img className="blockcore-1-icon2" alt="" src={logo} />
    
    <section className="sidebar-background-section7" />
    <section className="draganddrop-background-section3" />
    <Link to="/login"><button
      className="text-signout-button4"
    >
      Sign Out
    </button></Link>
    <input className="fileuploadfeature-input" type="file" />
    <div className="upload-a-file">
      <p className="name-hamza-al-zoubi4">Upload a File</p>
    </div>
    <div className="verison-history-coming-soon">
        Verison History Coming Soon!
      </div>
  </div>
    );}
}
export default RenderAppContract;