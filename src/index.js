import React, {useState, Component} from 'react';
import createroot from 'react-dom';
import { Link, Routes, Route, BrowserRouter, useNavigate } from 'react-router-dom';
import Settings from './accountPage';
import Home from './homePage';
import Login from './loginPage';
import Signup from './signUpPage';
import Version from './versionPage';
import Nodes from './nodePage';
import FirstCheck from './firstTimePage';
import VerifyPage from './verification';

  createroot.render(
    
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<FirstCheck />} />
            <Route path='home' element={<Home />} />
            <Route path='signup' element={<Signup />} />
            <Route path='login' element={<Login />} />
            <Route path='node' element={<Nodes />} />
            <Route path='account' element={<Settings />} />
            <Route path='history' element={<Version />} />
            <Route path='verify' element={<VerifyPage />} />
        </Routes>
    </BrowserRouter>,
  document.getElementById('root')
  )