import React, { Component } from 'react';
import {Link} from "react-router-dom";
import logo from "./images/blockcore-1@2x.png";
import "./css/ManageAccount.css";
import Web3 from "web3"
import store from "store2";
import Button from "@mui/material/Button";

class RenderAppContract extends Component {

  constructor(props){
    super(props)
    this.state = { 
      ipfsHash: null,
      ipfsCID: '',
      web3: null,
      contract: null,
      buffer: null,
      account: '',
      fileName: '',
      ipfsIV: null,
      IPFSLink: '',
      fileType: '',
      fileSize: 0,
      fileNameSub: ''
    }
  }

  //Mount component onloadStart of the page
  componentWillMount(){
    this.loadBlockChainData()
  }

  async loadBlockChainData(){
    const web3 = new Web3(Web3.givenProvider || "http://localhost:7545")
    const network = await web3.eth.net.getId()
    const accounts = await web3.eth.getAccounts()

    this.setState({ 
      account : accounts[0],
      web3: web3
     })

     const storageInstance = new web3.eth.Contract(BlockCoreContract.abi, this.state.account)

     this.setState({
      contract: storageInstance
     })

    console.log("network ID ", network)
    console.log("account ", accounts[0])
  }

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
      className="tabButton" 
    >
      <b>NODE VIEWER</b>
    </button></Link>
    {" "}
    
    <Link to="/account"><button
      className="tabButtonA" 
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
    <Link to="/"><button className="text-signout-button3" onClick={() => {
      store.session(false);
    }}>
      Sign Out
    </button></Link>

    <Link to="/home"><label className="inputTag"> Upload
    <input className="fileuploadfeature-input" type="file"></input>
    </label></Link>
    <div className="upload-a-file">
    
    
    
    <img className="frame-icon" alt="" src="../AccountIcon@2x.png" />
      
      <div
        className="name-hamza-al-zoubi-storage"
        
      >
        <p className="name-hamza-al-zoubi">
          <b className="span">Name:</b>
          <span> Hamza Al Zoubi 
            <p><b>Subscription Plan:</b> Core Plus+ (Yearly)</p> 
          <p>Expiration Date: 29/11/2023</p>
          </span>
        </p>
        <p className="storage-4gb500gb-p1">
          <b className="span">Storage:</b>
          <span> 4GB/500GB</span>
        </p>
        <p>
        <span> Your Account Address: </span>
          <b className="span">{this.state.account}</b>
        </p>
      </div>
    </div>
  </div>
    );}
}
export default RenderAppContract;