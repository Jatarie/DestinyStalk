import React, { Component } from 'react';
import './App.css';
import XP from './Components/XP';
import Stalk from './Components/Stalk';
import { HashRouter, Route } from 'react-router-dom';


class App extends Component {

  constructor(props) {
    super(props);
  }



  render() {
    return (
      <HashRouter>
        <div className={"App"}>
          <div>
            <Route path="/stalk" component={Stalk} />
            <Route path="/graph" component={XP} />
          </div>
        </div>
      </HashRouter>
    );
  }
}
export default App;