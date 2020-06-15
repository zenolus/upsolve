import React from 'react';
import './css/App.css';
import Home from './components/home.js'
import NavBar from './components/navbar.js';

function App() {
  return (
    <div className="App">
      <NavBar />
      <Home />
    </div>
  );
}

export default App;
