import React, { useState, useEffect } from 'react';
import logo from './images/BlockCoreLogo@2x.png';
import store from "store2";
import background from './images/BackgroundImage@2x.png';
import {Link, useNavigate} from "react-router-dom";
import "./css/LoginPage.css";


const Login = () => {
        const [password, setPassword] = useState("");
        var forge = require('node-forge');
        const passCheck = forge.md.sha256.create();

    return(
    <div>
    <img className="image-background-icon" src={background}></img>
    <img className="blockcore-logo-icon" src={logo} ></img>
    <div>
    {/* await tag must be used to verify if metamask is connected and the password, once those are verified the login button will show */}
    
    <div className="formLogin">
            <ul className='ulLogin'>
			    <li>
			        <input className="input-passwordloginS" id='passField' type="password" placeholder="Password" onChange={e => setPassword(e.target.value)}/>
                </li>
            </ul>
            
            <Link to="/verify"><button className='buttonL' onClick={() => {
                passCheck.update((store.local("passwordSalt")+password));
            
                if( (passCheck.digest().toHex()) == store.local("passwordSPH") ){
                    passCheck.update(password);
                    store.session("sessionPassword", passCheck.digest().toHex());
                    console.log("Password correct");
                }else{
                    console.log("Password incorrect");
                }
            }}><span>Login</span></button></Link>

            </div>
    </div>
    
    </div>
    
    );
}

export default Login;