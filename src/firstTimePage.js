import React, { Component, useEffect } from "react"
import {Link, useNavigate} from "react-router-dom"
import store from "store2";


const passwordCheck = () => {

      //Mount component onloadStart of the page
      const check = () =>{
        let navigate = useNavigate();
        
        const toLogin=()=>{
          useEffect(() => {
            navigate("/login");
          }, []);
        }

        const toSignup=()=>{
          useEffect(() => {
            navigate("/signup");
          }, []);
        }

        

        if(store.local.has("passwordSPH")){
          console.log("Found password");
          return(toLogin());
        }else{
          console.log("No password");
          return(toSignup());
        }
      };

      return(
        <div>
          <a onLoad={check()}></a>
        </div>
    );
}
export default passwordCheck;