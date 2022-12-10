import React, { Component } from 'react';
import {Link} from "react-router-dom";
import logo from './images/blockcore-1@2x.png';
import "./css/NodeViewer.css";

import loadingGif from "../src/images/nodeViewerGIF.gif"
import Button from "@mui/material/Button";

class RenderAppContract extends Component {

    render(){return(
        <div className="home-page-div">
    <section className="topbar-background-section3" />
   
    <div className="buttonH">
    <Link to="/home"><button
      className="tabButton">
      <b>FILES</b>
    </button></Link>
    {" "}
    
    <Link to="/node"><button 
      className="tabButtonN" 
    >
      <b>NODE VIEWER</b>
    </button></Link>
    {" "}
    
    <Link to="/account"><button
      className="tabButton" 
    >
      <b>MANAGE ACCOUNT</b>
    </button></Link>
    </div>
    
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

    <img src={loadingGif} className='nodeViewerGIF'/>

    <input className="fileuploadfeature-input" type="file" />

    <Link to="/home"><label className="inputTag"> Upload
    <input className="fileuploadfeature-input" type="file"></input>
    </label></Link>

    <div className="upload-a-file">
    
    </div>
  </div>
    );}
}
export default RenderAppContract;