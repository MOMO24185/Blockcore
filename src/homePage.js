import React, { Component } from "react"
import {Link} from "react-router-dom"
import forge from "node-forge"
import store from "store2";
import Web3 from "web3"
import fileImg from './images/FileImage@2x.png'
import logo from './images/blockcore-1@2x.png'
import BlockCoreContract from "./abis/BlockCore.json"
import "./css/homepage.css"
import * as IPFS from "ipfs-core"
import { toString as uint8ArrayToString } from "uint8arrays/to-string"
import { concat as uint8ArrayConcat } from "uint8arrays/concat"
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
      fileNameSub: '',
      fileStatus: '',
      contractAddress: '0x04C7a3C8541441c2c07F54F2b49D6a2F4E8C9C90' // ------ REPLACE THIS ADDRESS WITH THE CONTRACTS DEPLOYED ADDRESS FROM GANACHE --------
    }
  }

  //Mount component onloadStart of the page
  componentWillMount(){
    this.loadBlockChainData()
  }
  

  componentDidMount(){
    var fileNum = 1;

    console.log("starting page");

    while(store.has(fileNum.toString() + '.name')){
      console.log("reading stored file data");
      var fileManagerList = document.getElementById('fileManagerList')
      var tempValueString = '';
      var fileTag = document.createElement("button");
      var img = document.createElement("img");
      var fileTagName = document.createElement("li");
      var fileTagSize = document.createElement("li");
      var fileTagType = document.createElement("li");
      var fileTagButton = document.createElement("button");

      fileManagerList.appendChild(fileTag);
      fileTag.appendChild(img);
      fileTag.appendChild(fileTagName);
      fileTag.appendChild(fileTagSize);
      fileTag.appendChild(fileTagType);

      fileTag.className = "List";
      fileTag.id = fileNum;
      fileTag.addEventListener('click', (fileTag) => this.IPFSGet(fileTag), false);

      img.className = "logo";
      img.id = fileNum + "logo";
      img.src = fileImg;
      
      fileTagName.className = "item1";
      fileTagName.id = fileNum + "item1";
      tempValueString = fileNum.toString() + '.name';
      var fileNameText = document.createTextNode("File Name: " + store(tempValueString));
      fileTagName.appendChild(fileNameText);
      
      fileTagSize.className = "item2";
      fileTagSize.id = fileNum + "item2";
      tempValueString = fileNum.toString() + '.size';
      var tempSize = store(tempValueString);

      if      (tempSize >= 1073741824) { tempSize = (tempSize / 1073741824).toFixed(2) + " GB"; }
      else if (tempSize >= 1048576)    { tempSize = (tempSize / 1048576).toFixed(2) + " MB"; }
      else if (tempSize >= 1024)       { tempSize = (tempSize / 1024).toFixed(2) + " KB"; }
      else if (tempSize > 1)           { tempSize = tempSize + " bytes"; }
      else if (tempSize == 1)          { tempSize = tempSize + " byte"; }
      else                          { tempSize = "0 bytes"; }


      var fileSizeText = document.createTextNode("File Size: " + tempSize);
      fileTagSize.appendChild(fileSizeText)
      
      fileTagType.className = "item3";
      fileTagType.id = fileNum + "item3";
      tempValueString = fileNum.toString() + '.type';
      var fileTypeText = document.createTextNode("File Type: " + store(tempValueString));
      fileTagType.appendChild(fileTypeText);

      fileTagButton.className = "deleteBtn";
      fileTagButton.id = fileNum + "delete";
      var fileTypeText = document.createTextNode("Delete");
      fileTagButton.appendChild(fileTypeText);
      fileTagButton.addEventListener('click', (fileTag) => this.deleteFile(fileTag), false);
      fileTag.appendChild(fileTagButton);

      fileNum++;
    }
  }

  async loadBlockChainData(){
    const web3 = new Web3(Web3.givenProvider || "http://localhost:7545")
    const network = await web3.eth.net.getId()
    const accounts = await web3.eth.getAccounts()

    this.setState({ 
      account : accounts[0],
      web3: web3
     })

     const storageInstance = new web3.eth.Contract(BlockCoreContract.abi, this.state.contractAddress)

     this.setState({
      contract: storageInstance
     })

    console.log("network ID ", network)
    console.log("account ", accounts[0])
  }
  
  openFile = async (evt) => {
    evt.preventDefault()

    const fileObj = await evt.target.files[0];
    this.setState({
      fileStatus: 'Reading File'
     })
    console.log('Started Reading')
    // Mainline of the method
    var reader = new FileReader();
    // binary data
    await reader.readAsArrayBuffer(fileObj);
    console.log('LOADING', reader.readyState);

    reader.onloadend = () => {
      console.log('Finished Reading File')
      this.setState({ 
        buffer: reader.result,
        fileName: fileObj.name,
        fileType: fileObj.type,
        fileSize: fileObj.size,
        fileNameSub: fileObj.name.substring(0, fileObj.name.indexOf('.'))
      })

      console.log('DONE', reader.readyState); // readyState will be 2
      this.setState({
        fileStatus: 'Finished Reading'
       })
    };

    //Starting IPFS
    const ipfs = await IPFS.create({repo: 'repo: ' + Math.random()})
    console.log('Starting IPFS')
    
    this.setState({
      fileStatus: 'Encrypting'
     })
    //Starting Hashing 
    var md = forge.md.sha256.create()
    md.update(this.state.buffer)//Hash input
    console.log('Hash Result: ', md.digest().toHex())

    //Encrypting File using previously acquired hash
    var key = md.digest()
    console.log('KEY: ', key)
    var iv = forge.random.getBytesSync(16)
    console.log('IV: (', iv, ')')
    // CBC uses PKCS#7 padding as default
    var cipher = forge.cipher.createCipher('AES-CBC', key)
    cipher.start({iv: iv})
    cipher.update(forge.util.createBuffer(forge.util.encode64(forge.util.bytesToHex(reader.result))))
    console.log('Encryption Complete ', cipher.finish())
    var encrypted = cipher.output
    this.setState({
      fileStatus: 'Encryption Complete'
     })
    //Adding IPFS file
    const result = await ipfs.add(forge.util.encode64(forge.util.bytesToHex(encrypted)))
    console.log('UPLOAD IS COMPLETE')
    this.setState({
      fileStatus: 'Upload Complete'
     })
    //Setting state values and logging info
    this.setState({ 
      ipfsHash: md.digest().toHex(),
      ipfsIV: iv,
      ipfsCID: result.cid.toString(),
      IPFSLink: "https://ipfs.io/ipfs/" + result.cid.toString()
    })
    console.log('File Info:', result)
    var fileNum = 1;

    while(store.has(fileNum.toString() + '.name')){
      fileNum++;
    };
    if(!store.has(fileNum.toString() + '.name')){
      if(await this.ContractSet(result.cid.toString(), this.state.ipfsHash)){
        var file = store.namespace(fileNum);
      file('name', this.state.fileName)
      file('size', this.state.fileSize);
      file('type', this.state.fileType);
      file('IV', this.state.ipfsIV);
      this.setState({
        fileStatus: 'Encrypting Local Address'
       })
      //Encrypting File Hash for contract upload
      var key = forge.util.hexToBytes(store.session('sessionPassword'));
      console.log(key);
      var iv = this.state.ipfsIV
      // CBC uses PKCS#7 padding as default
      var cipher = forge.cipher.createCipher('AES-CBC', key)
      cipher.start({iv: iv})
      cipher.update(forge.util.createBuffer(result.cid.toString()))
      console.log('Encryption of Hash Complete ', cipher.finish())
      var encrypted = cipher.output
      this.setState({
        fileStatus: 'Address Encrypted'
       })
      file('CID', encrypted.toHex());
       

      var fileManagerList = window.document.getElementById('fileManagerList')
      var fileTag = document.createElement("button");
      var img = document.createElement("img");
      var fileTagName = document.createElement("li");
      var fileTagSize = document.createElement("li");
      var fileTagType = document.createElement("li");
      var fileTagButton = document.createElement("button");

      fileTag.className = "List";
      fileTag.id = fileNum;
      fileTag.addEventListener('click', (fileTag) => this.IPFSGet(fileTag), false);
      fileManagerList.appendChild(fileTag);

      img.className = "logo";
      img.id = fileNum + "logo";
      img.src = fileImg;
      fileTag.appendChild(img);
      
      fileTagName.className = "item1";
      fileTagName.id = fileNum + "item1";
      var fileNameText = document.createTextNode("File Name: " + this.state.fileName);
      fileTagName.appendChild(fileNameText);
      fileTag.appendChild(fileTagName);
      
      fileTagSize.className = "item2";
      fileTagSize.id = fileNum + "item2";
      var tempSize = this.state.fileSize;

      if      (tempSize >= 1073741824) { tempSize = (tempSize / 1073741824).toFixed(2) + " GB"; }
      else if (tempSize >= 1048576)    { tempSize = (tempSize / 1048576).toFixed(2) + " MB"; }
      else if (tempSize >= 1024)       { tempSize = (tempSize / 1024).toFixed(2) + " KB"; }
      else if (tempSize > 1)           { tempSize = tempSize + " bytes"; }
      else if (tempSize == 1)          { tempSize = tempSize + " byte"; }
      else                          { tempSize = "0 bytes"; }


      var fileSizeText = document.createTextNode("File Size: " + tempSize);
      fileTagSize.appendChild(fileSizeText);
      fileTag.appendChild(fileTagSize);
      
      fileTagType.className = "item3";
      fileTagType.id = fileNum + "item3";
      var fileTypeText = document.createTextNode("File Type: " + this.state.fileType);
      fileTagType.appendChild(fileTypeText);
      fileTag.appendChild(fileTagType);

      fileTagButton.className = "deleteBtn";
      fileTagButton.id = fileNum + "delete";
      var fileTypeText = document.createTextNode("Delete");
      fileTagButton.appendChild(fileTypeText);
      fileTagButton.addEventListener('click', (fileTag, fileTagButton) => this.deleteFile(fileTag, fileTagButton), false);
      fileTag.appendChild(fileTagButton);

      this.setState({
        fileStatus: 'Process Complete'
       })
    
      }else{
        this.setState({
          fileStatus: 'Approval Denied'
         })
      }
    }

}

  //Adds file using file ID
  ContractSet = async (CID, HASH) => {
    this.setState({
      fileStatus: 'Awaiting MetaMask Approval'
     })
    const simpleStorage = this.state.contract
    simpleStorage.options.address = this.state.contractAddress
    const result = await simpleStorage.methods.addFile(CID, HASH).send({from:this.state.account})
    console.log(result)
    return true;
  }

  //Get file from file ID
  ContractGet = async (CID) => {
    this.setState({
      fileStatus: 'Retrieving Key'
     })
    const simpleStorage = this.state.contract
    simpleStorage.options.address = this.state.contractAddress;
    const result = await simpleStorage.methods.getFile(CID).call();
    this.setState({
      ipfsHash: result
    });
    console.log('Retireved hash')
  }

  //Set file ID value from user input
  handleChange = (e) => {
    const value = e.target.value;
    this.setState({
      [e.target.name]: value
    });
  }

  //Get file from file ID
  IPFSGet = async (evt) => {
    const ipfs = await IPFS.create({repo: 'repo: ' + Math.random()})

    const fileNum = evt.target.id;
    const fileName = await store(fileNum + '.name');
    const fileType = await store(fileNum + '.type');
    const fileIV = await store(fileNum + '.IV');
    const ipfsPath = await store(fileNum + '.CID');
    
    //Decrypting hash from contract
    var key = forge.util.hexToBytes(store.session('sessionPassword'))
    var decipher = forge.cipher.createDecipher('AES-CBC', key)
    decipher.start({iv: fileIV})
    console.log('Starting decryption process')
    decipher.update(forge.util.createBuffer(forge.util.hexToBytes(ipfsPath)))//forge.util.createBuffer(forge.util.hexToBytes(forge.util.decode64(uint8ArrayToString())))
    console.log('Decryption of CID complete', decipher.finish())

    this.setState({
      fileStatus: 'Decrypting address'
     })
     
    await this.ContractGet(decipher.output.toString());
    var fileKey = this.state.ipfsHash;

    console.log('File Name: ', fileName, ' File Type: ', fileType)

    this.setState({
      fileStatus: 'Downloading File'
     })
    var result = null
    for await (const chunk of ipfs.cat(decipher.output.toString())) {
      result = uint8ArrayConcat(chunk, chunk)
    }
    console.log('File Retrieved')

    this.setState({
      fileStatus: 'Decrypting File'
     })

    // decrypt file using CBC mode
    var key = forge.util.hexToBytes(fileKey)
    var decipher = forge.cipher.createDecipher('AES-CBC', key)
    decipher.start({iv: fileIV})
    console.log('Starting decryption process')
    decipher.update(forge.util.createBuffer(forge.util.hexToBytes(forge.util.decode64(uint8ArrayToString(result)))))//forge.util.createBuffer(forge.util.hexToBytes(forge.util.decode64(uint8ArrayToString())))
    console.log('Decryption complete', decipher.finish())
    this.setState({
      fileStatus: 'Reconstructing File'
     })
    // Passing array to a file contructor
    const fileBuffer = new Uint8Array(Uint8Array.from(forge.util.decode64(decipher.output.toString()).match(/.{1,2}/g).map((byte) => parseInt(byte, 16))))
    //console.log('Result Buffer', fileBuffer)

    // Creating File instance with the arrayBuffer for file content
    const newFile = new File([fileBuffer], fileName, { type: fileType })

    const a = window.document.getElementById('downloadElement')
    a.href = window.URL.createObjectURL(newFile)
    a.download = fileName

    a.click();
    this.setState({
      fileStatus: 'File Downloaded'
     })
    return newFile
  }
      
  deleteFile = async (evt) => {
    this.setState({
      fileStatus: 'Deleting File'
     })

    const fileID = evt.target.id.substring(0, 1);

    if(store.has(fileID + '.name')){
      const listing = window.document.getElementById(fileID)
      const logo = window.document.getElementById(fileID + "logo")
      const item1 = window.document.getElementById(fileID + "item1")
      const item2 = window.document.getElementById(fileID + "item2")
      const item3 = window.document.getElementById(fileID + "item3")
      const delButton = window.document.getElementById(fileID + "delete")//<button className="deleteBtn">Delete</button>
      item3.remove();
      item2.remove();
      item1.remove();
      logo.remove();
      listing.remove();
      delButton.remove();

      store.remove(fileID + ".CID");
      store.remove(fileID + ".IV");
      store.remove(fileID + ".type");
      store.remove(fileID + ".size");
      store.remove(fileID + ".name");

      this.setState({
        fileStatus: 'File Deleted'
       })
    }
  }
      
    render(){return(
      
        <div className="home-page-div">
    <section className="topbar-background-section3" />
    

    <div className="buttonH">
    <Link to="/home"><button
      className="tabButtonH">
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


<div className="fileManager">
<ul className="verticalUL" id='fileManagerList'>

</ul>

</div>





    <img className="blockcore-1-icon2" alt="" src={logo} />
    <section className="sidebar-background-section7" />
    
    <section className="draganddrop-background-section3">
      <p className="status-message-label">Status:</p>
      <p className="status-message">{this.state.fileStatus}</p>
    </section>
    
      
    <label className="inputTag"> Upload
    <input className="fileuploadfeature-input" type="file" onChange={(e) => this.openFile(e)}></input>
    </label>

    <div className="upload-a-file">
      <p className="name-hamza-al-zoubi4">Upload a File</p>
    
      <li>
          <a id='downloadElement'></a>
      </li>
    </div>

  </div>
    );}
}
export default RenderAppContract;