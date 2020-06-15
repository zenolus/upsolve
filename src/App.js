import React from 'react';
import './css/App.css';
import Home from './components/home.js'
import NavBar from './components/navbar.js';
import { Helmet } from 'react-helmet'
import Favicon from 'react-favicon';

function App() {
  return (
    <div className="App">
      <Helmet><title>Efficient Codeforces Practice | UpSolve</title></Helmet>
      <Favicon url = {require('./favicon.png')}/>
      <NavBar />
      <Home />
    </div>
  );
}

export default App;
