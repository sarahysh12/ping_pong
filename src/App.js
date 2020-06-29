import React, { Component } from 'react';
import BoardGame from './containers/Boardgame/Boardgame';
import Table from './containers/Table/Table';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        {/* <BoardGame/> */}
        <Table/>
      </div>
    );
  }
}

export default App;
