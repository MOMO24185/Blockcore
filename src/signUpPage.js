import React, {useState, useEffect, Component} from 'react'
import store from "store2";
import logo from './images/BlockCoreLogo@2x.png';
import background from './images/BackgroundImage@2x.png';
import {Link, useNavigate} from "react-router-dom";
import "./css/SignUpPage.css";
import PasswordChecklist from "react-password-checklist";
import check from 'prettier';


const WalletCard = () => {
	const forge = require('node-forge');
	const md = forge.md.sha256.create();
	const salt = forge.util.bytesToHex(forge.random.getBytesSync(32));
	

	const [connectWallet, setConnectWallet] = useState(false);
	const [passwordMatch, setPasswordMatch] = useState(false);
	const [conditions, setConditions] = useState(false);

	const [password, setPassword] = useState("");
	const [passwordAgain, setPasswordAgain] = useState("");

	const [errorMessage, setErrorMessage] = useState(null);
	const [defaultAccount, setDefaultAccount] = useState(null);

	const [connButtonText, setConnButtonText] = useState('Connect Wallet');

	const connectWalletHandler = () => {
		if (window.ethereum && window.ethereum.isMetaMask) {
			console.log('MetaMask Here!');

			window.ethereum.request({ method: 'eth_requestAccounts'})
			.then(result => {
				setConnectWallet(true);
				accountChangedHandler(result[0]);
				setConnButtonText('Wallet Connected');
				
			})
			.catch(error => {
				setErrorMessage(error.message);
			
			});

		} else {
			console.log('Need to install MetaMask');
			setErrorMessage('Please install MetaMask browser extension to interact');
		}
	};

	// update account, will cause component re-render
	const accountChangedHandler = (newAccount) => {
		setDefaultAccount(newAccount);
		window.pubAdd={defaultAccount};
	};

	// listen for account changes
	window.ethereum.on('accountsChanged', accountChangedHandler);
	
	return (
		<div>
    	<div>
        <img className="image-background-icon" src={background}></img>
   		<img className="blockcore-logo-icon" src={logo} ></img>
		<div className="formSignup">
		<div className='walletCard'>
			<button className='buttonS' onClick={connectWalletHandler}>{connButtonText}</button>
			{errorMessage}
		</div>

            <ul className='ulSignup'>
			<li><span className='passText'> This password cannot be reset once it has been finalized! Please write it down and keep it safe! </span></li>
			<li>
			<input className="input-passwordlogin" type="password" placeholder="Password"  onChange={e => setPassword(e.target.value)}></input>
            </li>
			<li>
			<input className="input-passwordlogin2" type="password" placeholder="Confirm Password" onChange={e => setPasswordAgain(e.target.value)}></input>
            </li>
            </ul>
			
			<PasswordChecklist
				rules={["minLength","specialChar","number","capital","match"]}
				minLength={8}
				value={password}
				valueAgain={passwordAgain}
				onChange={(isValid) => {
					setPasswordMatch(true);
					if(connectWallet == true && passwordMatch == true){ 
						setConditions(true);
					} else {
						setConditions(false);
					}
				}}
			/>

            <Link to="/"><button disabled={!conditions} className='buttonS' id='signupButton' onClick={() => {
				console.log("Checking button");
				if(password == passwordAgain && !(store.local.has("passwordSPH")) && password != ""){
					store.local({"passwordSPH": md.update(salt+password).digest().toHex(), "passwordSalt": salt});
				}else{
					console.log("ERROR");
				};
			}}><span>Sign Up</span></button></Link>
			
            </div>

</div>
</div>);

}

export default WalletCard;