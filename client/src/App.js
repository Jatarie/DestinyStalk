import React, { Component } from 'react';
import './App.css';
import XP from './Components/Graph/XP';
import Stalk from './Components/Stalk/Stalk';
import Crafting from './Components/Crafting/Crafting';
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
            <Route path="/crafting" exact component={Crafting} />
          </div>
        </div>
      </HashRouter>
    );
  }
}
export default App;