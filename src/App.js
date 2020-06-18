import React, { useState } from 'react';
import './css/App.css';
import Home from './components/home.js'
import TopBar from './components/topbar.js'
import { Helmet } from 'react-helmet'
import Favicon from 'react-favicon';
import { CookiesProvider } from 'react-cookie'
import Footer from './components/footer';

const App = props => {
  const [Component, setComp] = useState(<Home />)
  return (
    <CookiesProvider>
      <div className="App">
        <Helmet><title>Efficient Codeforces Practice | UpSolve</title></Helmet>
        <Favicon url = {require('./favicon.png')}/>
        <TopBar />
        {Component}
        <Footer setComp = {setComp} />
      </div>
    </CookiesProvider>
  );
}

export default App;
