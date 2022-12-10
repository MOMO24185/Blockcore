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

        const toHome=()=>{
          useEffect(() => {
            navigate("/home");
          }, []);
        }

        

        if(store.session.has("sessionPassword")){
          console.log("VERIFY:Password Correct");
          return(toHome());
        }else{
          console.log("VERIFY:Password Incorrect");
          return(toLogin());
        }
      };

      return(
        <div>
          <a onLoad={check()}></a>
        </div>
    );
}
export default passwordCheck;