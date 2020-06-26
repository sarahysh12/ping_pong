import React, { Component } from 'react';
import Field from './containers/Field/Field';
import BoardGame from './containers/Boardgame/Boardgame';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        {/* <Field/> */}
        <BoardGame/>

      </div>
    );
  }
}

export default App;
