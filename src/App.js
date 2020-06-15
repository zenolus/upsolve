import React from 'react';
import './css/App.css';
import Home from './components/home.js'
import TopBar from './components/topbar.js'
import { Helmet } from 'react-helmet'
import Favicon from 'react-favicon';
import { CookiesProvider } from 'react-cookie'

const App = props => {
  return (
    <CookiesProvider>
      <div className="App">
        <Helmet><title>Efficient Codeforces Practice | UpSolve</title></Helmet>
        <Favicon url = {require('./favicon.png')}/>
        <TopBar />
        <Home />
      </div>
    </CookiesProvider>
  );
}

export default App;
